const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isSlowConnection = navigator.connection && 
  (navigator.connection.effectiveType === '4g' || navigator.connection.effectiveType === '3g');

const runWhenIdle = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
    return;
  }

  window.setTimeout(callback, 0);
};

// Defer non-critical initialization
document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link, .mobile-nav-link'));

  // Critical path
  initThemeToggle();
  initNavigation(sections, navLinks);
  initSmoothAnchors();
  optimizeImages();
  initContactForm();
  initDownloadResume();

  // Defer animations
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      if (!isSlowConnection) {
        initStatCounters();
        initCertificateSection();
      }
    });
  } else {
    runWhenIdle(() => {
      if (!isSlowConnection) {
        initStatCounters();
        initCertificateSection();
      }
    });
  }
  
  initScrollTopButton();
});


// ============================================================
// NAVIGATION
// ============================================================

function initNavigation(sections, navLinks) {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileOverlay = document.getElementById('mobileMenu');
  const mobileClose = document.querySelector('.mobile-close');
  const progressBar = document.querySelector('.nav-progress-bar');
  const progressWrap = document.querySelector('.nav-progress');

  let lastScrollY = window.scrollY;
  let lastUpdateY = 0;
  let ticking = false;
  const UPDATE_THRESHOLD = 50; // Only update every 50px of scroll

  const closeMenu = () => {
    if (!mobileOverlay || !menuToggle) {
      return;
    }

    mobileOverlay.classList.remove('active');
    mobileOverlay.setAttribute('aria-hidden', 'true');

    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    if (!mobileOverlay || !menuToggle) {
      return;
    }

    const isOpen = mobileOverlay.classList.toggle('active');

    mobileOverlay.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));

    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('active', isActive);
    });
  };

  const updateScrollUi = () => {
    const currentScrollY = window.scrollY;
    
    // Only update if threshold is met
    if (Math.abs(currentScrollY - lastUpdateY) < UPDATE_THRESHOLD && lastUpdateY !== 0) {
      ticking = false;
      return;
    }
    
    lastUpdateY = currentScrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min((currentScrollY / scrollHeight) * 100, 100) : 0;

    if (navbar) {
      navbar.classList.toggle('scrolled', currentScrollY > 24);
      navbar.classList.toggle('hidden', currentScrollY > lastScrollY && currentScrollY > 140);
    }

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progressWrap) {
      progressWrap.setAttribute('aria-valuenow', String(Math.round(progress)));
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (event) => {
      if (event.target === mobileOverlay) {
        closeMenu();
      }
    });
  }

  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0.1
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUi);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollUi();
}


// ============================================================
// SMOOTH ANCHORS
// ============================================================

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const offset = 88;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  });
}


// ============================================================
// THEME TOGGLE
// ============================================================

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');

      if (themeIcon) {
        themeIcon.className = 'fas fa-sun theme-icon';
      }

      return;
    }

    document.documentElement.removeAttribute('data-theme');

    if (themeIcon) {
      themeIcon.className = 'fas fa-moon theme-icon';
    }
  };

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener('click', () => {
    const nextTheme =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    localStorage.setItem('theme', nextTheme);

    applyTheme(nextTheme);
  });
}


// ============================================================
// EXISTING STAT COUNTERS
// ============================================================

function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');

  if (stats.length === 0) {
    return;
  }

  const animateValue = (element) => {
    const target = Number.parseInt(element.textContent, 10);

    if (!Number.isFinite(target)) {
      return;
    }

    if (prefersReducedMotion.matches) {
      element.textContent = String(target);
      return;
    }

    // Faster animation on slow connections
    const duration = isSlowConnection ? 300 : 500;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);

      element.textContent = String(Math.round(target * progress));

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = String(target);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, counterObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateValue(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  stats.forEach((stat) => observer.observe(stat));
}


// ============================================================
// PREMIUM CERTIFICATES SECTION
// ============================================================

