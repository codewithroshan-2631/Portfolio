// ============================================
// PROFESSIONAL PORTFOLIO - COMPLETE JAVASCRIPT
// ============================================

// Initialize EmailJS
(function() {
  // Initialize EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }
})();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initializeNavigation();
  initializeSkillCards();
  initializeCertifications();
  initializeContactForm();
  initializeScrollEffects();
  initializeAnimations();
  initializeImageOptimization();
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

// ============================================
// ENHANCED NAVIGATION SYSTEM
// ============================================

class EnhancedNavigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.mobileOverlay = document.querySelector('.mobile-overlay');
    this.mobileClose = document.querySelector('.mobile-close');
    this.searchToggle = document.querySelector('.search-toggle');
    this.searchOverlay = document.querySelector('.search-overlay');
    this.searchClose = document.querySelector('.search-close');
    this.searchInput = document.querySelector('.search-input');
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.querySelector('.theme-icon');
    this.progressBar = document.querySelector('.nav-progress-bar');
    this.lastScrollTop = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.loadThemePreference();
    this.setupKeyboardNavigation();
    this.setupSearchFunctionality();
  }
  
  setupEventListeners() {
    // Scroll events
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Menu toggle
    this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    this.mobileClose.addEventListener('click', () => this.closeMobileMenu());
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
    
    // Search toggle
    this.searchToggle.addEventListener('click', () => this.toggleSearch());
    this.searchClose.addEventListener('click', () => this.closeSearch());
    
    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Close overlays on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeSearch();
      }
      
      // Focus trap for mobile menu
      if (e.key === 'Tab' && this.mobileOverlay.classList.contains('active')) {
        this.handleFocusTrap(e);
      }
    });
    
    // Close search when clicking outside
    this.searchOverlay.addEventListener('click', (e) => {
      if (e.target === this.searchOverlay) {
        this.closeSearch();
      }
    });
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Hide/show navbar on scroll
    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      this.navbar.classList.add('hidden');
    } else {
      this.navbar.classList.remove('hidden');
    }
    
    // Add scrolled class
    if (scrollTop > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    // Update scroll progress
    const scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;
    this.progressBar.style.width = `${scrollPercent}%`;
    this.progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
    
    // Update active nav link based on scroll position
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.updateActiveNavLink();
      
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 100);
    }
    
    this.lastScrollTop = scrollTop;
  }
  
  setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.setActiveNavLink(id);
        }
      });
    }, options);
    
    sections.forEach(section => observer.observe(section));
  }
  
  setActiveNavLink(sectionId) {
    // Update desktop nav links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
    
    // Update mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
  
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      this.setActiveNavLink(currentSection);
    }
  }
  
  toggleMobileMenu() {
    this.mobileOverlay.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    this.menuToggle.setAttribute('aria-expanded', 
      this.mobileOverlay.classList.contains('active')
    );
    
    // Toggle body scroll
    document.body.style.overflow = this.mobileOverlay.classList.contains('active') 
      ? 'hidden' 
      : '';
    
    // Focus first item when opening
    if (this.mobileOverlay.classList.contains('active')) {
      setTimeout(() => {
        document.querySelector('.mobile-nav-link').focus();
      }, 100);
    }
  }
  
  closeMobileMenu() {
    this.mobileOverlay.classList.remove('active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.menuToggle.focus();
  }
  
  toggleSearch() {
    this.searchOverlay.classList.toggle('active');
    
    if (this.searchOverlay.classList.contains('active')) {
      this.searchInput.focus();
    }
  }
  
  closeSearch() {
    this.searchOverlay.classList.remove('active');
    this.searchToggle.focus();
  }
  
  setupSearchFunctionality() {
    const searchForm = document.querySelector('.search-form');
    const searchResults = document.querySelector('.search-results');
    
    // Sample searchable content
    const searchableContent = [
      { title: 'About Me', url: '#about', keywords: 'about bio information background' },
      { title: 'Skills', url: '#skills', keywords: 'skills technologies programming languages tools' },
      { title: 'Projects', url: '#projects', keywords: 'projects work portfolio calculator expense tracker' },
      { title: 'Contact', url: '#contact', keywords: 'contact email message get in touch' },
      { title: 'React Projects', url: '#projects', keywords: 'react calculator expense tracker' },
      { title: 'Python Development', url: '#skills', keywords: 'python flask programming backend' }
    ];
    
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch(searchInput.value, searchableContent, searchResults);
    });
    
    searchInput.addEventListener('input', () => {
      this.performSearch(searchInput.value, searchableContent, searchResults);
    });
  }
  
  performSearch(query, content, resultsContainer) {
    if (!query.trim()) {
      resultsContainer.innerHTML = '<p>Type to search...</p>';
      return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    const matches = content.filter(item => {
      const searchText = (item.title + ' ' + item.keywords).toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
    
    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
    } else {
      resultsContainer.innerHTML = `
        <p>Found ${matches.length} result${matches.length !== 1 ? 's' : ''}:</p>
        <ul style="list-style: none; padding: 0; margin-top: 1rem;">
          ${matches.map(item => `
            <li style="margin-bottom: 0.5rem;">
              <a href="${item.url}" 
                 style="color: #fff; text-decoration: none; display: block; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
                ${item.title}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    }
  }
  
  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.themeIcon.className = 'fas fa-sun';
    }
  }
  
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      this.themeIcon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.themeIcon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'dark');
    }
  }
  
  setupKeyboardNavigation() {
    // Add tabindex to all focusable elements
    const focusableElements = this.navbar.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach((el, index) => {
      el.setAttribute('tabindex', index + 1);
    });
    
    // Arrow key navigation for nav links
    this.navbar.addEventListener('keydown', (e) => {
      const focusable = Array.from(focusableElements);
      const currentIndex = focusable.indexOf(document.activeElement);
      
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % focusable.length;
          focusable[nextIndex].focus();
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
          focusable[prevIndex].focus();
          break;
          
        case 'Home':
          e.preventDefault();
          focusable[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          focusable[focusable.length - 1].focus();
          break;
      }
    });
  }
  
  handleFocusTrap(e) {
    const focusableElements = this.mobileOverlay.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  // Smooth scroll with offset for fixed navbar
  static smoothScroll(target, duration = 800) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
}

