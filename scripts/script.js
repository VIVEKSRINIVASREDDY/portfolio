// ===================================
// PROFESSIONAL PORTFOLIO JAVASCRIPT
// Dark Mode, Smooth Scroll, Form, Mobile Menu
// ===================================

// ===== FORMSPREE INTEGRATION =====
// To set up:
// 1. Go to https://formspree.io
// 2. Sign up and create a new form
// 3. Copy your form ID (e.g., f_xxxxxxxx)
// 4. Replace 'YOUR_FORMSPREE_ID' in the form action attribute in index.html
// Your email: ankireddyviveksrinivas@gmail.com

// ===== DOM Elements =====
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const body = document.body;
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('[data-scroll]');
const contactMeBtn = document.getElementById('contactMeBtn');
const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const hiddenCerts = document.getElementById('hiddenCerts');

// ===== FORM HELPER FUNCTIONS =====
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== DARK MODE FUNCTIONALITY =====
function initDarkMode() {
    // Check if user has dark mode preference saved
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // Check system preference if no saved preference
    if (!localStorage.getItem('darkMode')) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            updateThemeIcon(true);
        }
    }
}

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeIcon(isDarkMode);
}

function updateThemeIcon(isDarkMode) {
    const icon = themeToggle.querySelector('i');
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ===== CONTACT MODAL FUNCTIONALITY =====
function openContactModal() {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModalMenu() {
    contactModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== CERTIFICATIONS VIEW MORE FUNCTIONALITY =====
function toggleCertifications() {
    const isShowing = hiddenCerts.classList.contains('show');
    
    if (isShowing) {
        // Hide remaining certs with animation
        hiddenCerts.classList.add('hiding');
        viewMoreBtn.classList.remove('expanded');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            hiddenCerts.classList.remove('show');
            hiddenCerts.classList.remove('hiding');
            viewMoreBtn.innerHTML = '<i class="fas fa-plus"></i> View More Certificates';
        }, 520); // 400ms animation + 320ms last delay + 100ms buffer
    } else {
        // Show remaining certs
        hiddenCerts.classList.add('show');
        viewMoreBtn.classList.add('expanded');
        viewMoreBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
    }
}

// ===== SMOOTH SCROLL FUNCTIONALITY =====
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll to target
                const navbar = document.querySelector('.navbar');
                const offset = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveLink(targetId);
            }
        });
    });
}

function updateActiveLink(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ===== UPDATE ACTIVE LINK ON SCROLL =====
function updateActiveLinkOnScroll() {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');
    const offset = navbar.offsetHeight + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        if (scrollY >= sectionTop) {
            current = '#' + section.getAttribute('id');
        }
    });
    
    updateActiveLink(current);
}

// ===== FORM VALIDATION =====
function validateForm(event) {
    event.preventDefault();
    
    // Clear previous errors
    clearFormErrors();
    
    // Get form fields
    const from_name = document.getElementById('from_name').value.trim();
    const from_email = document.getElementById('from_email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name
    if (from_name === '') {
        showError('nameError', 'Please enter your name');
        isValid = false;
    } else if (from_name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (from_email === '') {
        showError('emailError', 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(from_email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        showError('messageError', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        submitFormWithFormspree();
    }
}

function submitFormWithFormspree() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Create FormData from form
    const formData = new FormData(form);
    
    // Send via Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Message sent successfully!');
            showSuccessMessage();
            form.reset();
            clearFormErrors();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        showError('nameError', 'Failed to send message. Please try again or contact directly.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const successMessage = document.getElementById('formSuccess');
    
    form.style.display = 'none';
    successMessage.style.display = 'flex';
    successMessage.style.flexDirection = 'column';
    successMessage.style.alignItems = 'center';
    
    // Reset after 4 seconds
    setTimeout(() => {
        form.style.display = 'grid';
        successMessage.style.display = 'none';
    }, 4000);
}

// ===== SCROLL TO TOP SMOOTH BEHAVIOR =====
function handleScrollAnimations() {
    const elements = document.querySelectorAll(
        '.info-item, .skill-category, .skill-item, .project-card, .certification-card, .education-item, .contact-item'
    );

    // Track scroll direction
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Let the toggle handle hidden cert cards independently
            if (entry.target.closest('#hiddenCerts')) return;

            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                const anim = scrollDirection === 'up'
                    ? 'slideInDown 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards'
                    : 'slideInUp 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards';
                entry.target.style.animation = anim;
            } else {
                // Reset so the element re-animates next time it enters
                entry.target.style.opacity = '0';
                entry.target.style.animation = 'none';
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Dark mode toggle
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Mobile menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }

    // Contact modal handlers
    if (contactMeBtn) {
        contactMeBtn.addEventListener('click', openContactModal);
    }
    
    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeContactModalMenu);
    }
    
    // Close contact modal when clicking outside
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModalMenu();
            }
        });
    }
    
    // Close contact modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeContactModalMenu();
        }
    });
    
    // View More Certificates handler
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', toggleCertifications);
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLinkOnScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
    handleScrollAnimations();
}

