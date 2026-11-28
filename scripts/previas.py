"""Gera as prévias de link (a imagem, o título e o resumo que aparecem quando alguém
cola o link no WhatsApp, Instagram, Facebook…).

WhatsApp e companhia não rodam o site nem leem o que vem depois do "#", então cada
notícia ganha uma página própria e leve em n/<id>.html, com as etiquetas da prévia
(og:image, og:title…). Quem toca no link é levado na hora para a notícia no site.

Rode antes de cada commit de publicação, depois de exportar o conteúdo:
    python3 -I scripts/previas.py

Faz:
  - assets/previas/<id>-<hash>.jpg: foto de capa da notícia em 1200x630 (enquadrada
    pelo ponto de foco escolhido em Configurações);
  - n/<id>.html: a página da prévia de cada notícia;
  - assets/previas/site.jpg: prévia geral do site (só cria se ainda não existir);
  - apaga as prévias de notícias que saíram do site.
"""
import hashlib
import html
import io
import json
import re
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://hceducacional.app.br"
NAME = "HC Instituto Educacional"
W, H = 1200, 630
IMG_DIR = ROOT / "assets" / "previas"
PAGE_DIR = ROOT / "n"
FONTS = Path("/usr/share/fonts/truetype/inter-zorin-os")


def load_content():
    s = (ROOT / "content.js").read_text(encoding="utf-8")
    return json.loads(s[s.index("{"): s.rindex("}") + 1])


def open_image(src):
    if src.startswith("http"):
        req = urllib.request.Request(src, headers={"User-Agent": "hc-previas"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return Image.open(io.BytesIO(r.read()))
    return Image.open(ROOT / src)


def cover(im, focus="50% 50%"):
    """Recorta a imagem para 1200x630 como o object-fit: cover do site, respeitando o foco."""
    im = ImageOps.exif_transpose(im).convert("RGB")
    nums = [float(x) for x in re.findall(r"[\d.]+", focus or "")] or [50, 50]
    fx, fy = (nums + [50, 50])[:2]
    k = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x = round((im.width - W) * fx / 100)
    y = round((im.height - H) * fy / 100)
    return im.crop((x, y, x + W, y + H))


def site_card(path):
    """Prévia geral: fundo claro, logo do HC e o nome do instituto."""
    im = Image.new("RGB", (W, H), "#f5f5f7")
    d = ImageDraw.Draw(im)
    for i in range(H):  # leve degradê
        t = i / H
        d.line([(0, i), (W, i)], fill=(int(250 - 14 * t), int(250 - 12 * t), int(252 - 6 * t)))
    logo = Image.open(ROOT / "assets/icons/icon-512.png").convert("RGB").resize((300, 300), Image.LANCZOS)
    mask = Image.new("L", (300, 300), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 299, 299), radius=66, fill=255)
    im.paste(logo, (110, 165), mask)
    bold = ImageFont.truetype(str(FONTS / "Inter-Bold.ttf"), 64)
    med = ImageFont.truetype(str(FONTS / "Inter-Medium.ttf"), 32)
    d.text((470, 215), "HC Instituto", font=bold, fill="#10093d")
    d.text((470, 290), "Educacional", font=bold, fill="#10093d")
    d.text((472, 385), "Notícias, cursos e agendamentos", font=med, fill="#6e6e73")
    d.rounded_rectangle((472, 175, 560, 183), radius=4, fill="#f20f17")
    im.save(path, "JPEG", quality=86, optimize=True, progressive=True)


PAGE = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — {name}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="{name}">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{img}">
<meta property="og:image:secure_url" content="{img}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="{w}">
<meta property="og:image:height" content="{h}">
<meta property="og:image:alt" content="{title}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{img}">
<meta http-equiv="refresh" content="0; url={dest}">
<script>location.replace({dest_js});</script>
<style>body{{margin:0;min-height:100vh;display:grid;place-items:center;font:500 16px/1.4 -apple-system,system-ui,sans-serif;background:#fbfbfd;color:#1d1d1f}}a{{color:#0071e3}}</style>
</head>
<body><p>Abrindo a notícia… <a href="{dest}">toque aqui</a> se não abrir.</p></body>
</html>
"""


def main():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    PAGE_DIR.mkdir(exist_ok=True)
    if not (IMG_DIR / "site.jpg").exists():
        site_card(IMG_DIR / "site.jpg")
        print("criada a prévia geral: assets/previas/site.jpg")

    keep_img, keep_page = {"site.jpg"}, set()
    for n in load_content().get("news", []):
        nid = str(n.get("id") or "")
        if not re.fullmatch(r"[\w-]+", nid):
            continue
        img_url = f"{SITE}/assets/previas/site.jpg"
        src = n.get("image") or ""
        if src:
            try:
                focus = (n.get("focus") or ["50% 50%"])[0] or "50% 50%"
                tag = hashlib.sha1(f"{src}|{focus}".encode()).hexdigest()[:8]
                fname = f"{nid}-{tag}.jpg"
                if not (IMG_DIR / fname).exists():
                    cover(open_image(src), focus).save(IMG_DIR / fname, "JPEG", quality=82, optimize=True, progressive=True)
                keep_img.add(fname)
                img_url = f"{SITE}/assets/previas/{fname}"
            except Exception as e:  # sem a foto, a notícia usa a prévia geral
                print(f"  aviso: não consegui a foto de {nid}: {e}")
        title = (n.get("title") or NAME).strip()
        desc = (n.get("excerpt") or "").strip() or f"Leia no site do {NAME}."
        dest = f"../#noticias/{nid}"  # relativo: funciona no site e no teste local
        e = lambda s: html.escape(s, quote=True)
        page = PAGE.format(title=e(title), desc=e(desc), name=e(NAME), url=f"{SITE}/n/{nid}.html",
                           img=img_url, w=W, h=H, dest=dest, dest_js=json.dumps(dest))
        (PAGE_DIR / f"{nid}.html").write_text(page, encoding="utf-8")
        keep_page.add(f"{nid}.html")

    for f in IMG_DIR.glob("*.jpg"):
        if f.name not in keep_img:
            f.unlink()
    for f in PAGE_DIR.glob("*.html"):
        if f.name not in keep_page:
            f.unlink()
    print(f"prévias: {len(keep_page)} notícias")


if __name__ == "__main__":
    main()
