document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const revealItems = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-track span');
    const form = document.getElementById('contact-form');

    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach((section) => {
            if (window.scrollY >= section.offsetTop - 150) current = section.id;
        });
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            if (entry.target.querySelector('.skill-track')) {
                skillBars.forEach((bar) => { bar.style.width = bar.dataset.width || '80%'; });
            }
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));

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
