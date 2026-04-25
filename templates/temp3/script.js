/* PortEdge - Cyberpunk Neon Portfolio JS */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation Logic --- */
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Active Link Highlight
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });


    /* --- Cyber Typing Effect --- */
    const roles = ["NEURAL_INTERFACE", "UX_SPECIALIST", "QUANTUM_CODER", "DIGITAL_NOMAD"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingEl = document.getElementById('typing-text');

    function typeEffect() {
        const fullTxt = roles[roleIdx];
        const displayTxt = isDeleting ? fullTxt.substring(0, charIdx - 1) : fullTxt.substring(0, charIdx + 1);

        typingEl.textContent = displayTxt;

        if (!isDeleting && displayTxt === fullTxt) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && displayTxt === '') {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(typeEffect, 500);
        } else {
            const speed = isDeleting ? 40 : 80;
            charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
            setTimeout(typeEffect, speed);
        }
    }
    typeEffect();


    /* --- Intersection Observer for Cyber Reveal --- */
    const options = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If skill module, animate circle
                if (entry.target.classList.contains('skills-grid')) {
                    const progressCircles = entry.target.querySelectorAll('.progress-circle');
                    progressCircles.forEach(circle => {
                        const percent = circle.closest('.circle-progress').getAttribute('data-percent');
                        const radius = circle.r.baseVal.value;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (percent / 100) * circumference;

                        circle.style.strokeDasharray = `${circumference} ${circumference}`;
                        circle.style.strokeDashoffset = offset;
                    });
                }
            }
        });
    }, options);

    document.querySelectorAll('.reveal-cyber, .skills-grid').forEach(el => {
        observer.observe(el);
    });


    /* --- Ripple & Hover Effects --- */
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function (e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.className = 'ripple-effect';
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => { ripples.remove(); }, 600);
        });
    });


    /* --- Matrix-ish Glitch Trigger --- */
    const glitchElements = document.querySelectorAll('.glitch');
    setInterval(() => {
        const randEl = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        randEl.style.animation = 'none';
        void randEl.offsetWidth; // trigger reflow
        randEl.style.animation = null;
    }, 3000);


    /* --- Form Submission Hub --- */
    const cyberForm = document.querySelector('.cyber-form');
    if (cyberForm) {
        cyberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = cyberForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'TRANSMITTING...';
            submitBtn.style.borderColor = '#00f7ff';
            submitBtn.style.color = '#00f7ff';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'DATA_SYNC_COMPLETE';
                submitBtn.style.borderColor = '#00ff88';
                submitBtn.style.color = '#00ff88';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                    cyberForm.reset();
                }, 3000);
            }, 2000);
        });
    }

});
