/* =====================================================================
   Hariyo Waste, Public Site Shared Layout
   Injects sticky header + footer into public pages.
   Each public page includes this script and calls UI.mountPublic(active).
   ===================================================================== */

(function (global) {
  'use strict';

  const NAV = [
    { href: 'index.html',       label: 'Home' },
    { href: 'about.html',       label: 'About' },
    { href: 'how-it-works.html', label: 'How It Works' },
    { href: 'compost.html',     label: 'Buy Compost' },
    { href: 'booking.html',     label: 'Book Collection' },
    { href: 'track.html',       label: 'Track Waste' },
    { href: 'contact.html',     label: 'Contact' },
  ];

  function brandHtml() {
    return `
      <a class="brand" href="index.html">
        <img class="brand-logo" src="../logo1.png" alt="" width="38" height="38" />
        <span>Hariyo Waste<small>Segregated Waste · Itahari</small></span>
      </a>`;
  }

  function headerHTML(active) {
    const links = NAV.map(n =>
      `<a href="${n.href}" class="${active === n.href ? 'active' : ''}"${active === n.href ? ' aria-current="page"' : ''}>${n.label}</a>`
    ).join('');
    return `
      <header class="site-header">
        <div class="container bar">
          ${brandHtml()}
          <nav class="nav-links" id="navLinks" aria-label="Main navigation">${links}</nav>
          <div class="header-cta">
            <a href="track.html" class="btn btn-outline btn-sm">Track Waste</a>
            <a href="booking.html" class="btn btn-primary btn-sm">Book Collection</a>
            <button type="button" class="menu-btn" id="menuBtn" aria-label="Open navigation menu" aria-controls="navLinks" aria-expanded="false">${UI.iconSvg('menu')}</button>
          </div>
        </div>
      </header>`;
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand" style="color:#fff;margin-bottom:14px">
                <img class="brand-logo" src="../logo1.png" alt="" width="38" height="38" />
                <span>Hariyo Waste<small style="color:#9fb6a8">Closing the loop on waste</small></span>
              </div>
              <p style="color:#9fb6a8;font-size:.88rem;max-width:320px">
                A Nepalese waste management startup that buys segregated waste from
                businesses, recycles it responsibly and turns organic waste into
                compost for local farms.
              </p>
            </div>
            <div>
              <h2>Company</h2>
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="how-it-works.html">How It Works</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div>
              <h2>Services</h2>
              <ul>
                <li><a href="booking.html">Book Collection</a></li>
                <li><a href="track.html">Track Your Waste</a></li>
                <li><a href="compost.html">Buy Compost</a></li>
              </ul>
            </div>
            <div>
              <h2>Staff Access</h2>
              <ul>
                <li><a href="dashboard.html">Staff Dashboard</a></li>
                <li><a href="worker.html">Worker Mobile App</a></li>
                <li><a href="track.html">Batch Tracking</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function mountPublic(active) {
    // Insert header at top of body, footer at bottom; ensure container wrapping
    const header = document.createElement('div');
    header.innerHTML = headerHTML(active);
    const headerNode = header.firstElementChild;
    document.body.insertBefore(headerNode, document.body.firstChild);

    const footer = document.createElement('div');
    footer.innerHTML = footerHTML();
    document.body.appendChild(footer.firstElementChild);

    // Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
      const mobileMenu = window.matchMedia('(max-width: 1180px)');
      const setMenuOpen = (open) => {
        navLinks.classList.toggle('open', open);
        navLinks.hidden = mobileMenu.matches && !open;
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      };
      setMenuOpen(false);
      menuBtn.addEventListener('click', () => {
        const open = menuBtn.getAttribute('aria-expanded') !== 'true';
        setMenuOpen(open);
        if (open) navLinks.querySelector('a')?.focus();
      });
      navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenuOpen(false);
      });
      menuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
      });
      navLinks.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { setMenuOpen(false); menuBtn.focus(); }
      });
      mobileMenu.addEventListener('change', () => setMenuOpen(false));
    }

    if (!document.querySelector('script[data-accessibility-controller]')) {
      const script = document.createElement('script');
      script.src = 'js/accessibility.js';
      script.dataset.accessibilityController = 'true';
      document.body.appendChild(script);
    }

    if (!document.querySelector('script[data-hariyo-chat]')) {
      const script = document.createElement('script');
      script.src = 'js/chatbot.js';
      script.dataset.hariyoChat = 'true';
      document.body.appendChild(script);
    }
  }

  global.UI.mountPublic = mountPublic;
})(window);
