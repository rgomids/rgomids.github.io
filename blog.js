/* Progressive enhancement for static Jekyll blog listing; articles remain visible without JS. */
(() => {
  const search = document.querySelector('[data-post-search]');
  const posts = [...document.querySelectorAll('[data-post]')];
  if (!search || posts.length === 0) return;

  const controls = [...document.querySelectorAll('[data-post-filter]')];
  const counter = document.querySelector('[data-post-count]');
  const empty = document.querySelector('[data-post-empty]');
  let activeTag = 'all';

  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const render = () => {
    const query = normalize(search.value.trim());
    let visible = 0;
    for (const post of posts) {
      const matchesText = !query || normalize(post.textContent).includes(query);
      const matchesTag = activeTag === 'all' || (post.dataset.tags || '').split(',').map(s => s.trim()).includes(activeTag);
      const show = matchesText && matchesTag;
      post.hidden = !show;
      if (show) visible += 1;
    }
    if (counter) counter.textContent = visible === 1 ? '1 artigo encontrado' : `${visible} artigos encontrados`;
    if (empty) empty.hidden = visible !== 0;
  };
  search.addEventListener('input', render);
  for (const button of controls) {
    button.addEventListener('click', () => {
      activeTag = button.dataset.postFilter;
      for (const candidate of controls) candidate.setAttribute('aria-pressed', String(candidate === button));
      render();
    });
  }
  render();
})();
