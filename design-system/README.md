# Dark Engineering — Design System

**Versão:** 0.1.0 (proposta para revisão)  
**Escopo:** portfólio pessoal + blog técnico de Rafael Gomides  
**Status:** biblioteca visual v0.1 integrada ao portfólio na branch de redesign; a página do Axion permanece independente

Design system dark-first com linguagem de engenharia: legibilidade editorial, hierarquia de informação, acentos verde-pastel e amarelo, tipografia sans com monoespaçada aplicada a contexto técnico.

## Explorar

- [Catálogo visual](preview/index.html)
- [Portfólio (demonstração)](preview/projects.html)
- [Blog (demonstração)](preview/blog.html)
- [Artigo técnico (demonstração)](preview/article.html)

Para visualizar localmente, a partir da **raiz do repositório**:

```sh
python3 -m http.server 8000
# abrir http://localhost:8000/design-system/preview/
```

Nenhuma instalação, bundler ou dependência de JavaScript é necessária para os protótipos. As fontes são carregadas do Google Fonts quando disponíveis, com fallback nativo. O site existente continua funcionando mesmo sem rede.

> **Importante:** GitHub Pages publica a branch configurada, não um PR automaticamente. Para revisar mudanças de um PR, execute o servidor local ou confira seus arquivos no GitHub.

## Arquitetura da pasta

```text
design-system/
├── README.md
├── tokens/
│   └── tokens.css            # fonte de verdade para valores de design
├── foundations/
│   ├── principles.md         # personalidade, decisões e limites
│   ├── typography.md         # papéis tipográficos e escala
│   └── accessibility.md      # requisitos e checklist
├── components/
│   ├── components.css        # estilos desacoplados e reutilizáveis
│   └── README.md             # API de componentes
├── patterns/
│   └── pages.md              # templates de página e estratégia para blog
├── preview/
│   ├── index.html            # catálogo
│   ├── projects.html         # exemplo de portfólio
│   ├── blog.html             # lista com pesquisa e filtros
│   ├── article.html          # leitura longa e blocos de código
│   ├── preview.css           # composição exclusiva dos protótipos
│   └── preview.js            # menu acessível + filtro do blog
└── scripts/
    └── validate.mjs          # checks estáticos sem dependências
```

## Como reutilizar no futuro site

Inclusão em uma página estática ou layout Astro:

```html
<link rel="stylesheet" href="/design-system/tokens/tokens.css">
<link rel="stylesheet" href="/design-system/components/components.css">

<body class="ds-app">
  <main class="ds-container">
    <a class="ds-btn ds-btn--primary" href="/artigos/">Ler artigos →</a>
  </main>
</body>
```

Tokens usam o prefixo `--ds-` e os componentes usam `ds-`. Isso evita colisões com CSS do portfólio legado. **Não importe `preview.css` na aplicação definitiva**: ele serve apenas para organizar as demonstrações.

Os tokens em `tokens/tokens.css` são a fonte de verdade. Não mantenha uma cópia manual de paleta dentro de componentes. Novos componentes devem referenciar variáveis, não valores hexadecimais.

## Direção visual

| Papel | Token | Valor |
| --- | --- | --- |
| Fundo | `--ds-color-bg` | `#0B0F0E` |
| Superfície | `--ds-color-surface` | `#151B18` |
| Texto | `--ds-color-text` | `#E9EDE7` |
| Texto secundário | `--ds-color-muted` | `#A8B8AD` |
| Interação e identidade | `--ds-color-accent` | `#A8D7B2` |
| Destaque editorial | `--ds-color-highlight` | `#E6D67E` |
| Borda | `--ds-color-border` | `#35443B` |

- Sans: **Space Grotesk** (fallback Inter/sistema)
- Mono: **JetBrains Mono** (fallback SFMono/Consolas)
- Grid: contêiner até **1120px**; largura de leitura até **70ch**
- Movimento: mínimo e respeitando `prefers-reduced-motion`
- Sem imagens stock, brilho neon excessivo ou estética de terminal em todo o conteúdo

## Fluxo de governança

1. Alterar tokens e/ou componentes em uma branch.
2. Atualizar a documentação se o contrato visual mudou.
3. Validar os protótipos em desktop e mobile.
4. Executar `node design-system/scripts/validate.mjs`.
5. Abrir PR; só depois de aprovado integrar o design system na home, blog e páginas.

A página independente do **Axion fica fora do escopo**. A navegação usa `/axiom/` como rota **presumida** a partir do nome do repositório `rgomids/axiom`; o endereço publicado não pôde ser confirmado automaticamente e precisa de verificação manual.

## Critérios de aprovação da v0.1

- [ ] Paleta e identidade técnica/editorial aprovadas
- [ ] Header desktop e mobile aprovados
- [ ] Cards de projetos e lista de artigos aprovados
- [ ] Experiência de leitura longa aprovada
- [ ] Acessibilidade e responsividade revisadas
- [ ] Rota pública correta do Axion confirmada

A integração do portfólio consome `design-system/tokens/tokens.css` e `design-system/components/components.css`, adicionando `portfolio.css` (composição de página) e `portfolio.js` (navegação) na raiz. A publicação real de artigos e a eventual migração para Astro permanecem para uma etapa posterior.

## Integração atual do portfólio

O documento `/index.html` importa os dois arquivos canônicos do design system, seguidos de `/portfolio.css` para compor hero, arquitetura, projetos, jornada, experiência e contato. `/portfolio.js` implementa o comportamento do menu responsivo. O CSS legado `/style.css` foi preservado no repositório, mas não é carregado pelo novo portfólio, permitindo comparar ou reverter a apresentação sem perder dados.

```sh
node design-system/scripts/validate.mjs
node scripts/validate-portfolio.mjs
python3 -m http.server 8000
# abrir http://localhost:8000/
```

**Escopo:** mesmo conteúdo das seis seções existentes, novo layout e navegação. A implementação de páginas reais do blog não faz parte dessa entrega.
