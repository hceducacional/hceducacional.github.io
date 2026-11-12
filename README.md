# HC Instituto Educacional

Painel do polo: banners, acesso rápido às instituições parceiras e notícias.
Site estático (HTML, CSS e JavaScript), publicado pelo GitHub Pages.

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da página (barra lateral, cabeçalho) |
| `styles.css` | Visual do site |
| `app.js` | Páginas, carrossel, notícias e Configurações |
| `content.js` | Conteúdo publicado: banners, botões e notícias |
| `assets/` | Imagens |
| `scripts/exportar_conteudo.py` | Copia o que foi editado em Configurações para `content.js` |

## Rodar localmente

```bash
python3 -m http.server 5173
```

Abra http://localhost:5173.

## Publicar alterações

1. Se você editou banners, botões ou notícias em **Configurações**, exporte esse conteúdo:
   rode `python3 scripts/exportar_conteudo.py` e, com o site aberto em
   http://localhost:5173, execute no console do navegador:
   `fetch('http://127.0.0.1:5174/export', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(await HC_exportContent())})`
2. Salve e envie para o GitHub:

```bash
git add -A
git commit -m "Descrição da alteração"
git push
```

O GitHub Pages atualiza o site em cerca de 1 minuto.

## Imagens

Tamanhos recomendados: banners **2560 × 673 px**, notícias **1920 × 1200 px**,
botões **800 × 320 px**. Imagens leves que já cabem no limite são mantidas como
estão; as maiores são reduzidas e salvas em WebP com 92% de qualidade.

## Observação

O que é editado em Configurações fica salvo só no navegador de quem editou
(textos no localStorage, imagens no IndexedDB), até ser exportado para
`content.js` e publicado.