// Initialize enhanced navigation
document.addEventListener('DOMContentLoaded', () => {
  const enhancedNav = new EnhancedNavigation();
  
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      EnhancedNavigation.smoothScroll(target);
      
      // Update URL without page jump
      history.pushState(null, null, target);
    });
  });
  
  // Add hover sound effect (optional)
  const hoverSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      // You can add a subtle sound effect here
      // hoverSound.currentTime = 0;
      // hoverSound.play().catch(() => {}); // Ignore errors if autoplay blocked
    });
  });
  
  // Add ripple effect to nav controls
  document.querySelectorAll('.nav-control').forEach(control => {
    control.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SKILL CARDS FUNCTIONALITY
// ============================================

function initializeSkillCards() {
  const skillCards = document.querySelectorAll('.skill-card-3d');
  
  skillCards.forEach(card => {
    // Add click event for mobile devices
    card.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        this.querySelector('.skill-card-inner').classList.toggle('flipped');
      }
    });
    
    // Add keyboard accessibility
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.querySelector('.skill-card-inner').classList.toggle('flipped');
      }
    });
    
    // Make cards focusable
    card.setAttribute('tabindex', '0');
  });
}

// ============================================
// CERTIFICATIONS FUNCTIONALITY
// ============================================

function initializeCertifications() {
  const modal = document.getElementById('certModal');
  const certButtons = document.querySelectorAll('.view-cert');
  const closeModal = document.querySelector('.close-modal');
  
  // Certificate data (replace with your actual certificate URLs)
  const certificates = {
    1: 'https://example.com/certificates/python.jpg',
    2: 'https://example.com/certificates/javascript.jpg',
    3: 'https://example.com/certificates/react.jpg',
    4: 'https://example.com/certificates/nodejs.jpg',
    5: 'https://example.com/certificates/mongodb.jpg',
    6: 'https://example.com/certificates/aws.jpg'
  };
  
  // Open modal when certificate button is clicked
  certButtons.forEach(button => {
    button.addEventListener('click', function() {
      const certId = this.getAttribute('data-cert');
      const certImage = document.getElementById('certImage');
      
      if (certificates[certId]) {
        certImage.src = certificates[certId];
        certImage.alt = `Certificate ${certId}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      } else {
        console.warn(`Certificate ${certId} not found`);
      }
    });
  });
  
  // Close modal when X is clicked
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Close modal when clicking outside the content
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================
// ENHANCED CONTACT FORM - COMPLETE FUNCTIONALITY
// ============================================

class EnhancedContactForm {
  constructor() {
    this.form = document.getElementById('enhancedContactForm');
    if (!this.form) return;
    
    // Form elements
    this.nameInput = document.getElementById('enhanced-name');
    this.emailInput = document.getElementById('enhanced-email');
    this.subjectInput = document.getElementById('enhanced-subject');
    this.messageInput = document.getElementById('enhanced-message');
    this.captchaInput = document.getElementById('captcha');
    this.privacyConsent = document.getElementById('privacyConsent');
    this.submitBtn = this.form.querySelector('.btn-submit');
    this.resetBtn = document.getElementById('resetFormBtn');
    this.progressBar = this.form.querySelector('.form-progress-bar');
    this.progressText = this.form.querySelector('.form-progress-text');
    this.charCount = document.getElementById('charCount');
    this.statusMessage = this.form.querySelector('.form-status-message');
    this.statusText = this.form.querySelector('.status-text');
    
    // File upload
    this.fileUploadArea = document.getElementById('fileUploadArea');
    this.fileInput = document.getElementById('fileAttachment');
    this.fileList = document.getElementById('fileList');
    
    // Attachments array
    this.attachments = [];
    
    // Validation states
    this.formState = {
      name: false,
      email: false,
      subject: false,
      message: false,
      captcha: false,
      privacy: false
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupFloatingLabels();
    this.setupAutoResize();
    this.setupEmailSuggestions();
    this.setupFileUpload();
    this.setupCharacterCounter();
    this.setupSubjectSuggestions();
    this.setupMessageFormatting();
    this.setupFormProgress();
    this.setupAutoSave();
  }
  
  setupEventListeners() {
    // Input validation
    this.nameInput.addEventListener('input', () => this.validateName());
    this.emailInput.addEventListener('input', () => this.validateEmail());
    this.subjectInput.addEventListener('input', () => this.validateSubject());
    this.messageInput.addEventListener('input', () => this.validateMessage());
    this.captchaInput.addEventListener('input', () => this.validateCaptcha());
    this.privacyConsent.addEventListener('change', () => this.validatePrivacy());
    
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Reset form
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetForm());
    }
    
    // Real-time email validation
    this.emailInput.addEventListener('blur', () => this.checkEmailDeliverability());
    
    // Paste event for email
    this.emailInput.addEventListener('paste', (e) => {
      setTimeout(() => this.validateEmail(), 100);
    });
  }
  
  setupFloatingLabels() {
    // Initialize floating labels
    const inputs = this.form.querySelectorAll('.floating-input');
    inputs.forEach(input => {
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      }
      
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value.trim() === '') {
          input.classList.remove('has-value');
        } else {
          input.classList.add('has-value');
        }
      });
    });
  }
  
  setupAutoResize() {
    // Auto-resize textarea
    this.messageInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }
  
  setupCharacterCounter() {
    // Character counter for message
    this.messageInput.addEventListener('input', () => {
      const count = this.messageInput.value.length;
      this.charCount.textContent = count;
      
      // Visual feedback
      if (count > 900) {
        this.charCount.style.color = '#f59e0b';
      } else if (count > 950) {
        this.charCount.style.color = '#ef4444';
      } else {
        this.charCount.style.color = 'var(--primary)';
      }
      
      // Update progress
      this.updateFormProgress();
    });
  }
  
  setupEmailSuggestions() {
    // Email domain suggestions
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
    const suggestionEl = document.getElementById('emailSuggestion');
    
    this.emailInput.addEventListener('input', () => {
      const value = this.emailInput.value;
      if (value.includes('@')) {
        const [local, domain] = value.split('@');
        if (domain && !domains.includes(domain.toLowerCase())) {
          const suggestion = domains.find(d => d.startsWith(domain.toLowerCase()));
          if (suggestion) {
            suggestionEl.innerHTML = `Did you mean <strong>${local}@${suggestion}</strong>? 
              <button type="button" class="suggestion-link">Use this</button>`;
            
            const button = suggestionEl.querySelector('.suggestion-link');
            button.onclick = () => {
              this.emailInput.value = `${local}@${suggestion}`;
              this.validateEmail();
              suggestionEl.innerHTML = '';
            };
          } else {
            suggestionEl.innerHTML = '';
          }
        } else {
          suggestionEl.innerHTML = '';
        }
      } else {
        suggestionEl.innerHTML = '';
      }
    });
  }
  
  setupFileUpload() {
    if (!this.fileUploadArea || !this.fileInput) return;
    
    // Click to upload
    this.fileUploadArea.addEventListener('click', () => {
      this.fileInput.click();
    });
    
    // Drag and drop
    this.fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.fileUploadArea.classList.add('dragover');
    });
    
    this.fileUploadArea.addEventListener('dragleave', () => {
      this.fileUploadArea.classList.remove('dragover');
    });
    
    this.fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.fileUploadArea.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files);
      this.handleFiles(files);
    });
    
    // File selection
    this.fileInput.addEventListener('change', () => {
      const files = Array.from(this.fileInput.files);
      this.handleFiles(files);
    });
  }
  
  handleFiles(files) {
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== files.length) {
      this.showStatus('Some files exceed the 5MB limit and were not added', 'error');
    }
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain'];
    
    const validTypeFiles = validFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validTypeFiles.length !== validFiles.length) {
      this.showStatus('Some file types are not supported', 'error');
    }
    
    // Add valid files to attachments
    validTypeFiles.forEach(file => {
      this.attachments.push(file);
      this.addFileToList(file);
    });
  }
  
  addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <i class="fas ${this.getFileIcon(file.type)}"></i>
      <span>${file.name}</span>
      <span class="file-size">${this.formatFileSize(file.size)}</span>
      <i class="fas fa-times remove-file"></i>
    `;
    
    const removeBtn = fileItem.querySelector('.remove-file');
    removeBtn.onclick = () => {
      const index = this.attachments.indexOf(file);
      if (index > -1) this.attachments.splice(index, 1);
      fileItem.remove();
    };
    
    this.fileList.appendChild(fileItem);
  }
  
  getFileIcon(type) {
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fa-file-word';
    if (type.includes('text')) return 'fa-file-alt';
    return 'fa-file';
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  setupSubjectSuggestions() {
    const suggestions = this.form.querySelectorAll('.subject-suggestion');
    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        this.subjectInput.value = btn.textContent;
        this.validateSubject();
        this.updateFormProgress();
        
        // Trigger floating label animation
        this.subjectInput.dispatchEvent(new Event('input'));
      });
    });
  }
  
  setupMessageFormatting() {
    const toolbarBtns = this.form.querySelectorAll('[data-format]');
    toolbarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        this.formatText(format);
      });
    });
  }
  
  formatText(format) {
    const textarea = this.messageInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
    }
    
    textarea.setRangeText(formattedText);
    textarea.dispatchEvent(new Event('input'));
  }
  
  setupFormProgress() {
    this.updateFormProgress();
  }
  
  updateFormProgress() {
    let completed = 0;
    let total = 0;
    
    // Check each field
    if (this.nameInput.value.trim().length >= 2) {
      this.formState.name = true;
      completed++;
    }
    total++;
    
    if (this.isValidEmail(this.emailInput.value)) {
      this.formState.email = true;
      completed++;
    }
    total++;
    
    if (this.subjectInput.value.trim().length >= 3) {
      this.formState.subject = true;
      completed++;
    }
    total++;
    
    if (this.messageInput.value.trim().length >= 10) {
      this.formState.message = true;
      completed++;
    }
    total++;
    
    if (this.captchaInput.value == 8) {
      this.formState.captcha = true;
      completed++;
    }
    total++;
    
    if (this.privacyConsent.checked) {
      this.formState.privacy = true;
      completed++;
    }
    total++;
    
    // Calculate progress percentage
    const progress = (completed / total) * 100;
    this.progressBar.style.width = `${progress}%`;
    this.progressText.textContent = `${Math.round(progress)}% Complete`;
  }
  
  setupAutoSave() {
    // Auto-save form data to localStorage
    const saveData = () => {
      const formData = {
        name: this.nameInput.value,
        email: this.emailInput.value,
        subject: this.subjectInput.value,
        message: this.messageInput.value,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('contactFormDraft', JSON.stringify(formData));
    };
    
    // Debounced save
    let saveTimeout;
    const inputs = [this.nameInput, this.emailInput, this.subjectInput, this.messageInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveData, 1000);
      });
    });
    
    // Load saved data
    const savedData = localStorage.getItem('contactFormDraft');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const savedTime = new Date(data.timestamp);
        const now = new Date();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        // Only restore if saved within last 24 hours
        if (hoursDiff < 24) {
          this.nameInput.value = data.name || '';
          this.emailInput.value = data.email || '';
          this.subjectInput.value = data.subject || '';
          this.messageInput.value = data.message || '';
          
          // Trigger validation
          this.validateName();
          this.validateEmail();
          this.validateSubject();
          this.validateMessage();
          
          this.showStatus('Draft restored from previous session', 'info');
        } else {
          localStorage.removeItem('contactFormDraft');
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }
  
  // Validation methods
  validateName() {
    const value = this.nameInput.value.trim();
    const feedback = this.nameInput.closest('.form-group').querySelector('.input-feedback');
    
    if (value.length === 0) {
      this.showFeedback(feedback, 'Name is required', 'error');
      this.formState.name = false;
      return false;
    } else if (value.length < 2) {
      this.showFeedback(feedback, 'Name must be at least 2 characters', 'error');
      this.formState.name = false;
      return false;
    } else if (value.length > 50) {
      this.showFeedback(feedback, 'Name cannot exceed 50 characters', 'error');
      this.formState.name = false;
      return false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      this.showFeedback(feedback, 'Name contains invalid characters', 'error');
      this.formState.name = false;
      return false;
    } else {
      this.showFeedback(feedback, '✓ Valid name', 'success');
      this.formState.name = true;
      
      // Update character count
      const charCount = this.nameInput.closest('.form-group').querySelector('.input-character-count');
      if (charCount) {
        charCount.textContent = `${value.length}/50`;
      }
      
      return true;
    }
  }
  
  validateEmail() {
    const value = this.emailInput.value.trim();
    const feedback = this.emailInput.closest('.form-group').querySelector('.input-feedback');
    
    if (value.length === 0) {
      this.showFeedback(feedback, 'Email is required', 'error');
      this.formState.email = false;
      return false;
    } else if (!this.isValidEmail(value)) {
      this.showFeedback(feedback, 'Please enter a valid email address', 'error');
      this.formState.email = false;
      return false;
    } else {
      this.showFeedback(feedback, '✓ Valid email format', 'success');
      this.formState.email = true;
      return true;
    }
  }
  
  validateSubject() {
    const value = this.subjectInput.value.trim();
    const feedback = this.subjectInput.closest('.form-group').querySelector('.input-feedback');
    const charCount = this.subjectInput.closest('.form-group').querySelector('.input-character-count');
    
    if (charCount) {
      charCount.textContent = `${value.length}/100`;
    }
    
    if (value.length === 0) {
      this.showFeedback(feedback, 'Subject is required', 'error');
      this.formState.subject = false;
      return false;
    } else if (value.length < 3) {
      this.showFeedback(feedback, 'Subject must be at least 3 characters', 'error');
      this.formState.subject = false;
      return false;
    } else if (value.length > 100) {
      this.showFeedback(feedback, 'Subject cannot exceed 100 characters', 'error');
      this.formState.subject = false;
      return false;
    } else {
      this.showFeedback(feedback, '✓ Valid subject', 'success');
      this.formState.subject = true;
      return true;
    }
  }
  
  validateMessage() {
    const value = this.messageInput.value.trim();
    const feedback = this.messageInput.closest('.form-group').querySelector('.input-feedback');
    
    if (value.length === 0) {
      this.showFeedback(feedback, 'Message is required', 'error');
      this.formState.message = false;
      return false;
    } else if (value.length < 10) {
      this.showFeedback(feedback, 'Message must be at least 10 characters', 'error');
      this.formState.message = false;
      return false;
    } else if (value.length > 1000) {
      this.showFeedback(feedback, 'Message cannot exceed 1000 characters', 'error');
      this.formState.message = false;
      return false;
    } else {
      this.showFeedback(feedback, '✓ Valid message', 'success');
      this.formState.message = true;
      return true;
    }
  }
  
  validateCaptcha() {
    const value = parseInt(this.captchaInput.value);
    const feedback = this.form.querySelector('.captcha-feedback');
    
    if (!value) {
      feedback.textContent = 'Please answer the security question';
      this.formState.captcha = false;
      return false;
    } else if (value !== 8) {
      feedback.textContent = 'Incorrect answer. 5 + 3 = 8';
      this.formState.captcha = false;
      return false;
    } else {
      feedback.textContent = '✓ Correct';
      feedback.style.color = '#10b981';
      this.formState.captcha = true;
      return true;
    }
  }
  
  validatePrivacy() {
    const feedback = this.privacyConsent.closest('.checkbox-group').querySelector('.input-feedback');
    
    if (!this.privacyConsent.checked) {
      if (feedback) {
        this.showFeedback(feedback, 'You must agree to the privacy policy', 'error');
      }
      this.formState.privacy = false;
      return false;
    } else {
      if (feedback) {
        this.showFeedback(feedback, '✓ Thank you for your consent', 'success');
      }
      this.formState.privacy = true;
      return true;
    }
  }
  
  showFeedback(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `input-feedback ${type}`;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async checkEmailDeliverability() {
    // Simulate email validation API call
    const email = this.emailInput.value.trim();
    if (this.isValidEmail(email)) {
      const domain = email.split('@')[1];
      
      // Check for disposable email domains
      const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
      if (disposableDomains.includes(domain)) {
        this.showFeedback(
          this.emailInput.closest('.form-group').querySelector('.input-feedback'),
          'Please use a permanent email address',
          'error'
        );
        this.formState.email = false;
        return false;
      }
      
      // Simulate MX record check
      return true;
    }
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = this.validateName() & this.validateEmail() & 
                    this.validateSubject() & this.validateMessage() & 
                    this.validateCaptcha() & this.validatePrivacy();
    
    if (!isValid) {
      this.showStatus('Please fix the errors before submitting', 'error');
      
      // Scroll to first error
      const firstError = this.form.querySelector('.input-feedback.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Show loading state
    this.submitBtn.classList.add('loading');
    this.submitBtn.disabled = true;
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('name', this.nameInput.value.trim());
      formData.append('email', this.emailInput.value.trim());
      formData.append('subject', this.subjectInput.value.trim());
      formData.append('message', this.messageInput.value.trim());
      
      // Add attachments
      this.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
      
      // Simulate API call (replace with actual API)
      await this.sendMessage(formData);
      
      // Success state
      this.submitBtn.classList.remove('loading');
      this.submitBtn.classList.add('success');
      
      this.showStatus('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        this.resetForm();
        this.submitBtn.classList.remove('success');
      }, 2000);
      
      // Clear saved draft
      localStorage.removeItem('contactFormDraft');
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      this.submitBtn.classList.remove('loading');
      this.showStatus('Failed to send message. Please try again or email me directly.', 'error');
    } finally {
      this.submitBtn.disabled = false;
    }
  }
  
  async sendMessage(formData) {
    // Replace with your actual API endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Network error'));
        }
      }, 1500);
    });
  }
  
  showStatus(message, type) {
    this.statusMessage.className = `form-status-message ${type}`;
    this.statusText.textContent = message;
    this.statusMessage.style.display = 'flex';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        this.statusMessage.style.display = 'none';
      }, 5000);
    }
  }
  
  resetForm() {
    // Clear all inputs
    this.form.reset();
    
    // Clear character counts
    this.charCount.textContent = '0';
    
    // Clear file attachments
    this.attachments = [];
    this.fileList.innerHTML = '';
    
    // Clear feedback messages
    this.form.querySelectorAll('.input-feedback').forEach(el => {
      el.textContent = '';
    });
    
    // Reset floating labels
    this.form.querySelectorAll('.floating-input').forEach(input => {
      input.classList.remove('has-value');
    });
    
    // Reset progress
    this.progressBar.style.width = '0%';
    this.progressText.textContent = '0% Complete';
    
    // Reset form state
    Object.keys(this.formState).forEach(key => {
      this.formState[key] = false;
    });
    
    // Show confirmation
    this.showStatus('Form has been reset', 'info');
  }
}

