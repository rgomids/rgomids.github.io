# Acessibilidade — checklist

Alvo: **WCAG 2.2 AA**, sujeito a validação manual e automatizada quando houver integração real. A intenção dos protótipos é demonstrar práticas; não certificá-los.

## Fundamentos já incorporados

- Link "Pular para o conteúdo" visível ao receber foco.
- Elementos semânticos (`header`, `nav`, `main`, `article`, `aside`, `footer`).
- Estado de navegação em `aria-current="page"`.
- Menu mobile por botão nativo, com `aria-expanded`, `aria-controls` e Escape para fechar.
- Visibilidade de foco com `focus-visible`.
- Áreas interativas principais com altura mínima de 44px.
- Blocos `pre` com rolagem horizontal, sem truncar código.
- `prefers-reduced-motion` reduz as transições.
- Pesquisa de artigos com labels, contagem `aria-live` e estado vazio.
- Controles e layout utilizáveis em telas pequenas.

## Contraste de referência

Razões calculadas sobre a paleta proposta (aproximadas; devem ser auditadas nas telas reais):

| Par de cores | Razão | Referência |
| --- | ---: | --- |
| Texto `#E9EDE7` / fundo `#0B0F0E` | 16.28:1 | AAA para texto normal |
| Muted `#A8B8AD` / fundo `#0B0F0E` | 9.30:1 | AAA |
| Accent `#A8D7B2` / fundo `#0B0F0E` | 11.96:1 | AAA |
| Highlight `#E6D67E` / fundo `#0B0F0E` | 13.12:1 | AAA |
| Muted `#A8B8AD` / surface `#151B18` | 8.42:1 | AAA |

As bordas decorativas não devem ser o único indicador de estado. Para estados interativos, testar contraste de componentes, não apenas textos.

## Checklist de PR para integração

- [ ] Tab percorre menu, botões, cards e links em ordem lógica.
- [ ] Foco sempre visível, inclusive após abrir e fechar o menu.
- [ ] Não há navegação exclusiva via hover nem armadilha de teclado.
- [ ] Layout a 320, 375, 768 e 1280px sem rolagem horizontal inesperada.
- [ ] Zoom 200% sem perda de informação.
- [ ] Leitor de tela anuncia links, botão de menu, busca e resultados.
- [ ] Nada depende apenas de cor para identificar informação.
- [ ] Imagens de conteúdo têm `alt` descritivo e ícones decorativos são ocultados de tecnologia assistiva.
- [ ] Verificar novamente o contraste após adicionar realces, imagens ou estados.
- [ ] Avaliar sem JavaScript e com redução de movimento.
