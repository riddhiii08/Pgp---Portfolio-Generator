document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Header
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 2. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If skill card, animate progress bar
                if (entry.target.classList.contains('skill-card')) {
                    const bar = entry.target.querySelector('.skill-bar');
                    if (bar) {
                        bar.style.width = bar.dataset.width;
                    }
                }
            }
        });
    }, {
        threshold: 0.2
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Hover effect for interactive elements
        const targets = document.querySelectorAll('a, button, .project-card, .skill-card, .info-card');
        targets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(3)';
                cursor.style.background = 'rgba(34, 211, 238, 0.2)';
                cursor.style.border = '1px solid var(--accent)';
            });
            target.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'var(--accent)';
                cursor.style.border = 'none';
            });
        });
    }

    // 4. Form Logic (Demo)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Transmitting...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Received!';
                btn.style.boxShadow = '0 0 30px #10b981';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.boxShadow = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // 5. Scroll Spy
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);
});