// Initialize enhanced contact form
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedContactForm();
  
  // Initialize particles for contact section
  initContactParticles();
});

// Contact section particles
function initContactParticles() {
  const container = document.getElementById('contactParticles');
  if (!container) return;
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'contact-particle';
    
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 50%;
      left: ${posX}%;
      top: ${posY}%;
      opacity: ${Math.random() * 0.1};
      animation: floatParticle ${duration}s linear infinite;
      animation-delay: -${delay}s;
    `;
    
    container.appendChild(particle);
  }
}

// Add CSS for contact particles
const style = document.createElement('style');
style.textContent = `
  @keyframes floatParticle {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(20px, -20px) rotate(90deg);
    }
    50% {
      transform: translate(40px, 0) rotate(180deg);
    }
    75% {
      transform: translate(20px, 20px) rotate(270deg);
    }
    100% {
      transform: translate(0, 0) rotate(360deg);
    }
  }
`;
document.head.appendChild(style);
// ============================================
// SCROLL EFFECTS
// ============================================

function initializeScrollEffects() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.skill-card-3d, .internship-card, .cert-card, .project-card').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// ANIMATIONS
// ============================================

function initializeAnimations() {
  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('.skill-card-3d, .internship-card, .cert-card, .project-card');
  
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });
}

// ============================================
// IMAGE OPTIMIZATION
// ============================================

function initializeImageOptimization() {
  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.getAttribute('data-src');
    });
  }
  
  // Profile image optimization
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    profileImage.addEventListener('error', function() {
      // Fallback to default avatar if image fails to load
      this.src = `https://ui-avatars.com/api/?name=Developer&size=200&background=6366f1&color=fff&bold=true`;
    });
  }
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Debounce function for scroll events
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// ============================================
// PROGRESSIVE WEB APP FEATURES
// ============================================

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// ============================================
// ADDITIONAL ENHANCEMENTS
// ============================================

