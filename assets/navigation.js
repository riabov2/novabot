(() => {
  const HUB = 'https://hub.muimmortalbot.com/';
  const rail = document.querySelector('.nb-bottom');
  const siteRoot = new URL('../', new URL(document.currentScript.src));
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

  if (rail) {
    const tabs = [
      ['bot-settings-13/index.html', 'Overview'],
      ['elf-minion-settings/index.html', 'Character'],
      ['map-settings/index.html', 'Hunting'],
      ['activities-settings/index.html', 'Events'],
      ['grab-store/index.html', 'Market'],
      ['pvp/index.html', 'PvP'],
      ['character-list/index.html', 'List'],
      ['others-settings/index.html', 'Settings']
    ];
    rail.innerHTML = `<a href="${new URL('mu/index.html', siteRoot)}" class="game-trigger" aria-expanded="${rail.classList.contains('is-open')}">MU</a>`
      + tabs.map(([path, label]) => `<a href="${new URL(path, siteRoot)}">${label}</a>`).join('');
  }
  const trigger = rail?.querySelector('.game-trigger');

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
  const paneBySection = {
    mu: 'overview', 'bot-settings-13': 'overview',
    'elf-minion-settings': 'character', 'get-coordinates': 'character',
    'map-settings': 'hunting', map: 'hunting',
    'activities-settings': 'events', 'grab-store': 'market',
    pvp: 'pvp', 'character-list': 'list',
    'others-settings': 'settings', 'installation-download': 'setup'
  };
  const pane = paneBySection[section];
  if (!pane) return;
  const container = document.querySelector('.container, .installsetup-container, .bot-settings-container, .mapsetup-container, .map-container, .elfsetup-container, .activities-container, .others-container, .coordinates-container, .grab-container');
  if (!container) return;

  const img = (name) => new URL(`assets/hub/${name}`, siteRoot);
  const logo = new URL('assets/novabot-logo.png', siteRoot);
  const tabDefs = [
    ['overview', 'bot-settings-13/index.html', 'Overview'],
    ['character', 'elf-minion-settings/index.html', 'Character'],
    ['hunting', 'map-settings/index.html', 'Hunting'],
    ['events', 'activities-settings/index.html', 'Events'],
    ['market', 'grab-store/index.html', 'Market'],
    ['pvp', 'pvp/index.html', 'PvP'],
    ['list', 'character-list/index.html', 'List'],
    ['settings', 'others-settings/index.html', 'Settings']
  ];
  const hubTabs = tabDefs.map(([key, path, label]) => `<a class="hub-ui-tab${pane === key ? ' on' : ''}" href="${new URL(path, siteRoot)}">${label}${key === 'events' ? '<i>●</i>' : ''}</a>`).join('');
  const toggle = (label, note, on = true) => `<div class="hub-switch"><div><b>${label}</b><small>${note}</small></div><span class="hub-toggle${on ? ' on' : ''}"><i></i></span></div>`;
  const stat = (label, value, tone = '') => `<div class="hub-stat"><span>${label}</span><strong class="${tone}">${value}</strong></div>`;
  const activity = (image, label, value, state = 'Ready') => `<article class="hub-activity" style="--activity:url('${img(image)}')"><div><span>${label}</span><strong>${value}</strong><small>${state}</small></div></article>`;

  const panes = {
    setup: `
      <div class="hub-ui-grid setup-grid">
        <section class="hub-ui-card hub-span-12"><div class="hub-card-head"><div><span class="hub-eyebrow">Setup wizard</span><h2>Three steps to connect NovaBot</h2></div><span class="hub-pill gold">WEB PANEL</span></div></section>
        <section class="hub-ui-card hub-span-4 hub-setup-step done"><b>01</b><h3>License</h3><p>MU-••••••-••••••</p><span>Connected</span></section>
        <section class="hub-ui-card hub-span-4 hub-setup-step active"><b>02</b><h3>Device</h3><p>Rooted cloud phone or Windows emulator</p><span>Agent online</span></section>
        <section class="hub-ui-card hub-span-4 hub-setup-step"><b>03</b><h3>Game</h3><p>Open MU Immortal and select a character</p><span>Waiting for game</span></section>
        <section class="hub-ui-card hub-span-8"><h2>Connected device</h2><div class="hub-device"><span>RF-Android-01</span><b>ONLINE</b></div><div class="hub-code">curl -s https://hub.muimmortalbot.com/setup | sh</div></section>
        <section class="hub-ui-card hub-span-4 hub-art-card" style="--art:url('${img('master-exp.jpg')}')"><span>Setup</span><strong>Ready for web control</strong></section>
      </div>`,
    overview: `
      <div class="hub-ui-grid">
        <section class="hub-character hub-span-12" style="--hero:url('${img('master-exp.jpg')}')">
          <img src="${logo}" alt="NovaBot"><div><span class="hub-eyebrow">Character</span><h2>NovaBot Demo</h2><p>S181 · Level 628 · Mystic Land</p></div><span class="hub-pill green">IN GAME</span>
        </section>
        <section class="hub-ui-card hub-span-8"><div class="hub-card-head"><h2>Daily jobs</h2><span class="hub-pill green">7 ACTIVE</span></div><div class="hub-activity-grid">${activity('mystic-land.jpg','Mystic Land','3 / 5','Running')}${activity('kundun.jpg','Kundun Trial','2 / 3')}${activity('warrior-quest.jpg','Warrior Quest','5 / 5','Done')}${activity('blood-castle.jpg','Blood Castle','Next 21:00','Waiting')}</div></section>
        <section class="hub-ui-card hub-span-4"><div class="hub-card-head"><h2>Right now</h2><span class="hub-live-dot"></span></div><div class="hub-now"><span>BOSS</span><strong>Heading to Golden Boss</strong><small>Mystic Land · Wire 2 · 46 m</small></div>${toggle('Auto hunt','Following the saved route')}${toggle('Pickup','Rare items and above')}</section>
        <section class="hub-ui-card hub-span-4"><h2>Hunting & deaths</h2><div class="hub-stats">${stat('Red boss','14','red')}${stat('Golden boss','6','gold')}${stat('Deaths','1')}</div></section>
        <section class="hub-ui-card hub-span-4"><h2>MU Coin wallet</h2><div class="hub-balance">128,450 <small>MUC</small></div><div class="hub-delta"><span>Earned +18,200</span><span>Spent −4,800</span></div></section>
        <section class="hub-ui-card hub-span-4"><h2>Boss tracking</h2><div class="hub-progress"><i style="width:72%"></i></div><p class="hub-muted">Route 5/7 · next: Kundun Trial</p></section>
      </div>`,
    character: `
      <div class="hub-subtabs"><button class="on">Buff & AFK</button><button>Equipment</button><button>Inventory</button><button>Character</button></div>
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-7"><div class="hub-card-head"><h2>Buff pickup</h2><span class="hub-pill green">ACTIVE</span></div>${toggle('Get buff automatically','Travel when selected buffs expire')}${toggle('Return after buff','Continue the previous task')}${toggle('Invite buff elf','NovaElf, SupportElf')}<div class="hub-fields"><label>Wait at point<input value="5 minutes" readonly></label><label>Retry after<input value="20 minutes" readonly></label></div></section>
        <section class="hub-ui-card hub-span-5 hub-art-card tall" style="--art:url('${img('warrior-quest.jpg')}')"><span>Saved position</span><strong>Lost Tower · Wire 3</strong><button>Pin current location</button></section>
        <section class="hub-ui-card hub-span-6"><h2>AFK return</h2>${toggle('Return to farming point','After death or event')}${toggle('Auto revive','Birth point · 3 sec delay')}<div class="hub-coords"><span>X <b>289</b></span><span>Y <b>793</b></span><button>Clear</button></div></section>
        <section class="hub-ui-card hub-span-6"><h2>Elf buff</h2>${toggle('Buff nearby players','Guild and party whitelist')}${toggle('Accept party requests','Trusted characters only')}<div class="hub-skill-row"><i>1</i><i>2</i><i>3</i><i>4</i><span>4 skills selected</span></div></section>
      </div>`,
    hunting: `
      <div class="hub-subtabs"><button class="on">Boss hunt</button><button>Route</button><button>VIP</button><button>Pickup</button><button>Salvage</button></div>
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-8"><div class="hub-card-head"><div><span class="hub-eyebrow">Boss hunt</span><h2>Hunting: Golden Boss</h2></div><span class="hub-pill green">3 ALIVE</span></div><div class="hub-boss-board"><div class="hub-boss-target" style="--art:url('${img('excellent.jpg')}')"><span>Current target</span><strong>Golden Knight</strong><small>41 m · Wire 2</small></div><div class="hub-boss-list"><p><b class="red">●</b> Red Dragon <span>76 m</span></p><p><b class="gold">●</b> Golden Knight <span>41 m</span></p><p><b class="gold">●</b> Golden Titan <span>93 m</span></p></div></div></section>
        <section class="hub-ui-card hub-span-4"><h2>Hunt settings</h2>${toggle('Red bosses','Enabled')}${toggle('Golden bosses','Enabled')}${toggle('Skip claimed','Other player owns loot')}<div class="hub-fields"><label>Priority<input value="Unclaimed first" readonly></label><label>Fight range<input value="3 cells" readonly></label></div></section>
        <section class="hub-ui-card hub-span-12"><div class="hub-card-head"><h2>Map route</h2><span class="hub-muted">6 stops</span></div><div class="hub-route"><span class="here"><b>1</b>Mystic Land<small>W2</small></span><i>→</i><span><b>2</b>Kundun<small>W1</small></span><i>→</i><span><b>3</b>VIP Domain<small>F3</small></span><i>→</i><span><b>4</b>Excellent<small>W2</small></span></div></section>
        <section class="hub-ui-card hub-span-7 hub-art-card route-art" style="--art:url('${img('vip.jpg')}')"><span>VIP hunting</span><strong>When the route is empty</strong><button>Floor 3 · Golden first</button></section>
        <section class="hub-ui-card hub-span-5"><h2>Daily limit</h2><div class="hub-stats">${stat('Red','14 / 30','red')}${stat('Golden','6 / 20','gold')}</div><div class="hub-progress"><i style="width:47%"></i></div><p class="hub-muted">Boss hunting continues until both limits are reached.</p></section>
      </div>`,
    events: `
      <div class="hub-subtabs"><button class="on">Daily jobs</button><button>Timed events</button><button>Recorder</button></div>
      <div class="hub-event-wall">${[
        ['blood-castle.jpg','Blood Castle','Open','2 / 3'],['devil-square.jpg','Devil Square','Opens 18:30','1 / 3'],['warrior-quest.jpg','Warrior Quest','Running','5 / 10'],['mystic-land.jpg','Mystic Land','Ready','3 / 5'],['guild-boss.jpg','Guild Boss','Tonight 21:00','Auto'],['pvp.jpg','3v3 Arena','Matching','4 / 5'],['kundun.jpg','Kundun Trial','Ready','2 / 3'],['excellent.jpg','Excellent Boss','Whole day','Auto']
      ].map(([pic,name,state,count],i)=>`<article class="hub-event-card${i===2?' active':''}" style="--art:url('${img(pic)}')"><div class="hub-event-state">${state}</div><span>${name}</span><strong>${count}</strong><div class="hub-toggle on"><i></i></div></article>`).join('')}</div>`,
    market: `
      <div class="hub-subtabs"><button class="on">Buy orders</button><button>Divine Realm</button><button>Recent purchases</button><button>Inventory</button></div>
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-12 hub-market-hero" style="--art:url('${img('master-exp.jpg')}')"><div><span class="hub-eyebrow">MU Coin wallet</span><strong>128,450 <small>MUC</small></strong><p>Today: 8 purchases · −4,800 MUC</p></div><button>+ Item</button></section>
        <section class="hub-ui-card hub-span-8"><div class="hub-card-head"><h2>Buy orders</h2><span class="hub-pill green">SCANNING</span></div><div class="hub-orders"><article><i>JOC</i><div><b>Jewel of Chaos</b><span>24 / 50 bought</span><div class="hub-progress"><i style="width:48%"></i></div></div><strong>≤ 1,080</strong></article><article><i>SS</i><div><b>Soul Stone</b><span>8 / 20 bought</span><div class="hub-progress"><i style="width:40%"></i></div></div><strong>≤ 860</strong></article><article><i>FL</i><div><b>Fluorite</b><span>Target reached</span><div class="hub-progress"><i style="width:100%"></i></div></div><strong>≤ 420</strong></article></div></section>
        <section class="hub-ui-card hub-span-4"><h2>Market automation</h2>${toggle('Real buying','Orders may purchase')}${toggle('Scan Trading Hall','Active orders only')}${toggle('Rent a stall','Divine Realm')}<div class="hub-fields"><label>Daily cap<input value="25,000 MUC" readonly></label></div></section>
        <section class="hub-ui-card hub-span-12"><h2>Recent purchases</h2><table class="hub-table"><thead><tr><th>Item</th><th>Source</th><th>Quantity</th><th>Unit price</th><th>Total</th></tr></thead><tbody><tr><td>Jewel of Chaos</td><td>Trading Hall</td><td>×3</td><td>980</td><td>2,940</td></tr><tr><td>Soul Stone</td><td>Stall 14</td><td>×2</td><td>820</td><td>1,640</td></tr></tbody></table></section>
      </div>`,
    pvp: `
      <div class="hub-subtabs"><button class="on">Fight mode</button><button>Attackers</button><button>Counter attack</button></div>
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-12 hub-pvp-hero" style="--art:url('${img('pvp.jpg')}')"><div><span class="hub-eyebrow">PvP</span><h2>Attackers and fight mode</h2><p>Live protection rules from the web panel</p></div><span class="hub-pill green">MONITORING</span></section>
        <section class="hub-ui-card hub-span-7"><h2>Fight mode</h2><div class="hub-mode-row"><button>Peace</button><button>Team</button><button>Guild</button><button>Cross Guild</button><button class="on">All</button></div>${toggle('Record players who hit me','Players only, not monsters')}${toggle('Notify on Telegram','Once per 5 minutes per player')}</section>
        <section class="hub-ui-card hub-span-5"><h2>Counter attack</h2>${toggle('Attack whoever hits me','Chase and auto-fight')}${toggle('Switch to All mode','Restore previous mode after')}<div class="hub-fields"><label>Stop after<input value="15 seconds" readonly></label></div></section>
        <section class="hub-ui-card hub-span-12"><div class="hub-card-head"><h2>Recent attackers</h2><button>Clear list</button></div><table class="hub-table"><thead><tr><th>Player</th><th>Map</th><th>Hits</th><th>Damage</th><th>Last seen</th></tr></thead><tbody><tr><td><b>DarkKnight</b></td><td>Mystic Land</td><td>12</td><td class="red">84,230</td><td>2 min ago</td></tr><tr><td><b>WizardX</b></td><td>VIP Domain</td><td>4</td><td>19,410</td><td>18 min ago</td></tr></tbody></table></section>
      </div>`,
    list: `
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-12"><div class="hub-card-head"><div><span class="hub-eyebrow">Account</span><h2>Character list</h2></div><div class="hub-search">Server no. or character</div></div><div class="hub-list-summary">${stat('Characters','4')}${stat('Online','3','green')}${stat('Total MUC','486,240','gold')}${stat('Diamonds','12,850')}</div></section>
        <section class="hub-ui-card hub-span-12 hub-table-wrap"><table class="hub-table character-table"><thead><tr><th>Character</th><th>Main server</th><th>Cross servers</th><th>Level</th><th>MUC</th><th>Diamonds</th><th>Status</th></tr></thead><tbody><tr><td><div class="hub-char"><img src="${logo}" alt=""><b>NovaKnight</b></div></td><td>S181</td><td>S179 · S180</td><td>628</td><td>128,450</td><td>4,200</td><td><span class="hub-pill green">ONLINE</span></td></tr><tr><td><div class="hub-char"><img src="${logo}" alt=""><b>NovaElf</b></div></td><td>S181</td><td>S179 · S180</td><td>602</td><td>94,800</td><td>3,150</td><td><span class="hub-pill green">ONLINE</span></td></tr><tr><td><div class="hub-char"><img src="${logo}" alt=""><b>NovaMage</b></div></td><td>S205</td><td>Single server</td><td>577</td><td>178,320</td><td>4,900</td><td><span class="hub-pill gold">GAME CLOSED</span></td></tr><tr><td><div class="hub-char"><img src="${logo}" alt=""><b>NovaLord</b></div></td><td>S94</td><td>S92 · S93</td><td>511</td><td>84,670</td><td>600</td><td><span class="hub-pill green">ONLINE</span></td></tr></tbody></table></section>
      </div>`,
    settings: `
      <div class="hub-subtabs"><button class="on">General</button><button>Telegram</button><button>Status card</button><button>Setup</button><button>Log</button></div>
      <div class="hub-ui-grid">
        <section class="hub-ui-card hub-span-6"><h2>General</h2><div class="hub-fields"><label>Language<select><option>English</option></select></label><label>Timezone<select><option>Server time</option></select></label></div>${toggle('In-game status card','Show the current bot decision')}${toggle('Automatic updates','Keep agent and rules current')}</section>
        <section class="hub-ui-card hub-span-6"><div class="hub-card-head"><h2>Telegram</h2><span class="hub-pill green">CONNECTED</span></div>${toggle('Boss alerts','Red, golden and excellent')}${toggle('PvP alerts','Players who attack you')}${toggle('Event alerts','Open, joined and completed')}<button class="hub-button">Send test message</button></section>
        <section class="hub-ui-card hub-span-7"><h2>In-game status card</h2><div class="hub-ingame-card"><span>BOSS</span><b>Heading to Golden Knight</b><small>Mystic Land · Wire 2 · 41 m</small></div>${toggle('Display card','Bottom centre of game')}</section>
        <section class="hub-ui-card hub-span-5"><h2>License & device</h2><div class="hub-device"><span>NovaBot Demo</span><b>ACTIVE</b></div><p class="hub-muted">RF-Android-01 · Agent 2.4.1</p><button class="hub-button">Open setup</button></section>
        <section class="hub-ui-card hub-span-12"><div class="hub-card-head"><h2>Recent events</h2><span class="hub-muted">Live log</span></div><div class="hub-log"><p><time>14:26:08</time><b>SAVED</b> Configuration applied</p><p><time>14:25:51</time><b>HUNT</b> Golden Knight selected · 41 m</p><p><time>14:24:13</time><b>EVENT</b> Blood Castle opens at 21:00</p></div></section>
      </div>`
  };

  const titles = {setup:'Setup',overview:'Overview',character:'Character',hunting:'Hunting',events:'Events',market:'Market',pvp:'PvP',list:'List',settings:'Settings'};
  document.title = `${titles[pane]} — NovaBot Web Hub`;
  container.className = 'container hub-preview-page';
  container.innerHTML = `
    <section class="hub-ui-shell">
      <header class="hub-ui-top">
        <div class="hub-ui-brand"><img src="${img('hub-logo.png')}" alt="MU Immortal Bot"><div><span class="hub-eyebrow">MU Immortal</span><h1>MU Service Panel</h1></div></div>
        <div class="hub-lamps"><span><i class="on"></i>License</span><span><i class="on"></i>Agent</span><span><i class="on"></i>Game</span></div>
        <a href="${HUB}" target="_blank" rel="noopener">Open live hub ↗</a>
      </header>
      <div class="hub-license-bar"><button class="on"><i></i>NovaBot Demo<small>S181 · Online</small></button><span>Rooted device connected</span></div>
      ${pane === 'setup' ? '' : `<nav class="hub-ui-tabs">${hubTabs}</nav>`}
      <main class="hub-ui-pane">${panes[pane]}</main>
      <footer class="hub-ui-footer"><span>Interface preview based on the live MU Immortal Bot Hub</span><a href="${HUB}" target="_blank" rel="noopener">Launch Web Hub</a></footer>
    </section>`;
})();
