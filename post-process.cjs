const fs = require('fs');
const path = require('path');

// Path to the generated index.html file
const indexPath = path.join(__dirname, 'public', 'index.html');

// Read the existing index.html file
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  // Define the custom HTML and JavaScript to append
  const customCode = `
    <div id="graph"></div>
    <div id="content" style="display:none;">
      <!-- Content will be loaded here -->
    </div>
    <script src="https://d3js.org/d3.v6.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const data = {
          name: "Home",
          children: [
            { name: "About Me" },
            { name: "Projects" },
            { name: "Resume" }
          ]
        };

        const width = 800;
        const height = 600;

        const svg = d3.select("#graph")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .call(d3.zoom().on("zoom", function (event) {
            svg.attr("transform", event.transform);
          }))
          .append("g");

        const root = d3.hierarchy(data);
        const treeLayout = d3.tree().size([width, height]);
        treeLayout(root);

        svg.selectAll(".link")
          .data(root.links())
          .enter()
          .append("line")
          .attr("class", "link")
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)
          .attr("stroke", "#ccc");

        const nodes = svg.selectAll(".node")
          .data(root.descendants())
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", d => \`translate(\${d.x},\${d.y})\`)
          .on("click", function(event, d) {
            if (d.data.name === "Home") {
              // Implement zoom out to home node
            } else {
              // Implement zoom in and load content
              d3.select("#graph").style("display", "none");
              d3.select("#content").style("display", "block").html(\`<h1>\${d.data.name}</h1><p>Loading...</p>\`);
              // Load content dynamically
              fetch(\`/\${d.data.name.replace(/\\s+/g, '')}.md\`)
                .then(response => response.text())
                .then(text => d3.select("#content").html(marked(text)));
            }
          });

        nodes.append("circle")
          .attr("r", 5)
          .attr("fill", "#69b3a2");

        nodes.append("text")
          .attr("dy", -10)
          .attr("x", d => d.children ? -10 : 10)
          .style("text-anchor", d => d.children ? "end" : "start")
          .text(d => d.data.name);
      });
    </script>
  `;

  // Find the closing </body> tag and insert the custom code before it
  const updatedData = data.replace('</body>', `${customCode}</body>`);

  // Write the modified HTML back to index.html
  fs.writeFile(indexPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to index.html:', err);
      return;
    }
    console.log('Successfully added custom code to index.html');
  });
});

