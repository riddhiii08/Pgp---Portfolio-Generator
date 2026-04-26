document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-links');
    const revealItems = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-line span');
    const form = document.getElementById('contact-form');

    menuBtn?.addEventListener('click', () => navMenu.classList.toggle('active'));
    navLinks.forEach((link) => link.addEventListener('click', () => navMenu.classList.remove('active')));

    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach((section) => {
            if (window.scrollY >= section.offsetTop - 160) current = section.id;
        });
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            if (entry.target.classList.contains('skills-stack')) {
                skillBars.forEach((bar) => { bar.style.width = bar.dataset.width || '80%'; });
            }
        });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => observer.observe(item));
    document.querySelector('.skills-stack') && observer.observe(document.querySelector('.skills-stack'));

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = form.querySelector('button');
        const original = button.textContent;
        button.disabled = true;
        button.textContent = 'Sending...';
        setTimeout(() => {
            button.textContent = 'Sent';
            form.reset();
            setTimeout(() => {
                button.disabled = false;
                button.textContent = original;
            }, 1500);
        }, 900);
    });
});