(function() {
  'use strict';

  const CONFIG = {
    glowIntensity: 0.08,
    statDuration: 1500,
    statThreshold: 0.35,
    cardRevealThreshold: 0.15,
  };

  let statsAnimated = false;

  function initCertificates() {
    initCardGlow();
    initCertificateStatCounters();
    initCardRevealOnScroll();
  }


  // ----------------------------------------------------------
  // CARD GLOW EFFECT
  // ----------------------------------------------------------

  function initCardGlow() {
    const cards = document.querySelectorAll('.cert-card');

    if (cards.length === 0) {
      return;
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    cards.forEach((card) => {
      let glow = card.querySelector('.cert-card-glow');

      if (!glow) {
        glow = document.createElement('div');
        glow.className = 'cert-card-glow';

        card.prepend(glow);
      }

      let animationFrame = null;

      const updateGlow = (x, y) => {
        const rect = card.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const xPercent =
          ((x - rect.left) / rect.width) * 100;

        const yPercent =
          ((y - rect.top) / rect.height) * 100;

        glow.style.setProperty(
          '--mouse-x',
          `${xPercent}%`
        );

        glow.style.setProperty(
          '--mouse-y',
          `${yPercent}%`
        );
      };

      card.addEventListener('mouseenter', () => {
        glow.style.opacity = CONFIG.glowIntensity;
      });

      card.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      });

      card.addEventListener('mousemove', (event) => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
          updateGlow(
            event.clientX,
            event.clientY
          );

          animationFrame = null;
        });
      });
    });
  }


  // ----------------------------------------------------------
  // CERTIFICATE STAT COUNTERS
  // ----------------------------------------------------------

  function initCertificateStatCounters() {
    const stats = document.querySelectorAll(
      '.cert-stat-number'
    );

    if (stats.length === 0) {
      return;
    }

    const statsBar =
      document.querySelector('.cert-stats-bar');

    const animateStat = (element) => {
      const target = parseInt(
        element.getAttribute('data-target'),
        10
      );

      if (isNaN(target) || target <= 0) {
        element.textContent = '0';
        return;
      }

      if (
        window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      ) {
        element.textContent = String(target);
        return;
      }

      const duration = CONFIG.statDuration;
      const startTime = performance.now();

      const updateNumber = (currentTime) => {
        const elapsed =
          currentTime - startTime;

        const progress = Math.min(
          elapsed / duration,
          1
        );

        // Ease-out cubic
        const eased =
          1 - Math.pow(1 - progress, 3);

        const current =
          Math.round(eased * target);

        element.textContent =
          String(current);

        if (progress < 1) {
          requestAnimationFrame(
            updateNumber
          );
        } else {
          element.textContent =
            String(target);
        }
      };

      requestAnimationFrame(updateNumber);
    };


    // If stats bar doesn't exist, observe each stat
    if (!statsBar) {
      const fallbackObserver =
        new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              animateStat(entry.target);

              observer.unobserve(
                entry.target
              );
            });
          },
          {
            threshold:
              CONFIG.statThreshold
          }
        );

      stats.forEach((stat) => {
        fallbackObserver.observe(stat);
      });

      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !statsAnimated
            ) {
              statsAnimated = true;

              stats.forEach((stat) => {
                stat.textContent = '0';
                animateStat(stat);
              });

              observer.disconnect();
            }
          });
        },
        {
          threshold:
            CONFIG.statThreshold
        }
      );

    observer.observe(statsBar);
  }


  // ----------------------------------------------------------
  // CARD REVEAL ON SCROLL
  // ----------------------------------------------------------

  // ============================================
// PREMIUM SCROLL TO TOP BUTTON - JAVASCRIPT
// ============================================

