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

O renderizador opcional `/blog-mermaid.js` usa a versão fixa `mermaid@11.4.1`, com tema escuro e política `securityLevel: strict`. O navegador carrega o pacote externo **somente quando há diagrama** na página. Se o carregamento ou o diagrama falhar, o código-fonte continua visível no artigo, sem impedir a leitura.

## Fluxo usado no primeiro artigo (Notion → Markdown → GitHub)

1. Ler toda a página do Notion e identificar explicitamente título, subtítulo, corpo e fronteira das notas internas.
2. Converter para Markdown preservando links, headings, listas, código e diagramas.
3. Remover callouts de rascunho, notas editoriais após as referências e anotações internas do Notion (ex.: `discussion-urls`).
4. Criar o arquivo `_posts/YYYY-MM-DD-slug.md` com data local, descrição e tags.
5. Validar o build Jekyll no PR e checar a saída gerada (inclusive os dois diagramas, caso existam).
6. Fazer merge após a revisão e verificar a URL pública e o índice de artigos.

**Importante:** o processo de publicação deve respeitar a fronteira editorial definida pelo autor; não remova parágrafos substantivos do corpo do artigo.
