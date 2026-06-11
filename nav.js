(function () {
  const NAV_LINKS = [
    { href: 'index.html',      label: 'Inicio',         icon: '🏠', pat: /index\.html$|\/nihongo\/?$/ },
    { href: 'quiz.html',       label: 'Quiz',           icon: '📝', pat: /quiz\.html/ },
    { href: 'listening.html',  label: 'Listening',      icon: '🎧', pat: /listening\.html/ },
    { href: 'shadowing.html',  label: 'Shadowing',      icon: '🎙️', pat: /shadowing\.html/ },
    { href: 'changelog.html',  label: 'Cambios',        icon: '📋', pat: /changelog\.html/ },
    { href: 'config.html',     label: 'Configuración',  icon: '⚙️', pat: /config\.html/ },
  ];

  const moonSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const sunSVG  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  const googleIconSVG = '<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="flex-shrink:0"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>';

  const path = window.location.pathname;

  /* ── HTML ── */
  const linksHtml = NAV_LINKS.map(l => {
    const active = l.pat.test(path) ? ' snav-active' : '';
    return `<a href="${l.href}" class="snav-link${active}">
      <span class="snav-icon" aria-hidden="true">${l.icon}</span>${l.label}
    </a>`;
  }).join('');

  const btn = document.createElement('button');
  btn.id = 'snav-btn';
  btn.setAttribute('aria-label', 'Menú de navegación');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'snav-panel');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  /* ── User identity tag (top-right, shows name or login prompt) ── */
  var userTag = document.createElement('button');
  userTag.id = 'snav-user-tag';
  userTag.setAttribute('aria-label', 'Perfil de usuario');
  userTag.setAttribute('type', 'button');

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
      <button id="snav-close" aria-label="Cerrar menú">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div id="snav-links">${linksHtml}</div>
    <div id="snav-footer">
      <button id="snav-theme-btn" aria-label="Activar modo oscuro"></button>
      <span id="snav-theme-label">Modo oscuro</span>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(userTag);
  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  /* ── Theme toggle ── */
  const themeBtn = panel.querySelector('#snav-theme-btn');
  const themeLbl = panel.querySelector('#snav-theme-label');

  function updateNavTheme(isDark) {
    themeBtn.innerHTML = isDark ? sunSVG : moonSVG;
    themeBtn.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    if (themeLbl) themeLbl.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }

  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('nihongo_theme', isDark ? 'dark' : 'light');
    updateNavTheme(isDark);
    /* Keep config.html checkbox in sync if present */
    const configCheck = document.getElementById('dark-toggle');
    if (configCheck) configCheck.checked = isDark;
  });

  updateNavTheme(document.documentElement.getAttribute('data-theme') === 'dark');

  /* ── Open / close ── */
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

  /* ── Auth UI (active only on pages that load supabase-client.js) ── */
  var snavAuthEl = document.createElement('div');
  snavAuthEl.id = 'snav-auth';
  snavAuthEl.style.display = 'none'; /* hidden until auth resolves */
  panel.appendChild(snavAuthEl);

  function _snavEsc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function _renderAuthUI(user) {
    snavAuthEl.style.display = '';

    if (user) {
      var meta    = user.user_metadata || {};
      var name    = meta.full_name || meta.name || (user.email && user.email.split('@')[0]) || 'Usuario';
      var initial = name.charAt(0).toUpperCase();
      var email   = user.email || '';
      var firstName = name.split(' ')[0];

      snavAuthEl.innerHTML =
        '<div class="snav-auth-user">' +
          '<div class="snav-auth-avatar">' + initial + '</div>' +
          '<div class="snav-auth-info">' +
            '<div class="snav-auth-name" title="' + _snavEsc(name) + '">' + _snavEsc(name) + '</div>' +
            '<div class="snav-auth-email" title="' + _snavEsc(email) + '">' + _snavEsc(email) + '</div>' +
          '</div>' +
        '</div>' +
        '<button id="snav-logout-btn" class="snav-auth-logout">Cerrar sesión</button>';

      document.getElementById('snav-logout-btn').addEventListener('click', function () {
        window.SupabaseClient && window.SupabaseClient.logout();
      });

      /* Update user tag — shows first name, clicking opens nav */
      userTag.className = 'tag-visible';
      userTag.innerHTML =
        '<div class="snav-tag-avatar">' + initial + '</div>' +
        '<span class="snav-tag-name">' + _snavEsc(firstName) + '</span>';
      userTag.onclick = openNav;

      /* Add admin-only nav links — check existence inside .then() to avoid duplicates */
      (window.SupabaseClient ? window.SupabaseClient.checkIsAdmin() : Promise.resolve(false))
        .then(function (isAdmin) {
          if (!isAdmin) return;
          var linksEl = document.getElementById('snav-links');
          if (!linksEl) return;
          if (!document.getElementById('snav-revision-link')) {
            var revLink = document.createElement('a');
            revLink.id = 'snav-revision-link';
            revLink.href = 'revision.html';
            revLink.className = 'snav-link' + (/revision\.html/.test(window.location.pathname) ? ' snav-active' : '');
            revLink.innerHTML = '<span class="snav-icon" aria-hidden="true">🔭</span>Revisión';
            linksEl.appendChild(revLink);
          }
          if (!document.getElementById('snav-admin-link')) {
            var adminLink = document.createElement('a');
            adminLink.id = 'snav-admin-link';
            adminLink.href = 'admin.html';
            adminLink.className = 'snav-link' + (/admin\.html/.test(window.location.pathname) ? ' snav-active' : '');
            adminLink.innerHTML = '<span class="snav-icon" aria-hidden="true">🛠️</span>Admin';
            linksEl.appendChild(adminLink);
          }
        });

    } else {
      snavAuthEl.innerHTML =
        '<div class="snav-auth-prompt">Guardá tu progreso en todos tus dispositivos</div>' +
        '<button id="snav-login-btn" class="snav-auth-btn">' +
          googleIconSVG +
          'Iniciar sesión con Google' +
        '</button>';

      document.getElementById('snav-login-btn').addEventListener('click', function () {
        window.SupabaseClient && window.SupabaseClient.loginWithGoogle();
      });

      /* Update user tag — clicking logs in directly */
      userTag.className = 'tag-visible tag-login';
      userTag.innerHTML = '<span class="snav-tag-name">Iniciar sesión</span>';
      userTag.onclick = function () {
        window.SupabaseClient && window.SupabaseClient.loginWithGoogle();
      };

      /* Remove admin-only links on logout */
      ['snav-revision-link', 'snav-admin-link'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.remove();
      });
    }
  }

  (window.supabaseReady || Promise.resolve(null)).then(function (sc) {
    if (!sc) return;
    sc.getUser().then(function (user) { _renderAuthUI(user); });
    sc.onAuthChange(function (_evt, user) { _renderAuthUI(user); });
  });
})();
