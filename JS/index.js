/* ===== NAVIGATION ===== */
  let currentPage = 'home';
  let isTransitioning = false;

  function navigate(pageId) {
    if (pageId === currentPage || isTransitioning) return;
    isTransitioning = true;

    const transition = document.getElementById('pageTransition');
    transition.className = 'page-transition enter';

    setTimeout(() => {
      // Hide current page
      const current = document.getElementById(currentPage);
      current.classList.remove('visible');
      setTimeout(() => { current.classList.remove('active'); }, 50);

      // Show new page
      const next = document.getElementById(pageId);
      next.classList.add('active');
      
      // Scroll to top
      window.scrollTo(0, 0);

      setTimeout(() => {
        next.classList.add('visible');
        currentPage = pageId;

        // Update nav
        document.querySelectorAll('[data-page]').forEach(a => {
          a.classList.toggle('active', a.dataset.page === pageId);
        });

        // Exit transition
        transition.className = 'page-transition exit';
        setTimeout(() => {
          transition.className = 'page-transition';
          isTransitioning = false;
          // Trigger reveal animations
          observeReveals();
          // Trigger skill bars
          if (pageId === 'about') {
            document.getElementById('about').classList.add('visible');
          }
        }, 420);
      }, 80);
    }, 380);
  }

  /* ===== MOBILE MENU ===== */
  function toggleMenu() {
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    ham.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }

  /* ===== NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    navbar.classList.toggle('scrolled', scrolled > 20);
    backTop.classList.toggle('show', scrolled > 400);

    // Scroll progress
    const total = document.body.scrollHeight - window.innerHeight;
    scrollProgress.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`;
  }, { passive: true });

  /* ===== CURSOR GLOW ===== */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ===== REVEAL ON SCROLL ===== */
  function observeReveals() {
    const reveals = document.querySelectorAll('.reveal:not(.in-view)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ===== PROJECT FILTER ===== */
  function filterProjects(cat, btn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.project-card').forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (card.style.opacity === '0') card.style.display = 'none';
        }, 300);
      }
    });
  }


  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', () => {
    // Activate home page
    const home = document.getElementById('home');
    home.classList.add('active');
    setTimeout(() => {
      home.classList.add('visible');
      observeReveals();
    }, 50);
  });


  /* ===== FORM VALIDATION BY JS TO AVOID SPAM ===== */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
  
  function showEmailError(message) {
    const input = document.getElementById('form-email-input');
    
    let errorEl = document.getElementById('email-error-msg');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.id = 'email-error-msg';
      errorEl.style.cssText = 'color:#e53e3e; font-size:0.8rem; margin-top:4px; display:block;';
      input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
  
    input.style.borderColor = '#e53e3e';
    input.style.outline = 'none';
    errorEl.textContent = message;
  }
  
  function clearEmailError() {
    const input = document.getElementById('form-email-input');
    const errorEl = document.getElementById('email-error-msg');
  
    input.style.borderColor = '';
    if (errorEl) errorEl.textContent = '';
  }
  
  function submitForm() {
    const emailInput = document.getElementById('form-email-input');
    const emailValue = emailInput.value;
  
    // Block submission if email is empty
    if (!emailValue.trim()) {
      showEmailError('Email address is required.');
      emailInput.focus();
      return;
    }
  
    // Block submission if email is invalid
    if (!validateEmail(emailValue)) {
      showEmailError('Please enter a valid email address (e.g. name@example.com)');
      emailInput.focus();
      return;
    }
  
    // Email is valid — clear any previous error and proceed
    clearEmailError();
  
    const btn = document.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      document.getElementById('formContent').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    }, 1200);
  }
  
  function resetForm() {
    document.getElementById('formContent').style.display = '';
    document.getElementById('formSuccess').classList.remove('show');
    document.querySelector('.form-submit').textContent = 'Send Message ✈️';
    document.querySelector('.form-submit').style.opacity = '';
    document.querySelectorAll('.form-input, .form-textarea').forEach(i => i.value = '');
    clearEmailError();
  }
  
  // Live validation: clears error as user types a valid email
  document.getElementById('form-email-input').addEventListener('input', function () {
    if (validateEmail(this.value)) {
      clearEmailError();
    }
  });
