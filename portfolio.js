/* Portfolio navigation: progressively enhance native anchors, no framework required. */
(() => {
  const header = document.querySelector('.ds-header');
  const toggle = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu-panel]');
  if (!header || !toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.dataset.open = String(open);
  };
  const close = () => setOpen(false);
  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (!header.contains(event.target)) close();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) close();
  });
})();
