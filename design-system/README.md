# Dark Engineering — Design System

**Versão:** 0.1.0 (proposta para revisão)  
**Escopo:** portfólio pessoal + blog técnico de Rafael Gomides  
**Status:** protótipo isolado; não modifica a home atual nem a página do Axion

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

> **Importante:** GitHub Pages publica a branch configurada, não um PR automaticamente. O catálogo só estará disponível no domínio público depois do merge/deploy. Para revisar o PR agora, execute o servidor local ou abra os arquivos HTML no navegador.

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

A página independente do **Axion fica fora do escopo**. A navegação usa `/axion/` como rota **presumida** para demonstração, com base no caminho informado; confirmar a URL exata no ambiente publicado antes da integração definitiva.

## Critérios de aprovação da v0.1

- [ ] Paleta e identidade técnica/editorial aprovadas
- [ ] Header desktop e mobile aprovados
- [ ] Cards de projetos e lista de artigos aprovados
- [ ] Experiência de leitura longa aprovada
- [ ] Acessibilidade e responsividade revisadas
- [ ] Rota pública correta do Axion confirmada

Este PR não inclui migração para Astro, publicação real de artigos ou alterações no site atual. Esses trabalhos serão etapas posteriores.
