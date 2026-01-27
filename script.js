// ============================================
// MAVERICK SUITE - Documentation Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSidebarNav();
    initScrollSpy();
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking a link (mobile)
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        }
    });
}

// ============================================
// SIDEBAR NAVIGATION
// ============================================
function initSidebarNav() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offset = window.innerWidth <= 768 ? 80 : 20;
                    const targetPosition = target.offsetTop - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================
// SCROLL SPY
// ============================================
function initScrollSpy() {
    const sections = document.querySelectorAll('.doc-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                setActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c MAVERICK SUITE', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%c Documentation v2.0', 'color: #a1a1aa; font-style: italic;');
