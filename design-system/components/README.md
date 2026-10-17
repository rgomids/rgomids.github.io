# API dos componentes

CSS reutilizável, sem dependências e sem runtime obrigatório. Primeiro incluir `../tokens/tokens.css`, depois `components.css`. Aplicar `ds-app` no contêiner da experiência nova. Classes `ds-` não devem interferir no site legado.

## Navegação

- `ds-header`, `ds-header__inner`, `ds-brand` e `ds-nav`
- `ds-nav__links` contém links `ds-nav__link`
- Estado ativo: `aria-current="page"`
- Em telas até 800px, mostrar `ds-nav__toggle` e alternar `data-open=true` no painel
- A lógica de referência está em `preview/preview.js`, opcionalmente reimplementável em Astro

## Botões

```html
<a class="ds-btn ds-btn--primary" href="/projetos/">Ver projetos ↗</a>
<button class="ds-btn ds-btn--secondary" type="button">Ação</button>
<button class="ds-btn ds-btn--primary" disabled>Desabilitado</button>
```

Usar `a` para navegação e `button` para ações. Variantes: `primary`, `secondary`, `ghost`. Não utilizar botões sem função apenas como decoração em produção.

## Chips

```html
<span class="ds-chip">Go</span>
<span class="ds-chip ds-chip--green">Disponível</span>
<span class="ds-chip ds-chip--yellow">Destaque</span>
```

Chips são metadados estáticos; filtros clicáveis devem ser botões com `aria-pressed`.

## Cards de projeto

```html
<a class="ds-card" href="/projetos/exemplo/">
  <span class="ds-card__eyebrow">Open source / Projeto</span>
  <h3 class="ds-card__title">Título</h3>
  <p class="ds-card__desc">Problema e impacto em linguagem clara.</p>
  <div class="ds-card__foot">
    <span class="ds-chip">Go</span>
    <span class="ds-card__arrow">Saiba mais ↗</span>
  </div>
</a>
```

Não usar `a` dentro de `a.ds-card`; se houver vários destinos, usar `article.ds-card` e links distintos.

## Lista de artigos

`ds-post-list` contém `a.ds-post-item`. Filho: data, título, resumo, tags e seta. O conteúdo recebe o CSS editorial; filtro/consulta é comportamento independente e fica em `preview.js` no protótipo.

## Artigos e código

- `ds-article__title`, `ds-article__intro`, `ds-article__meta`
- `ds-prose` controla markdown renderizado: headings, links, listas, `pre`, `code`, blockquote e imagens
- `ds-callout` e `ds-callout--highlight` servem para alertas e decisões
- Código com overflow em `pre`, preservando leitura no celular

## Utilitários limitados

`ds-container`, `ds-section`, `ds-grid`, `ds-grid--two`, `ds-row`, `ds-muted`, `ds-mono`, `ds-caption`.

Evitar proliferar utilitários; quando padrões se repetirem, criar um componente semântico documentado.

## Critérios para adicionar componente

1. Uso recorrente em portfólio e/ou blog.
2. Propósito, estrutura HTML e estados definidos.
3. Teclado, leitor de tela, mobile e redução de movimento considerados.
4. Tokens existentes reutilizados antes de introduzir outros.
5. Exemplo no catálogo atualizado junto da alteração.
