/* ============================================================
   SKYBOOK – Premium Arabic Flight Booking Website
   script.js
   ============================================================ */

'use strict';

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL for nav links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

createParticles();

/* ===== TRIP TYPE TABS ===== */
const tripTabs = document.querySelectorAll('.trip-tab');
const returnField = document.getElementById('returnField');

tripTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tripTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const type = tab.dataset.tab;
    if (type === 'oneway') {
      returnField.style.opacity = '0.4';
      returnField.style.pointerEvents = 'none';
      returnField.querySelector('input').value = '';
    } else {
      returnField.style.opacity = '1';
      returnField.style.pointerEvents = 'auto';
    }
  });
});

/* ===== SWAP BUTTON ===== */
const swapBtn = document.getElementById('swapBtn');
if (swapBtn) {
  swapBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.search-field input[type="text"]');
    if (inputs.length >= 2) {
      const valA = inputs[0].value;
      const valB = inputs[1].value;
      inputs[0].value = valB;
      inputs[1].value = valA;

      // Swap codes
      const codes = document.querySelectorAll('.field-code');
      if (codes.length >= 2) {
        const codeA = codes[0].textContent;
        const codeB = codes[1].textContent;
        codes[0].textContent = codeB;
        codes[1].textContent = codeA;
      }
    }
    swapBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => { swapBtn.style.transform = ''; }, 400);
  });
}

/* ===== PASSENGERS DROPDOWN ===== */
const passengersInput = document.getElementById('passengersInput');
const passDropdown = document.getElementById('passDropdown');
const passDone = document.getElementById('passDone');
const passCount = document.getElementById('passCount');

let passengers = { adults: 1, children: 0, infants: 0 };

if (passengersInput) {
  passengersInput.addEventListener('click', (e) => {
    e.stopPropagation();
    passengersInput.classList.toggle('open');
    passDropdown.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (passDropdown && !passDropdown.contains(e.target) && e.target !== passengersInput) {
    passengersInput && passengersInput.classList.remove('open');
    passDropdown && passDropdown.classList.remove('open');
  }
});

function updatePassCount() {
  const total = passengers.adults + passengers.children + passengers.infants;
  let label = `${total} مسافر`;
  if (total !== 1) label = `${total} مسافرين`;
  passCount.textContent = label;
}

document.querySelectorAll('.cnt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    const action = btn.dataset.action;

    if (action === 'plus') {
      if (type === 'adults' && passengers.adults < 9) passengers.adults++;
      if (type === 'children' && passengers.children < 9) passengers.children++;
      if (type === 'infants' && passengers.infants < passengers.adults) passengers.infants++;
    } else {
      if (type === 'adults' && passengers.adults > 1) passengers.adults--;
      if (type === 'children' && passengers.children > 0) passengers.children--;
      if (type === 'infants' && passengers.infants > 0) passengers.infants--;
    }

    document.getElementById('adultsCount').textContent = passengers.adults;
    document.getElementById('childrenCount').textContent = passengers.children;
    document.getElementById('infantsCount').textContent = passengers.infants;
    updatePassCount();
  });
});

if (passDone) {
  passDone.addEventListener('click', () => {
    passengersInput && passengersInput.classList.remove('open');
    passDropdown && passDropdown.classList.remove('open');
  });
}

/* ===== SET DEFAULT DATES ===== */
function setDefaultDates() {
  const today = new Date();
  const depart = new Date(today);
  depart.setDate(today.getDate() + 7);
  const ret = new Date(today);
  ret.setDate(today.getDate() + 14);

  const fmt = d => d.toISOString().split('T')[0];

  const departInput = document.getElementById('departDate');
  const returnInput = document.getElementById('returnDate');

  if (departInput) {
    departInput.value = fmt(depart);
    departInput.min = fmt(today);
  }
  if (returnInput) {
    returnInput.value = fmt(ret);
    returnInput.min = fmt(depart);
  }

  if (departInput) {
    departInput.addEventListener('change', () => {
      if (returnInput) {
        const newMin = new Date(departInput.value);
        newMin.setDate(newMin.getDate() + 1);
        returnInput.min = fmt(newMin);
        if (returnInput.value && new Date(returnInput.value) <= new Date(departInput.value)) {
          returnInput.value = fmt(newMin);
        }
      }
    });
  }
}

