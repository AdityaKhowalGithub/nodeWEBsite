from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        for key, value in attrs:
            if key == "href" and value:
                self.hrefs.append(value)


def parse_html_files(root: Path) -> None:
    class Parser(HTMLParser):
        pass

    for path in root.rglob("*.html"):
        Parser().feed(path.read_text())


def validate_internal_links(root: Path) -> None:
    errors: list[str] = []

    for page in root.rglob("*.html"):
        parser = LinkParser()
        parser.feed(page.read_text())

        for href in parser.hrefs:
            if href.startswith(("http://", "https://", "mailto:", "#")):
                continue

            parsed = urlparse(href)
            target = (page.parent / parsed.path).resolve()

            if parsed.path.endswith("/") or target.is_dir():
                target = target / "index.html"

            if not target.exists():
                errors.append(f"{page.relative_to(root)} -> {href}")

    if errors:
        raise SystemExit("Broken internal links:\n" + "\n".join(errors))


if __name__ == "__main__":
    site_root = Path("site").resolve()
    parse_html_files(site_root)
    validate_internal_links(site_root)
    print("Static site HTML and links look good.")
