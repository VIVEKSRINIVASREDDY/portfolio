// ===================================
// PROFESSIONAL PORTFOLIO JAVASCRIPT
// Dark Mode, Smooth Scroll, Form, Mobile Menu
// ===================================

// ===== EmailJS Configuration =====
// TODO: Replace these with your EmailJS credentials from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_xxxxx';     // Get from EmailJS Dashboard
const EMAILJS_TEMPLATE_ID = 'template_xxxxx';   // Get from EmailJS Email Templates
const EMAILJS_PUBLIC_KEY = 'xxxxxxxxxxxxx';     // Get from EmailJS Account > API Keys
const RECIPIENT_EMAIL = 'ankireddyviveksrinivas@gmail.com';

// Initialize EmailJS
(function() {
    if (EMAILJS_PUBLIC_KEY !== 'xxxxxxxxxxxxx') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===== DOM Elements =====
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const body = document.body;
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('[data-scroll]');

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
    
    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'xxxxxxxxxxxxx') {
        alert('❌ Contact form is not yet configured. Please check the setup instructions or contact the website owner.');
        return;
    }
    
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
        submitFormWithEmailJS(from_name, from_email, message);
    }
}

function submitFormWithEmailJS(from_name, from_email, message) {
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Prepare email parameters
    const templateParams = {
        to_email: RECIPIENT_EMAIL,
        from_name: from_name,
        from_email: from_email,
        message: message,
        reply_to: from_email
    };
    
    // Send email via EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            showSuccessMessage();
            contactForm.reset();
            clearFormErrors();
        })
        .catch(function(error) {
            console.error('Failed to send email:', error);
            showError('nameError', 'Failed to send message. Please try again or contact directly.');
        })
        .finally(function() {
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
    const elements = document.querySelectorAll('.info-item, .skill-category, .project-card, .education-item, .contact-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = 'slideInUp 600ms ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized');
    
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