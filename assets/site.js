(() => {
  const filters = document.querySelector('.project-filters');
  if (filters) {
    const result = document.querySelector('.filter-result');
    const buttons = [...filters.querySelectorAll('button[data-filter]')];
    const groups = [...document.querySelectorAll('[data-group]')];
    filters.hidden = false;
    result.hidden = false;
    const applyFilter = value => {
      const selected = buttons.find(b => b.dataset.filter === value) || buttons[0];
      const key = selected.dataset.filter;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === selected)));
      groups.forEach(g => { g.hidden = key !== 'all' && g.dataset.group !== key; });
      const count = groups.filter(g => !g.hidden).reduce((n,g) => n + g.querySelectorAll('[data-project]').length, 0);
      result.textContent = key === 'all' ? `Showing all ${count} projects` : `Showing ${count} projects in ${selected.textContent.replace(/\s*\d+\s*$/, '').trim()}`;
    };
    const readFilter = () => applyFilter(new URL(location.href).searchParams.get('category') || 'all');
    buttons.forEach(button => button.addEventListener('click', () => {
      const url = new URL(location.href);
      button.dataset.filter === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', button.dataset.filter);
      history.pushState(null, '', url);
      applyFilter(button.dataset.filter);
    }));
    window.addEventListener('popstate', readFilter);
    readFilter();
  }
  document.querySelectorAll('[data-switch]').forEach(explorer => {
    const select = explorer.querySelector('[data-panel-select]');
    const panels = [...explorer.querySelectorAll('[data-panel]')];
    select.closest('label').hidden = false;
    const update = () => panels.forEach(panel => { panel.hidden = panel.id !== select.value; });
    select.addEventListener('change', update);
    update();
  });
})();
