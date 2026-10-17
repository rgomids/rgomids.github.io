# Tipografia

| Função | Família | Tamanho base | Notas |
| --- | --- | --- | --- |
| Display / hero | Space Grotesk | `clamp(2.8rem,7vw,5.75rem)` | tracking -0.075em; poucas linhas |
| Título da seção | Space Grotesk | `clamp(1.75rem,3.5vw,2.5rem)` | line-height 1.08 |
| Título de card | Space Grotesk | 1.4rem | texto conciso |
| Parágrafo | Space Grotesk | 1rem | line-height 1.65 |
| Artigo | Space Grotesk | 1.06rem | line-height 1.85; 70ch máximo |
| Labels, metadados | JetBrains Mono | 0.75rem | somente detalhes técnicos |
| Código | JetBrains Mono | 0.88rem | scroll horizontal em trechos longos |

Use pesos 400/500 para texto corrido e 600/700 para títulos. Evite introduzir uma terceira família tipográfica.

## Regras

- Texto contínuo nunca em monoespaçada; reservar esse tratamento para elementos curtos.
- Evitar todas as maiúsculas fora de labels pequenos.
- Não justificar parágrafos; alinhamento à esquerda.
- Quebra de linha natural; sem fixar alturas em blocos que recebem texto dinâmico.
- Manter estrutura `h1 > h2 > h3` na ordem semântica de cada página.
- Fontes remotas são melhoria progressiva: fallbacks de sistema devem permanecer legíveis offline.

## Idioma

Interface principal em pt-BR; nomes técnicos em inglês quando forem terminologia consagrada, sem exigir tradução artificial.
