/* Shared appearance controller. Load synchronously in <head> before CSS to
   avoid a flash of the wrong theme. The value is stored across blog pages.
   No access to storage is required for basic reading or switching. */
(() => {
  const root = document.documentElement;
  const key = 'rgomids-color-theme';
  const media = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let preference = 'system';
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === 'light' || stored === 'dark' || stored === 'system') preference = stored;
  } catch (_) { /* Privacy/security settings can block localStorage. */ }

  const resolvedTheme = () => preference === 'system'
    ? (media?.matches ? 'dark' : 'light') : preference;

  const render = () => {
    const active = resolvedTheme();
    root.dataset.theme = active;
    root.dataset.themePreference = preference;
    root.style.colorScheme = active;
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      const next = active === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', 'Ativar modo ' + (next === 'light' ? 'claro' : 'escuro'));
      button.setAttribute('title', 'Ativar modo ' + (next === 'light' ? 'claro' : 'escuro'));
      const label = button.querySelector('[data-theme-label]');
      const icon = button.querySelector('[data-theme-icon]');
      if (label) label.textContent = next === 'light' ? 'Modo claro' : 'Modo escuro';
      if (icon) icon.textContent = next === 'light' ? '☀' : '☾';
    }
  };

  // Set colors before the first stylesheet is parsed.
  render();
  const initialize = () => {
    root.dataset.themeReady = 'true';
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.addEventListener('click', () => {
        preference = resolvedTheme() === 'dark' ? 'light' : 'dark';
        try { window.localStorage.setItem(key, preference); } catch (_) { /* non-persistent fallback */ }
        render();
      });
    }
    render();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  const onSystemChange = () => {
    if (preference === 'system') render();
  };
  if (media?.addEventListener) media.addEventListener('change', onSystemChange);
  else if (media?.addListener) media.addListener(onSystemChange);
})();