setDefaultDates();

/* ===== SEARCH BUTTON ===== */
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const fromInput = document.querySelector('.search-field input[type="text"]:first-of-type');
    const toInput = document.querySelectorAll('.search-field input[type="text"]')[1];

    if (!toInput || !toInput.value.trim()) {
      showToast('⚠️ الرجاء تحديد وجهتك أولاً');
      toInput && toInput.focus();
      return;
    }

    searchBtn.textContent = '...جاري البحث عن رحلات';
    searchBtn.style.opacity = '0.8';

    setTimeout(() => {
      searchBtn.innerHTML = '<span class="search-btn-icon">🔍</span> ابحث عن رحلات';
      searchBtn.style.opacity = '1';
      showToast('✅ تم العثور على 24 رحلة متاحة!');
    }, 1800);
  });
}

/* ===== DESTINATION CARDS hover city name ===== */
document.querySelectorAll('.dest-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const cityName = btn.closest('.dest-card').querySelector('h3').textContent;
    showToast(`✈️ جاري البحث عن رحلات إلى ${cityName}...`);
  });
});

/* ===== BOOK BUTTONS ===== */
document.querySelectorAll('.book-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.deal-card');
    const dest = card.querySelector('.route-city:last-child .route-name').textContent;
    const price = card.querySelector('.deal-price strong').textContent;
    showToast(`🎟️ تم تأجيل الحجز إلى ${dest} بسعر ${price}`);
  });
});

/* ===== REVIEWS SLIDER ===== */
const reviewCards = document.querySelectorAll('.review-card');
const sliderDots = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentReview = 0;
let reviewAutoPlay;

