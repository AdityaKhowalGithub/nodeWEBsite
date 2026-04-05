# Aditya Khowal website

This repo is a plain static website. The source of truth is `site/`.

## Editing

- `site/index.html` for the homepage
- `site/projects/index.html` for the projects page
- `site/blog/index.html` for the writing index
- `site/blog/*.html` for article pages
- `site/styles.css` for the shared styling

## Local preview

Run a simple static server from the repo root:

```bash
python3 -m http.server 8000 -d site
```

Then open `http://localhost:8000`.

## Docker

Build and run the site with Nginx:

```bash
docker build -t aditya-site .
docker run --rm -p 8080:80 aditya-site
```

Then open `http://localhost:8080`.

## Deployment

GitHub Pages deploys `site/` directly through `.github/workflows/deploy.yml`.
CI validates the HTML, checks internal links, and smoke-tests the Docker image.

