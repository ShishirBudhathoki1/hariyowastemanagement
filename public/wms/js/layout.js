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
      `<a href="${n.href}" class="${active === n.href ? 'active' : ''}">${n.label}</a>`
    ).join('');
    return `
      <header class="site-header">
        <div class="container bar">
          ${brandHtml()}
          <nav class="nav-links" id="navLinks">${links}</nav>
          <div class="header-cta">
            <a href="track.html" class="btn btn-outline btn-sm">Track Waste</a>
            <a href="booking.html" class="btn btn-primary btn-sm">Book Collection</a>
            <button class="menu-btn" id="menuBtn" aria-label="Open menu">${UI.iconSvg('menu')}</button>
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
              <h4>Company</h4>
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="how-it-works.html">How It Works</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                <li><a href="booking.html">Book Collection</a></li>
                <li><a href="track.html">Track Your Waste</a></li>
                <li><a href="compost.html">Buy Compost</a></li>
              </ul>
            </div>
            <div>
              <h4>Staff Access</h4>
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
      menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') navLinks.classList.remove('open');
      });
    }
  }

  global.UI.mountPublic = mountPublic;
})(window);
