"""Carimba uma versão nova nos arquivos do site (index.html), para o navegador
baixar tudo de novo depois de cada publicação em vez de usar a cópia guardada.
Rode antes de cada commit de publicação:  python3 -I scripts/versao.py"""
import re
import time
from pathlib import Path

INDEX = Path(__file__).resolve().parent.parent / "index.html"
v = time.strftime("%Y%m%d%H%M")
html = INDEX.read_text(encoding="utf-8")
html = re.sub(r'(href|src)="(styles\.css|content\.js|app\.js|auth\.js|agenda\.js|indicar\.js|secretaria\.js|informatica\.js|avisos\.js|pedagogico\.js)(\?v=\w+)?"',
              lambda m: f'{m[1]}="{m[2]}?v={v}"', html)
html = re.sub(r"window\.HC_V = '\w*'", f"window.HC_V = '{v}'", html)
INDEX.write_text(html, encoding="utf-8")
print("versão", v)
