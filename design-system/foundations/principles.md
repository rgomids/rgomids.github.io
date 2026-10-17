# Princípios e personalidade

## Identidade

**Dark Engineering:** portfólio de engenharia de software com expressão técnica, caráter editorial e futurismo discreto, agora com opção de leitura clara no blog.

Inspirado na precisão dos sites técnicos minimalistas, na leitura confortável de blogs editoriais e em interfaces modernas sem excesso visual. Não copiar layouts ou assets de terceiros.

### Decisões

1. **Conteúdo primeiro:** arquitetura, problemas, resultados e raciocínio mais visíveis que efeitos.
2. **Clareza de interação:** links parecem links; botões têm hierarquia evidente; foco e hover distinguíveis.
3. **Dark-first, não neon-first:** verde-pastel identifica ações; amarelo destaca uma pequena área por vez. No light mode, acentos tornam-se mais escuros para manter contraste.
4. **Monoespaçada sem saturação:** reservar para metadados, labels, código, navegação e indicadores.
5. **Componentes por responsabilidade:** cards não devem carregar lógica de filtros, tema ou navegação.
6. **Portfólio = blog:** mesmo header, footer, tokens, largura e linguagem visual.
7. **Axiom independente:** apenas link externo/rota; não trocar seu design.

## Práticas recomendadas

- Mostrar o problema resolvido em cada projeto; stack é contexto secundário.
- Tratar artigos como conteúdo longo: largura limitada, headings, exemplos e respiro vertical.
- Usar fundos texturizados apenas em áreas pequenas, como a hero.
- Preferir conteúdo acessível sem JavaScript; usar JS para progressão (menu, pesquisa).
- Componentes com espaçamento e bordas consistentes, derivados de tokens.

## Evitar

- Gradientes agressivos, glow forte, animações intermináveis e terminal em todo lugar.
- Cards com alturas fixas que cortem descrições longas.
- Texto cinza de contraste baixo, botão sem estado de foco e menu somente em hover.
- Misturar cores semânticas com cores decorativas.
- Acoplar a implementação do design system a um framework específico nesta etapa.

## Evolução

v0.1 = tokens, fundamentos, CSS reutilizável e catálogo.  
v0.2 = implementação em layouts reais do portfólio/blog e decisão de infraestrutura editorial.  
v1.0 = design validado em páginas reais, com acessibilidade auditada e documentação de variantes estabilizada.
