/* Progressive enhancement for the static design-system demos. */
(() => {
  const toggle = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu-panel]');
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) setOpen(false);
    });
  }
  const search = document.querySelector('[data-post-search]');
  const filters = [...document.querySelectorAll('[data-post-filter]')];
  const posts = [...document.querySelectorAll('[data-post]')];
  const count = document.querySelector('[data-post-count]');
  const empty = document.querySelector('[data-post-empty]');
  if (search && posts.length) {
    let tag = 'all';
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase('pt-BR');
      let visible = 0;
      for (const post of posts) {
        const content = post.textContent.toLocaleLowerCase('pt-BR');
        const tags = (post.dataset.tags || '').split(',').map(item => item.trim());
        const matches = (!query || content.includes(query)) && (tag === 'all' || tags.includes(tag));
        post.hidden = !matches;
        if (matches) visible++;
      }
      if (count) count.textContent = visible === 1 ? '1 artigo encontrado' : `${visible} artigos encontrados`;
      if (empty) empty.hidden = visible !== 0;
    };
    for (const filter of filters) {
      filter.addEventListener('click', () => {
        tag = filter.dataset.postFilter;
        for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
        update();
      });
    }
    search.addEventListener('input', update);
    update();
  }
})();