function buildDots() {
  if (!sliderDots) return;
  reviewCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `مراجعة ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToReview(i));
    sliderDots.appendChild(dot);
  });
}

function goToReview(index) {
  reviewCards[currentReview].classList.remove('active');
  document.querySelectorAll('.dot')[currentReview]?.classList.remove('active');

  currentReview = (index + reviewCards.length) % reviewCards.length;

  reviewCards[currentReview].classList.add('active');
  document.querySelectorAll('.dot')[currentReview]?.classList.add('active');
}

function nextReview() { goToReview(currentReview + 1); }
function prevReview() { goToReview(currentReview - 1); }

function startAutoPlay() {
  reviewAutoPlay = setInterval(nextReview, 5000);
}

function stopAutoPlay() {
  clearInterval(reviewAutoPlay);
}

if (reviewCards.length > 0) {
  reviewCards[0].classList.add('active');
  buildDots();
  startAutoPlay();

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextReview(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevReview(); startAutoPlay(); });
}

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(fi => {
      fi.classList.remove('open');
      fi.querySelector('.faq-answer').classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>جاري الإرسال...</span>';
    btn.style.opacity = '0.8';

    setTimeout(() => {
      btn.innerHTML = '<span>✅ تم إرسال رسالتك بنجاح!</span>';
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.opacity = '1';
        contactForm.reset();
        showToast('✉️ شكراً! سنتواصل معك في أقرب وقت.');
      }, 2500);
    }, 1500);
  });
}

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn && scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn && scrollTopBtn.classList.remove('visible');
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== INTERSECTION OBSERVER – Fade in animations ===== */
const fadeEls = document.querySelectorAll('.fade-in-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

/* ===== TOAST NOTIFICATION ===== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ===== DESTINATION CARDS – parallax subtle effect ===== */
document.querySelectorAll('.dest-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ===== DEAL CARDS – subtle tilt ===== */
document.querySelectorAll('.deal-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.querySelector('.deal-route') &&
      (card.querySelector('.deal-route').style.transform = `translateX(${x * 0.5}px)`);
  });

  card.addEventListener('mouseleave', () => {
    const route = card.querySelector('.deal-route');
    if (route) route.style.transform = '';
  });
});

/* ===== AUTO-COMPLETE CITY SUGGESTIONS ===== */
const cities = [
  { name: 'دبي', code: 'DXB' },
  { name: 'القاهرة', code: 'CAI' },
  { name: 'جدة', code: 'JED' },
  { name: 'الرياض', code: 'RUH' },
  { name: 'إسطنبول', code: 'IST' },
  { name: 'باريس', code: 'CDG' },
  { name: 'لندن', code: 'LHR' },
  { name: 'الدوحة', code: 'DOH' },
  { name: 'أبوظبي', code: 'AUH' },
  { name: 'الكويت', code: 'KWI' },
  { name: 'مسقط', code: 'MCT' },
  { name: 'بيروت', code: 'BEY' },
  { name: 'عمّان', code: 'AMM' },
  { name: 'نيويورك', code: 'JFK' },
  { name: 'دبي الإمارات', code: 'DWC' },
  { name: 'فرانكفورت', code: 'FRA' },
  { name: 'أمستردام', code: 'AMS' },
  { name: 'روما', code: 'FCO' },
  { name: 'مدريد', code: 'MAD' },
  { name: 'بنكوك', code: 'BKK' },
  { name: 'كوالالمبور', code: 'KUL' },
  { name: 'سنغافورة', code: 'SIN' },
  { name: 'طوكيو', code: 'NRT' },
];

const cityInputs = document.querySelectorAll('.search-field input[type="text"]');

cityInputs.forEach((input, idx) => {
  const wrapper = input.closest('.search-field');
  let suggBox = null;

  input.addEventListener('input', () => {
    const val = input.value.trim();
    removeSugg();

    if (val.length < 1) return;

    const matches = cities.filter(c =>
      c.name.includes(val) || c.code.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);

    if (matches.length === 0) return;

    suggBox = document.createElement('div');
    suggBox.className = 'city-suggestions';
    suggBox.style.cssText = `
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      left: 0;
      background: #fff;
      border: 2px solid #e2e8f4;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(10,61,145,0.15);
      z-index: 200;
      overflow: hidden;
    `;

    matches.forEach(city => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 11px 14px;
        cursor: pointer;
        font-family: Cairo, sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        color: #0d1b3e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f1f5fb;
        transition: background 0.2s;
      `;
      item.innerHTML = `<span>${city.name}</span><span style="font-size:0.75rem;color:#7589ab;font-weight:700;letter-spacing:1px;">${city.code}</span>`;

      item.addEventListener('mouseenter', () => { item.style.background = '#f1f5fb'; });
      item.addEventListener('mouseleave', () => { item.style.background = ''; });

      item.addEventListener('mousedown', () => {
        input.value = city.name;
        const codes = wrapper.querySelectorAll('.field-code');
        if (codes.length > 0) codes[0].textContent = city.code;
        else {
          const codeEl = wrapper.querySelector('.field-code');
          if (codeEl) codeEl.textContent = city.code;
        }
        removeSugg();
      });

      suggBox.appendChild(item);
    });

    wrapper.style.position = 'relative';
    wrapper.appendChild(suggBox);
  });

  input.addEventListener('blur', () => {
    setTimeout(removeSugg, 200);
  });

  function removeSugg() {
    if (suggBox && suggBox.parentNode) {
      suggBox.parentNode.removeChild(suggBox);
      suggBox = null;
    }
  }
});

/* ===== COUNTER ANIMATION (stats) ===== */
function animateCounters() {
  const stats = document.querySelectorAll('.stat strong');
  stats.forEach(stat => {
    const target = stat.textContent;
    const numMatch = target.match(/[\d,.]+/);
    if (!numMatch) return;

    const rawNum = numMatch[0].replace(/,/g, '');
    const num = parseFloat(rawNum);
    const suffix = target.replace(numMatch[0], '');
    const hasPlus = suffix.includes('+');
    const isFloat = rawNum.includes('.');

    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;
      const display = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('ar');
      stat.textContent = display + (hasPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
      else stat.textContent = target;
    };
    requestAnimationFrame(step);
  });
}

// Trigger counter when hero stats become visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

/* ===== SCROLL PROGRESS BAR ===== */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(to left, #FF8A00, #3FA9F5);
  z-index: 9999;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = scrolled / maxScroll;
  progressBar.style.transform = `scaleX(${progress})`;
});

