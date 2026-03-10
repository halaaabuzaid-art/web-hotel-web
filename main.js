// ===== SPA Navigation =====
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
  }

  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.page === pageId) a.classList.add('active');
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-init animations
  initScrollAnimations();
}

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', function () {
  // Wire up all nav links
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showPage(this.dataset.page);
    });
  });

  // Show home by default
  showPage('home');

  // Init features
  initSmoothScroll();
  initMobileMenu();
  initFormValidation();
  initGalleryLightbox();
  initVideoBackground();
});

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) {
        const navHeight = document.querySelector('nav').offsetHeight;
        window.scrollTo({ top: el.offsetTop - navHeight, behavior: 'smooth' });
      }
    });
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.style.cssText = `
      background: none; border: none; font-size: 24px;
      cursor: pointer; color: var(--rose-dark); display: block;
    `;
    nav.insertBefore(menuBtn, nav.firstChild);

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.style.display = 'none';
      menuBtn.addEventListener('click', function () {
        const open = navLinks.style.display !== 'none';
        navLinks.style.display = open ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '68px';
        navLinks.style.right = '0';
        navLinks.style.left = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        menuBtn.innerHTML = open ? '☰' : '✕';
      });
    }
  }
}

// ===== Form Validation =====
function initFormValidation() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      this.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showFieldError(field, 'هذا الحقل مطلوب');
        } else {
          removeFieldError(field);
          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            isValid = false;
            showFieldError(field, 'البريد الإلكتروني غير صحيح');
          }
          if (field.type === 'tel' && !/^[\d\s\-\+\(\)]+$/.test(field.value)) {
            isValid = false;
            showFieldError(field, 'رقم الهاتف غير صحيح');
          }
        }
      });

      if (isValid) {
        showSuccessMessage(form);
        form.reset();
      }
    });
  });
}

function showFieldError(field, message) {
  removeFieldError(field);
  const err = document.createElement('div');
  err.className = 'field-error';
  err.style.cssText = 'color:#e74c3c;font-size:12px;margin-top:4px;';
  err.textContent = message;
  field.style.borderColor = '#e74c3c';
  field.parentNode.appendChild(err);
}

function removeFieldError(field) {
  field.style.borderColor = '';
  const e = field.parentNode.querySelector('.field-error');
  if (e) e.remove();
}

function showSuccessMessage(form) {
  const div = document.createElement('div');
  div.style.cssText = `
    background:#27ae60;color:white;padding:15px 20px;
    border-radius:10px;margin-top:20px;text-align:center;
    animation:fadeIn 0.3s ease;
  `;
  div.textContent = 'تم الإرسال بنجاح! سنتواصل معك قريباً.';
  form.appendChild(div);
  setTimeout(() => div.remove(), 5000);
}

// ===== Gallery Lightbox =====
function initGalleryLightbox() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;
      const lb = document.createElement('div');
      lb.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.9);display:flex;
        align-items:center;justify-content:center;
        z-index:9999;cursor:pointer;animation:fadeIn 0.3s ease;
      `;
      const i = document.createElement('img');
      i.src = img.src;
      i.style.cssText = 'max-width:90%;max-height:90%;border-radius:10px;';
      lb.appendChild(i);
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';
      lb.addEventListener('click', () => {
        lb.remove();
        document.body.style.overflow = '';
      });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { lb.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', esc); }
      });
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const els = document.querySelectorAll('.feature-card:not(.animated), .package-card:not(.animated), .team-card:not(.animated), .value-card:not(.animated), .gallery-item:not(.animated)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn', 'animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== Video Background =====
function initVideoBackground() {
  const video = document.querySelector('.video-section video');
  if (!video) return;

  video.play().catch(() => {
    const vs = document.querySelector('.video-section');
    if (vs) vs.style.display = 'none';
  });

  video.addEventListener('error', function () {
    const vs = document.querySelector('.video-section');
    if (vs) vs.style.display = 'none';
  });
}