(function() {
  'use strict';

  // ----- Configuration -----
  const CONFIG = {
    showThreshold: 300,      // Scroll position to show button
    ringCircumference: 263.89, // 2 * PI * 42
    smoothScroll: true,
  };

  // ----- State -----
  let ticking = false;
  let scrollTarget = 0;

  // ----- DOM References -----
  const button = document.getElementById('scrollTopBtn');
  const progressRing = button?.querySelector('.scroll-top-ring-progress');

  // ----- Check if button exists -----
  if (!button) {
    console.warn('Scroll to top button not found');
    return;
  }

  // ----- Helper: Check reduced motion -----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- Helper: Update button state -----
  function updateButton() {
    const scrollY = window.pageYOffset || window.scrollY || 0;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollY / scrollHeight, 1) : 0;

    // Show/hide button
    button.classList.toggle('show', scrollY > CONFIG.showThreshold);

    // Update progress ring
    if (progressRing) {
      const offset = CONFIG.ringCircumference * (1 - progress);
      progressRing.style.strokeDashoffset = String(offset);
    }

    // Update aria-label
    button.setAttribute(
      'aria-label',
      `Scroll to top (${Math.round(progress * 100)}% scrolled)`
    );

    ticking = false;
  }

  // ----- Debounced scroll handler -----
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateButton();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ----- Smooth scroll to top (OPTIMIZED FOR SPEED) -----
  function scrollToTop() {
    // Use native browser smooth scroll - fastest method
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback: instant scroll for older browsers
      window.scrollTo(0, 0);
    }
  }

  // ----- Click handler -----
  button.addEventListener('click', scrollToTop);

  // ----- Keyboard support -----
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  });

  // ----- Scroll listener -----
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ----- Resize listener (recalculate progress) -----
  window.addEventListener('resize', updateButton, { passive: true });

  // ----- Initialize button state -----
  updateButton();

  // ----- Handle URL hash on load -----
  if (window.location.hash) {
    // Small delay to let page render
    setTimeout(() => {
      updateButton();
    }, 100);
  }

  // ----- Expose for debugging (optional) -----
  if (window.DEV_MODE) {
    window.__scrollTop = {
      button,
      updateButton,
      scrollToTop,
      CONFIG
    };
  }

})();
  // ----------------------------------------------------------
  // INITIALIZE CERTIFICATES
  // ----------------------------------------------------------

  function initCertificateSection() {
    initCertificates();
  }

})();


// ============================================================
// CONTACT FORM
// ============================================================

function initContactForm() {
  const form = document.getElementById(
    'enhancedContactForm'
  );

  if (!form) {
    return;
  }

  const nameInput =
    form.querySelector('#enhanced-name');

  const emailInput =
    form.querySelector('#enhanced-email');

  const messageInput =
    form.querySelector('#enhanced-message');

  const consentInput =
    form.querySelector('#privacyConsent');

  const progressBar =
    form.querySelector('.form-progress-bar');

  const progressText =
    form.querySelector('.form-progress-text');

  const resetButton =
    document.getElementById('resetFormBtn');

  const submitButton =
    form.querySelector('button[type="submit"]');

  let statusNode =
    form.querySelector(
      '.form-status-message'
    );


  if (!statusNode) {
    statusNode =
      document.createElement('p');

    statusNode.className =
      'form-status-message';

    form.appendChild(statusNode);
  }


  const fields = [
    nameInput,
    emailInput,
    messageInput,
    consentInput
  ].filter(Boolean);


  const updateProgress = () => {
    const completed =
      fields.filter(
        (field) => field.checkValidity()
      ).length;

    const percentage =
      Math.round(
        (completed / fields.length) * 100
      );

    if (progressBar) {
      progressBar.style.width =
        `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent =
        percentage === 100
          ? 'Ready to send'
          : `Form ${percentage}% complete`;
    }
  };


  const showStatus = (
    message,
    isError = false
  ) => {
    statusNode.textContent = message;

    statusNode.classList.toggle(
      'is-error',
      isError
    );

    statusNode.classList.toggle(
      'is-success',
      !isError && Boolean(message)
    );
  };


  if (messageInput) {
    const resizeMessage = () => {
      messageInput.style.height = 'auto';

      messageInput.style.height =
        `${messageInput.scrollHeight}px`;
    };

    messageInput.addEventListener(
      'input',
      resizeMessage
    );

    resizeMessage();
  }


  fields.forEach((field) => {
    field.addEventListener(
      'input',
      updateProgress
    );

    field.addEventListener(
      'change',
      updateProgress
    );
  });


  if (resetButton) {
    resetButton.addEventListener(
      'click',
      () => {
        form.reset();

        if (messageInput) {
          messageInput.style.height =
            'auto';
        }

        showStatus('');
        updateProgress();
      }
    );
  }


  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        showStatus(
          'Please complete all required fields before sending.',
          true
        );

        updateProgress();
        return;
      }

      const recipient =
        'roshanmanjhi2631@gmail.com';

      const senderName =
        nameInput.value.trim();

      const senderEmail =
        emailInput.value.trim();

      const message =
        messageInput.value.trim();

      const subject =
        encodeURIComponent(
          `Portfolio enquiry from ${senderName}`
        );

      const body =
        encodeURIComponent(
          `Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`
        );

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${subject}&body=${body}`;

      const mailtoUrl =
        `mailto:${recipient}?subject=${subject}&body=${body}`;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('is-sent');
      }

      showStatus('Opening Gmail compose. Click Send there to deliver your message.');

      const composeWindow =
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');

      if (!composeWindow) {
        window.location.href = mailtoUrl;
      }

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('is-sent');
        }
      }, 1500);
    }
  );


  updateProgress();
}


