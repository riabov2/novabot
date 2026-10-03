(() => {
  const rail = document.querySelector('.nb-bottom');
  const trigger = rail?.querySelector('.game-trigger');
  if (!rail || !trigger) return;

  const normalize = (pathname) => pathname
    .toLowerCase()
    .replace(/\/index\.html$/, '/')
    .replace(/\/+$/, '/');
  const current = normalize(window.location.pathname);

  rail.querySelectorAll('a').forEach((link) => {
    const isCurrent = normalize(new URL(link.href).pathname) === current;
    link.classList.toggle('active', isCurrent || (link === trigger && rail.classList.contains('is-open')));
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const setOpen = (open) => {
    rail.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  setOpen(rail.classList.contains('is-open'));

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    setOpen(!rail.classList.contains('is-open'));
  });

  const activeLink = rail.querySelector('[aria-current="page"]');
  if (rail.classList.contains('is-open') && activeLink && activeLink !== trigger) {
    requestAnimationFrame(() => {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }
})();
