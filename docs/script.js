/*STICKY HEADER*/
(function initStickyHeader() {
  const sticky = document.getElementById('stickyHeader');
  const hero = document.getElementById('heroSection');
  if (!sticky || !hero) return;

  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const scrollingDown = window.scrollY > lastY;
    if (heroBottom < 0 && scrollingDown) {
      sticky.classList.add('visible');
    } else if (window.scrollY < lastY || heroBottom >= 0) {
      sticky.classList.remove('visible');
    }
    lastY = window.scrollY;
  }, { passive: true });
})();


/*HERO CAROUSEL + ZOOM*/
(function initHeroCarousel() {
  const images = [
    'assets/images/workers.png',
    'assets/images/workers.png',
    'assets/images/workers.png',
    'assets/images/workers.png',
    'assets/images/workers.png',
    'assets/images/workers.png',
  ];

  let current = 0;
  const mainImg = document.getElementById('mainImg');
  const zoomImg = document.getElementById('zoomImg');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const thumbs = document.querySelectorAll('.thumb');
  const carMain = document.getElementById('carouselMain');
  const zoomPanel = document.getElementById('zoomPanel');
  const zoomCursor = document.getElementById('zoomCursor');

  if (!mainImg) return;

  function goTo(index) {
    thumbs[current]?.classList.remove('active');
    current = (index + images.length) % images.length;
    mainImg.src = images[current];
    if (zoomImg) zoomImg.src = images[current];
    thumbs[current]?.classList.add('active');
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  thumbs.forEach(t => t.addEventListener('click', () => goTo(+t.dataset.index)));

  const ZOOM = 2.5;
  const LENS = 150;


  if (zoomPanel) {
    document.body.appendChild(zoomPanel);
    zoomPanel.style.position   = 'fixed';
    zoomPanel.style.zIndex     = '99999';
    zoomPanel.style.width      = '350px';
    zoomPanel.style.height     = '350px';
    zoomPanel.style.top        = '0';
    zoomPanel.style.left       = '0';
    zoomPanel.style.opacity    = '0';
    zoomPanel.style.transition = 'opacity 0.2s';
  }

  carMain?.addEventListener('mouseenter', () => {
    if (!zoomImg) return;
    zoomImg.src = mainImg.src;
    if (zoomPanel) zoomPanel.style.opacity = '1';
    if (zoomCursor) zoomCursor.style.opacity = '1';
  });

  carMain?.addEventListener('mousemove', (e) => {
    const mainRect = carMain.getBoundingClientRect();
    const imgRect  = mainImg.getBoundingClientRect();
    const ix = e.clientX - imgRect.left;
    const iy = e.clientY - imgRect.top;
    const halfLens = LENS / 2;
    const lensX = Math.max(halfLens, Math.min(imgRect.width  - halfLens, ix));
    const lensY = Math.max(halfLens, Math.min(imgRect.height - halfLens, iy));
    const offsetX = imgRect.left - mainRect.left;
    const offsetY = imgRect.top  - mainRect.top;

    
    if (zoomCursor) {
      zoomCursor.style.left = (lensX + offsetX) + 'px';
      zoomCursor.style.top  = (lensY + offsetY) + 'px';
    }

    
    if (zoomPanel) {
      var pLeft = imgRect.right + 16;
      var pTop  = Math.max(10, Math.min(imgRect.top, window.innerHeight - 360));
      zoomPanel.style.left = pLeft + 'px';
      zoomPanel.style.top  = pTop  + 'px';
    }

    
    const xPct = (lensX / imgRect.width)  * 100;
    const yPct = (lensY / imgRect.height) * 100;
    if (zoomImg) {
      zoomImg.style.transformOrigin = xPct + '% ' + yPct + '%';
      zoomImg.style.transform       = 'scale(' + ZOOM + ')';
    }
  });

  carMain?.addEventListener('mouseleave', () => {
    if (zoomImg)   zoomImg.style.transform = 'scale(1)';
    if (zoomPanel) zoomPanel.style.opacity = '0';
    if (zoomCursor) zoomCursor.style.opacity = '0';
  });
})();


/*APPLICATIONS CAROUSEL*/
(function initAppCarousel() {
  const track = document.getElementById('appTrack');
  const prevBtn = document.getElementById('appPrev');
  const nextBtn = document.getElementById('appNext');
  if (!track) return;

  const CARD_W = 314;
  let offset = 0;

  function maxOffset() {
    const cards = track.querySelectorAll('.app-card').length;
    const visible = Math.floor(track.parentElement.offsetWidth / CARD_W);
    return Math.max(0, (cards - visible) * CARD_W);
  }

  prevBtn?.addEventListener('click', () => {
    offset = Math.max(0, offset - CARD_W);
    track.style.transform = 'translateX(-' + offset + 'px)';
  });

  nextBtn?.addEventListener('click', () => {
    offset = Math.min(maxOffset(), offset + CARD_W);
    track.style.transform = 'translateX(-' + offset + 'px)';
  });
})();


/*MANUFACTURING PROCESS TABS*/
(function initProcessTabs() {
  const tabs = document.querySelectorAll('.proc-tab');
  if (!tabs.length) return;

  var data = {
    raw: { title: 'High-Grade Raw Material Selection', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', list: ['PE100 grade material', 'Optimal molecular weight distribution'] },
    extrusion: { title: 'Precision Extrusion Process', desc: 'Single-screw extruders with precise temperature control zones ensure uniform melt quality and consistent pipe dimensions throughout production.', list: ['Temperature-controlled zones', 'Uniform melt flow rate'] },
    cooling: { title: 'Controlled Cooling System', desc: 'Water bath cooling ensures gradual, uniform cooling preventing residual stresses and ensuring dimensional stability of the finished pipe.', list: ['Staged water bath cooling', 'Stress-free pipe formation'] },
    sizing: { title: 'Precision Sizing & Calibration', desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.', list: ['+/-0.1mm dimensional tolerance', 'Continuous wall thickness monitoring'] },
    quality: { title: 'Rigorous Quality Control', desc: 'Every pipe undergoes comprehensive testing including hydrostatic pressure tests, dimensional checks, and visual inspection before certification.', list: ['Hydrostatic pressure testing', 'ISO/BIS certification compliance'] },
    marking: { title: 'Permanent Pipe Marking', desc: 'Inkjet or embossed marking systems apply production data including size, pressure rating, standard compliance, and batch number for full traceability.', list: ['Full production traceability', 'Standards compliance marking'] },
    cutting: { title: 'Precision Cutting', desc: 'Automated cutting systems ensure clean, square cuts at exact lengths, ready for installation or coiling as specified by the customer.', list: ['Automated length control', 'Clean square-cut ends'] },
    packaging: { title: 'Secure Packaging & Dispatch', desc: 'Pipes are bundled, strapped and wrapped to protect against UV exposure and physical damage during transport and outdoor storage.', list: ['UV-protected wrapping', 'Transit-safe bundling'] }
  };

  var titleEl = document.getElementById('procTitle');
  var descEl = document.getElementById('procDesc');
  var listEl = document.getElementById('procList');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var d = data[tab.dataset.tab];
      if (d && titleEl && descEl && listEl) {
        titleEl.textContent = d.title;
        descEl.textContent = d.desc;
        listEl.innerHTML = d.list.map(function (i) {
          return '<li><span class="check-dot"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' + i + '</li>';
        }).join('');
      }
    });
  });
})();


/*FAQ ACCORDION*/
(function initFAQ() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  var SVG_DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
  var SVG_UP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var chev = item.querySelector('.faq-chev');

    if (!btn) return;

    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');

      /* Close all */
      items.forEach(function (i) {
        i.classList.remove('open');
        var c = i.querySelector('.faq-chev');
        if (c) { c.innerHTML = SVG_DOWN; c.classList.remove('up'); }
      });

      /* Open clicked if it was closed */
      if (!wasOpen) {
        item.classList.add('open');
        if (chev) { chev.innerHTML = SVG_UP; chev.classList.add('up'); }
      }
    });
  });
})();


/*MODAL OPEN / CLOSE */
function openModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.modal-overlay').forEach(function (o) {
  o.addEventListener('click', function (e) {
    if (e.target === o) { o.classList.remove('open'); document.body.style.overflow = ''; }
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open'); document.body.style.overflow = '';
    });
  }
});


/*MOBILE NAV*/
(function initMobileNav() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    nav.classList.toggle('open');
    var spans = btn.querySelectorAll('span');
    var open = nav.classList.contains('open');
    spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity = open ? '0' : '';
    spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });
})();


/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});