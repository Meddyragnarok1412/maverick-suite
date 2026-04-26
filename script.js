// ============================================
// MAVERICK TRADING GUIDE
// Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initChecklist();
    initLightbox();
    initChartErrorHandling();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    // Scroll effect - add scrolled class
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initScrollEffects() {
    // Parallax on hero background
    const hero = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg');

    if (hero && heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;

            if (scrolled < heroHeight) {
                const parallax = scrolled * 0.3;
                heroBg.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.getElementById('nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// ANIMATIONS
// ============================================
function initAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animateElements = document.querySelectorAll(
        '.foundation-card, .setup-card, .ref-card, .tf-card, ' +
        '.rule-box, .workflow-step, .matrix-item, .break-item, ' +
        '.distinction-item, .flow-step, .principle-card, .theory-block, ' +
        '.mav-tool-card, .ssp-step, .radar-feature, .chart-item, .mtf-rule'
    );

    animateElements.forEach((el, index) => {
        // Stagger the animation delay
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-value');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''));

    // Skip if not a number (like "MTF" or "SSP")
    if (isNaN(numericValue)) return;

    let current = 0;
    const increment = numericValue / 30;
    const suffix = text.replace(/[0-9]/g, '');

    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// ============================================
// CHECKLIST PERSISTENCE
// ============================================
function initChecklist() {
    const checkboxes = document.querySelectorAll('.check-item input');

    // Load saved state from localStorage
    checkboxes.forEach((checkbox, index) => {
        const saved = localStorage.getItem(`maverick-checklist-${index}`);
        if (saved === 'true') {
            checkbox.checked = true;
        }

        // Save state on change
        checkbox.addEventListener('change', () => {
            localStorage.setItem(`maverick-checklist-${index}`, checkbox.checked);
        });
    });

    // Add reset button functionality if it exists
    const resetBtn = document.getElementById('reset-checklist');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = false;
                localStorage.removeItem(`maverick-checklist-${index}`);
            });
        });
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navHeight = document.getElementById('nav').offsetHeight;
    let currentIndex = -1;

    // Find current section
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navHeight + 100 && rect.bottom > navHeight) {
            currentIndex = index;
        }
    });

    // J = next section, K = previous section
    if (e.key === 'j' && currentIndex < sections.length - 1) {
        e.preventDefault();
        const nextSection = sections[currentIndex + 1];
        window.scrollTo({
            top: nextSection.offsetTop - navHeight - 20,
            behavior: 'smooth'
        });
    } else if (e.key === 'k' && currentIndex > 0) {
        e.preventDefault();
        const prevSection = sections[currentIndex - 1];
        window.scrollTo({
            top: prevSection.offsetTop - navHeight - 20,
            behavior: 'smooth'
        });
    }

    // Home = go to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // End = go to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ============================================
// CHART ERROR HANDLING
// ============================================
function initChartErrorHandling() {
    // Handle images that fail to load - hide their container
    const chartImages = document.querySelectorAll('.gallery-item img, .chart-item img');

    chartImages.forEach(img => {
        img.onerror = function() {
            this.parentElement.style.display = 'none';
        };
    });
}

// ============================================
// LIGHTBOX
// ============================================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!lightbox) return;

    // Open lightbox on image click (gallery-item or chart-item)
    document.addEventListener('click', (e) => {
        const clickableItem = e.target.closest('.gallery-item, .chart-item');
        if (clickableItem) {
            const img = clickableItem.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c◈ MAVERICK TRADING GUIDE', 'color: #f59e0b; font-size: 20px; font-weight: bold;');
console.log('%c"Structure first. Entry second. Confluence always."', 'color: #a1a1aa; font-style: italic;');
console.log('%cKeyboard shortcuts: J/K to navigate sections, Home/End for top/bottom', 'color: #71717a;');
