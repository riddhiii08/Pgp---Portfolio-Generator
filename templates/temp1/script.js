/* PortEdge - Futuristic Portfolio JS */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Logic ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const navItems = document.querySelectorAll('.nav-item');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Active Link Highlighting
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // --- Typing Effect ---
    const words = ["Frontend Developer", "UI/UX Designer", "Creative Thinker", "Future Shaper"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingText = document.getElementById('typing-text');

    function type() {
        const currentWord = words[wordIndex];
        const displayText = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);

        typingText.textContent = displayText;

        if (!isDeleting && displayText === currentWord) {
            isDeleting = true;
            setTimeout(type, 2000); // Wait at end
        } else if (isDeleting && displayText === '') {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500); // Short pause before next word
        } else {
            const speed = isDeleting ? 50 : 100;
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            setTimeout(type, speed);
        }
    }
    type();


    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger progress bars if specialized item
                if (entry.target.classList.contains('skills-grid')) {
                    const progressLines = entry.target.querySelectorAll('.progress-line span');
                    progressLines.forEach(line => {
                        const percent = line.parentElement.getAttribute('data-percent');
                        line.style.width = percent;
                    });
                }
            }
        });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll('.reveal, .skills-grid').forEach(el => {
        observer.observe(el);
    });


    // --- Simple Canvas Particle System ---
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.getElementById('particles-js').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.init();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- Parallax Effect for Hero ---
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

        const sphere = document.querySelector('.floating-sphere');
        const card = document.querySelector('.glass-card-hero');

        if (sphere) {
            sphere.style.transform = `translate(${moveX * 5}px, ${moveY * 5}px)`;
        }
        if (card) {
            card.style.transform = `perspective(1000px) rotateY(${-15 + moveX}deg) rotateX(${10 + moveY}deg) translate(${moveX * 2}px, ${moveY * 2}px)`;
        }
    });


    // --- Form Submission Simulation ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = '#00ff88';
                btn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }
});
