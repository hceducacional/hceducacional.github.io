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
   http://localhost:5173, envie o conteúdo salvo no navegador para o receptor.
2. Salve e envie para o GitHub:

```bash
git add -A
git commit -m "Descrição da alteração"
git push
```

O GitHub Pages atualiza o site em cerca de 1 minuto.

## Observação

O que é editado em Configurações fica salvo só no navegador de quem editou,
até ser exportado para `content.js` e publicado.