/* ===== NAVBAR ACTIVE LINK HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--accent)';
    }
  });
});

/* ===== WHY CARDS hover ripple ===== */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      top: ${e.clientY - rect.top - size / 2}px;
      left: ${e.clientX - rect.left - size / 2}px;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
      z-index: 10;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ===== DEAL CARDS BADGE PULSE ===== */
document.querySelectorAll('.deal-badge').forEach(badge => {
  setInterval(() => {
    badge.style.transform = 'scale(1.08)';
    setTimeout(() => { badge.style.transform = ''; }, 300);
  }, 3000);
});

/* ===== KEYBOARD ACCESSIBILITY ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close passengers dropdown
    if (passDropdown) passDropdown.classList.remove('open');
    if (passengersInput) passengersInput.classList.remove('open');
    // Close mobile menu
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }

  // Arrow keys for slider
  if (e.key === 'ArrowLeft') nextReview();
  if (e.key === 'ArrowRight') prevReview();
});

/* ===== TOUCH SWIPE for SLIDER ===== */
let touchStartX = 0;
let touchEndX = 0;

const sliderEl = document.querySelector('.reviews-slider-wrap');
if (sliderEl) {
  sliderEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  sliderEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextReview();
      else prevReview();
    }
  }, { passive: true });
}

/* ===== INITIAL PAGE VISIBILITY FIX ===== */
// Ensure first review card is visible on load
if (reviewCards.length > 0) {
  reviewCards.forEach((c, i) => {
    c.classList.toggle('active', i === 0);
  });
}

/* ===== DYNAMIC YEAR IN FOOTER ===== */
const yearEls = document.querySelectorAll('.footer-bottom p');
yearEls.forEach(el => {
  el.innerHTML = el.innerHTML.replace('2025', new Date().getFullYear());
});

/* ===== CONSOLE BRANDING ===== */
console.log(
  '%c✈ SKYBOOK %c| Premium Flight Booking ',
  'background:#0A3D91;color:#fff;font-family:Cairo,sans-serif;font-size:14px;font-weight:800;padding:8px 12px;border-radius:6px 0 0 6px;',
  'background:#FF8A00;color:#fff;font-family:Cairo,sans-serif;font-size:14px;font-weight:700;padding:8px 12px;border-radius:0 6px 6px 0;'
);

/* ============================================================
   SKYBOOK – PREMIUM UI UPGRADE LAYER
   ============================================================ */

/* ===== PREMIUM LOADER PERCENT COUNTER ===== */
(function() {
  const pct = document.getElementById('loaderPercent');
  if (!pct) return;
  let val = 0;
  const interval = setInterval(() => {
    val += Math.floor(Math.random() * 8) + 3;
    if (val >= 100) { val = 100; clearInterval(interval); }
    pct.textContent = val + '%';
  }, 80);
})();