// ============================================================
// SCROLL TOP BUTTON
// ============================================================

function initScrollTopButton() {
  const button = document.getElementById('scrollTopBtn');
  const progressRing = button?.querySelector('.scroll-top-ring-progress');

  if (!button) {
    return;
  }

  let ticking = false;
  let lastUpdateY = 0;
  const UPDATE_THRESHOLD = 100; // Only update every 100px

  const updateButton = () => {
    const scrollY = window.scrollY;
    
    // Skip update if below threshold
    if (Math.abs(scrollY - lastUpdateY) < UPDATE_THRESHOLD && lastUpdateY !== 0) {
      ticking = false;
      return;
    }
    
    lastUpdateY = scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollY / scrollHeight, 1) : 0;

    button.classList.toggle('show', scrollY > 320);

    button.setAttribute('aria-label', `Scroll to top (${Math.round(progress * 100)}% scrolled)`);

    if (progressRing) {
      progressRing.style.strokeDashoffset = String(263.89 * (1 - progress));
    }

    ticking = false;
  };

  // Ultra-fast scroll to top using native browser API
  const scrollToTop = () => {
    if (prefersReducedMotion.matches) {
      window.scrollTo(0, 0);
      return;
    }
    
    // Native smooth scroll - fastest & most efficient
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateButton);
      ticking = true;
    }
  }, { passive: true });

  button.addEventListener('click', scrollToTop);

  // Keyboard support
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  });

  updateButton();
}


// ============================================================
// IMAGE OPTIMIZATION
// ============================================================

function optimizeImages() {
  const images =
    Array.from(document.images);

  images.forEach((image, index) => {
    image.decoding = 'async';

    if (index === 0) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
      return;
    }

    image.loading = 'lazy';
  });
}


// ============================================================
// OPTIMIZED RESUME DOWNLOAD
// ============================================================

function initDownloadResume() {
  const downloadBtn = document.querySelector('.download-cv');
  
  if (!downloadBtn) {
    return;
  }

  downloadBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const fileName = 'Roshan_Manjhi_Professional_Resume.pdf';
    const filePath = `./${fileName}`;
    
    // Add loading state
    const originalHTML = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    downloadBtn.disabled = true;
    
    try {
      // Fetch with optimized settings
      const response = await fetch(filePath, {
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=31536000'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get file as blob
      const blob = await response.blob();
      
      // Create download link using Blob URL (fastest method)
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      // Append and click
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      // Reset button
      downloadBtn.innerHTML = originalHTML;
      downloadBtn.disabled = false;
      
      // Optional: Show success feedback
      const originalText = downloadBtn.textContent;
      downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
      setTimeout(() => {
        downloadBtn.innerHTML = originalHTML;
      }, 2000);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback to direct link
      window.location.href = filePath;
      
      // Reset button
      downloadBtn.innerHTML = originalHTML;
      downloadBtn.disabled = false;
    }
  });
}