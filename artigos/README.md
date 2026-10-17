# Engineering Notes — Como publicar artigos

O blog está disponível em `/artigos/` e utiliza Jekyll/Markdown no GitHub Pages, com o mesmo design system do portfólio.

> **Sem CMS, banco de dados ou backend.** Cada artigo é um arquivo Markdown versionado no repositório.

## Publicar um artigo

1. Copie `_drafts/exemplo-de-artigo.md` para `_posts/YYYY-MM-DD-meu-titulo.md`, na raiz do repositório. Use a **data de publicação** no nome.
2. Edite `title`, `description`, `date` com timezone `-0300`, e `tags` no YAML inicial.
3. Escreva em Markdown. Código é destacado por linguagem com cercas como `go`, `bash` ou `yaml`.
4. Crie uma branch e abra um PR, aguarde validação e faça merge para publicar.
5. O artigo será listado automaticamente em `/artigos/`, no RSS e sitemap. URL final: `/artigos/meu-titulo/`.

Exemplo mínimo:

```markdown
---
layout: article
title: "Como reduzir a latência de uma API Go"
description: "Comparação prática entre pooling de conexões, cache e otimização de queries."
date: 2026-10-17 12:00:00 -0300
author: "Rafael Gomides"
tags: ["Go", "Backend", "Performance"]
---

Introdução ao problema e ao ambiente.

## Diagnóstico

Observações, hipóteses e dados.

## Alternativas

Trade-offs considerados.

## Conclusão

Resultados e referências.
```

## Preview local

Requer Ruby/Bundler e uma versão do Ruby suportada pela stack GitHub Pages.

```bash
bundle install
bundle exec jekyll serve --livereload
# http://127.0.0.1:4000/artigos/
```

Para visualizar drafts localmente: `bundle exec jekyll serve --drafts`. **Não use `--drafts` no build de produção.** Posts futuros também não são publicados, pois `future: false`.

## Imagens

Salvar assets em `assets/artigos/<slug>/` e referenciar com caminhos absolutos, como `/assets/artigos/meu-titulo/diagrama.webp`. Prefira WebP/SVG quando apropriado, alt descritivo e resolução proporcional.

## Tags e busca

- As tags declaradas no YAML geram automaticamente os filtros na lista; escolha poucos assuntos consistentes.
- A pesquisa por título, resumo e tags roda no navegador. Sem JavaScript, os artigos continuam listados.
- A lista é cronológica (mais recentes primeiro). O tempo de leitura é uma **estimativa** por contagem de palavras.
- Sem artigo publicado, a página mostra um estado vazio — não há conteúdo demonstrativo publicado.

## SEO / syndication

- `/feed.xml`: RSS 2.0 dos 20 artigos mais recentes.
- `/sitemap.xml`: raiz, índice e posts publicados.
- `/robots.txt`: referência ao sitemap.
- Cada artigo possui título, descrição, canonical, Open Graph e tags.
- Campo opcional `image: /assets/artigos/slug/capa.webp` ativa `og:image`.
- Campo opcional `last_modified_at:` marca atualizações relevantes.

## Compatibilidade e cuidados

O portfólio é HTML estático sem front matter e continua sendo copiado pelo Jekyll. O `CNAME` é preservado. A página externa do Axion não é modificada. O arquivo `.nojekyll` foi removido propositalmente para habilitar o build Jekyll no GitHub Pages.

**Pré-condição de deploy:** GitHub Pages deve estar configurado para publicar a partir da branch `main` (ou uma configuração equivalente com Jekyll); se o repositório usar outro fluxo de deploy, verificar a configuração antes do merge.

Jekyll suporta Markdown, não componentes MDX nativamente. Se futuramente precisar de componentes React/MDX, a migração para Astro poderá ser feita em etapa separada.

## Validar antes de publicar

```sh
node scripts/validate-blog.mjs
bundle exec jekyll build
```

O fluxo de PR possui GitHub Actions para executar essas verificações e confirmar a existência das rotas geradas.


## Diagramas Mermaid

Diagramas como `flowchart` e `sequenceDiagram` podem ser escritos diretamente em Markdown:

\`\`\`mermaid
flowchart LR
    A["ChatGPT"] --> B["Linear"]
    B --> C["Grok Bot"]
\`\`\`

### Publicação confiável: SVG no repositório

Os diagramas não precisam carregar Mermaid no navegador. Os arquivos `.mmd` ficam em `diagrams/` e são compilados para SVG usando `@mermaid-js/mermaid-cli@11.17.0`. O workflow `.github/workflows/render-article-diagrams.yml` executa a geração quando as fontes de diagrama mudam em uma branch diferente da `main` e comita os SVGs gerados na mesma branch.

No primeiro artigo, os arquivos são:

- `diagrams/article-chatgpt-architecture.mmd` → `assets/artigos/chatgpt-como-camada-de-preparacao/architecture.svg`
- `diagrams/article-chatgpt-sequence.mmd` → `assets/artigos/chatgpt-como-camada-de-preparacao/sequence.svg`

A página inclui um painel com imagem SVG, aba **Código**, botão **Copiar código** e link para o arquivo Mermaid original. A imagem aparece mesmo com JavaScript desabilitado; `blog-mermaid.js` cuida **apenas dos controles de interface**.

Para adicionar diagramas a outro artigo, use o mesmo padrão: versionar o arquivo `.mmd`, definir sua saída no workflow, gerar/commitar o SVG na branch, inserir a imagem e o bloco de código fonte do diagrama no artigo. No PR, confirme os arquivos SVG no diff e que o build Jekyll os inclui em `_site/`. Não dependa apenas de uma cerca \`\`\`mermaid para exibir diagramas em produção.

**Espaçamento editorial:** cada parágrafo do texto deve ser separado do seguinte por **uma linha em branco no Markdown**. Uma quebra de linha simples não inicia um novo parágrafo no Jekyll. Coloque também linhas em branco antes/depois de títulos, listas, blocos de código e diagramas. Não use elementos vazios ou múltiplas quebras artificiais de HTML para criar espaçamento: o estilo do blog cuida disso.

## Fluxo usado no primeiro artigo (Notion → Markdown → GitHub)

1. Ler toda a página do Notion e identificar explicitamente título, subtítulo, corpo e fronteira das notas internas.
2. Converter para Markdown preservando links, headings, listas, código e diagramas.
3. Remover callouts de rascunho, notas editoriais após as referências e anotações internas do Notion (ex.: `discussion-urls`).
4. Criar o arquivo `_posts/YYYY-MM-DD-slug.md` com data local, descrição e tags.
5. Validar o build Jekyll no PR e checar a saída gerada (inclusive os dois diagramas, caso existam).
6. Fazer merge após a revisão e verificar a URL pública e o índice de artigos.

**Importante:** o processo de publicação deve respeitar a fronteira editorial definida pelo autor; não remova parágrafos substantivos do corpo do artigo.