// Add loading state to page
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Remove loading spinner if exists
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
});

// Keyboard navigation enhancements
document.addEventListener('keydown', function(e) {
  // Close modal with Escape key
  if (e.key === 'Escape') {
    const modal = document.getElementById('certModal');
    if (modal && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
});

// Print styles enhancement
window.addEventListener('beforeprint', function() {
  // Add any print-specific modifications here
});

window.addEventListener('afterprint', function() {
  // Revert any print-specific modifications here
});
// ============================================
// SCROLL TO TOP BUTTON FUNCTIONALITY
// ============================================

class ScrollToTop {
  constructor() {
    this.scrollBtn = document.getElementById('scrollTopBtn');
    this.progressBar = this.scrollBtn?.querySelector('.scroll-top-progress');
    this.threshold = 300; // Show button after scrolling 300px
    this.scrollTimeout = null;
    
    this.init();
  }
  
  init() {
    if (!this.scrollBtn) return;
    
    // Add event listeners
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.debounce(this.handleScroll.bind(this), 100));
    this.scrollBtn.addEventListener('click', this.scrollToTop.bind(this));
    
    // Initial check
    this.handleScroll();
    
    // Add keyboard accessibility
    this.scrollBtn.setAttribute('role', 'button');
    this.scrollBtn.setAttribute('tabindex', '0');
    
    // Add keydown event for Enter key
    this.scrollBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Show/hide button based on scroll position
    if (scrollTop > this.threshold) {
      this.showButton();
    } else {
      this.hideButton();
    }
    
    // Update progress indicator
    if (this.progressBar) {
      this.progressBar.style.transform = `scaleY(${scrollPercent / 100})`;
      this.progressBar.style.opacity = scrollPercent > 0 ? '0.2' : '0';
    }
    
    // Update ARIA label with scroll percentage
    if (this.scrollBtn) {
      this.scrollBtn.setAttribute('aria-label', `Scroll to top - ${Math.round(scrollPercent)}% scrolled`);
    }
  }
  
  showButton() {
    if (!this.scrollBtn.classList.contains('show')) {
      this.scrollBtn.classList.add('show');
      
      // Announce for screen readers
      this.announce('Scroll to top button available', 'polite');
    }
  }
  
  hideButton() {
    if (this.scrollBtn.classList.contains('show')) {
      this.scrollBtn.classList.remove('show');
    }
  }
  
  scrollToTop() {
    // Get smooth scroll duration based on scroll distance
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const duration = Math.min(800, Math.max(400, scrollTop * 0.5));
    
    this.animateScroll(duration);
    
    // Announce to screen readers
    this.announce('Scrolled to top of page', 'assertive');
    
    // Add ripple effect
    this.createRipple();
  }
  
  animateScroll(duration) {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    const animation = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, startPosition * (1 - easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
  
  createRipple() {
    const ripple = document.createElement('span');
    ripple.className = 'scroll-top-ripple';
    
    const size = Math.max(this.scrollBtn.offsetWidth, this.scrollBtn.offsetHeight);
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
      transform: scale(0);
      animation: scrollRipple 0.6s ease-out;
      width: ${size * 2}px;
      height: ${size * 2}px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      z-index: 0;
    `;
    
    this.scrollBtn.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  announce(message, priority = 'polite') {
    let announcer = document.getElementById('scroll-top-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'scroll-top-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
  }
  
  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

// Initialize Scroll to Top Button
document.addEventListener('DOMContentLoaded', () => {
  new ScrollToTop();
  
  // Add CSS for scroll ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scrollRipple {
      to {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// Also initialize after dynamic content loads
window.addEventListener('load', () => {
  // Ensure scroll button is initialized after all content loads
  if (!document.getElementById('scrollTopBtn')) {
    console.warn('Scroll to top button not found in DOM');
  }
});

// Handle AJAX page loads (if applicable)
document.addEventListener('pjax:end', () => {
  new ScrollToTop();
});


