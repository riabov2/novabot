(() => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const closeMenu = () => { if (!toggle || !menu) return; toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); };
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); menu.classList.toggle('open', !open); });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 18), { passive: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) items.forEach(item => item.classList.add('visible'));
  else { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 }); items.forEach(item => observer.observe(item)); }

  const demoTabs = [...document.querySelectorAll('[data-demo-tab]')];
  const demoPanels = [...document.querySelectorAll('[data-demo-panel]')];
  const demoNav = document.querySelector('.product-tabs');
  const demoStage = document.querySelector('.demo-stage');
  let demoIndex = 0;
  let demoTimer;
  const selectDemo = (index, manual = false) => {
    demoIndex = (index + demoTabs.length) % demoTabs.length;
    demoTabs.forEach((tab, i) => {
      const active = i === demoIndex;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    demoPanels.forEach((panel, i) => panel.classList.toggle('active', i === demoIndex));
    if (manual) {
      demoNav?.classList.add('paused');
      clearInterval(demoTimer);
    }
  };
  const startDemoTour = () => {
    if (reduced || demoTabs.length < 2) return;
    clearInterval(demoTimer);
    demoTimer = setInterval(() => selectDemo(demoIndex + 1), 6000);
  };
  demoTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectDemo(index, true));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const next = event.key === 'ArrowRight' ? index + 1 : index - 1;
      selectDemo(next, true);
      demoTabs[demoIndex].focus();
    });
  });
  demoStage?.addEventListener('mouseenter', () => clearInterval(demoTimer));
  demoStage?.addEventListener('mouseleave', () => { if (!demoNav?.classList.contains('paused')) startDemoTour(); });
  selectDemo(0);
  startDemoTour();
})();
