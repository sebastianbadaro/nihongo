(function () {
  const inListening = /\/listening\//.test(window.location.pathname);
  const root = inListening ? '../' : '';

  const NAV_LINKS = [
    { href: root + 'index.html',               label: 'Quiz',      icon: '📝', pat: /index\.html$|\/nihongo\/?$/ },
    { href: root + 'listening/listening.html',  label: 'Listening', icon: '🎧', pat: /listening\.html/ },
    { href: root + 'revision.html',             label: 'Revisión',  icon: '🔭', pat: /revision\.html/ },
    { href: root + 'changelog.html',            label: 'Cambios',   icon: '📋', pat: /changelog\.html/ },
  ];

  const path = window.location.pathname;

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #snav-btn {
      position: fixed;
      top: 12px; left: 12px;
      z-index: 1001;
      width: 38px; height: 38px;
      border-radius: 10px;
      border: 1.5px solid rgba(0,0,0,0.10);
      background: #fff;
      color: #2c3e50;
      font-size: 17px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 6px rgba(0,0,0,0.10);
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    body.dark #snav-btn {
      background: #252538;
      border-color: rgba(255,255,255,0.12);
      color: #e2e8f0;
      box-shadow: 0 1px 6px rgba(0,0,0,0.4);
    }
    #snav-btn:hover { border-color: #c0392b; color: #c0392b; }
    body.dark #snav-btn:hover { border-color: #e57373; color: #e57373; }

    #snav-backdrop {
      display: none;
      position: fixed; inset: 0;
      z-index: 999;
      background: rgba(0,0,0,0.38);
    }
    #snav-backdrop.snav-open { display: block; }

    #snav-panel {
      position: fixed;
      top: 0; left: 0;
      height: 100%;
      width: 240px;
      z-index: 1000;
      background: #fff;
      box-shadow: 3px 0 20px rgba(0,0,0,0.12);
      transform: translateX(-100%);
      transition: transform 0.24s cubic-bezier(.4,0,.2,1);
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    body.dark #snav-panel {
      background: #1e1e2e;
      box-shadow: 3px 0 20px rgba(0,0,0,0.55);
    }
    #snav-panel.snav-open { transform: translateX(0); }

    @media (max-width: 480px) {
      #snav-panel { width: min(280px, 85vw); }
    }

    #snav-header {
      padding: 18px 16px 14px;
      border-bottom: 1px solid #f0e4e4;
      display: flex; align-items: flex-start; justify-content: space-between;
    }
    body.dark #snav-header { border-color: #2d2d4a; }

    #snav-title-jp {
      font-size: 1em;
      font-weight: 700;
      color: #c0392b;
      line-height: 1.2;
      font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
    }
    body.dark #snav-title-jp { color: #e57373; }
    #snav-title-sub {
      font-size: 0.72em;
      color: #7f8c8d;
      margin-top: 2px;
      font-weight: 400;
    }
    body.dark #snav-title-sub { color: #64748b; }

    #snav-close {
      background: none; border: none;
      color: #7f8c8d; cursor: pointer;
      font-size: 18px; line-height: 1;
      padding: 2px 4px; border-radius: 6px;
      flex-shrink: 0;
      transition: color 0.15s, background 0.15s;
    }
    #snav-close:hover { color: #c0392b; background: #fef6f6; }
    body.dark #snav-close:hover { color: #e57373; background: #2d1f1f; }

    #snav-links {
      flex: 1;
      padding: 10px 8px;
      display: flex; flex-direction: column; gap: 2px;
      overflow-y: auto;
    }

    .snav-link {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9em;
      font-weight: 500;
      color: #2c3e50;
      transition: background 0.15s, color 0.15s;
    }
    body.dark .snav-link { color: #e2e8f0; }
    .snav-link:hover { background: #fef6f6; color: #c0392b; }
    body.dark .snav-link:hover { background: #252538; color: #e57373; }
    .snav-link.snav-active {
      background: #fef6f6;
      color: #c0392b;
      font-weight: 600;
    }
    body.dark .snav-link.snav-active { background: #2d1f1f; color: #e57373; }

    .snav-icon { font-size: 1.05em; flex-shrink: 0; width: 20px; text-align: center; }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  const linksHtml = NAV_LINKS.map(l => {
    const active = l.pat.test(path) ? ' snav-active' : '';
    return `<a href="${l.href}" class="snav-link${active}">
      <span class="snav-icon">${l.icon}</span>${l.label}
    </a>`;
  }).join('');

  const btn      = document.createElement('button');
  btn.id         = 'snav-btn';
  btn.setAttribute('aria-label', 'Menú');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'snav-panel');
  btn.textContent = '☰';

  const backdrop = document.createElement('div');
  backdrop.id = 'snav-backdrop';

  const panel = document.createElement('nav');
  panel.id = 'snav-panel';
  panel.setAttribute('role', 'navigation');
  panel.setAttribute('aria-label', 'Navegación principal');
  panel.innerHTML = `
    <div id="snav-header">
      <div>
        <div id="snav-title-jp">日本語 Quiz</div>
        <div id="snav-title-sub">Dekiru Nihongo</div>
      </div>
      <button id="snav-close" aria-label="Cerrar menú">✕</button>
    </div>
    <div id="snav-links">${linksHtml}</div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  /* ── Behavior ── */
  const closeBtn = panel.querySelector('#snav-close');

  function openNav() {
    panel.classList.add('snav-open');
    backdrop.classList.add('snav-open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    panel.classList.remove('snav-open');
    backdrop.classList.remove('snav-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();
