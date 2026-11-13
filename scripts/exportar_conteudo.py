"""
Exporta o conteúdo editado em Configurações (banners, botões, notícias, logo e blocos)
para os arquivos do site, para que ele seja publicado junto.

Como funciona:
  1. Rode este script: ele abre um receptor local em http://127.0.0.1:5174
  2. Na página do site (aberta em http://localhost:5173), rode no console:
       fetch('http://127.0.0.1:5174/export', {method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(await HC_exportContent())})
  3. As imagens viram arquivos em assets/conteudo/ e os textos vão para content.js.

Uso: python3 scripts/exportar_conteudo.py
O receptor encerra sozinho depois de receber uma exportação.
"""
import base64
import hashlib
import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "assets" / "conteudo"
CONTENT_JS = ROOT / "content.js"
ALLOWED_ORIGIN = "http://localhost:5173"
EXT = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg"}
DATA_URL = re.compile(r"^data:([\w/+.-]+);base64,(.+)$", re.S)


def save_image(value, kind, safe_id):
    """Salva uma imagem em base64 como arquivo e devolve o caminho novo (ou o valor original)."""
    m = DATA_URL.match(value or "")
    if not m:
        return value
    mime, payload = m.groups()
    ext = EXT.get(mime)
    if not ext:
        raise ValueError(f"tipo de imagem não suportado: {mime}")
    raw = base64.b64decode(payload)
    digest = hashlib.sha1(raw).hexdigest()[:8]  # muda quando a imagem muda (evita cache antigo)
    name = f"{kind}-{safe_id}-{digest}.{ext}"
    (OUT_DIR / name).write_bytes(raw)
    return f"assets/conteudo/{name}"


def save_images(items, kind):
    """Troca imagens em base64 por arquivos (capa e galeria) e devolve os itens com o caminho novo."""
    for item in items:
        safe_id = re.sub(r"[^\w-]", "", str(item.get("id", "x")))
        if item.get("image"):
            item["image"] = save_image(item["image"], kind, safe_id)
        if isinstance(item.get("gallery"), list):
            item["gallery"] = [save_image(g, kind, f"{safe_id}-g{k + 1}") for k, g in enumerate(item["gallery"]) if g]
    return items


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        try:
            data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            OUT_DIR.mkdir(parents=True, exist_ok=True)
            content = {}
            for key, kind in (("banners", "banner"), ("exclusive", "exclusivo"), ("links", "botao"), ("news", "noticia"), ("brand", "logo"), ("connect", "conectado"), ("authors", "autor"), ("radar", "radar")):
                if isinstance(data.get(key), list):
                    content[key] = save_images(data[key], kind)
            CONTENT_JS.write_text(
                "/* Conteúdo publicado do site (banners, botões e notícias).\n"
                "   Gerado por scripts/exportar_conteudo.py a partir das Configurações. */\n"
                "window.HC_CONTENT = " + json.dumps(content, ensure_ascii=False, indent=2) + ";\n",
                encoding="utf-8",
            )
            # apaga só as imagens exportadas antes que nenhum item usa mais
            used = {Path(src).name for v in content.values() for it in v
                    for src in [it.get("image", ""), *(it.get("gallery") or [])]
                    if str(src).startswith("assets/conteudo/")}
            for old in OUT_DIR.iterdir():
                if old.is_file() and old.name not in used:
                    old.unlink()
            summary = {k: len(v) for k, v in content.items()}
            summary["imagens"] = len(list(OUT_DIR.iterdir()))
            body = json.dumps({"ok": True, **summary}).encode()
            self.send_response(200)
            self.server.done = True
        except Exception as exc:  # noqa: BLE001
            body = json.dumps({"ok": False, "erro": str(exc)}).encode()
            self.send_response(400)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 5174), Handler)
    server.done = False
    print("Aguardando exportação em http://127.0.0.1:5174 ...", flush=True)
    while not server.done:
        server.handle_request()
    print("Exportação concluída:", CONTENT_JS.relative_to(ROOT), "e", OUT_DIR.relative_to(ROOT), flush=True)
