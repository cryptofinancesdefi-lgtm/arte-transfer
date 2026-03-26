// ============================================
// Arte Transfer — Landing Page Scripts
// ============================================

(function () {
  'use strict';

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.hidden = isOpen;
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenu.hidden) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        menuToggle.focus();
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '#main') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // --- WhatsApp phone mask ---
  var whatsappInput = document.getElementById('whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', function () {
      var value = this.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
      } else if (value.length > 2) {
        this.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
      } else if (value.length > 0) {
        this.value = '(' + value;
      }
    });
  }

  // --- Form validation & submission ---
  var form = document.getElementById('formOrcamento');
  if (form) {
    var validations = {
      nome: {
        test: function (v) { return v.trim().length >= 3; },
        msg: 'Informe seu nome completo.'
      },
      email: {
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
        msg: 'Informe um e-mail válido.'
      },
      whatsapp: {
        test: function (v) { return v.replace(/\D/g, '').length >= 10; },
        msg: 'Informe um WhatsApp válido.'
      },
      produto: {
        test: function (v) { return v !== ''; },
        msg: 'Selecione um produto.'
      },
      quantidade: {
        test: function (v) { return parseInt(v, 10) >= 1; },
        msg: 'Informe a quantidade desejada.'
      }
    };

    function validateField(name) {
      var field = form.querySelector('[name="' + name + '"]');
      var group = field.closest('.form-group');
      var errorEl = group.querySelector('.form-error');
      var rule = validations[name];

      if (!rule) return true;

      var isValid = rule.test(field.value);
      group.classList.toggle('error', !isValid);
      if (errorEl) {
        errorEl.textContent = isValid ? '' : rule.msg;
      }

      return isValid;
    }

    // Validate on blur
    Object.keys(validations).forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) {
        field.addEventListener('blur', function () {
          validateField(name);
        });
        // Clear error on input
        field.addEventListener('input', function () {
          var group = this.closest('.form-group');
          if (group.classList.contains('error')) {
            validateField(name);
          }
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all fields
      var allValid = true;
      Object.keys(validations).forEach(function (name) {
        if (!validateField(name)) {
          allValid = false;
        }
      });

      if (!allValid) {
        // Focus first error field
        var firstError = form.querySelector('.form-group.error input, .form-group.error select');
        if (firstError) firstError.focus();
        return;
      }

      // Show loading state
      var btnText = form.querySelector('.btn-text');
      var btnLoading = form.querySelector('.btn-loading');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      if (submitBtn) submitBtn.disabled = true;

      // Send data to Google Sheets
      var data = {
        nome: form.querySelector('[name="nome"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        whatsapp: form.querySelector('[name="whatsapp"]').value.trim(),
        produto: form.querySelector('[name="produto"]').value,
        quantidade: form.querySelector('[name="quantidade"]').value,
        mensagem: form.querySelector('[name="mensagem"]').value.trim()
      };

      var successEl = form.querySelector('.form-success');
      var errorMsgEl = form.querySelector('.form-error-msg');

      fetch('https://script.google.com/macros/s/AKfycbxGy_Nu-WLWFP8Rgsgag9L093rfswtA7m9VQ99FcY4Uxg93WzqR6MynyyS5CSoyJOMY/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function () {
        // Show success
        if (successEl) successEl.hidden = false;
        if (errorMsgEl) errorMsgEl.hidden = true;

        // Reset form
        form.reset();

        // Clear any remaining error states
        form.querySelectorAll('.form-group.error').forEach(function (group) {
          group.classList.remove('error');
        });

        // Hide success after 6 seconds
        setTimeout(function () {
          if (successEl) successEl.hidden = true;
        }, 6000);
      })
      .catch(function () {
        // Show error
        if (errorMsgEl) errorMsgEl.hidden = false;
        if (successEl) successEl.hidden = true;

        // Hide error after 6 seconds
        setTimeout(function () {
          if (errorMsgEl) errorMsgEl.hidden = true;
        }, 6000);
      })
      .finally(function () {
        // Reset button
        if (btnText) btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  // --- Intersection Observer for scroll animations ---
  if ('IntersectionObserver' in window) {
    var animatedElements = document.querySelectorAll(
      '.product-card, .diff-card, .section-header, .orcamento-info, .form-card'
    );

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedElements.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
        observer.unobserve(el);
      });
    }
  }

})();