// ===== UTILITY: SMOOTH SCROLL SUPPORT CHECK =====
function getSmoothScrollSupport() {
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
    } catch (e) {
        return false;
    }
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    const loaderText = document.getElementById('loaderText');
    if (!loader) return;

    // Apply correct theme to loader before showing
    const savedDark = localStorage.getItem('darkMode') === 'true';
    const systemDark = !localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!savedDark && !systemDark) {
        loader.classList.add('light');
    }

    // Hide scrollbar while loading
    document.body.style.overflow = 'hidden';

    // Cycling messages
    const messages = [
        { text: 'Loading Data',           dots: true  },
        { text: 'Preparing Insights',     dots: true  },
        { text: "Loading Vivek's Portfolio", dots: true }
    ];

    function setMessage(index) {
        if (!loaderText) return;
        const msg = messages[index];
        const dotsHTML = msg.dots
            ? `<span class="loader-dots"><span>.</span><span>.</span><span>.</span></span>`
            : '';

        // Slide out
        loaderText.classList.add('swap-out');
        setTimeout(() => {
            loaderText.innerHTML = msg.text + dotsHTML;
            loaderText.classList.remove('swap-out');
            loaderText.classList.add('swap-in');
            // Force reflow then slide in
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    loaderText.classList.remove('swap-in');
                });
            });
        }, 350);
    }

    // Schedule message transitions
    setTimeout(() => setMessage(1), 1400);   // 1.4s → "Preparing Insights..."
    setTimeout(() => setMessage(2), 2800);   // 2.8s → "Loading Vivek's Portfolio..."

    // Minimum display time so the animation completes gracefully
    const minDisplay = 4500;
    const startTime = Date.now();

    function dismiss() {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplay - elapsed);
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.style.overflow = '';
            // Remove from DOM after transition
            setTimeout(() => loader.remove(), 650);
        }, remaining);
    }

    if (document.readyState === 'complete') {
        dismiss();
    } else {
        window.addEventListener('load', dismiss, { once: true });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized');

    // Loading screen must run first
    initLoadingScreen();
    
    // Initialize all features
    initDarkMode();
    initSmoothScroll();
    initEventListeners();
    initScrollAnimations();
    
    // Set initial active link
    updateActiveLinkOnScroll();
});

// ===== PAGE VISIBILITY OPTIMIZATION =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations if page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations
        document.body.style.animationPlayState = 'running';
    }
});

// ===== CONSOLE MESSAGES =====
console.log(
    '%c👋 Welcome to Vivek Srinivas Reddy\'s Portfolio',
    'font-size: 16px; color: #0066ff; font-weight: bold;'
);
console.log(
    '%cCheck out the source code and projects to learn more!',
    'font-size: 12px; color: #666;'
);