// =====================
// NAVBAR SCROLL EFFECT
// =====================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// =====================
// SMOOTH SCROLL FUNCTION
// =====================
function scrollToSection(id) {
    const section = document.getElementById(id);
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');

    if (!section || !navbar) return;

    const navHeight = navbar.offsetHeight;
    const targetPos = section.offsetTop - navHeight;

    window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
    });

    // Close mobile menu
    if (navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}


// =====================
// MOBILE MENU TOGGLE
// =====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}


// =====================
// SMOOTH SCROLL FOR INTERNAL LINKS ONLY
// =====================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);

            // prevent errors if target doesn't exist
            if (document.getElementById(targetId)) {
                e.preventDefault();
                scrollToSection(targetId);
            }
        }
    });
});


// =====================
// CLOSE MOBILE MENU ON OUTSIDE CLICK
// =====================
document.addEventListener('click', event => {
    if (!navMenu || !navToggle) return;

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        navMenu.classList.remove('active');
    }
});

