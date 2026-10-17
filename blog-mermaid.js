/* Progressive enhancement: render fenced Mermaid blocks without losing readable source.
   Mermaid is loaded only on articles containing a Mermaid code fence.
   If the CDN or rendering fails, Rouge's original code block remains visible. */
(async () => {
  const blocks = [...document.querySelectorAll('.language-mermaid pre code')];
  if (!blocks.length) return;

  let mermaid;
  try {
    ({ default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs'));
  } catch (error) {
    console.warn('Mermaid indisponível; código do diagrama preservado.', error);
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'dark',
    fontFamily: '"Space Grotesk", sans-serif',
    themeVariables: {
      darkMode: true,
      background: '#0b0f0e',
      primaryColor: '#151b18',
      primaryTextColor: '#e9ede7',
      primaryBorderColor: '#587064',
      lineColor: '#a8d7b2',
      secondaryColor: '#1c2520',
      tertiaryColor: '#151b18',
      textColor: '#e9ede7',
      fontFamily: '"Space Grotesk", sans-serif'
    }
  });

  for (const [index, code] of blocks.entries()) {
    const source = code.textContent.trim();
    const original = code.closest('.language-mermaid') || code.closest('pre');
    if (!original || !source) continue;
    try {
      const { svg, bindFunctions } = await mermaid.render(`article-diagram-${index + 1}`, source);
      const panel = document.createElement('div');
      panel.className = 'blog-diagram';
      panel.setAttribute('role', 'img');
      panel.setAttribute('aria-label', `Diagrama técnico ${index + 1}`);
      panel.setAttribute('tabindex', '0');
      panel.innerHTML = svg;
      bindFunctions?.(panel);
      original.replaceWith(panel);
    } catch (error) {
      console.warn(`Falha ao renderizar diagrama ${index + 1}; mantendo fonte.`, error);
    }
  }
})();
