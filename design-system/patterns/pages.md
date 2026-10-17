# Padrões de página e navegação

## Sitemap proposto

```text
/                      Portfólio (home)
/projetos/             Projetos e estudos de caso
/artigos/              Lista editorial
/artigos/{slug}/       Artigo
/axiom/                Link para projeto independente — rota a confirmar
```

Esta árvore é **proposta**, não representa rotas já implementadas. Não criar ou modificar arquivos dentro do projeto Axiom.

## Elementos compartilhados

- Mesmo header, footer, marca RG., paleta, tipografia, grid e estados.
- Em desktop, navegação compacta, horizontal e sem células de 98px.
- Em mobile, menu explícito por botão com `aria-expanded`.
- `Axiom ↗` aparece como destino independente, sem absorver visualmente o projeto.
- Não usar "Disponível" como link de navegação primário: estado profissional e ação são conceitos diferentes.

## Portfólio

1. **Hero:** frase clara sobre sistemas distribuídos, arquitetura e backend; CTA para projetos e artigos.
2. **Projetos:** cards apresentam problema, decisão técnica e impacto. Destacar Axiom sem reestilizá-lo.
3. **Sobre:** trajetória e competências, com forte hierarquia e escaneabilidade.
4. **Jornada:** narrativa aprofundada em página/seção secundária para evitar home excessiva.
5. **Contato:** links reais e discretos.

## Blog — índice

- Título "Artigos" ou "Engineering notes".
- Artigos em lista editorial com título, resumo, data real, tempo de leitura **calculado**, tags.
- Busca e filtros progressivos: conteúdos continuam visíveis sem JS.
- Estado vazio acessível.
- Paginação se o volume exigir; não carregar indefinidamente a home.

## Blog — artigo

- Navegação de retorno, título, resumo, data real, tags e autoria.
- Área de leitura até 70ch, com h2/h3, código e listas.
- Índice opcional em telas largas, sem roubar espaço em mobile.
- Metadados de SEO, canonical, Open Graph, sitemap e RSS no momento da implementação.
- Publicar conteúdo em Markdown/MDX versionado; separar conteúdo de layout.

Exemplo **futuro**, não implementado aqui, de front matter:

```yaml
---
title: "Da issue ao agente"
description: "Arquitetura e governança em desenvolvimento com IA"
publishedAt: "2026-10-17"
tags: ["AI Engineering", "Architecture"]
draft: true
---
```

## Integração sugerida

Manter o GitHub Pages. Avaliar Astro para geração estática e Markdown/MDX na fase de construção do novo site. Reaproveitar `tokens.css` e `components.css`; extrair header/footer/templates dos HTMLs do catálogo para layouts comuns. **Não migrar a stack nesta PR.**

## Axiom

Foi informado que o projeto já está hospedado sob o mesmo domínio. O caminho `/axiom/` usado no protótipo e no portfólio é **presumido** a partir do nome do repositório, não validado tecnicamente. Antes da implantação, confirmar a URL efetiva, incluindo grafia e maiúsculas/minúsculas. A página existente permanece intocada.
