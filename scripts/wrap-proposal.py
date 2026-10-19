"""Wrap docs/propozycja.html (artifact fragment) into a full page at out/propozycja/index.html."""
from pathlib import Path

src = Path("docs/propozycja.html").read_text(encoding="utf-8")
page = (
    '<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<meta name="robots" content="noindex, nofollow">\n'
    '<style>body{margin:0}img{max-width:100%}</style>\n'
    + src.replace("</style>", "</style>\n</head>\n<body>", 1)
    + "\n</body>\n</html>\n"
)
out = Path("out/propozycja")
out.mkdir(parents=True, exist_ok=True)
(out / "index.html").write_text(page, encoding="utf-8")
print("proposal ->", out / "index.html")
