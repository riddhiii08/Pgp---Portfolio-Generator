/**
 * PORTEDGE ARTIS — SCRIPT.JS
 * Interactions, Animations, & Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor Follower
    const cursor = document.querySelector('.cursor-blob');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Adjust the cursor position (centered)
            cursor.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
        });

        // Hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, .project-item, .skill-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2.5)';
                cursor.style.backgroundColor = 'rgba(219, 39, 119, 0.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
                cursor.style.backgroundColor = 'rgba(109, 40, 217, 0.6)';
            });
        });
    }

    // 2. Parallax Effects (Hero Shapes)
    const heroShapes = document.querySelectorAll('.shape');
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 30;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            shape.style.translate = `${x}px ${y}px`;
        });
    });

    // 3. Typing Animation
    const typedTextSpan = document.getElementById('typed-text');
    const words = ["Creative Technologist", "Design Artisan", "Frontend Visionary", "Fullstack Architect"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        if (!typedTextSpan) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Wait at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typedTextSpan) type();

    // 4. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when link is clicked
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(l => {
            l.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                // Reset bars
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // 7. Artistic Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            // Visual feedback
            submitBtn.innerHTML = '<span>Igniting...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Spark Sent!</span> <i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #27c93f, #2ecc71)';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.pointerEvents = 'all';
                    submitBtn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // 8. Add Smooth Scroll Offset for Fixed Header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some CSS styles for JavaScript elements dynamically
const style = document.createElement('style');
style.textContent = `
    .cursor-blob {
        position: fixed;
        width: 30px;
        height: 30px;
        background: rgba(109, 40, 217, 0.6);
        border-radius: 50%;
        filter: blur(10px);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out, background-color 0.3s ease;
    }

    #nav-links.active {
        display: flex !important;
        flex-direction: column;
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        background: var(--bg-dark);
        justify-content: center;
        align-items: center;
        z-index: 1000;
        gap: 40px;
        font-size: 24px;
        animation: fadeIn 0.5s forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