/* ===== SPARKLES IN HERO ===== */
(function createSparkles() {
  const container = document.getElementById('heroSparkles');
  if (!container) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-duration:${Math.random() * 4 + 2}s;
      animation-delay:${Math.random() * 5}s;
    `;
    container.appendChild(s);
  }
})();

/* ===== PREMIUM CITY SUGGESTIONS ===== */
const premiumCities = [
  { name: 'دبي',       country: 'الإمارات', code: 'DXB', flag: '🇦🇪' },
  { name: 'القاهرة',   country: 'مصر',      code: 'CAI', flag: '🇪🇬' },
  { name: 'جدة',       country: 'السعودية', code: 'JED', flag: '🇸🇦' },
  { name: 'الرياض',    country: 'السعودية', code: 'RUH', flag: '🇸🇦' },
  { name: 'إسطنبول',   country: 'تركيا',   code: 'IST', flag: '🇹🇷' },
  { name: 'باريس',     country: 'فرنسا',    code: 'CDG', flag: '🇫🇷' },
  { name: 'لندن',      country: 'المملكة المتحدة', code: 'LHR', flag: '🇬🇧' },
  { name: 'الدوحة',    country: 'قطر',      code: 'DOH', flag: '🇶🇦' },
  { name: 'أبوظبي',    country: 'الإمارات', code: 'AUH', flag: '🇦🇪' },
  { name: 'الكويت',    country: 'الكويت',   code: 'KWI', flag: '🇰🇼' },
  { name: 'مسقط',      country: 'عُمان',    code: 'MCT', flag: '🇴🇲' },
  { name: 'عمّان',     country: 'الأردن',   code: 'AMM', flag: '🇯🇴' },
  { name: 'بيروت',     country: 'لبنان',    code: 'BEY', flag: '🇱🇧' },
  { name: 'نيويورك',   country: 'الولايات المتحدة', code: 'JFK', flag: '🇺🇸' },
  { name: 'فرانكفورت', country: 'ألمانيا',  code: 'FRA', flag: '🇩🇪' },
  { name: 'أمستردام',  country: 'هولندا',   code: 'AMS', flag: '🇳🇱' },
  { name: 'روما',      country: 'إيطاليا',  code: 'FCO', flag: '🇮🇹' },
  { name: 'مدريد',     country: 'إسبانيا',  code: 'MAD', flag: '🇪🇸' },
  { name: 'بانكوك',    country: 'تايلاند',  code: 'BKK', flag: '🇹🇭' },
  { name: 'سنغافورة',  country: 'سنغافورة', code: 'SIN', flag: '🇸🇬' },
  { name: 'طوكيو',     country: 'اليابان',  code: 'NRT', flag: '🇯🇵' },
  { name: 'كوالالمبور',country: 'ماليزيا',  code: 'KUL', flag: '🇲🇾' },
  { name: 'مومباي',    country: 'الهند',    code: 'BOM', flag: '🇮🇳' },
  { name: 'زيورخ',     country: 'سويسرا',   code: 'ZRH', flag: '🇨🇭' },
];

function buildSuggestionBox(inputEl, boxEl, codeEl) {
  if (!inputEl || !boxEl) return;

  function showSugg(matches) {
    if (!matches.length) { boxEl.classList.remove('visible'); return; }
    boxEl.innerHTML = `<div class="sf-sugg-header">مطارات مقترحة</div>`;
    matches.forEach(city => {
      const item = document.createElement('div');
      item.className = 'sf-sugg-item';
      item.innerHTML = `
        <div class="sf-sugg-icon">${city.flag}</div>
        <div class="sf-sugg-text">
          <span class="sf-sugg-name">${city.name}</span>
          <span class="sf-sugg-country">${city.country}</span>
        </div>
        <span class="sf-sugg-code">${city.code}</span>
      `;
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = city.name;
        if (codeEl) codeEl.textContent = city.code;
        boxEl.classList.remove('visible');
      });
      boxEl.appendChild(item);
    });
    boxEl.classList.add('visible');
  }

  inputEl.addEventListener('input', () => {
    const val = inputEl.value.trim();
    if (!val) { boxEl.classList.remove('visible'); return; }
    const matches = premiumCities.filter(c =>
      c.name.includes(val) || c.code.toLowerCase().startsWith(val.toLowerCase()) || c.country.includes(val)
    ).slice(0, 6);
    showSugg(matches);
  });

  inputEl.addEventListener('focus', () => {
    // Show popular cities on empty focus
    if (!inputEl.value.trim()) {
      showSugg(premiumCities.slice(0, 5));
    }
  });

  inputEl.addEventListener('blur', () => {
    setTimeout(() => boxEl.classList.remove('visible'), 200);
  });
}

buildSuggestionBox(
  document.getElementById('fromInput'),
  document.getElementById('fromSuggestions'),
  document.getElementById('fromCode')
);

buildSuggestionBox(
  document.getElementById('toInput'),
  document.getElementById('toSuggestions'),
  document.getElementById('toCode')
);

/* ===== QUICK SEARCH TAGS ===== */
document.querySelectorAll('.qs-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const to = tag.dataset.to;
    const code = tag.dataset.code;
    const toInput = document.getElementById('toInput');
    const toCode  = document.getElementById('toCode');
    if (toInput) toInput.value = to;
    if (toCode)  toCode.textContent = code;
    showToast(`✈️ تم اختيار ${to} (${code}) كوجهة`);
    // Animate the field
    if (toInput) {
      toInput.style.borderColor = 'rgba(255,138,0,0.6)';
      toInput.style.boxShadow = '0 0 0 3px rgba(255,138,0,0.15)';
      setTimeout(() => {
        toInput.style.borderColor = '';
        toInput.style.boxShadow = '';
      }, 1200);
    }
  });
});

/* ===== CABIN OPTIONS TOGGLE ===== */
document.querySelectorAll('.cabin-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cabin-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Update passCount to include class
    const cabin = btn.dataset.cabin;
    const count = document.getElementById('passCount');
    if (count) {
      const totalText = count.textContent.split('·')[0].trim();
      count.textContent = `${totalText} · ${cabin}`;
    }
  });
});

/* ===== PASSENGERS COUNT with cabin class ===== */
// Override the existing updatePassCount to include cabin class
function updatePassCountPremium() {
  const adults   = parseInt(document.getElementById('adultsCount')?.textContent || '1');
  const children = parseInt(document.getElementById('childrenCount')?.textContent || '0');
  const infants  = parseInt(document.getElementById('infantsCount')?.textContent || '0');
  const total = adults + children + infants;
  const activeCabin = document.querySelector('.cabin-opt.active');
  const cabin = activeCabin ? activeCabin.dataset.cabin : 'الاقتصادية';
  const countEl = document.getElementById('passCount');
  if (countEl) countEl.textContent = `${total} ${total === 1 ? 'مسافر' : 'مسافرين'} · ${cabin}`;
}

// Patch counter buttons to also call premium update
document.querySelectorAll('.cnt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(updatePassCountPremium, 10);
  });
});

document.querySelectorAll('.cabin-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(updatePassCountPremium, 10);
  });
});

/* ===== OVERRIDE SEARCH BUTTON for new input IDs ===== */
const searchBtnNew = document.getElementById('searchBtn');
if (searchBtnNew) {
  searchBtnNew.addEventListener('click', () => {
    const toInput = document.getElementById('toInput');
    if (!toInput || !toInput.value.trim()) {
      // Shake the to-field
      const sf = toInput ? toInput.closest('.search-field') : null;
      if (sf) {
        sf.style.animation = 'none';
        sf.style.transform = 'translateX(0)';
        sf.offsetHeight; // reflow
        sf.style.animation = 'shakeField 0.4s ease';
      }
      showToast('⚠️ الرجاء تحديد وجهتك أولاً');
      toInput && toInput.focus();
      return;
    }
    const btn = searchBtnNew;
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="32" style="animation:spinDash 0.8s ease forwards"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg><span>جاري البحث...</span>';
    btn.style.opacity = '0.85';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.opacity = '';
      showToast('✅ تم العثور على 24 رحلة بأفضل الأسعار!');
    }, 2000);
  }, { once: false });
}

// Inject shakeField keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeField {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ===== OVERRIDE SWAP BUTTON for new input IDs ===== */
const swapBtnNew = document.getElementById('swapBtn');
if (swapBtnNew) {
  swapBtnNew.addEventListener('click', () => {
    const from = document.getElementById('fromInput');
    const to   = document.getElementById('toInput');
    const fromCode = document.getElementById('fromCode');
    const toCode   = document.getElementById('toCode');
    if (from && to) {
      [from.value, to.value] = [to.value, from.value];
    }
    if (fromCode && toCode) {
      [fromCode.textContent, toCode.textContent] = [toCode.textContent, fromCode.textContent];
    }
  });
}

/* ===== HERO BACKGROUND PARALLAX on mouse move ===== */
const heroSection = document.getElementById('hero');
const heroImg = document.getElementById('heroImg');
const floatPlane = document.getElementById('floatPlane');

if (heroSection && heroImg) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top)  / rect.height - 0.5;

    heroImg.style.transform = `scale(1.08) translate(${xPct * -10}px, ${yPct * -10}px)`;

    if (floatPlane) {
      floatPlane.style.transform = `translate(${xPct * 20}px, ${yPct * -20}px)`;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
    if (floatPlane) floatPlane.style.transform = '';
  });
}

