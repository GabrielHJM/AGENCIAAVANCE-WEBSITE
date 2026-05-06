// Agência Avance - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on every load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Clear hash to prevent jumping to sections on initial load
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }
    
    window.scrollTo(0, 0);

    initDeviceDetection();
    initGSAPAnimations();
    // initInteractiveElements(); // Removed: function not defined
    initScrollProgress();
    initLiquidGlassEffect();
    initButtonPhysics();
    initMobileMenu();
});

// Extra safety for some browsers
window.onload = () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
};

/**
 * Smart Device Detection
 */
function initDeviceDetection() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (isMobile || isTouch) {
        document.body.classList.add('is-mobile');
    } else {
        document.body.classList.add('is-desktop');
        initCursorTracking();
    }
}

/**
 * Scroll Progress & Percentage Label
 */
function initScrollProgress() {
    const scrollStatus = document.getElementById('scroll-status');
    if (!scrollStatus) return;

    // Pílula flutuante
    const scrollPct = document.getElementById('scroll-percentage');
    const progressText = document.getElementById('progress-text');

    // Usar ScrollTrigger para uma lógica mais premium e precisa na barra superior e pílula
    gsap.to(scrollStatus, {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
                const progress = Math.round(self.progress * 100);
                
                // Barra superior
                if (scrollStatus) {
                    scrollStatus.style.width = `${progress}%`;
                }

                // Pílula flutuante (Dynamic Island)
                if (scrollPct && progressText) {
                    progressText.innerText = `${progress}%`;
                    
                    // Exibir apenas se o usuário rolou um pouco e ainda não chegou totalmente no final
                    if (progress > 3 && progress < 97) {
                        scrollPct.classList.add('visible');
                        scrollPct.classList.remove('hidden');
                    } else {
                        scrollPct.classList.remove('visible');
                        scrollPct.classList.add('hidden');
                    }
                }
            }
        }
    });
}

/**
 * Physics on Buttons (Interactive Spring)
 */
function initButtonPhysics() {
    const physicsButtons = document.querySelectorAll('.physics-btn');

    physicsButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                scale: 1.05,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

/**
 * Innovation: Liquid Glass Effect
 */
function initLiquidGlassEffect() {
    const cards = document.querySelectorAll('.glass-card');
    
    if (document.body.classList.contains('is-desktop')) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                const rotateX = (y - rect.height / 2) / 25;
                const rotateY = (rect.width / 2 - x) / 25;
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            });
        });
    }
}

/**
 * GSAP Animations
 */
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section
    const tl = gsap.timeline();
    tl.from("#hero-lion-img", {
        duration: 2,
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: "expo.out"
    })
    .from(".reveal-text", {
        duration: 1.5,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out"
    }, "-=1.5")
    .from(".hero-subtitle", {
        duration: 1.2,
        opacity: 0,
        y: 15
    }, "-=1");

    // Reveal animations for all sections
    gsap.utils.toArray("section > div").forEach((box) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Navbar state
    ScrollTrigger.create({
        start: "top -50",
        onEnter: () => gsap.to("#navbar .nav-container", { background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", borderRadius: "25px", duration: 0.4 }),
        onLeaveBack: () => gsap.to("#navbar .nav-container", { background: "transparent", backdropFilter: "blur(0px)", borderRadius: "50px", duration: 0.4 })
    });
}

/**
 * iOS Style Cursor Tracking
 */
function initCursorTracking() {
    const cursorBlur = document.getElementById('cursor-blur');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorBlur, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    document.querySelectorAll('a, button, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorBlur, { scale: 1.3, opacity: 0.6, duration: 0.4 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorBlur, { scale: 1, opacity: 0.4, duration: 0.4 });
        });
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            console.log("Floating Menu Clicked - State:", navLinks.classList.contains('active')); 
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                gsap.to(navLinks, { opacity: 1, scale: 1, duration: 0.4, ease: "power4.out" });
            } else {
                document.body.style.overflow = 'auto';
                gsap.to(navLinks, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" });
            }
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}
