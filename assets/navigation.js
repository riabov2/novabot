(() => {
  const HUB = 'https://hub.muimmortalbot.com/';
  const rail = document.querySelector('.nb-bottom');
  const trigger = rail?.querySelector('.game-trigger');
  const top = document.querySelector('.nb-top');

  if (top && !top.querySelector('.hub-nav-link')) {
    const link = document.createElement('a');
    link.href = HUB;
    link.className = 'hub-nav-link';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open Web Hub';
    top.insertBefore(link, top.children[1] || null);
  }

  const labels = {
    'installation-download': 'Start', 'bot-settings-13': 'Overview',
    'map-settings': 'Hunting', map: 'Boss Routes',
    'elf-minion-settings': 'Buff & AFK', 'activities-settings': 'Events',
    'others-settings': 'Settings', 'get-coordinates': 'Character',
    'grab-store': 'Market & Stalls'
  };

  rail?.querySelectorAll('a:not(.game-trigger)').forEach((link) => {
    const key = new URL(link.href).pathname.split('/').filter(Boolean).at(-2);
    if (labels[key]) link.textContent = labels[key];
  });

  if (rail && trigger) {
    const normalize = (path) => path.toLowerCase().replace(/\/index\.html$/, '/').replace(/\/+$/, '/');
    const current = normalize(location.pathname);
    rail.querySelectorAll('a').forEach((link) => {
      const here = normalize(new URL(link.href).pathname) === current;
      link.classList.toggle('active', here || (link === trigger && rail.classList.contains('is-open')));
      if (here) link.setAttribute('aria-current', 'page');
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
  }

  const guides = {
    mu: ['NovaBot × MU Immortal Bot', 'Official collaboration', 'overview',
      'NovaBot now works with the MU Immortal Bot web platform. Setup, live status, hunting, events, market tools, and settings are available from one browser-based hub.',
      [['Sign in', 'Open the hub and select the license or character you want to manage.'], ['Configure', 'Change automation rules in the browser and save them to the active service.'], ['Monitor', 'Follow live status, tasks, hunting results, and alerts from any modern browser.']],
      ['A rooted cloud phone or rooted Android emulator on Windows runs the game.', 'Control the bot from desktop and mobile browsers.', 'The hub stays aligned with active bot features.']],
    'installation-download': ['Start in the Web Hub', 'Web setup', 'setup',
      'NovaBot setup and control now happen in the browser. Keep the game running on a rooted cloud phone or rooted Android emulator on Windows, then manage the active bot from the web hub.',
      [['Open the hub', 'Sign in with the account provided to you.'], ['Add your license', 'Open Setup, enter your NovaBot license key, and select the attached character.'], ['Configure in browser', 'Set hunting, buffs, events, market rules, and notifications, then press Save.']],
      ['Use the English language selector in the hub.', 'Keep your license key private.', 'Open Overview after saving to confirm the active status.']],
    'bot-settings-13': ['Overview & Live Status', 'Web guide', 'overview',
      'Overview is your command centre: character state, current action, daily progress, boss results, deaths, wallet movement, and recent activity are shown in one place.',
      [['Choose a character', 'Select the license/character chip at the top of the hub.'], ['Read the live state', 'Check what the bot is doing and whether any task is waiting, paused, or blocked.'], ['Pause or continue', 'Use the pause control when taking over manually, then resume from the same panel.']],
      ['Daily counters follow the time shown in the hub.', 'Information buttons explain individual fields.', 'Use Overview to verify every saved change.']],
    'map-settings': ['Hunting Settings', 'Web guide', 'boss',
      'The Hunting tab replaces the old map-settings screen. Configure boss types, range, priority, route behaviour, daily limits, pickup, salvage, and recycle directly in the web hub.',
      [['Enable hunting', 'Choose red, golden, or both boss types and set the auto-fight distance.'], ['Pick a priority', 'Select nearest, level-based, colour-first, or unclaimed-first targeting.'], ['Save the route', 'Select maps and wires in travel order, set daily limits, and save.']],
      ['Use 1–2 cells for melee and 3–5 for ranged characters.', 'Skip claimed bosses to avoid another player’s loot.', 'A daily limit of 0 means unlimited.']],
    map: ['Boss Routes & VIP Hunting', 'Web guide', 'boss',
      'Maps are interactive inside the hub. Build an ordered route, choose wires, see the current map, and configure VIP hunting without copying coordinates from screenshots.',
      [['Build a route', 'Search or filter maps, then tick the wires the character should visit.'], ['Order stops', 'The route strip shows the exact travel order; remove and re-add a stop to reprioritise it.'], ['Configure VIP', 'Choose VIP-only or fallback mode, then select floor, wire, fight mode, and bosses.']],
      ['The current map is highlighted.', 'Closed or uncertain wires are marked separately.', 'Standard boss routes need no manual coordinates.']],
    'elf-minion-settings': ['Buff & AFK', 'Web guide', 'extras',
      'Manage buff trips, party roles, elf buffing, AFK return, death recovery, and saved positions from the Character section of the web hub.',
      [['Choose the role', 'Set the character as a hunter receiving buffs or an elf providing them.'], ['Set the rules', 'Choose buffs, retry timing, party names, waiting time, and death behaviour.'], ['Save and verify', 'Save, then use Overview to check the next buff or AFK action.']],
      ['Use exact in-game character names.', 'Whitelist players or guilds when the elf should not buff everyone.', 'Advanced fields have built-in explanations.']],
    'activities-settings': ['Events & Daily Jobs', 'Web guide', 'events',
      'Enable and monitor daily jobs and timed activities from Events. Each card shows whether an activity is open, closed, waiting, running, or finished.',
      [['Open Events', 'Select the event or daily job you want to automate.'], ['Configure it', 'Enable the activity and set its limits, preparation, and fallback options.'], ['Watch progress', 'Use the event card for its current phase and Overview for daily counters.']],
      ['The hub uses live status instead of a static screenshot.', 'Keep the game/server schedule correct.', 'Unavailable activities stay off until requirements are met.']],
    'others-settings': ['Settings, Alerts & Safety', 'Web guide', 'notify',
      'General controls live in Settings: language, alerts, Telegram, the in-game status card, logs, license information, and account options.',
      [['Open Settings', 'Choose the relevant subsection in the last hub tab.'], ['Review descriptions', 'Read the information beside advanced behaviour and notification fields.'], ['Save', 'Wait for confirmation that the bot will apply the change on its next cycle.']],
      ['Never share passwords, keys, or Telegram tokens.', 'Use the technical log only for troubleshooting.', 'Preferences are managed through the web panel.']],
    'get-coordinates': ['Character & Live Position', 'Web guide', 'extras',
      'The old coordinate-capture workflow is no longer the main setup method. Live character data, saved points, buff location, and AFK return are handled from the web hub.',
      [['Open Character', 'Choose the feature that needs a saved position.'], ['Pin the live point', 'Stand at the desired place in game and use the available “pin here” action.'], ['Confirm', 'Verify that the point is saved and the related task is ready.']],
      ['Do not copy coordinates from old screenshots.', 'Clear an old point before replacing it if prompted.', 'Boss routes do not need manual coordinates.']],
    'grab-store': ['Market & Stalls', 'Web guide', 'market',
      'Create buy orders, set maximum unit prices and targets, review purchases, and control Divine Realm stall rental from the Market section.',
      [['Create an order', 'Choose an item, maximum unit price, target quantity, and enable the order.'], ['Set limits', 'Configure a daily MUC cap; keep real buying off while testing rules.'], ['Review results', 'Recent purchases show source, quantity, price, total spent, and failed attempts.']],
      ['A target of 0 means no quantity limit.', 'Buying stops when the target is reached.', 'Reset the counter to restart without deleting the order.']]
  };

  const pathParts = location.pathname.split('/').filter(Boolean);
  const section = pathParts.at(-1)?.toLowerCase() === 'index.html' ? pathParts.at(-2) : pathParts.at(-1);
  const guide = guides[section];
  if (!guide) return;
  const photoSets = {
    mu: [['master-exp.jpg', 'Web dashboard'], ['mystic-land.jpg', 'Mystic Land'], ['blood-castle.jpg', 'Blood Castle']],
    'installation-download': [['master-exp.jpg', 'Web setup'], ['kundun.jpg', 'Kundun'], ['warrior-quest.jpg', 'Warrior Quest']],
    'bot-settings-13': [['guild-boss.jpg', 'Live status'], ['pvp.jpg', 'PvP activity'], ['mystic-land.jpg', 'Daily progress']],
    'map-settings': [['vip.jpg', 'VIP hunting'], ['excellent.jpg', 'Excellent bosses'], ['kundun.jpg', 'Boss route']],
    map: [['kundun.jpg', 'Boss routes'], ['vip.jpg', 'VIP domain'], ['excellent.jpg', 'Excellent hunting']],
    'elf-minion-settings': [['warrior-quest.jpg', 'Character automation'], ['mystic-land.jpg', 'AFK return'], ['guild-boss.jpg', 'Party support']],
    'activities-settings': [['blood-castle.jpg', 'Blood Castle'], ['devil-square.jpg', 'Devil Square'], ['warrior-quest.jpg', 'Warrior Quest']],
    'others-settings': [['master-exp.jpg', 'Web settings'], ['pvp.jpg', 'Alerts'], ['excellent.jpg', 'Live decisions']],
    'get-coordinates': [['mystic-land.jpg', 'Live position'], ['kundun.jpg', 'Saved routes'], ['vip.jpg', 'Pinned locations']],
    'grab-store': [['master-exp.jpg', 'Market control'], ['excellent.jpg', 'Buy orders'], ['guild-boss.jpg', 'Recent activity']]
  };
  const photos = photoSets[section] || photoSets.mu;
  const container = document.querySelector('.container, .installsetup-container, .bot-settings-container, .mapsetup-container, .map-container, .elfsetup-container, .activities-container, .others-container, .coordinates-container, .grab-container');
  if (!container) return;

  const [title, eyebrow, hash, lead, steps, tips] = guide;
  document.title = `${title} — NovaBot`;
  container.className = 'container hub-guide';
  container.innerHTML = `
    <section class="hub-guide-hero">
      <span class="release-badge">${eyebrow}</span><h1>${title}</h1><p>${lead}</p>
      <div class="release-actions">
        <a class="btn-nova" href="${HUB}#${hash}" target="_blank" rel="noopener">Open this section in the Hub</a>
        <a class="btn-nova btn-secondary" href="../index.html">Back to NovaBot</a>
      </div>
      <div class="web-only-note"><strong>Web control hub</strong><span>Rooted cloud phone · Rooted Windows emulator</span></div>
    </section>
    <section class="guide-photo-strip" aria-label="MU Immortal Bot hub artwork">
      ${photos.map(([file, caption]) => `<figure class="guide-photo"><img src="../assets/hub/${file}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join('')}
    </section>
    <section class="guide-steps" aria-label="Guide steps">
      ${steps.map(([heading, text], index) => `<article class="guide-step"><span>${index + 1}</span><div><h2>${heading}</h2><p>${text}</p></div></article>`).join('')}
    </section>
    <section class="hub-tips"><h2>Good to know</h2><ul>${tips.map((tip) => `<li>${tip}</li>`).join('')}</ul></section>`;
})();
