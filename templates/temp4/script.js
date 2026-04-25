/* PortEdge - Modern Startup Portfolio JS */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation --- */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Active Link Highlighting
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
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


    /* --- Typing Effect --- */
    const roles = ["ELEGANT_CODE", "CREATIVE_UI", "STARTUP_SOLUTIONS", "DIGITAL_BRANDS"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingEl = document.getElementById('typing-text');

    function typeEffect() {
        const fullTxt = roles[roleIdx];
        const displayTxt = isDeleting
            ? fullTxt.substring(0, charIdx - 1)
            : fullTxt.substring(0, charIdx + 1);

        typingEl.textContent = displayTxt;

        if (!isDeleting && displayTxt === fullTxt) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && displayTxt === '') {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(typeEffect, 500);
        } else {
            const speed = isDeleting ? 50 : 100;
            charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
            setTimeout(typeEffect, speed);
        }
    }

    if (typingEl) typeEffect();


    /* --- Animation Observer --- */
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate skill bars
                if (entry.target.classList.contains('skills-grid')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .fade-in, .skills-grid').forEach(el => {
        observer.observe(el);
    });


    /* --- Contact Form Interaction --- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.pointerEvents = 'none';

            // Simulate server request
            setTimeout(() => {
                submitBtn.innerHTML = 'Success <i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #20c997 0%, #007bff 100%)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.pointerEvents = 'all';
                    contactForm.reset();
                }, 3000);
            }, 2000);
        });
    }

});
