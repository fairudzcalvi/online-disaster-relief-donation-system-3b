// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll to sections
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const navHeight = document.getElementById('navbar').offsetHeight;
        const elementPosition = element.offsetTop - navHeight;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
}

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Add smooth scroll to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (navMenu && navToggle) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
});

// Secret admin access - Ctrl+Alt+A
let keysPressed = {};

document.addEventListener('keydown', function(e) {
    keysPressed[e.key] = true;

    // Check for Ctrl+Alt+A
    if (keysPressed['Control'] && keysPressed['Alt'] && keysPressed['a']) {
        // Redirect to admin login
        window.location.href = 'admin-pages/admin_login.html';
        
        // Reset keys
        keysPressed = {};
        e.preventDefault();
    }
});

document.addEventListener('keyup', function(e) {
    delete keysPressed[e.key];
});