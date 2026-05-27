(function () {
  const NAV_LINKS = [
    { href: 'index.html',      label: 'Inicio',         icon: '🏠', pat: /index\.html$|\/nihongo\/?$/ },
    { href: 'quiz.html',       label: 'Quiz',           icon: '📝', pat: /quiz\.html/ },
    { href: 'listening.html',  label: 'Listening',      icon: '🎧', pat: /listening\.html/ },
    { href: 'revision.html',   label: 'Revisión',       icon: '🔭', pat: /revision\.html/ },
    { href: 'changelog.html',  label: 'Cambios',        icon: '📋', pat: /changelog\.html/ },
    { href: 'config.html',     label: 'Configuración',  icon: '⚙️', pat: /config\.html/ },
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
      border: 1.5px solid rgba(28,25,23,0.12);
      background: #FEFCF6;
      color: #1C1917;
      font-size: 17px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 6px rgba(28,25,23,0.10);
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    body.dark #snav-btn {
      background: #231F1B;
      border-color: rgba(232,224,208,0.12);
      color: #E8E0D0;
      box-shadow: 0 1px 6px rgba(0,0,0,0.45);
    }
    #snav-btn:hover { border-color: #B5281C; color: #B5281C; }
    body.dark #snav-btn:hover { border-color: #E05A45; color: #E05A45; }

    #snav-backdrop {
      display: none;
      position: fixed; inset: 0;
      z-index: 999;
      background: rgba(0,0,0,0.32);
    }
    #snav-backdrop.snav-open { display: block; }

    #snav-panel {
      position: fixed;
      top: 0; left: 0;
      height: 100%;
      width: 240px;
      z-index: 1000;
      background: #FEFCF6;
      box-shadow: 3px 0 20px rgba(28,25,23,0.12);
      transform: translateX(-100%);
      transition: transform 0.24s cubic-bezier(.4,0,.2,1);
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    body.dark #snav-panel {
      background: #1C1A17;
      box-shadow: 3px 0 20px rgba(0,0,0,0.55);
    }
    #snav-panel.snav-open { transform: translateX(0); }

    @media (max-width: 480px) {
      #snav-panel { width: min(280px, 85vw); }
    }

    #snav-header {
      padding: 20px 16px 16px;
      border-bottom: 1px solid #E2D9C8;
      display: flex; align-items: flex-start; justify-content: space-between;
    }
    body.dark #snav-header { border-color: #2E2A23; }

    #snav-title-jp {
      font-size: 1em;
      font-weight: 700;
      color: #B5281C;
      line-height: 1.2;
      font-family: "Hiragino Sans", "Yu Gothic", "Noto Serif JP", serif;
    }
    body.dark #snav-title-jp { color: #E05A45; }
    #snav-title-sub {
      font-size: 0.72em;
      color: #79726A;
      margin-top: 2px;
      font-weight: 400;
    }
    body.dark #snav-title-sub { color: #5A5550; }

    #snav-close {
      background: none; border: none;
      color: #79726A; cursor: pointer;
      font-size: 18px; line-height: 1;
      padding: 2px 4px; border-radius: 6px;
      flex-shrink: 0;
      transition: color 0.15s, background 0.15s;
    }
    #snav-close:hover { color: #B5281C; background: #FDF0EE; }
    body.dark #snav-close:hover { color: #E05A45; background: #2A1A18; }

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
      color: #1C1917;
      transition: background 0.15s, color 0.15s;
    }
    body.dark .snav-link { color: #E8E0D0; }
    .snav-link:hover { background: #FDF0EE; color: #B5281C; }
    body.dark .snav-link:hover { background: #2A1A18; color: #E05A45; }
    .snav-link.snav-active {
      background: #FDF0EE;
      color: #B5281C;
      font-weight: 600;
    }
    body.dark .snav-link.snav-active { background: #2A1A18; color: #E05A45; }

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
    btn.style.display = 'none';
  }
  function closeNav() {
    panel.classList.remove('snav-open');
    backdrop.classList.remove('snav-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.display = '';
  }

  btn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();
