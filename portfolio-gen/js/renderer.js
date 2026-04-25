const Renderer = (() => {
  const FONT_IMPORTS = {
    'DM Sans':    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap',
    'Inter':      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'Poppins':    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    'Roboto':     'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
  };
  const esc = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const initials = name => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const skillsHTML = (skills) => skills.map(s =>
    `<span class="skill-chip">${esc(s)}</span>`).join('');
  const toLayoutClass = (layout) => {
    if (layout === 'two-col') return 'two-column';
    if (layout === 'grid') return 'grid';
    return 'single';
  };
  const socialLinks = (contact, accent) => {
    const links = [];
    if (contact.github)   links.push(`<a href="${esc(contact.github)}" target="_blank">GitHub</a>`);
    if (contact.linkedin) links.push(`<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>`);
    if (contact.twitter)  links.push(`<a href="${esc(contact.twitter)}" target="_blank">Twitter</a>`);
    if (contact.website)  links.push(`<a href="${esc(contact.website)}" target="_blank">Website</a>`);
    return links.join(' | ');
  };

<<<<<<< HEAD
  //HTML document wrapper 
  
=======
  const normalizeLink = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  };

>>>>>>> ecf6e2cdddb2ec736e044607f846c9f21a823a83
  function buildDocument(bodyHTML, css, title, fontURL) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
<title>${esc(title || 'My Portfolio')}</title>
${fontURL ? `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fontURL}" rel="stylesheet"/>` : ''}
<style>${css}</style>
</head>
<body>${bodyHTML}</body>
</html>`;
  }
  function renderModernPortfolio(d, defaultThemeClass = 'theme-minimal', variant = 'minimal-clean') {
    const { personal, skills, projects, education, contact, theme } = d;

    const FONT_STACKS = {
      'DM Sans': "'DM Sans', 'Inter', sans-serif",
      'Inter': "'Inter', sans-serif",
      'Poppins': "'Poppins', 'Inter', sans-serif",
      'Playfair Display': "'Playfair Display', 'Inter', serif",
      'Montserrat': "'Montserrat', 'Inter', sans-serif",
      'Roboto': "'Roboto', 'Inter', sans-serif"
    };


    const safeSkills = Array.isArray(skills) ? skills.map((s) => String(s || '').trim()).filter(Boolean) : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];



    const allowedThemes = ['theme-minimal', 'theme-dark', 'theme-creative', 'theme-grid'];
    const allowedVariants = [
      'minimal-clean', 'executive', 'sidebar-pro', 'timeline', 'resume-blueprint',
      'glassmorphic', 'editorial', 'neon-dark', 'brutalist',
      'terminal', 'matrix-grid', 'devcard', 'startup'
    ];
    const initialTheme = allowedThemes.includes(defaultThemeClass) ? defaultThemeClass : 'theme-minimal';
    const safeVariant = allowedVariants.includes(variant) ? variant : 'minimal-clean';
    const initialDarkMode = Boolean(theme && theme.darkMode);
    const chosenAccent = theme && theme.accent ? theme.accent : '#2563eb';
    const chosenFont = FONT_STACKS[(theme && theme.font) || 'Inter'] || "'Inter', sans-serif";
    const chosenFontURL = FONT_IMPORTS[(theme && theme.font) || 'Inter'] || FONT_IMPORTS['Inter'];
    const chosenLayout = toLayoutClass((theme && theme.layout) || 'single');
    const showPhoto = !(theme && theme.showPhoto === false);
    const showSkills = !(theme && theme.showSkills === false);

    const skillsHTML = (safeSkills.length ? safeSkills : ['JavaScript', 'HTML', 'CSS', 'UI Design'])
      .map((s) => `<span class="skill-chip">${esc(s)}</span>`)
      .join('');

    const projectsHTML = (safeProjects.length ? safeProjects : [{
      title: 'Production Portfolio Platform',
      description: 'A real-time configurable portfolio generator with extensible theme architecture.',
      tech: 'JavaScript, CSS, UX Architecture',
      link: ''
    }]).map((p) => {
      const tags = String(p.tech || '').split(',').map((t) => t.trim()).filter(Boolean)
        .map((t) => `<span class="tech-chip">${esc(t)}</span>`).join('') || '<span class="tech-chip">Frontend</span>';
      const href = normalizeLink(p.link);

      return `
        <article class="project-card">
          <h3>${esc(p.title) || 'Untitled Project'}</h3>
          <p>${esc(p.description) || 'No description provided yet.'}</p>
          <div class="project-meta">
            <div class="tech-row">${tags}</div>
            ${href ? `<a href="${esc(href)}" target="_blank" rel="noopener">View Project</a>` : ''}
          </div>
        </article>`;
    }).join('');

    const educationHTML = (safeEducation.length ? safeEducation : [{
      institution: 'Your Institution',
      degree: 'Degree Program',
      field: 'Specialization',
      from: '2020',
      to: '2024',
      current: false
    }]).map((e) => `
      <article class="edu-item">
        <div>
          <h3>${esc(e.institution) || 'Institution'}</h3>
          <p>${esc(e.degree) || 'Program'}${e.field ? `, ${esc(e.field)}` : ''}</p>
        </div>
        <span>${esc(e.from || '')}${e.to ? ` - ${e.current ? 'Present' : esc(e.to)}` : ''}</span>
      </article>`).join('');

    const contactLinks = [
      contact.email ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : '',
      contact.github ? `<a href="${esc(normalizeLink(contact.github))}" target="_blank" rel="noopener">GitHub</a>` : '',
      contact.linkedin ? `<a href="${esc(normalizeLink(contact.linkedin))}" target="_blank" rel="noopener">LinkedIn</a>` : '',
      contact.website ? `<a href="${esc(normalizeLink(contact.website))}" target="_blank" rel="noopener">Website</a>` : '',
      contact.twitter ? `<a href="${esc(normalizeLink(contact.twitter))}" target="_blank" rel="noopener">Twitter</a>` : ''
    ].filter(Boolean).join('') || '<a href="#">you@example.com</a>';

    const heroBio = esc(personal.bio || 'I build high-quality digital experiences with an emphasis on performance, clarity, and scalable frontend systems.');

    const css = `
      :root {
        --bg-color: #f8fafc;
        --text-color: #0f172a;
        --muted-color: #64748b;
        --card-bg: #ffffff;
        --surface-soft: #f1f5f9;
        --accent-color: #2563eb;
        --border-color: #e2e8f0;
        --shadow-color: rgba(15, 23, 42, 0.08);
        --glow-color: rgba(37, 99, 235, 0.25);
        --container-width: 1120px;
        --radius: 18px;
        --font-ui: ${chosenFont};
        --user-accent: ${chosenAccent};
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: var(--font-ui, 'Inter', sans-serif);
        background: var(--bg-color);
        color: var(--text-color);
        line-height: 1.6;
      }

      .portfolio-container {
        min-height: 100vh;
        --font-ui: ${chosenFont};
        --user-accent: ${chosenAccent};
        --accent-color: var(--user-accent);
        background: var(--bg-color);
        color: var(--text-color);
        font-family: var(--font-ui, 'Inter', sans-serif);
        transition: background 260ms ease, color 260ms ease;
      }

      .portfolio-shell {
        width: min(var(--container-width), 92vw);
        margin: 0 auto;
        padding: 28px 0 92px;
      }

      .theme-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 26px;
      }

      .template-label {
        font-size: 11px;
        letter-spacing: .12em;
        text-transform: uppercase;
        font-weight: 800;
        color: var(--muted-color);
      }

      .theme-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .theme-buttons button,
      .dark-toggle {
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        color: var(--text-color);
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .06em;
        cursor: pointer;
        transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
      }

      .theme-buttons button:hover,
      .dark-toggle:hover {
        transform: translateY(-1px);
        border-color: var(--accent-color);
      }

      .hero,
      .section-card {
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        background: var(--card-bg);
        box-shadow: 0 16px 38px var(--shadow-color);
      }

      .hero {
        padding: 34px;
        display: grid;
        grid-template-columns: 1.1fr .9fr;
        gap: 24px;
        animation: fadeInMinimal 560ms ease both;
      }

      .hero-main {
        display: flex;
        flex-direction: column;
      }

      .hero-top {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .hero-avatar {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--border-color);
        background: var(--surface-soft);
        flex-shrink: 0;
      }

      .hero-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .hero h1 {
        font-size: clamp(36px, 5vw, 42px);
        line-height: 1.05;
        font-weight: 800;
        letter-spacing: -0.03em;
      }

      .hero .role {
        margin-top: 10px;
        color: var(--accent-color);
        font-size: 18px;
        font-weight: 600;
      }

      .hero .bio {
        margin-top: 16px;
        color: var(--muted-color);
        max-width: 64ch;
      }

      .hero-cta { margin-top: 22px; }
      .hero-cta a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        background: var(--accent-color);
        color: #ffffff;
        padding: 12px 22px;
        border-radius: 12px;
        font-weight: 700;
        transition: transform 220ms ease, box-shadow 220ms ease;
      }

      .hero-cta a:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 30px var(--glow-color);
      }

      .hero-side {
        border: 1px solid var(--border-color);
        background: var(--surface-soft);
        border-radius: 14px;
        padding: 16px;
        display: grid;
        gap: 12px;
        align-content: center;
      }

      .hero-side h4 {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .12em;
        color: var(--muted-color);
      }

      .hero-side p { font-size: 14px; }

      .section-card {
        margin-top: 74px;
        padding: 26px;
        animation: fadeInMinimal 620ms ease both;
      }

      .section-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-weight: 800;
        margin-bottom: 18px;
      }

      .skills-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill-chip {
        border-radius: 999px;
        border: 1px solid var(--border-color);
        background: var(--surface-soft);
        padding: 7px 12px;
        font-size: 13px;
        font-weight: 600;
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .project-card {
        padding: 20px;
        border-radius: 14px;
        border: 1px solid var(--border-color);
        background: var(--card-bg);
        box-shadow: 0 12px 24px var(--shadow-color);
        transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
      }

      .project-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 18px 36px var(--shadow-color);
      }

      .project-card h3 { font-size: 20px; line-height: 1.2; }
      .project-card p { margin-top: 10px; font-size: 14px; color: var(--muted-color); }

      .project-meta {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
      }

      .tech-row { display: flex; flex-wrap: wrap; gap: 8px; }
      .tech-chip {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        background: var(--surface-soft);
        border: 1px solid var(--border-color);
      }

      .project-meta a,
      .contact-links a {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 700;
      }

      .edu-wrap { display: grid; gap: 12px; }
      .edu-item {
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 16px;
        background: var(--surface-soft);
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .edu-item h3 { font-size: 16px; }
      .edu-item p { color: var(--muted-color); font-size: 14px; }
      .edu-item span { color: var(--muted-color); font-size: 13px; font-weight: 600; white-space: nowrap; }

      .contact-links { display: flex; flex-wrap: wrap; gap: 12px 16px; }

      .theme-minimal {
        --bg-color: #ffffff;
        --text-color: #0f172a;
        --muted-color: #64748b;
        --card-bg: #ffffff;
        --surface-soft: #f8fafc;
        --accent-color: #1d4ed8;
        --border-color: #e2e8f0;
        --shadow-color: rgba(15, 23, 42, 0.08);
        --glow-color: rgba(37, 99, 235, 0.25);
        --accent-color: #1d4ed8;
      }

      .theme-minimal.dark-mode {
        --bg-color: #0f172a;
        --text-color: #e2e8f0;
        --muted-color: #94a3b8;
        --card-bg: #111827;
        --surface-soft: #0b1220;
        --accent-color: #60a5fa;
        --border-color: #1f314f;
        --shadow-color: rgba(2, 8, 23, 0.55);
        --glow-color: rgba(96, 165, 250, 0.32);
      }

      .theme-dark {
        --bg-color: #0f172a;
        --text-color: #e2e8f0;
        --muted-color: #94a3b8;
        --card-bg: #111827;
        --surface-soft: #0b1220;
        --accent-color: #22d3ee;
        --border-color: #1f314f;
        --shadow-color: rgba(2, 8, 23, 0.65);
        --glow-color: rgba(34, 211, 238, 0.45);
      }

      .theme-dark .project-card:hover {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.35), 0 20px 38px rgba(3, 10, 26, 0.75);
      }

      .theme-dark.dark-mode {
        --accent-color: #67e8f9;
      }

      .theme-creative {
        --bg-color: #f6f1ff;
        --text-color: #2f1f4d;
        --muted-color: #6b5a8f;
        --card-bg: rgba(255, 255, 255, 0.8);
        --surface-soft: rgba(255, 255, 255, 0.62);
        --accent-color: #7c3aed;
        --border-color: rgba(124, 58, 237, 0.26);
        --shadow-color: rgba(76, 29, 149, 0.18);
        --glow-color: rgba(124, 58, 237, 0.35);
      }

      .theme-creative .portfolio-shell {
        position: relative;
      }

      .theme-creative .portfolio-shell::before,
      .theme-creative .portfolio-shell::after {
        content: '';
        position: absolute;
        pointer-events: none;
        z-index: 0;
      }

      .theme-creative .portfolio-shell::before {
        width: 380px;
        height: 380px;
        right: -80px;
        top: 140px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.24), transparent 68%);
      }

      .theme-creative .portfolio-shell::after {
        width: 320px;
        height: 320px;
        left: -100px;
        bottom: 30px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%);
      }

      .theme-creative .hero,
      .theme-creative .section-card {
        position: relative;
        z-index: 1;
      }

      .theme-creative .hero {
        border-radius: 28px 10px 28px 10px;
        background: linear-gradient(130deg, rgba(255, 255, 255, 0.82), rgba(245, 243, 255, 0.72));
      }

      .theme-creative .projects-grid {
        grid-template-columns: 1.2fr .8fr;
      }

      .theme-creative .project-card:nth-child(odd) { transform: translateY(-4px); }
      .theme-creative .project-card:nth-child(even) { transform: translateY(8px); }
      .theme-creative .project-card:hover { transform: translateY(-8px) scale(1.01); }

      .theme-creative.dark-mode {
        --bg-color: #1f1236;
        --text-color: #efe9ff;
        --muted-color: #c7b7eb;
        --card-bg: rgba(36, 24, 61, 0.78);
        --surface-soft: rgba(51, 35, 81, 0.72);
        --accent-color: #a78bfa;
        --border-color: rgba(167, 139, 250, 0.4);
        --shadow-color: rgba(3, 2, 12, 0.6);
        --glow-color: rgba(167, 139, 250, 0.45);
      }

      .theme-grid {
        --bg-color: #f8fafc;
        --text-color: #0f172a;
        --muted-color: #475569;
        --card-bg: #ffffff;
        --surface-soft: #f1f5f9;
        --accent-color: #0ea5e9;
        --border-color: #dbe7f4;
        --shadow-color: rgba(15, 23, 42, 0.07);
        --glow-color: rgba(14, 165, 233, 0.28);
      }

      .theme-grid .portfolio-shell {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 16px;
      }

      .theme-grid .theme-controls { grid-column: 1 / -1; margin-bottom: 6px; }
      .theme-grid .hero { grid-column: 1 / -1; }
      .theme-grid .section-skills { grid-column: 1 / 5; margin-top: 0; }
      .theme-grid .section-projects { grid-column: 5 / -1; margin-top: 0; }
      .theme-grid .section-education { grid-column: 1 / 8; margin-top: 0; }
      .theme-grid .section-contact { grid-column: 8 / -1; margin-top: 0; }

      .theme-grid .project-card { border-radius: 12px; }

      .theme-grid.dark-mode {
        --bg-color: #0b1220;
        --text-color: #e2e8f0;
        --muted-color: #9fb0c8;
        --card-bg: #0f1b31;
        --surface-soft: #0c1628;
        --accent-color: #38bdf8;
        --border-color: #1f314f;
        --shadow-color: rgba(1, 7, 17, 0.65);
        --glow-color: rgba(56, 189, 248, 0.4);
      }

      .portfolio-container.dark-mode {
        --bg-color: #0b1220;
        --text-color: #e2e8f0;
        --muted-color: #9fb0c8;
        --card-bg: #0f1b31;
        --surface-soft: #0c1628;
        --border-color: #1f314f;
        --shadow-color: rgba(1, 7, 17, 0.65);
        --glow-color: rgba(56, 189, 248, 0.28);
      }

      
      .variant-minimal-clean {
        --bg-color: #ffffff;
        --text-color: #111827;
        --muted-color: #6b7280;
        --card-bg: #ffffff;
        --surface-soft: #f9fafb;
        --accent-color: #1f2937;
        --border-color: #e5e7eb;
        --shadow-color: rgba(17, 24, 39, 0.08);
        --accent-color: var(--user-accent, #1f2937);
      }
      .variant-minimal-clean .hero { border-radius: 22px; }
      .variant-minimal-clean .portfolio-shell { max-width: 920px; }
      .variant-minimal-clean .hero,
      .variant-minimal-clean .section-card,
      .variant-minimal-clean .project-card {
        box-shadow: none;
      }
      .variant-minimal-clean .section-title {
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 8px;
      }

      .variant-executive {
        --bg-color: #f8fafc;
        --text-color: #0f172a;
        --muted-color: #475569;
        --card-bg: #ffffff;
        --surface-soft: #eef2f7;
        --accent-color: #7c2d12;
        --border-color: #e2e8f0;
        --shadow-color: rgba(30, 41, 59, 0.1);
        --font-ui: 'Poppins', 'Inter', sans-serif;
      }
      .variant-executive .hero {
        background: linear-gradient(120deg, var(--card-bg), var(--surface-soft));
        border-left: 6px solid var(--accent-color);
        border-radius: 14px;
      }
      .variant-executive .section-title { letter-spacing: .2em; }
      .variant-executive .project-card {
        border-radius: 10px;
      }

      .variant-sidebar-pro {
        --bg-color: #f7f7ff;
        --text-color: #1f2340;
        --muted-color: #5b628b;
        --card-bg: #ffffff;
        --surface-soft: #eef1ff;
        --accent-color: #5b4cf5;
        --border-color: #d9def8;
        --shadow-color: rgba(48, 56, 110, 0.15);
        --font-ui: 'Montserrat', 'Inter', sans-serif;
      }
      .variant-sidebar-pro .portfolio-shell {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 16px;
      }
      .variant-sidebar-pro .theme-controls,
      .variant-sidebar-pro .hero,
      .variant-sidebar-pro .section-card { grid-column: 2; }
      .variant-sidebar-pro .hero {
        grid-template-columns: 1fr;
        min-height: 220px;
      }
      .variant-sidebar-pro .section-skills {
        grid-column: 1;
        grid-row: 2 / span 3;
        margin-top: 0;
        position: sticky;
        top: 18px;
        height: fit-content;
        background: rgba(2, 6, 23, 0.04);
      }
      .variant-sidebar-pro.dark-mode .section-skills {
        background: rgba(148, 163, 184, 0.06);
      }

      .variant-timeline {
        --bg-color: #fff7ed;
        --text-color: #3b2617;
        --muted-color: #7c5b45;
        --card-bg: #ffffff;
        --surface-soft: #fff1e4;
        --accent-color: #ea580c;
        --border-color: #fed7aa;
        --shadow-color: rgba(154, 52, 18, 0.14);
        --font-ui: 'Poppins', 'Inter', sans-serif;
      }
      .variant-timeline .projects-grid,
      .variant-timeline .edu-wrap {
        display: block;
      }
      .variant-timeline .portfolio-shell {
        position: relative;
      }
      .variant-timeline .portfolio-shell::after {
        content: '';
        position: absolute;
        left: 34px;
        top: 140px;
        bottom: 24px;
        width: 2px;
        background: rgba(234, 88, 12, 0.35);
        pointer-events: none;
      }
      .variant-timeline .hero,
      .variant-timeline .section-card {
        margin-left: 56px;
      }
      .variant-timeline .project-card,
      .variant-timeline .edu-item {
        margin-bottom: 14px;
        border-left: 4px solid var(--accent-color);
        border-radius: 4px 12px 12px 4px;
      }
      .variant-timeline .section-title::before {
        content: 'Timeline';
        display: inline-block;
        font-size: 10px;
        margin-right: 10px;
        opacity: .75;
      }

      .variant-resume-blueprint .theme-controls { justify-content: flex-end; }
      .variant-resume-blueprint {
        --bg-color: #ffffff;
        --text-color: #0f172a;
        --muted-color: #475569;
        --card-bg: #ffffff;
        --surface-soft: #ffffff;
        --accent-color: #1e3a8a;
        --border-color: #d6dde8;
        --shadow-color: rgba(0, 0, 0, 0);
        --font-ui: 'Inter', sans-serif;
      }
      .variant-resume-blueprint .hero,
      .variant-resume-blueprint .section-card {
        border-radius: 8px;
        box-shadow: none;
      }
      .variant-resume-blueprint .portfolio-shell {
        max-width: 860px;
      }
      .variant-resume-blueprint .projects-grid {
        display: block;
      }
      .variant-resume-blueprint .project-card {
        margin-bottom: 10px;
        box-shadow: none;
        border-radius: 4px;
      }
      .variant-resume-blueprint .section-card {
        border-width: 1px 0 0 0;
      }
      .variant-resume-blueprint .hero {
        border-width: 0 0 1px 0;
      }
      .variant-resume-blueprint .hero-cta,
      .variant-resume-blueprint #darkToggle,
      .variant-resume-blueprint .theme-buttons {
        display: none;
      }
      .variant-resume-blueprint .section-title {
        font-size: 11px;
        letter-spacing: .18em;
      }

      .variant-glassmorphic {
        --bg-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --text-color: #f8f7ff;
        --muted-color: rgba(248, 247, 255, 0.8);
        --card-bg: rgba(255, 255, 255, 0.16);
        --surface-soft: rgba(255, 255, 255, 0.12);
        --accent-color: #f8fafc;
        --border-color: rgba(255, 255, 255, 0.3);
        --font-ui: 'Poppins', 'Inter', sans-serif;
      }
      .variant-glassmorphic {
        backdrop-filter: blur(6px);
      }
      .variant-glassmorphic .hero,
      .variant-glassmorphic .section-card,
      .variant-glassmorphic .project-card {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(14px);
      }
      .variant-glassmorphic .hero-cta a { color: #2f1f4d; }

      .variant-editorial {
        --bg-color: #fff8f1;
        --text-color: #2f2418;
        --muted-color: #6b5a49;
        --card-bg: #fffdf9;
        --surface-soft: #f7efe3;
        --accent-color: #c2410c;
        --border-color: #eadbc8;
        --shadow-color: rgba(120, 53, 15, 0.13);
        --font-ui: 'Playfair Display', 'Poppins', serif;
      }
      .variant-editorial .portfolio-shell {
        max-width: 1180px;
        position: relative;
      }
      .variant-editorial .portfolio-shell::before {
        content: '';
        position: absolute;
        left: 0;
        top: 80px;
        width: 36%;
        height: calc(100% - 120px);
        background: linear-gradient(180deg, rgba(194,65,12,.08), rgba(251,146,60,.08));
        border-right: 1px solid #efddcb;
        pointer-events: none;
      }
      .variant-editorial .hero {
        grid-template-columns: .9fr 1.1fr;
        border-radius: 0;
        border-top: 8px solid var(--accent-color);
        border-left: 0;
        box-shadow: none;
      }
      .variant-editorial .hero h1 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(40px, 5.6vw, 56px);
        letter-spacing: 0;
        line-height: 1.02;
      }
      .variant-editorial .section-title {
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: var(--accent-color);
        border-bottom: 2px solid #e6c9ad;
        padding-bottom: 8px;
      }
      .variant-editorial .project-card {
        border-radius: 0;
        border-left: 4px solid var(--accent-color);
        box-shadow: none;
      }
      .variant-editorial .project-card:nth-child(odd) {
        margin-right: 8%;
      }
      .variant-editorial .project-card:nth-child(even) {
        margin-left: 8%;
      }

      .variant-neon-dark {
        --bg-color: #13091f;
        --text-color: #f3e8ff;
        --muted-color: #d8b4fe;
        --card-bg: rgba(42, 14, 72, 0.9);
        --surface-soft: rgba(62, 23, 103, 0.86);
        --accent-color: #e879f9;
        --border-color: rgba(232, 121, 249, 0.35);
        --shadow-color: rgba(0, 0, 0, 0.7);
        --font-ui: 'Poppins', 'Inter', sans-serif;
      }
      .variant-neon-dark .project-card:hover {
        box-shadow: 0 0 0 1px var(--accent-color), 0 0 24px var(--glow-color), 0 20px 38px rgba(3, 10, 26, 0.75);
      }
      .variant-neon-dark .section-title { color: #67e8f9; }
      .variant-neon-dark .hero {
        background: radial-gradient(120% 120% at 10% 0%, rgba(232,121,249,.18), rgba(42,14,72,.9));
      }
      .variant-neon-dark .tech-chip {
        background: rgba(232,121,249,.14);
        border-color: rgba(232,121,249,.35);
      }

      .variant-brutalist {
        --bg-color: #ffe066;
        --text-color: #111111;
        --muted-color: #2c2c2c;
        --card-bg: #fff;
        --surface-soft: #fff1a8;
        --accent-color: #ff4d00;
        --border-color: #111111;
        --shadow-color: rgba(0, 0, 0, 0.12);
        --font-ui: 'Montserrat', 'Inter', sans-serif;
      }
      .variant-brutalist .hero,
      .variant-brutalist .section-card,
      .variant-brutalist .project-card {
        border-radius: 2px;
        border-width: 2px;
      }
      .variant-brutalist .hero,
      .variant-brutalist .section-card {
        transform: skew(-1.2deg);
      }
      .variant-brutalist .project-card:nth-child(even) {
        background: #111;
        color: #ffe066;
      }
      .variant-brutalist .project-card:nth-child(even) p,
      .variant-brutalist .project-card:nth-child(even) a {
        color: #ffe066;
      }
      .variant-brutalist .hero-cta a {
        border-radius: 2px;
        text-transform: uppercase;
        color: #111;
      }

      .variant-terminal {
        --bg-color: #0d1117;
        --text-color: #e6edf3;
        --muted-color: #8b949e;
        --card-bg: #161b22;
        --surface-soft: #0d1117;
        --accent-color: #f59e0b;
        --border-color: #30363d;
        --shadow-color: rgba(0, 0, 0, 0.5);
        --font-ui: 'JetBrains Mono', monospace;
      }
      .variant-terminal {
        font-family: 'JetBrains Mono', monospace;
      }
      .variant-terminal .hero,
      .variant-terminal .section-card {
        position: relative;
      }
      .variant-terminal .hero::before,
      .variant-terminal .section-card::before {
        content: '';
        position: absolute;
        left: 12px;
        top: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ef4444;
        box-shadow: 14px 0 0 #f59e0b, 28px 0 0 #22c55e;
      }
      .variant-terminal .hero,
      .variant-terminal .section-card {
        padding-top: 26px;
      }
      .variant-terminal .hero,
      .variant-terminal .section-card,
      .variant-terminal .project-card {
        border-radius: 6px;
      }
      .variant-terminal .hero {
        grid-template-columns: 1fr;
        border: 1px solid #30363d;
      }
      .variant-terminal .projects-grid {
        display: block;
      }
      .variant-terminal .hero-side {
        border: 1px dashed #334155;
      }
      .variant-terminal .section-title::before {
        content: '$ ';
        color: var(--accent-color);
      }
      .variant-terminal .hero-cta a {
        border-radius: 4px;
        background: transparent;
        border: 1px solid var(--accent-color);
        color: var(--accent-color);
      }
      .variant-terminal .project-card {
        border: 1px dashed #374151;
        box-shadow: none;
        margin-bottom: 10px;
      }
      .variant-terminal .project-card:hover {
        border-color: var(--accent-color);
        box-shadow: inset 0 0 0 1px rgba(245,158,11,.2);
      }

      .variant-matrix-grid {
        --bg-color: #062925;
        --text-color: #d1fae5;
        --muted-color: #86efac;
        --card-bg: #0b3b35;
        --surface-soft: #0a322d;
        --accent-color: #34d399;
        --border-color: #11645a;
        --shadow-color: rgba(1, 8, 20, 0.65);
        --font-ui: 'JetBrains Mono', monospace;
      }
      .variant-matrix-grid .project-card,
      .variant-devcard .project-card,
      .variant-startup .project-card {
        border-radius: 10px;
      }
      .variant-matrix-grid .portfolio-shell {
        background-image: linear-gradient(rgba(100,255,218,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,.08) 1px, transparent 1px);
        background-size: 22px 22px;
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 14px;
      }
      .variant-matrix-grid .theme-controls { grid-column: 1 / -1; }
      .variant-matrix-grid .hero { grid-column: 1 / 8; margin-top: 0; }
      .variant-matrix-grid .section-skills { grid-column: 8 / -1; margin-top: 0; }
      .variant-matrix-grid .section-projects { grid-column: 1 / -1; margin-top: 0; }
      .variant-matrix-grid .section-education { grid-column: 1 / 7; margin-top: 0; }
      .variant-matrix-grid .section-contact { grid-column: 7 / -1; margin-top: 0; }

      .variant-devcard {
        --bg-color: #1f2937;
        --text-color: #f9fafb;
        --muted-color: #cbd5e1;
        --card-bg: #111827;
        --surface-soft: #0f172a;
        --accent-color: #f97316;
        --border-color: #374151;
        --font-ui: 'Inter', sans-serif;
      }
      .variant-devcard .projects-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .variant-devcard .project-card {
        border-radius: 10px;
        border: 1px solid #4b5563;
      }
      .variant-devcard .hero {
        border: 1px solid #4b5563;
      }
      .variant-devcard .section-title {
        color: #fb923c;
      }

      .variant-startup {
        --bg-color: #f6fffb;
        --text-color: #0b2b1f;
        --muted-color: #3f6c58;
        --card-bg: #ffffff;
        --surface-soft: #ecfdf5;
        --accent-color: #14b8a6;
        --border-color: #b7e4ce;
        --font-ui: 'Poppins', 'Inter', sans-serif;
      }
      .variant-startup .hero {
        background: linear-gradient(130deg, var(--card-bg), var(--surface-soft));
      }
      .variant-startup .hero::after {
        content: '';
        position: absolute;
        right: 24px;
        top: 24px;
        width: 86px;
        height: 86px;
        border-radius: 18px;
        background: radial-gradient(circle at 30% 30%, rgba(20,184,166,.45), rgba(16,185,129,.18));
      }
      .variant-startup .project-card {
        border-top: 3px solid var(--accent-color);
      }
      .variant-startup .tech-chip {
        background: rgba(20,184,166,.12);
      }

      .portfolio-container {
        --font-ui: ${chosenFont};
        --accent-color: var(--user-accent);
      }

      .portfolio-container,
      .portfolio-container * {
        font-family: var(--font-ui, 'Inter', sans-serif);
      }

      .portfolio-container.dark-mode {
        --bg-color: #0b1220;
        --text-color: #e2e8f0;
        --muted-color: #9fb0c8;
        --card-bg: #0f1b31;
        --surface-soft: #0c1628;
        --border-color: #1f314f;
        --shadow-color: rgba(1, 7, 17, 0.65);
        --glow-color: rgba(56, 189, 248, 0.28);
        --accent-color: var(--user-accent);
      }

      .layout-two-column .portfolio-shell {
        display: grid;
        grid-template-columns: minmax(0, 32%) minmax(0, 68%);
        gap: 16px;
      }

      .layout-two-column .theme-controls,
      .layout-two-column .hero,
      .layout-two-column .section-projects,
      .layout-two-column .section-education {
        grid-column: 2;
      }

      .layout-two-column .section-skills,
      .layout-two-column .section-contact {
        grid-column: 1;
      }

      .layout-grid .portfolio-shell {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .layout-grid .theme-controls,
      .layout-grid .hero,
      .layout-grid .section-projects {
        grid-column: 1 / -1;
      }

      .layout-grid .section-card { margin-top: 0; }

      @keyframes fadeInMinimal {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media print {
        @page { size: A4; margin: 12mm; }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        * {
          animation: none !important;
          transition: none !important;
          text-shadow: none !important;
        }

        .portfolio-shell {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
          background-image: none !important;
        }

        .theme-controls,
        .hero-cta {
          display: none !important;
        }

        .section-card,
        .hero {
          margin-top: 14px !important;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .projects-grid,
        .edu-wrap {
          display: block !important;
        }

        .project-card,
        .edu-item {
          margin-bottom: 10px !important;
          break-inside: avoid;
          page-break-inside: avoid;
          transform: none !important;
        }

        .hero,
        .section-card,
        .project-card,
        .edu-item,
        .hero-side {
          box-shadow: none !important;
          backdrop-filter: none !important;
          filter: none !important;
        }

        .project-card:hover,
        .theme-buttons button:hover,
        .dark-toggle:hover,
        .hero-cta a:hover {
          transform: none !important;
        }

        .portfolio-shell::before,
        .portfolio-shell::after {
          display: none !important;
          content: none !important;
        }
      }

      @media (max-width: 980px) {
        .hero { grid-template-columns: 1fr; }
        .projects-grid,
        .theme-creative .projects-grid { grid-template-columns: 1fr; }
        .theme-grid .portfolio-shell { display: block; }
        .theme-grid .section-card { margin-top: 74px; }
        .variant-timeline .hero,
        .variant-timeline .section-card { margin-left: 0; }
        .variant-timeline .portfolio-shell::after { display: none; }
        .variant-matrix-grid .portfolio-shell { display: block; }
        .variant-matrix-grid .section-card { margin-top: 74px; }
        .layout-two-column .portfolio-shell,
        .layout-grid .portfolio-shell { display: block; }
        .layout-grid .section-card,
        .layout-two-column .section-card { margin-top: 74px; }
        .theme-creative .project-card:nth-child(odd),
        .theme-creative .project-card:nth-child(even) { transform: none; }
      }

      @media (max-width: 720px) {
        .portfolio-shell { padding: 20px 0 70px; }
        .hero, .section-card, .project-card, .edu-item { padding: 16px; }
        .theme-controls { align-items: flex-start; }
        .edu-item { flex-direction: column; align-items: flex-start; }
      }
    `;

    const body = `
      <main id="portfolioRoot" class="portfolio-container variant-${safeVariant} layout-${chosenLayout} ${initialTheme}${initialDarkMode ? ' dark-mode' : ''}">
        <div class="portfolio-shell">
          <div class="theme-controls">
            <span class="template-label">Template: ${esc((d.selectedTemplate || '').replace(/-/g, ' ')) || 'Custom'}</span>
          </div>

          <header class="hero section-hero">
            <div class="hero-main">
              <div class="hero-top">
                ${showPhoto ? `<div class="hero-avatar">${personal.avatar ? `<img src="${esc(personal.avatar)}" alt="${esc(personal.name || 'Avatar')}" onerror="this.style.display='none'"/>` : ''}</div>` : ''}
                <div>
                  <h1>${esc(personal.name) || 'Your Name'}</h1>
                  <p class="role">${esc(personal.title) || 'Frontend Developer'}</p>
                </div>
              </div>
              <p class="bio">${heroBio}</p>
              <div class="hero-cta"><a href="#contact">Lets Connect</a></div>
            </div>
            <aside class="hero-side">
              <div>
                <h4>Location</h4>
                <p>${esc(contact.location) || 'Remote / Worldwide'}</p>
              </div>
              <div>
                <h4>Primary Stack</h4>
                <p>${safeSkills.slice(0, 3).map(esc).join(' / ') || 'HTML / CSS / JavaScript'}</p>
              </div>
            </aside>
          </header>

          ${showSkills ? `<section class="section-card section-skills" id="skills">
            <h2 class="section-title">Skills</h2>
            <div class="skills-wrap">${skillsHTML}</div>
          </section>` : ''}

          <section class="section-card section-projects" id="projects">
            <h2 class="section-title">Projects</h2>
            <div class="projects-grid">${projectsHTML}</div>
          </section>

          <section class="section-card section-education" id="education">
            <h2 class="section-title">Education</h2>
            <div class="edu-wrap">${educationHTML}</div>
          </section>

          <section class="section-card section-contact" id="contact">
            <h2 class="section-title">Contact</h2>
            <div class="contact-links">${contactLinks}</div>
          </section>
        </div>
      </main>

      <script>
        (function initThemeSystem() {
          const root = document.getElementById('portfolioRoot');
          if (!root) return;

          const appState = {
            theme: '${initialTheme.replace('theme-', '')}',
            variant: '${safeVariant}',
            layout: '${chosenLayout}',
            darkMode: ${initialDarkMode ? 'true' : 'false'}
          };

          const applyTheme = () => {
            root.className = 'portfolio-container variant-' + appState.variant + ' layout-' + appState.layout + ' theme-' + appState.theme + (appState.darkMode ? ' dark-mode' : '');
          };

          applyTheme();
        })();
      </script>`;

    return buildDocument(
      body,
      css,
      personal.name,
      chosenFontURL
    );
  }
  function renderMinimalClean(d, theme) {
    const { personal, skills, projects, education, contact } = d;
    const layoutClass = toLayoutClass(theme.layout);
    const accent = theme.accent;
    const font = theme.font || 'DM Sans';
    const bg = theme.darkMode ? '#0f0f0f' : '#ffffff';
    const ink = theme.darkMode ? '#f0f0f0' : '#1a1a2e';
    const muted = theme.darkMode ? '#999' : '#6b7280';
    const cardBg = theme.darkMode ? '#1a1a1a' : '#f9fafb';
    const border = theme.darkMode ? '#2a2a2a' : '#e5e7eb';

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: '${font}', sans-serif; background: ${bg}; color: ${ink}; line-height: 1.6; }
      a { color: ${accent}; text-decoration: none; }
      a:hover { text-decoration: underline; }
      #portfolioPreview { transition: all .25s ease; }
      .container { max-width: 800px; margin: 0 auto; padding: 60px 32px; }
      .content-section { margin-bottom: 48px; }

      
      #portfolioPreview.layout-single .container {
        max-width: 800px;
        display: block;
      }
      #portfolioPreview.layout-two-column .container {
        max-width: 1080px;
        display: grid;
        grid-template-columns: minmax(220px, 30%) minmax(0, 70%);
        gap: 22px 32px;
      }
      #portfolioPreview.layout-two-column .header {
        grid-column: 1 / -1;
        margin-bottom: 10px;
      }
      #portfolioPreview.layout-two-column .section-about,
      #portfolioPreview.layout-two-column .section-skills,
      #portfolioPreview.layout-two-column .section-connect {
        grid-column: 1;
      }
      #portfolioPreview.layout-two-column .section-projects,
      #portfolioPreview.layout-two-column .section-education {
        grid-column: 2;
      }
      #portfolioPreview.layout-grid .container {
        max-width: 1080px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
      }
      #portfolioPreview.layout-grid .header,
      #portfolioPreview.layout-grid .footer {
        grid-column: 1 / -1;
      }
      #portfolioPreview.layout-grid .content-section {
        margin-bottom: 0;
        padding: 20px;
        border: 1px solid ${border};
        border-radius: 12px;
        background: ${cardBg};
      }

      @media (max-width: 860px) {
        #portfolioPreview.layout-two-column .container,
        #portfolioPreview.layout-grid .container {
          max-width: 800px;
          display: block;
        }
        #portfolioPreview.layout-grid .content-section {
          margin-bottom: 24px;
          padding: 0;
          border: none;
          border-radius: 0;
          background: transparent;
        }
      }
      
      .header { display: flex; align-items: flex-start; gap: 28px; margin-bottom: 60px; }
      .avatar {
        width: 88px; height: 88px; border-radius: 50%; flex-shrink: 0;
        background: ${accent}; display: flex; align-items: center; justify-content: center;
        color: white; font-size: 1.8rem; font-weight: 700; overflow: hidden; border: 3px solid ${border};
      }
      .avatar img { width: 100%; height: 100%; object-fit: cover; }
      .header-text h1 { font-size: 2.2rem; font-weight: 700; letter-spacing: -.02em; margin-bottom: 4px; }
      .header-text .role { font-size: 1.05rem; color: ${muted}; margin-bottom: 12px; }
      .contact-line { font-size: .85rem; color: ${muted}; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
      .contact-line span::before { content: '|'; margin-right: 8px; }
      .contact-line span:first-child::before { content: ''; margin: 0; }
      
      section { margin-bottom: 48px; }
      .section-title {
        font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 8px; margin-bottom: 20px;
      }
      .bio { color: ${muted}; line-height: 1.8; font-size: .97rem; }
      
      .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-chip {
        padding: 5px 14px; background: ${cardBg}; border: 1px solid ${border};
        border-radius: 9999px; font-size: .8rem; font-weight: 500; color: ${ink};
      }
      
      .project-card {
        padding: 20px; background: ${cardBg}; border-radius: 10px;
        border: 1px solid ${border}; margin-bottom: 14px;
      }
      .project-title { font-weight: 600; font-size: 1rem; margin-bottom: 6px; }
      .project-desc { font-size: .875rem; color: ${muted}; margin-bottom: 10px; line-height: 1.6; }
      .project-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
      .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .tech-tag { padding: 2px 10px; background: ${accent}22; border-radius: 9999px; font-size: .72rem; color: ${accent}; font-weight: 500; }
      .project-link { font-size: .8rem; color: ${accent}; }
      
      .edu-item { display: flex; gap: 20px; margin-bottom: 20px; }
      .edu-dot { width: 10px; height: 10px; border-radius: 50%; background: ${accent}; margin-top: 6px; flex-shrink: 0; }
      .edu-name { font-weight: 600; margin-bottom: 2px; }
      .edu-degree { font-size: .875rem; color: ${muted}; }
      .edu-dates { font-size: .78rem; color: ${muted}; margin-top: 2px; }
      
      .social-links { display: flex; flex-wrap: wrap; gap: 12px; }
      .social-links a {
        padding: 8px 18px; border: 1.5px solid ${border}; border-radius: 9999px;
        font-size: .85rem; font-weight: 500; color: ${ink}; transition: all .2s;
      }
      .social-links a:hover { background: ${accent}; border-color: ${accent}; color: white; text-decoration: none; }
      
      .footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid ${border}; text-align: center; font-size: .75rem; color: ${muted}; }
    `;

    const projectsHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-title">${esc(p.title)}</div>
        <div class="project-desc">${esc(p.description)}</div>
        <div class="project-footer">
          <div class="tech-tags">${(p.tech || '').split(',').filter(Boolean).map(t =>
            `<span class="tech-tag">${esc(t.trim())}</span>`).join('')}</div>
          ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank">View Project -></a>` : ''}
        </div>
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="edu-item">
        <div class="edu-dot"></div>
        <div>
          <div class="edu-name">${esc(e.institution)}</div>
          <div class="edu-degree">${esc(e.degree)} ${e.field ? `in ${esc(e.field)}` : ''}</div>
          <div class="edu-dates">${esc(e.from || '')}${e.to ? ` - ${e.current ? 'Present' : esc(e.to)}` : ''}</div>
        </div>
      </div>`).join('');

    const contactLine = [
      contact.email && `<span>${esc(contact.email)}</span>`,
      contact.phone && `<span>${esc(contact.phone)}</span>`,
      contact.location && `<span>${esc(contact.location)}</span>`
    ].filter(Boolean).join('');

    const body = `
    <div id="portfolioPreview" class="layout-${layoutClass}">
    <div class="container">
      <header class="header">
        ${theme.showPhoto ? `
        <div class="avatar">
          ${personal.avatar
            ? `<img src="${esc(personal.avatar)}" alt="${esc(personal.name)}" onerror="this.style.display='none'" />`
            : initials(personal.name)}
        </div>` : ''}
        <div class="header-text">
          <h1>${esc(personal.name) || 'Your Name'}</h1>
          <div class="role">${esc(personal.title) || 'Your Title'}</div>
          <div class="contact-line">${contactLine}</div>
        </div>
      </header>

      ${personal.bio ? `<section class="content-section section-about">
        <div class="section-title">About</div>
        <p class="bio">${esc(personal.bio)}</p>
      </section>` : ''}

      ${theme.showSkills && skills.length ? `<section class="content-section section-skills">
        <div class="section-title">Skills</div>
        <div class="skills-wrap">${skillsHTML(skills)}</div>
      </section>` : ''}

      ${projects.length ? `<section class="content-section section-projects">
        <div class="section-title">Projects</div>
        ${projectsHTML}
      </section>` : ''}

      ${education.length ? `<section class="content-section section-education">
        <div class="section-title">Education</div>
        ${eduHTML}
      </section>` : ''}

      <section class="content-section section-connect">
        <div class="section-title">Connect</div>
        <div class="social-links">
          ${contact.email ? `<a href="mailto:${esc(contact.email)}">Email</a>` : ''}
          ${contact.github ? `<a href="${esc(contact.github)}" target="_blank">GitHub</a>` : ''}
          ${contact.linkedin ? `<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>` : ''}
          ${contact.twitter ? `<a href="${esc(contact.twitter)}" target="_blank">Twitter</a>` : ''}
          ${contact.website ? `<a href="${esc(contact.website)}" target="_blank">Website</a>` : ''}
        </div>
      </section>

      <div class="footer">Built with PortfolioForge | ${new Date().getFullYear()}</div>
    </div>
    </div>`;

    return buildDocument(body, css, personal.name, FONT_IMPORTS[font]);
  }
  function renderSidebarPro(d, theme) {
    const { personal, skills, projects, education, contact } = d;
    const accent = theme.accent;
    const font = theme.font || 'DM Sans';
    const dark = theme.darkMode;
    const sidebarBg = dark ? '#0f0f0f' : '#1e293b';
    const mainBg = dark ? '#1a1a1a' : '#ffffff';
    const sideInk = 'rgba(255,255,255,.9)';
    const sideMuted = 'rgba(255,255,255,.55)';
    const mainInk = dark ? '#f0f0f0' : '#1e293b';
    const mainMuted = dark ? '#999' : '#64748b';
    const border = dark ? '#2a2a2a' : '#e2e8f0';
    const cardBg = dark ? '#242424' : '#f8fafc';

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: '${font}', sans-serif; background: ${mainBg}; color: ${mainInk}; display: flex; min-height: 100vh; }
      a { color: ${accent}; text-decoration: none; }
      
      .sidebar {
        width: 280px; min-height: 100vh; background: ${sidebarBg}; color: ${sideInk};
        padding: 40px 28px; display: flex; flex-direction: column; flex-shrink: 0;
      }
      .avatar {
        width: 90px; height: 90px; border-radius: 50%; overflow: hidden; margin-bottom: 20px;
        background: ${accent}; display: flex; align-items: center; justify-content: center;
        color: white; font-size: 1.8rem; font-weight: 700; border: 3px solid rgba(255,255,255,.15);
      }
      .avatar img { width: 100%; height: 100%; object-fit: cover; }
      .s-name { font-size: 1.35rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2; }
      .s-role { font-size: .85rem; color: ${sideMuted}; margin-bottom: 28px; }
      .s-section-title {
        font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; margin-bottom: 12px; margin-top: 28px;
      }
      .s-section-title:first-of-type { margin-top: 0; }
      .s-contact-item { display: flex; align-items: center; gap: 8px; font-size: .82rem; color: ${sideMuted}; margin-bottom: 8px; }
      .s-contact-item a { color: ${sideMuted}; transition: color .2s; }
      .s-contact-item a:hover { color: ${sideInk}; }
      .skill-chip { display: inline-block; padding: 4px 12px; margin: 3px 2px; background: rgba(255,255,255,.08); border-radius: 9999px; font-size: .78rem; }
      .skills-wrap { display: flex; flex-wrap: wrap; }
      
      .main { flex: 1; padding: 48px 44px; }
      section { margin-bottom: 40px; }
      .section-title {
        font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; border-bottom: 2px solid ${accent}22; padding-bottom: 8px; margin-bottom: 20px;
      }
      .bio { color: ${mainMuted}; line-height: 1.8; font-size: .95rem; }
      
      .projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .project-card {
        padding: 20px; background: ${cardBg}; border-radius: 10px; border: 1px solid ${border};
      }
      .project-title { font-weight: 600; font-size: .95rem; margin-bottom: 6px; }
      .project-desc { font-size: .82rem; color: ${mainMuted}; margin-bottom: 12px; line-height: 1.5; }
      .tech-tags { display: flex; flex-wrap: wrap; gap: 4px; }
      .tech-tag { padding: 2px 8px; background: ${accent}18; border-radius: 9999px; font-size: .7rem; color: ${accent}; }
      .project-link { font-size: .78rem; color: ${accent}; margin-top: 8px; display: block; }
      
      .edu-item { margin-bottom: 20px; padding-left: 16px; border-left: 2px solid ${accent}; }
      .edu-name { font-weight: 600; font-size: .95rem; }
      .edu-degree { font-size: .85rem; color: ${mainMuted}; }
      .edu-dates { font-size: .75rem; color: ${mainMuted}; margin-top: 2px; }
    `;

    const projectsHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-title">${esc(p.title)}</div>
        <div class="project-desc">${esc(p.description)}</div>
        <div class="tech-tags">${(p.tech || '').split(',').filter(Boolean).map(t =>
          `<span class="tech-tag">${esc(t.trim())}</span>`).join('')}</div>
        ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank">View -></a>` : ''}
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="edu-item">
        <div class="edu-name">${esc(e.institution)}</div>
        <div class="edu-degree">${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}</div>
        <div class="edu-dates">${esc(e.from || '')}${e.to ? ` - ${e.current ? 'Present' : esc(e.to)}` : ''}</div>
      </div>`).join('');

    const body = `
    <div class="sidebar">
      ${theme.showPhoto ? `
      <div class="avatar">
        ${personal.avatar
          ? `<img src="${esc(personal.avatar)}" alt="${esc(personal.name)}" onerror="this.style.display='none'"/>`
          : initials(personal.name)}
      </div>` : ''}
      <div class="s-name">${esc(personal.name) || 'Your Name'}</div>
      <div class="s-role">${esc(personal.title) || 'Your Title'}</div>
      <div class="s-section-title">Contact</div>
      ${contact.email ? `<div class="s-contact-item">Email: <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div>` : ''}
      ${contact.phone ? `<div class="s-contact-item">Phone: ${esc(contact.phone)}</div>` : ''}
      ${contact.location ? `<div class="s-contact-item">Location: ${esc(contact.location)}</div>` : ''}
      ${contact.github ? `<div class="s-contact-item">GitHub: <a href="${esc(contact.github)}" target="_blank">GitHub</a></div>` : ''}
      ${contact.linkedin ? `<div class="s-contact-item">in <a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a></div>` : ''}
      ${contact.website ? `<div class="s-contact-item">Website: <a href="${esc(contact.website)}" target="_blank">Website</a></div>` : ''}
      ${theme.showSkills && skills.length ? `
      <div class="s-section-title">Skills</div>
      <div class="skills-wrap">${skillsHTML(skills)}</div>` : ''}
    </div>
    <div class="main">
      ${personal.bio ? `<section>
        <div class="section-title">About Me</div>
        <p class="bio">${esc(personal.bio)}</p>
      </section>` : ''}
      ${projects.length ? `<section>
        <div class="section-title">Projects</div>
        <div class="projects-grid">${projectsHTML}</div>
      </section>` : ''}
      ${education.length ? `<section>
        <div class="section-title">Education</div>
        ${eduHTML}
      </section>` : ''}
    </div>`;

    return buildDocument(body, css, personal.name, FONT_IMPORTS[font]);
  }
  function renderTerminal(d, theme) {
    const { personal, skills, projects, education, contact } = d;
    const accent = theme.accent === '#5b4cf5' ? '#7ee787' : theme.accent;
    const font = 'JetBrains Mono';
    const bg = '#0d1117'; const ink = '#e6edf3'; const muted = '#8b949e';
    const green = '#7ee787'; const blue = '#58a6ff'; const red = '#ff7b72';

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'JetBrains Mono', monospace; background: ${bg}; color: ${ink}; min-height: 100vh; }
      a { color: ${blue}; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .container { max-width: 860px; margin: 0 auto; padding: 40px 24px; }
      
      .window-bar {
        background: #161b22; border: 1px solid #30363d; border-bottom: none;
        border-radius: 10px 10px 0 0; padding: 12px 16px; display: flex; align-items: center; gap: 8px;
      }
      .dot { width: 12px; height: 12px; border-radius: 50%; }
      .dot-red { background: ${red}; } .dot-yellow { background: #f0b429; } .dot-green { background: ${green}; }
      .window-title { flex: 1; text-align: center; font-size: .75rem; color: ${muted}; }
      .terminal-body {
        background: #161b22; border: 1px solid #30363d; border-top: none;
        border-radius: 0 0 10px 10px; padding: 28px 32px;
      }
      
      .prompt { display: flex; gap: 10px; margin-bottom: 4px; font-size: .875rem; }
      .p-user { color: ${green}; } .p-sep { color: ${muted}; } .p-cmd { color: ${ink}; }
      .p-path { color: ${blue}; }
      .output { padding-left: 0; margin-bottom: 20px; }
      
      .comment { color: ${muted}; font-size: .78rem; margin-bottom: 16px; }
      
      .ascii-name {
        color: ${accent}; font-size: 1.1rem; font-weight: 700; letter-spacing: .05em;
        border: 1px solid ${accent}44; padding: 12px 20px; display: inline-block;
        border-radius: 4px; margin-bottom: 8px;
      }
      .role-line { color: ${muted}; font-size: .85rem; margin-bottom: 16px; }
      
      .skill-chip { color: ${green}; margin-right: 6px; font-size: .82rem; }
      
      .s-header { color: ${blue}; font-size: .85rem; font-weight: 700; margin-bottom: 12px; }
      
      .project-block { border-left: 2px solid ${accent}; padding: 12px 16px; margin-bottom: 16px; background: #0d1117; border-radius: 0 6px 6px 0; }
      .proj-title { color: ${ink}; font-weight: 700; margin-bottom: 4px; font-size: .9rem; }
      .proj-desc { color: ${muted}; font-size: .8rem; margin-bottom: 8px; line-height: 1.6; }
      .proj-meta { font-size: .75rem; }
      .proj-tech { color: ${accent}; } .proj-link { color: ${blue}; margin-left: 12px; }
      
      .edu-block { margin-bottom: 12px; }
      .edu-inst { color: ${ink}; font-weight: 600; font-size: .87rem; }
      .edu-deg { color: ${muted}; font-size: .8rem; }
      .edu-dates { color: ${accent}; font-size: .75rem; }
      
      .contact-row { display: flex; align-items: center; gap: 12px; font-size: .82rem; color: ${muted}; margin-bottom: 6px; }
      .c-key { color: ${blue}; min-width: 90px; } .c-eq { color: ${muted}; } .c-val { color: ${green}; }
      
      .cursor { display: inline-block; width: 8px; height: 1em; background: ${ink}; animation: blink 1s step-end infinite; vertical-align: text-bottom; }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      .footer-prompt { margin-top: 24px; }
    `;

    const projectsHTML = projects.map(p => `
      <div class="project-block">
        <div class="proj-title"># ${esc(p.title)}</div>
        <div class="proj-desc">${esc(p.description)}</div>
        <div class="proj-meta">
          <span class="proj-tech">[${esc(p.tech || 'N/A')}]</span>
          ${p.link ? `<a class="proj-link" href="${esc(p.link)}" target="_blank">${esc(p.link)}</a>` : ''}
        </div>
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="edu-block">
        <div class="edu-inst">${esc(e.institution)}</div>
        <div class="edu-deg">${esc(e.degree)}${e.field ? ` // ${esc(e.field)}` : ''}</div>
        <div class="edu-dates">${esc(e.from || '')}${e.to ? ` -> ${e.current ? 'now' : esc(e.to)}` : ''}</div>
      </div>`).join('');

    const body = `
    <div class="container">
      <div class="window-bar">
        <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
        <div class="window-title">portfolio.sh - bash - 120x40</div>
      </div>
      <div class="terminal-body">
        <div class="comment">## ${esc(personal.name || 'developer')}'s portfolio - ${new Date().getFullYear()}</div>

        <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="p-cmd">cat about.txt</span></div>
        <div class="output">
          <div class="ascii-name">${esc(personal.name) || 'Your Name'}</div>
          <div class="role-line">// ${esc(personal.title) || 'Developer'}</div>
          ${personal.bio ? `<div style="color:#c9d1d9;font-size:.85rem;line-height:1.7;max-width:600px">${esc(personal.bio)}</div>` : ''}
        </div>

        ${theme.showSkills && skills.length ? `
        <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="p-cmd">ls skills/</span></div>
        <div class="output">${skills.map(s => `<span class="skill-chip">${esc(s)}/</span>`).join('')}</div>` : ''}

        ${projects.length ? `
        <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="p-cmd">ls -la projects/</span></div>
        <div class="output">${projectsHTML}</div>` : ''}

        ${education.length ? `
        <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="p-cmd">cat education.json</span></div>
        <div class="output">${eduHTML}</div>` : ''}

        <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="p-cmd">env | grep CONTACT</span></div>
        <div class="output">
          ${contact.email ? `<div class="contact-row"><span class="c-key">EMAIL</span><span class="c-eq">=</span><a class="c-val" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div>` : ''}
          ${contact.github ? `<div class="contact-row"><span class="c-key">GITHUB</span><span class="c-eq">=</span><a class="c-val" href="${esc(contact.github)}" target="_blank">${esc(contact.github)}</a></div>` : ''}
          ${contact.linkedin ? `<div class="contact-row"><span class="c-key">LINKEDIN</span><span class="c-eq">=</span><a class="c-val" href="${esc(contact.linkedin)}" target="_blank">${esc(contact.linkedin)}</a></div>` : ''}
          ${contact.location ? `<div class="contact-row"><span class="c-key">LOCATION</span><span class="c-eq">=</span><span class="c-val">${esc(contact.location)}</span></div>` : ''}
        </div>

        <div class="footer-prompt">
          <div class="prompt"><span class="p-user">visitor</span><span class="p-sep">@</span><span class="p-path">portfolio</span><span class="p-sep">:~$</span><span class="cursor"></span></div>
        </div>
      </div>
    </div>`;

    return buildDocument(body, css, personal.name, FONT_IMPORTS['JetBrains Mono']);
  }
  function renderGlassmorphic(d, theme) {
    const { personal, skills, projects, education, contact } = d;
    const accent = theme.accent;
    const font = theme.font || 'Poppins';

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: '${font}', sans-serif; min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        background-attachment: fixed; color: white; }
      a { color: rgba(255,255,255,.9); text-decoration: none; }
      .container { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
      .glass {
        background: rgba(255,255,255,.12); backdrop-filter: blur(20px) saturate(1.4);
        border: 1px solid rgba(255,255,255,.25); border-radius: 20px; padding: 32px;
        margin-bottom: 24px; box-shadow: 0 8px 32px rgba(0,0,0,.2);
      }
      .header { display: flex; align-items: center; gap: 28px; }
      .avatar {
        width: 96px; height: 96px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
        background: rgba(255,255,255,.2); display: flex; align-items: center; justify-content: center;
        font-size: 2rem; font-weight: 700; border: 3px solid rgba(255,255,255,.4);
      }
      .avatar img { width: 100%; height: 100%; object-fit: cover; }
      h1 { font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
      .role { font-size: 1rem; opacity: .8; margin-bottom: 8px; }
      .contact-line { font-size: .8rem; opacity: .7; }
      .section-title {
        font-size: .7rem; text-transform: uppercase; letter-spacing: .14em; font-weight: 700;
        opacity: .7; border-bottom: 1px solid rgba(255,255,255,.2); padding-bottom: 8px; margin-bottom: 16px;
      }
      .bio { opacity: .85; line-height: 1.8; font-size: .92rem; }
      .skill-chip {
        display: inline-block; padding: 5px 14px; margin: 3px; background: rgba(255,255,255,.15);
        border-radius: 9999px; font-size: .78rem; border: 1px solid rgba(255,255,255,.25);
      }
      .skills-wrap { display: flex; flex-wrap: wrap; }
      .project-card { background: rgba(255,255,255,.08); border-radius: 12px; padding: 18px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,.15); }
      .project-title { font-weight: 600; margin-bottom: 6px; }
      .project-desc { font-size: .85rem; opacity: .75; margin-bottom: 10px; line-height: 1.5; }
      .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
      .tech-tag { padding: 2px 10px; background: rgba(255,255,255,.2); border-radius: 9999px; font-size: .7rem; }
      .project-link { font-size: .8rem; margin-top: 8px; display: block; opacity: .8; }
      .edu-item { margin-bottom: 14px; padding-left: 14px; border-left: 2px solid rgba(255,255,255,.3); }
      .edu-name { font-weight: 600; }
      .edu-degree, .edu-dates { font-size: .82rem; opacity: .7; }
      .social-links { display: flex; gap: 12px; flex-wrap: wrap; }
      .social-links a {
        padding: 8px 18px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
        border-radius: 9999px; font-size: .82rem; font-weight: 500; transition: all .2s;
      }
      .social-links a:hover { background: rgba(255,255,255,.3); }
    `;

    const projectsHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-title">${esc(p.title)}</div>
        <div class="project-desc">${esc(p.description)}</div>
        <div class="tech-tags">${(p.tech||'').split(',').filter(Boolean).map(t=>`<span class="tech-tag">${esc(t.trim())}</span>`).join('')}</div>
        ${p.link?`<a class="project-link" href="${esc(p.link)}" target="_blank">-> ${esc(p.link)}</a>`:''}
      </div>`).join('');

    const eduHTML = education.map(e=>`
      <div class="edu-item">
        <div class="edu-name">${esc(e.institution)}</div>
        <div class="edu-degree">${esc(e.degree)}${e.field?`, ${esc(e.field)}`:''}</div>
        <div class="edu-dates">${esc(e.from||'')}${e.to?` - ${e.current?'Present':esc(e.to)}`:''}</div>
      </div>`).join('');

    const body = `
    <div class="container">
      <div class="glass header">
        ${theme.showPhoto?`<div class="avatar">${personal.avatar?`<img src="${esc(personal.avatar)}" onerror="this.style.display='none'"/>`:initials(personal.name)}</div>`:``}
        <div>
          <h1>${esc(personal.name)||'Your Name'}</h1>
          <div class="role">${esc(personal.title)||'Your Title'}</div>
          <div class="contact-line">${[contact.email,contact.phone,contact.location].filter(Boolean).map(esc).join(' | ')}</div>
        </div>
      </div>
      ${personal.bio?`<div class="glass"><div class="section-title">About</div><p class="bio">${esc(personal.bio)}</p></div>`:``}
      ${theme.showSkills&&skills.length?`<div class="glass"><div class="section-title">Skills</div><div class="skills-wrap">${skillsHTML(skills)}</div></div>`:``}
      ${projects.length?`<div class="glass"><div class="section-title">Projects</div>${projectsHTML}</div>`:``}
      ${education.length?`<div class="glass"><div class="section-title">Education</div>${eduHTML}</div>`:``}
      <div class="glass">
        <div class="section-title">Connect</div>
        <div class="social-links">
          ${contact.email?`<a href="mailto:${esc(contact.email)}">Email</a>`:''}
          ${contact.github?`<a href="${esc(contact.github)}" target="_blank">GitHub</a>`:''}
          ${contact.linkedin?`<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>`:''}
          ${contact.website?`<a href="${esc(contact.website)}" target="_blank">Website</a>`:''}
        </div>
      </div>
    </div>`;

    return buildDocument(body, css, personal.name, FONT_IMPORTS[font]);
  }
  function renderResumeBlueprint(d) {
    const { personal, skills, projects, education, contact } = d;
    const layoutClass = toLayoutClass(d?.theme?.layout);
    const safeSkills = Array.isArray(skills) ? skills.map(s => String(s || '').trim()).filter(Boolean) : [];
    const safeProjects = Array.isArray(projects) ? projects.filter(Boolean) : [];
    const safeEducation = Array.isArray(education) ? education.filter(Boolean) : [];

    const css = `
      :root {
        --accent: #2563eb;
        --ink: #1a1a1a;
        --title: #0f172a;
        --body: #374151;
        --muted: #6b7280;
        --line: #e5e7eb;
      }
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: #ffffff;
        color: var(--ink);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        line-height: 1.7;
      }
      a { color: #2563eb; text-decoration: none; }
      .cv-wrapper {
        width: 100%;
        max-width: 860px;
        margin: 0 auto;
        padding: 40px 48px;
        background: #ffffff;
      }
      .cv-wrapper.layout-single { display: block; }
      .cv-wrapper.layout-two-column {
        display: grid;
        grid-template-columns: minmax(220px, 30%) minmax(0, 70%);
        gap: 20px 28px;
        max-width: 980px;
      }
      .cv-wrapper.layout-two-column .header,
      .cv-wrapper.layout-two-column .footer {
        grid-column: 1 / -1;
      }
      .cv-wrapper.layout-two-column .section:nth-of-type(1),
      .cv-wrapper.layout-two-column .section:nth-of-type(2) {
        grid-column: 1;
      }
      .cv-wrapper.layout-two-column .section:nth-of-type(3),
      .cv-wrapper.layout-two-column .section:nth-of-type(4) {
        grid-column: 2;
      }
      .cv-wrapper.layout-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        max-width: 980px;
      }
      .cv-wrapper.layout-grid .header,
      .cv-wrapper.layout-grid .footer {
        grid-column: 1 / -1;
      }
      .cv-wrapper.layout-grid .section {
        margin-top: 0;
        padding: 16px;
        border: 1px solid #e5e7eb;
      }
      .header {
        border-bottom: 1px solid var(--line);
        padding-bottom: 18px;
      }
      .name {
        margin: 0;
        font-size: 36px;
        line-height: 1.15;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.5px;
      }
      .job-title {
        margin: 4px 0 0;
        font-size: 16px;
        font-weight: 400;
        color: #475569;
      }
      .contact-row {
        margin-top: 10px;
        font-size: 12px;
        color: #6b7280;
        line-height: 1.5;
      }
      .contact-row a { color: #6b7280; }
      .section {
        margin-top: 20px;
        padding-top: 18px;
        border-top: 1px solid #eef2f7;
      }
      .section:first-of-type {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
      }
      .section-title {
        margin: 0 0 14px;
        padding-bottom: 6px;
        border-bottom: 2px solid #2563eb;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #2563eb;
      }
      .summary {
        margin: 0;
        font-size: 14px;
        line-height: 1.8;
        color: #374151;
        white-space: pre-line;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .skills-line {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: #374151;
      }
      .project-item { margin-bottom: 14px; }
      .project-item:last-child { margin-bottom: 0; }
      .project-head,
      .education-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 12px;
      }
      .project-name {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
      }
      .project-tech {
        font-size: 11px;
        font-weight: 500;
        color: #2563eb;
        text-align: right;
        white-space: nowrap;
      }
      .project-desc {
        margin: 3px 0 0;
        font-size: 14px;
        line-height: 1.7;
        color: #4b5563;
        white-space: pre-line;
      }
      .project-link {
        display: inline-block;
        margin-top: 3px;
        font-size: 11px;
        color: #2563eb;
      }
      .education-item { margin-bottom: 12px; }
      .education-item:last-child { margin-bottom: 0; }
      .institution {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
      }
      .date {
        font-size: 12px;
        color: #6b7280;
        font-style: normal;
        text-align: right;
        white-space: nowrap;
      }
      .degree-field {
        margin: 2px 0 0;
        font-size: 14px;
        line-height: 1.6;
        color: #4b5563;
      }
      .footer {
        margin-top: 40px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 10px;
        color: #9ca3af;
      }

      @media print {
        @page { size: A4; margin: 16mm; }
        body { margin: 0; padding: 0; }
        .cv-wrapper { padding: 24px 30px; max-width: 100%; }
        a { color: #2563eb; text-decoration: none; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }

      @media (max-width: 768px) {
        .cv-wrapper {
          max-width: 100%;
          padding: 28px 22px;
        }
        .cv-wrapper.layout-two-column,
        .cv-wrapper.layout-grid {
          display: block;
          max-width: 100%;
        }
        .cv-wrapper.layout-grid .section {
          margin-top: 20px;
          padding: 18px 0 0;
          border: none;
        }
        .name { font-size: 30px; }
        .project-tech,
        .date {
          width: 100%;
          text-align: left;
        }
      }
    `;

    const nonEmpty = (v) => !!String(v || '').trim();
    const normalizeLink = (v) => {
      const raw = String(v || '').trim();
      if (!raw) return '';
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    };
    const renderSection = (title, html) => html ? `<section class="section"><h2 class="section-title">${esc(title)}</h2>${html}</section>` : '';

    const contactParts = [];
    if (nonEmpty(contact.email)) contactParts.push(`<span>${esc(contact.email)}</span>`);
    if (nonEmpty(contact.phone)) contactParts.push(`<span>${esc(contact.phone)}</span>`);
    if (nonEmpty(contact.location)) contactParts.push(`<span>${esc(contact.location)}</span>`);
    if (nonEmpty(contact.github)) {
      const href = normalizeLink(contact.github);
      contactParts.push(`<a href="${esc(href)}" target="_blank">${esc(contact.github)}</a>`);
    }
    if (nonEmpty(contact.linkedin)) {
      const href = normalizeLink(contact.linkedin);
      contactParts.push(`<a href="${esc(href)}" target="_blank">${esc(contact.linkedin)}</a>`);
    }

    const header = `
      <header class="header">
        ${nonEmpty(personal.name) ? `<h1 class="name">${esc(personal.name)}</h1>` : ''}
        ${nonEmpty(personal.title) ? `<p class="job-title">${esc(personal.title)}</p>` : ''}
        ${contactParts.length ? `<div class="contact-row">${contactParts.join(' | ')}</div>` : ''}
      </header>`;

    const summary = renderSection(
      'PROFESSIONAL SUMMARY',
      nonEmpty(personal.bio) ? `<p class="summary">${esc(personal.bio)}</p>` : ''
    );

    const skillsSection = renderSection(
      'TECHNICAL SKILLS',
      safeSkills.length ? `<p class="skills-line">${safeSkills.map(esc).join(', ')}</p>` : ''
    );

    const workItems = safeProjects.map(p => {
      const title = p.title || '';
      const tech = p.tech || '';
      const desc = p.description || '';
      const linkText = p.link || '';
      const href = normalizeLink(linkText);

      if (![title, tech, desc, linkText].some(nonEmpty)) return '';

      return `
        <article class="project-item">
          <div class="project-head">
            <h3 class="project-name">${esc(title)}</h3>
            ${nonEmpty(tech) ? `<div class="project-tech">${esc(tech)}</div>` : ''}
          </div>
          ${nonEmpty(desc) ? `<p class="project-desc">${esc(desc)}</p>` : ''}
          ${nonEmpty(linkText) ? `<a class="project-link" href="${esc(href)}" target="_blank">${esc(linkText)}</a>` : ''}
        </article>`;
    }).filter(Boolean).join('');

    const workSection = renderSection('PROJECTS', workItems);

    const eduItems = safeEducation.map(e => {
      const degree = e.degree || '';
      const field = e.field || '';
      const institution = e.institution || '';
      const duration = [e.from, e.to ? (e.current ? 'Present' : e.to) : ''].filter(nonEmpty).join(' - ');

      if (![degree, field, institution, duration].some(nonEmpty)) return '';

      return `
        <article class="education-item">
          <div class="education-head">
            <h3 class="institution">${esc(institution)}</h3>
            ${nonEmpty(duration) ? `<div class="date">${esc(duration)}</div>` : ''}
          </div>
          ${nonEmpty(degree) || nonEmpty(field) ? `<p class="degree-field">${esc([degree, field].filter(nonEmpty).join(' | '))}</p>` : ''}
        </article>`;
    }).filter(Boolean).join('');

    const educationSection = renderSection('EDUCATION', eduItems);

    const body = `
      <main id="portfolioPreview" class="cv-wrapper layout-${layoutClass}">
        ${header}
        ${summary}
        ${skillsSection}
        ${workSection}
        ${educationSection}
        <footer class="footer">Generated by PortfolioForge | 2026</footer>
      </main>`;

    return buildDocument(body, css, personal.name || 'Resume', FONT_IMPORTS['Inter']);
  }

  // ─── renderTemp1 ─────────────────────────────────────────────────────────────
  // Futuristic Portfolio (Inter / Poppins)
  function renderTemp1(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const e = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const accent = (theme && theme.accent) ? theme.accent : '#00d2ff';

    const skillsHTML = safeSkills.map(s => `
      <div class="skill-item">
        <div class="skill-info">
          <span>${e(s)}</span>
          <span class="skill-percentage">90%</span>
        </div>
        <div class="progress-line" data-percent="90%"><span style="width: 0;"></span></div>
      </div>`).join('');

    const projectsHTML = safeProjects.map(p => `
      <div class="project-card glass reveal">
        <div class="project-img">
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" alt="${e(p.title)}">
          <div class="project-overlay">
            ${p.link ? `<a href="${norm(p.link)}" target="_blank" class="view-btn"><i class="fas fa-external-link-alt"></i></a>` : ''}
          </div>
        </div>
        <div class="project-content">
          <span class="project-tag">${e((p.tech || '').split(',')[0] || 'Project')}</span>
          <h3>${e(p.title)}</h3>
          <p>${e(p.description)}</p>
        </div>
      </div>`).join('');

    const educationHTML = safeEducation.map(edu => `
      <div class="timeline-item ${Math.random() > 0.5 ? 'left' : 'right'} reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-content glass">
          <span class="date">${e(edu.from)} - ${edu.current ? 'Present' : e(edu.to)}</span>
          <h3>${e(edu.degree)}</h3>
          <p>${e(edu.institution)}</p>
          <p>${e(edu.field)}</p>
        </div>
      </div>`).join('');

    const css = `
      :root {
        --primary-color: ${accent};
        --secondary-color: #3a7bd5;
        --accent-color: #00f2fe;
        --bg-dark: #050510;
        --navy-dark: #0a0a20;
        --text-main: #e0e0e0;
        --text-dim: #a0a0c0;
        --glass-bg: rgba(255, 255, 255, 0.03);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glow-shadow: 0 0 20px ${accent}44;
        --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        --font-heading: 'Poppins', sans-serif;
        --font-body: 'Inter', sans-serif;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background-color: var(--bg-dark); color: var(--text-main); font-family: var(--font-body); line-height: 1.6; overflow-x: hidden; }
      a { text-decoration: none; color: inherit; transition: var(--transition); }
      ul { list-style: none; }
      section { padding: 100px 0; position: relative; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .background-glare { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 10% 20%, ${accent}11 0%, transparent 40%), radial-gradient(circle at 90% 80%, #3a7bd511 0%, transparent 40%); pointer-events: none; z-index: -1; }
      #particles-js { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; }
      .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
      .reveal.active { opacity: 1; transform: translateY(0); }
      h1, h2, h3, h4 { font-family: var(--font-heading); font-weight: 700; }
      .section-header { text-align: center; margin-bottom: 60px; }
      .section-title { font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px; }
      .section-title span { color: var(--primary-color); }
      .underline { width: 60px; height: 4px; background: linear-gradient(90deg, var(--primary-color), transparent); margin: 10px auto 0; border-radius: 2px; }
      .btn { display: inline-block; padding: 12px 30px; border-radius: 50px; font-weight: 600; cursor: pointer; font-family: var(--font-heading); border: none; text-align: center; }
      .btn-primary { background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: #fff; box-shadow: var(--glow-shadow); }
      .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 25px ${accent}66; }
      .btn-secondary { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); }
      .btn-secondary:hover { background: var(--primary-color); color: #fff; transform: translateY(-3px); }
      .navbar { position: fixed; top: 0; left: 0; width: 100%; padding: 20px 0; z-index: 1000; transition: var(--transition); }
      .navbar.sticky { padding: 12px 0; background: rgba(5, 5, 16, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid var(--glass-border); }
      .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 40px; }
      .nav-logo { font-size: 1.8rem; font-weight: 800; color: #fff; font-family: var(--font-heading); letter-spacing: 1px; }
      .nav-logo span { color: var(--primary-color); }
      .nav-links { display: flex; gap: 30px; }
      .nav-item { font-weight: 500; color: var(--text-dim); position: relative; padding: 5px 0; }
      .nav-item:hover, .nav-item.active { color: #fff; }
      .nav-item::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--primary-color); transition: var(--transition); }
      .nav-item:hover::after, .nav-item.active::after { width: 100%; }
      .hero { height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 0 8%; }
      .hero-content { flex: 1; z-index: 10; }
      .hero-subtitle { color: var(--primary-color); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 15px; }
      .hero-name { font-size: 5rem; line-height: 1.1; margin-bottom: 20px; }
      .hero-name span { color: var(--primary-color); }
      .hero-typing { font-size: 2rem; color: var(--text-dim); margin-bottom: 30px; font-weight: 400; }
      #typing-text { color: #fff; font-weight: 700; border-right: 3px solid var(--primary-color); padding-right: 5px; animation: blink 0.7s infinite; }
      @keyframes blink { 50% { border-color: transparent; } }
      .hero-description { max-width: 500px; margin-bottom: 40px; color: var(--text-dim); font-size: 1.1rem; }
      .hero-btns { display: flex; gap: 20px; margin-bottom: 40px; }
      .social-icons { display: flex; gap: 20px; }
      .social-icons a { width: 45px; height: 45px; border-radius: 50%; background: var(--glass-bg); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--text-dim); }
      .social-icons a:hover { background: var(--primary-color); color: #fff; transform: translateY(-5px); box-shadow: var(--glow-shadow); }
      .hero-visual { flex: 1; display: flex; justify-content: center; align-items: center; position: relative; }
      .floating-sphere { width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, var(--primary-color), var(--secondary-color)); filter: blur(80px); opacity: 0.3; animation: float 6s ease-in-out infinite; }
      .glass-card-hero { position: absolute; width: 250px; height: 150px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(15px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); transform: perspective(1000px) rotateY(-15deg) rotateX(10deg); }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      .about-wrapper { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
      .img-box { position: relative; padding: 20px; }
      .img-box img { width: 100%; border-radius: 20px; filter: grayscale(20%); z-index: 2; position: relative; }
      .img-border { position: absolute; top: 40px; left: 40px; width: 100%; height: 100%; border: 3px solid var(--primary-color); border-radius: 20px; z-index: 1; }
      .about-text h3 { font-size: 2rem; margin-bottom: 20px; }
      .about-text h3 span { color: var(--primary-color); }
      .about-text p { color: var(--text-dim); margin-bottom: 20px; }
      .about-info { display: flex; gap: 40px; margin-bottom: 30px; }
      .info-label { color: var(--text-dim); font-size: 0.9rem; }
      .info-value { color: var(--primary-color); font-size: 1.5rem; font-weight: 700; }
      .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
      .skill-category h3 { margin-bottom: 25px; font-size: 1.5rem; color: var(--primary-color); }
      .skill-item { margin-bottom: 25px; }
      .skill-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .progress-line { width: 100%; height: 8px; background: var(--glass-bg); border-radius: 10px; position: relative; overflow: hidden; }
      .progress-line span { height: 100%; position: absolute; left: 0; top: 0; border-radius: 10px; background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); box-shadow: 0 0 10px var(--primary-color); transition: width 1.5s cubic-bezier(1, 0, 0, 1); }
      .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
      .glass { background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); transition: var(--transition); }
      .project-card { border-radius: 20px; overflow: hidden; position: relative; }
      .project-card:hover { transform: translateY(-10px); border-color: var(--primary-color); box-shadow: var(--glow-shadow); }
      .project-img { position: relative; height: 220px; overflow: hidden; }
      .project-img img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition); }
      .project-card:hover .project-img img { transform: scale(1.1); }
      .project-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5, 5, 16, 0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); }
      .project-card:hover .project-overlay { opacity: 1; }
      .view-btn { width: 50px; height: 50px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
      .project-content { padding: 25px; }
      .project-tag { color: var(--primary-color); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
      .project-content h3 { margin: 10px 0; }
      .project-content p { color: var(--text-dim); font-size: 0.95rem; }
      .timeline { position: relative; max-width: 1000px; margin: 0 auto; }
      .timeline::after { content: ''; position: absolute; width: 4px; background: var(--glass-border); top: 0; bottom: 0; left: 50%; margin-left: -2px; }
      .timeline-item { padding: 10px 40px; position: relative; width: 50%; }
      .timeline-item.left { left: 0; }
      .timeline-item.right { left: 50%; }
      .timeline-dot { position: absolute; width: 20px; height: 20px; right: -10px; background: var(--primary-color); border-radius: 50%; top: 15px; z-index: 5; box-shadow: var(--glow-shadow); }
      .timeline-item.right .timeline-dot { left: -10px; }
      .timeline-content { padding: 25px; border-radius: 15px; }
      .timeline-content .date { font-weight: 700; color: var(--primary-color); margin-bottom: 10px; display: block; }
      .contact-wrapper { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; }
      .contact-item { display: flex; gap: 20px; margin-bottom: 30px; }
      .contact-item i { width: 50px; height: 50px; background: var(--glass-bg); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 1.2rem; }
      .contact-form { padding: 40px; border-radius: 20px; }
      .input-group { position: relative; margin-bottom: 30px; }
      .input-group input, .input-group textarea { width: 100%; background: transparent; border: none; border-bottom: 2px solid var(--glass-border); padding: 10px 0; color: #fff; font-family: inherit; outline: none; }
      .input-group .bar { position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--primary-color); transition: 0.4s; }
      .input-group input:focus~.bar, .input-group textarea:focus~.bar { width: 100%; }
      footer { padding: 40px 0; border-top: 1px solid var(--glass-border); text-align: center; }
      @media (max-width: 991px) { .hero-name { font-size: 3.5rem; } .about-wrapper, .contact-wrapper, .skills-grid { grid-template-columns: 1fr; } .timeline::after { left: 31px; } .timeline-item { width: 100%; padding-left: 70px; padding-right: 25px; } .timeline-item.right { left: 0; } .timeline-dot { left: 21px !important; } }
    `;

    const script = `
      document.addEventListener('DOMContentLoaded', () => {
        const words = ${JSON.stringify(personal.title ? [personal.title] : ["Frontend Developer", "UI/UX Designer"])};
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        const typingText = document.getElementById('typing-text');
        function type() {
          const currentWord = words[wordIndex];
          const displayText = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
          if (typingText) typingText.textContent = displayText;
          if (!isDeleting && displayText === currentWord) { isDeleting = true; setTimeout(type, 2000); }
          else if (isDeleting && displayText === '') { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 500); }
          else { charIndex = isDeleting ? charIndex - 1 : charIndex + 1; setTimeout(type, isDeleting ? 50 : 100); }
        }
        type();
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              if (entry.target.classList.contains('skills-grid')) {
                entry.target.querySelectorAll('.progress-line span').forEach(line => {
                  line.style.width = line.parentElement.getAttribute('data-percent');
                });
              }
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal, .skills-grid').forEach(el => observer.observe(el));
      });
    `;

    const body = `
      <div class="background-glare"></div>
      <nav class="navbar" id="navbar">
        <div class="nav-container">
          <a href="#" class="nav-logo">Port<span>Edge</span></a>
          <ul class="nav-links">
            <li><a href="#home" class="nav-item active">Home</a></li>
            <li><a href="#about" class="nav-item">About</a></li>
            <li><a href="#projects" class="nav-item">Projects</a></li>
            <li><a href="#contact" class="nav-item">Contact</a></li>
          </ul>
        </div>
      </nav>
      <section class="hero" id="home">
        <div class="hero-content">
          <h5 class="hero-subtitle">Welcome to the future</h5>
          <h1 class="hero-name">${e(personal.name || 'PORTEDGE')}<span>.</span></h1>
          <h2 class="hero-typing">I'm a <span id="typing-text"></span></h2>
          <p class="hero-description">${e(personal.bio || 'Architecting premium digital experiences.')}</p>
          <div class="hero-btns"><a href="#projects" class="btn btn-primary">View Projects</a></div>
        </div>
        <div class="hero-visual"><div class="floating-sphere"></div><div class="glass-card-hero"><h3>Design & Code</h3></div></div>
      </section>
      <section class="about section" id="about">
        <div class="container">
          <div class="section-header reveal"><h2 class="section-title">About <span>Me</span></h2><div class="underline"></div></div>
          <div class="about-wrapper">
            <div class="about-img reveal"><div class="img-box"><img src="${e(personal.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600')}" alt="About"><div class="img-border"></div></div></div>
            <div class="about-text reveal"><h3>Creative Developer</h3><p>${e(personal.bio)}</p></div>
          </div>
        </div>
      </section>
      <section class="skills section" id="skills">
        <div class="container">
          <div class="section-header reveal"><h2 class="section-title">My <span>Skills</span></h2><div class="underline"></div></div>
          <div class="skills-grid reveal">${skillsHTML}</div>
        </div>
      </section>
      <section class="projects section" id="projects">
        <div class="container">
          <div class="section-header reveal"><h2 class="section-title">Recent <span>Projects</span></h2><div class="underline"></div></div>
          <div class="project-grid">${projectsHTML}</div>
        </div>
      </section>
      <section class="contact section" id="contact">
        <div class="container">
          <div class="section-header reveal"><h2 class="section-title">Get <span>In Touch</span></h2><div class="underline"></div></div>
          <div class="contact-wrapper">
             <div class="contact-info reveal">
               <div class="contact-item"><i class="fas fa-envelope"></i><div><h4>Email</h4><p>${e(contact.email)}</p></div></div>
             </div>
             <form class="contact-form glass reveal">
               <div class="input-group"><input type="text" placeholder="Name" required><span class="bar"></span></div>
               <button type="submit" class="btn btn-primary">Send Message</button>
             </form>
          </div>
        </div>
      </section>
      <footer><p>&copy; 2026 Port<span>Edge</span>. Futuristic Design.</p></footer>
      <script>${script}</script>`;

    return buildDocument(body, css, personal.name, 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
  }

  // ─── renderTemp2 ─────────────────────────────────────────────────────────────
  // Minimal Elegant Portfolio (Playfair Display / Montserrat)
  function renderTemp2(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const safeSkills    = Array.isArray(skills)    ? skills    : [];
    const safeProjects  = Array.isArray(projects)  ? projects  : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const accent = (theme && theme.accent) ? theme.accent : '#f7a072';
    const e = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const skillsHTML = safeSkills.slice(0,8).map((s,i) => {
      const pct = Math.max(70, 95 - i*5);
      return `<div class="skills-item">
        <div class="skills-header"><span class="skills-name">${e(s)}</span><span class="skills-percentage">${pct}%</span></div>
        <div class="skills-bar"><span class="skills-progress" style="width:0" data-width="${pct}%"></span></div>
      </div>`;
    }).join('');

    const projectsHTML = safeProjects.map(p => {
      const href = norm(p.link);
      const tags = (p.tech||'').split(',').filter(Boolean).map(t=>`<span>${e(t.trim())}</span>`).join('');
      return `<article class="project-card reveal">
        <div class="project-img-wrapper">
          <div style="width:100%;height:350px;background:linear-gradient(135deg,#f5f5f5,#e8e8e8);display:flex;align-items:center;justify-content:center;font-size:3rem;color:#ccc">&#128187;</div>
          <div class="project-overlay"><a href="${e(href||'#')}" target="_blank" class="project-btn">View Details</a></div>
        </div>
        <div class="project-info">
          <div class="project-tags">${tags||'<span>Project</span>'}</div>
          <h3 class="project-title">${e(p.title)}</h3>
          <p style="color:#636e72;font-size:.95rem;margin-top:8px">${e(p.description)}</p>
        </div>
      </article>`;
    }).join('');

    const timelineHTML = safeEducation.map(edu => {
      const dates = [edu.from, edu.to?(edu.current?'Present':edu.to):''].filter(Boolean).join(' - ');
      return `<div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <span class="timeline-date">${e(dates)}</span>
          <h3 class="timeline-title">${e(edu.degree||edu.institution)}</h3>
          <p class="timeline-company">${e(edu.institution)}</p>
          ${edu.field?`<p class="timeline-desc">${e(edu.field)}</p>`:''}
        </div>
      </div>`;
    }).join('');

    const socialHTML = [
      contact.github   && `<a href="${e(norm(contact.github))}"   target="_blank" class="social-link"><i class="fab fa-github"></i></a>`,
      contact.linkedin && `<a href="${e(norm(contact.linkedin))}" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>`,
      contact.twitter  && `<a href="${e(norm(contact.twitter))}"  target="_blank" class="social-link"><i class="fab fa-twitter"></i></a>`,
      contact.website  && `<a href="${e(norm(contact.website))}"  target="_blank" class="social-link"><i class="fas fa-globe"></i></a>`,
    ].filter(Boolean).join('');

    const css = `
      :root{--primary-color:#333;--accent-color:${accent};--bg-main:#fff;--bg-alt:#f8f9fa;--text-main:#2d3436;--text-dim:#636e72;--border-color:#eee;--shadow-soft:0 10px 30px rgba(0,0,0,.05);--shadow-hover:0 15px 40px rgba(0,0,0,.1);--transition:all .5s cubic-bezier(.25,1,.5,1);--font-heading:'Playfair Display',serif;--font-body:'Montserrat',sans-serif;}
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
      body{background:var(--bg-main);color:var(--text-main);font-family:var(--font-body);line-height:1.7;overflow-x:hidden}
      a{text-decoration:none;color:inherit;transition:var(--transition)}ul{list-style:none}img{max-width:100%;height:auto;display:block}
      section{padding:120px 0}.container{max-width:1100px;margin:0 auto;padding:0 24px}
      h1,h2,h3,h4{font-family:var(--font-heading);font-weight:700;line-height:1.2}
      .section-title{text-align:center;margin-bottom:80px}
      .section-title h2{font-size:2.8rem;margin-bottom:15px;position:relative;display:inline-block}
      .section-title h2::after{content:'';position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:50px;height:2px;background:var(--accent-color)}
      .section-title p{color:var(--text-dim);font-style:italic;font-size:1.1rem}
      .btn{display:inline-block;padding:16px 36px;border-radius:4px;font-weight:600;font-family:var(--font-body);font-size:.9rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border:none}
      .btn-dark{background:var(--primary-color);color:#fff}.btn-dark:hover{background:var(--text-dim);transform:translateY(-2px);box-shadow:var(--shadow-hover)}
      .btn-outline{background:transparent;border:1px solid var(--primary-color);color:var(--primary-color)}.btn-outline:hover{background:var(--primary-color);color:#fff;transform:translateY(-2px)}
      .header{position:fixed;top:0;left:0;width:100%;z-index:1000;transition:var(--transition);padding:24px 0}
      .header.sticky{padding:16px 0;background:#FEE6DA;backdrop-filter:blur(10px);box-shadow:0 2px 20px rgba(0,0,0,.05)}
      .nav{display:flex;justify-content:space-between;align-items:center}
      .nav-logo{font-family:var(--font-heading);font-size:1.8rem;font-weight:700;letter-spacing:-1px}
      .nav-logo span{color:var(--accent-color)}.nav-list{display:flex;gap:40px}
      .nav-link{font-weight:500;font-size:.9rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px}
      .nav-link:hover,.nav-link.active{color:var(--primary-color)}
      .nav-toggle,.nav-close{display:none}
      .hero{height:100vh;display:flex;align-items:center;position:relative;overflow:hidden}
      .hero-bg{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#fff 0%,#fdeff9 50%,#ecf2ff 100%);background-size:400% 400%;animation:gradientBG 15s ease infinite;z-index:-1}
      @keyframes gradientBG{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      .hero-greeting{display:block;font-family:var(--font-heading);font-style:italic;font-size:1.5rem;margin-bottom:10px;color:var(--text-dim)}
      .hero-title{font-size:5rem;margin-bottom:10px;letter-spacing:-2px}.hero-title span{color:var(--accent-color)}
      .hero-subtitle{font-size:1.8rem;font-weight:400;color:var(--text-dim);margin-bottom:25px}
      .hero-description{max-width:600px;font-size:1.2rem;margin-bottom:40px;color:var(--text-dim)}
      .hero-btns{display:flex;gap:20px}
      .hero-social{position:absolute;right:50px;display:flex;flex-direction:column;gap:25px}
      .social-link{font-size:1.3rem;color:var(--text-dim)}.social-link:hover{color:var(--accent-color);transform:translateX(-5px)}
      .fade-in{opacity:0;transform:translateY(20px);transition:var(--transition)}.fade-in.active{opacity:1;transform:translateY(0)}
      .reveal{opacity:0;transform:translateY(40px);transition:1s cubic-bezier(.25,1,.5,1)}.reveal.active{opacity:1;transform:translateY(0)}
      .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
      .about-img{position:relative;border-radius:12px;overflow:hidden;box-shadow:var(--shadow-soft)}
      .about-img img{width:100%;filter:grayscale(100%);transition:var(--transition)}.about-img:hover img{filter:grayscale(0%);transform:scale(1.05)}
      .about-heading{font-size:2.5rem;margin-bottom:25px}.about-heading span{color:var(--accent-color)}
      .about-text{margin-bottom:20px;font-size:1.1rem;color:var(--text-dim)}
      .about-info{display:flex;gap:50px;margin-top:40px}
      .info-number{display:block;font-size:2.2rem;font-weight:700;font-family:var(--font-heading);line-height:1}
      .info-label{font-size:.9rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px}
      .skills-wrapper{display:grid;grid-template-columns:1fr 1fr;gap:60px}
      .skills-item{margin-bottom:30px}.skills-header{display:flex;justify-content:space-between;margin-bottom:12px}
      .skills-name{font-weight:600;font-size:1rem}
      .skills-bar{width:100%;height:4px;background:var(--bg-alt);border-radius:2px;position:relative}
      .skills-progress{position:absolute;height:100%;background:var(--primary-color);border-radius:2px;transition:width 1.5s ease}
      .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(450px,1fr));gap:40px}
      .project-card{background:#fff;border-radius:12px;overflow:hidden;transition:var(--transition)}
      .project-card:hover{box-shadow:var(--shadow-hover);transform:translateY(-8px)}
      .project-img-wrapper{position:relative;height:350px;overflow:hidden}
      .project-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;opacity:0;transition:var(--transition)}
      .project-card:hover .project-overlay{opacity:1}
      .project-btn{padding:12px 24px;border:1px solid var(--primary-color);font-weight:600}
      .project-info{padding:30px}.project-tags{margin-bottom:10px}
      .project-tags span{font-size:.8rem;color:var(--text-dim);margin-right:15px;text-transform:uppercase;letter-spacing:1px}
      .project-title{font-size:1.8rem}
      .timeline{max-width:800px;margin:0 auto;position:relative;padding-left:50px}
      .timeline::before{content:'';position:absolute;left:0;top:0;width:1px;height:100%;background:var(--border-color)}
      .timeline-item{position:relative;margin-bottom:60px}
      .timeline-dot{position:absolute;left:-55px;top:8px;width:11px;height:11px;background:var(--accent-color);border-radius:50%;border:2px solid #fff;z-index:1}
      .timeline-date{display:block;font-size:.9rem;color:var(--text-dim);font-weight:600;margin-bottom:8px}
      .timeline-title{font-size:1.5rem;margin-bottom:5px}.timeline-company{font-style:italic;color:var(--text-dim);margin-bottom:15px}
      .contact-wrapper{max-width:700px;margin:0 auto}
      .form-group{position:relative;margin-bottom:40px}
      .form-input{width:100%;padding:12px 0;border:none;border-bottom:1px solid var(--border-color);background:transparent;font-family:var(--font-body);font-size:1rem;color:var(--text-main);outline:none;transition:var(--transition)}
      .form-label{position:absolute;left:0;top:12px;font-size:1rem;color:var(--text-dim);pointer-events:none;transition:var(--transition)}
      .form-input:focus~.form-label,.form-input:valid~.form-label{top:-15px;font-size:.8rem;color:var(--accent-color)}
      .form-input:focus{border-bottom-color:var(--primary-color)}
      .contact-btn{width:100%;padding:20px}
      footer{background:var(--bg-alt);padding:60px 0;text-align:center}
      .footer-content p{font-family:var(--font-heading);font-size:1.2rem;margin-bottom:20px}
      .footer-social{display:flex;justify-content:center;gap:30px}
      .footer-social a{font-size:1.4rem;color:var(--text-dim)}.footer-social a:hover{color:var(--primary-color)}
      @media(max-width:991px){.hero-title{font-size:3.5rem}.about-grid{grid-template-columns:1fr;gap:40px}.skills-wrapper{grid-template-columns:1fr;gap:0}.projects-grid{grid-template-columns:1fr}}
      @media(max-width:768px){.nav-list{display:none}.hero-title{font-size:2.8rem}.hero-social{display:none}}
    `;

    const script = `
document.addEventListener('DOMContentLoaded',()=>{
  const header=document.getElementById('header');
  window.addEventListener('scroll',()=>{
    header.classList.toggle('sticky',window.scrollY>=50);
  });
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('active');
      if(entry.target.classList.contains('skills-wrapper')){
        entry.target.querySelectorAll('.skills-progress').forEach(b=>{b.style.width=b.getAttribute('data-width');});
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.fade-in,.reveal,.skills-wrapper').forEach(el=>obs.observe(el));
  setTimeout(()=>document.querySelectorAll('.hero .fade-in').forEach(el=>el.classList.add('active')),100);
  const form=document.getElementById('contact-form');
  if(form){form.addEventListener('submit',ev=>{ev.preventDefault();const btn=form.querySelector('.contact-btn');const orig=btn.textContent;btn.disabled=true;btn.textContent='Sending...';setTimeout(()=>{btn.textContent='Message Received';btn.style.background='#27ae60';btn.style.color='#fff';form.reset();setTimeout(()=>{btn.disabled=false;btn.textContent=orig;btn.style.background='';btn.style.color='';},3000);},1500);});}
});`;

    const body = `
<div class="background-glare"></div>
<header class="header" id="header">
  <nav class="nav container">
    <a href="#" class="nav-logo">Port<span>Edge</span></a>
    <ul class="nav-list">
      <li><a href="#home"       class="nav-link active">Home</a></li>
      <li><a href="#about"      class="nav-link">About</a></li>
      ${safeSkills.length    ?`<li><a href="#skills"     class="nav-link">Skills</a></li>`:''}
      ${safeProjects.length  ?`<li><a href="#projects"   class="nav-link">Projects</a></li>`:''}
      ${safeEducation.length ?`<li><a href="#experience" class="nav-link">Experience</a></li>`:''}
      <li><a href="#contact" class="nav-link">Contact</a></li>
    </ul>
  </nav>
</header>

<main class="main">
  <section class="hero section" id="home">
    <div class="hero-bg"></div>
    <div class="container hero-container">
      <div class="hero-content">
        <span class="hero-greeting fade-in">Hello, I'm</span>
        <h1 class="hero-title fade-in">${e(personal.name||'Your Name')} <span>.</span></h1>
        <p class="hero-subtitle fade-in">${e(personal.title||'Creative Developer')}</p>
        <p class="hero-description fade-in">${e(personal.bio||'Creating refined digital experiences through minimal design.')}</p>
        <div class="hero-btns fade-in">
          <a href="#projects" class="btn btn-dark">Explore My Work</a>
          <a href="#contact"  class="btn btn-outline">Say Hello</a>
        </div>
      </div>
      <div class="hero-social fade-in">${socialHTML||'<a href="#" class="social-link"><i class="fab fa-github"></i></a>'}</div>
    </div>
  </section>

  <section class="about section" id="about">
    <div class="container">
      <div class="section-title reveal"><h2>About Me</h2><p>Subtle transitions, refined aesthetics.</p></div>
      <div class="about-grid">
        <div class="about-img reveal">
          ${personal.avatar
            ?`<img src="${e(personal.avatar)}" alt="${e(personal.name||'')}" onerror="this.style.display='none'">`
            :`<div style="width:100%;height:350px;background:linear-gradient(135deg,#fdeff9,#ecf2ff);display:flex;align-items:center;justify-content:center;font-size:6rem;color:${accent}">${(personal.name||'?').charAt(0)}</div>`}
        </div>
        <div class="about-data reveal">
          <h3 class="about-heading">${e(personal.name||'Your Name')} <span>&</span> ${e(personal.title||'Developer')}</h3>
          <p class="about-text">${e(personal.bio||'A passionate developer focused on creating clean, elegant interfaces.')}</p>
          <div class="about-info">
            ${contact.location?`<div><span class="info-number" style="font-size:1rem">${e(contact.location)}</span><span class="info-label">Location</span></div>`:''}
            ${safeProjects.length?`<div><span class="info-number">${safeProjects.length}+</span><span class="info-label">Projects</span></div>`:''}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${safeSkills.length?`
  <section class="skills section" id="skills">
    <div class="container">
      <div class="section-title reveal"><h2>Expertise</h2><p>The tools I use to craft digital excellence.</p></div>
      <div class="skills-wrapper reveal">
        <div class="skills-group">${safeSkills.slice(0,4).map((s,i)=>{const p=Math.max(70,95-i*5);return`<div class="skills-item"><div class="skills-header"><span class="skills-name">${e(s)}</span><span class="skills-percentage">${p}%</span></div><div class="skills-bar"><span class="skills-progress" style="width:0" data-width="${p}%"></span></div></div>`;}).join('')}</div>
        <div class="skills-group">${safeSkills.slice(4,8).map((s,i)=>{const p=Math.max(65,88-i*5);return`<div class="skills-item"><div class="skills-header"><span class="skills-name">${e(s)}</span><span class="skills-percentage">${p}%</span></div><div class="skills-bar"><span class="skills-progress" style="width:0" data-width="${p}%"></span></div></div>`;}).join('')}</div>
      </div>
    </div>
  </section>`:''}

  ${safeProjects.length?`
  <section class="projects section" id="projects">
    <div class="container">
      <div class="section-title reveal"><h2>Selected Works</h2><p>A collection of thoughtfully crafted projects.</p></div>
      <div class="projects-grid">${projectsHTML}</div>
    </div>
  </section>`:''}

  ${safeEducation.length?`
  <section class="experience section" id="experience">
    <div class="container">
      <div class="section-title reveal"><h2>The Journey</h2><p>Professional highlights and milestones.</p></div>
      <div class="timeline reveal">${timelineHTML}</div>
    </div>
  </section>`:''}

  <section class="contact section" id="contact">
    <div class="container">
      <div class="section-title reveal"><h2>Get in Touch</h2><p>Let's collaborate on something meaningful.</p></div>
      <div class="contact-wrapper">
        <form class="contact-form reveal" id="contact-form">
          <div class="form-group"><input type="text" id="name" required class="form-input"><label for="name" class="form-label">Full Name</label></div>
          <div class="form-group"><input type="email" id="email" required class="form-input"><label for="email" class="form-label">Email Address</label></div>
          <div class="form-group"><textarea id="message" required class="form-input" rows="5"></textarea><label for="message" class="form-label">Your Message</label></div>
          <button type="submit" class="btn btn-dark contact-btn">Send Message</button>
        </form>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <p>&copy; ${new Date().getFullYear()} Port<span style="color:${accent};font-weight:700">Edge</span>. Minimal by Design.</p>
      <div class="footer-social">${socialHTML}</div>
    </div>
  </div>
</footer>
<script>${script}</script>`;

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${e(personal.name||'Portfolio')} | Minimal Elegant</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
<style>${css}</style></head><body>${body}</body></html>`;
  }
  // ─── end renderTemp2 ──────────────────────────────────────────────────────────


  // ─── renderTemp3 ─────────────────────────────────────────────────────────────
  // Cyberpunk Neon Portfolio (Orbitron / Roboto Mono)
  function renderTemp3(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const safeSkills    = Array.isArray(skills)    ? skills    : [];
    const safeProjects  = Array.isArray(projects)  ? projects  : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const accent = (theme && theme.accent) ? theme.accent : '#00f7ff';
    const e = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const skillModules = safeSkills.slice(0,6).map((s,i) => {
      const colors = ['cyan','purple','pink','cyan','purple','pink'];
      const pct = Math.max(70, 95-i*4);
      const col = colors[i%3];
      const strokeColor = col==='cyan'?accent:col==='purple'?'#bf00ff':'#ff00ea';
      const circ = 2*Math.PI*45;
      const offset = circ - (pct/100)*circ;
      return `<div class="skill-module ${col}-edge">
        <div class="skill-info">
          <h3>${e(s.toUpperCase().replace(/ /g,'_'))}</h3>
          <div class="circle-progress">
            <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" class="bg-circle"></circle>
            <circle cx="50" cy="50" r="45" class="progress-circle ${col}-pulse" style="stroke-dasharray:${circ};stroke-dashoffset:${offset}"></circle></svg>
            <span class="percent-text">${pct}%</span>
          </div>
        </div>
      </div>`;
    }).join('');

    const projectsHTML = safeProjects.map(p => {
      const href = norm(p.link);
      const tag = (p.tech||'').split(',')[0].trim()||'Project';
      return `<div class="project-card reveal-cyber">
        <div class="card-img" style="height:250px;background:linear-gradient(135deg,#111,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:3rem;color:${accent}">
          <div class="card-overlay"><a href="${e(href||'#')}" target="_blank" class="view-op">VIEW_OP</a></div>
          &#128187;
        </div>
        <div class="card-body">
          <span class="card-tag">${e(tag.toUpperCase().replace(/ /g,'_'))}</span>
          <h3>${e(p.title)}</h3>
          <p style="color:#888;margin-top:8px;font-size:.85rem">${e(p.description)}</p>
          ${href?`<a href="${e(href)}" target="_blank" style="display:inline-block;margin-top:10px;color:${accent};font-size:.8rem;font-family:var(--font-cyber)">VIEW_PROJECT &#8599;</a>`:''}
        </div>
      </div>`;
    }).join('');

    const timelineHTML = safeEducation.map((edu,i) => {
      const dates = [edu.from, edu.to?(edu.current?'Present':edu.to):''].filter(Boolean).join(' - ');
      const glowClass = i%2===0?'cyan-glow':'purple-glow';
      return `<div class="timeline-item reveal-cyber">
        <div class="node ${glowClass}"></div>
        <div class="time-content">
          <span class="time-stamp">CYCLE: ${e(dates)}</span>
          <h3>${e(edu.degree||edu.institution)}</h3>
          <p>${e(edu.institution)}${edu.field?` // ${e(edu.field)}`:''}</p>
        </div>
      </div>`;
    }).join('');

    const socialHTML = [
      contact.github   && `<a href="${e(norm(contact.github))}"   target="_blank" class="social-item cyan-text"><i class="fab fa-github"></i></a>`,
      contact.linkedin && `<a href="${e(norm(contact.linkedin))}" target="_blank" class="social-item purple-text"><i class="fab fa-linkedin-in"></i></a>`,
      contact.twitter  && `<a href="${e(norm(contact.twitter))}"  target="_blank" class="social-item pink-text"><i class="fab fa-twitter"></i></a>`,
      contact.website  && `<a href="${e(norm(contact.website))}"  target="_blank" class="social-item cyan-text"><i class="fas fa-globe"></i></a>`,
    ].filter(Boolean).join('');

    const titleWords = JSON.stringify(personal.title ? [personal.title.toUpperCase().replace(/ /g,'_')] : ['NEURAL_INTERFACE','UX_SPECIALIST','DIGITAL_NOMAD']);

    const css = `
      :root{--bg-black:#050505;--neon-cyan:${accent};--neon-purple:#bf00ff;--neon-pink:#ff00ea;--text-white:#fff;--text-gray:#888;--glow-cyan:0 0 10px ${accent},0 0 20px ${accent}88;--glow-pink:0 0 10px #ff00ea,0 0 20px #ff00ea88;--glow-purple:0 0 10px #bf00ff,0 0 20px #bf00ff88;--font-cyber:'Orbitron',sans-serif;--font-mono:'Roboto Mono',monospace;--transition:all .3s cubic-bezier(.175,.885,.32,1.275)}
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;background:#050505}
      body{background:var(--bg-black);color:var(--text-white);font-family:var(--font-mono);line-height:1.6;overflow-x:hidden}
      a{text-decoration:none;color:inherit;transition:var(--transition)}ul{list-style:none}section{padding:100px 0;position:relative}
      .container{max-width:1200px;margin:0 auto;padding:0 20px}
      .scanlines{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,rgba(255,255,255,0) 50%,rgba(0,0,0,.05) 50%);background-size:100% 4px;z-index:9999;pointer-events:none}
      .navbar{position:fixed;top:0;left:0;width:100%;padding:25px 0;z-index:1000;background:transparent;transition:var(--transition)}
      .navbar.sticky{background:rgba(5,5,5,.9);backdrop-filter:blur(10px);padding:15px 0;border-bottom:1px solid var(--neon-cyan);box-shadow:0 0 15px rgba(0,247,255,.2)}
      .nav-container{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:0 30px}
      .nav-logo{font-family:var(--font-cyber);font-size:1.8rem;font-weight:900}.nav-logo span{color:var(--neon-cyan);text-shadow:var(--glow-cyan)}
      .nav-links{display:flex;gap:30px}
      .nav-item{font-family:var(--font-cyber);font-size:.85rem;font-weight:700;letter-spacing:2px;color:var(--text-gray);position:relative;padding:5px 0}
      .nav-item:hover,.nav-item.active{color:var(--neon-cyan);text-shadow:var(--glow-cyan)}
      .nav-item::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--neon-cyan);box-shadow:var(--glow-cyan);transition:var(--transition)}
      .nav-item:hover::after,.nav-item.active::after{width:100%}
      .hero{height:100vh;display:flex;align-items:center;justify-content:space-between;padding:0 8%}
      .hero-content{flex:1;z-index:10}
      .hero-top-decor{font-family:var(--font-mono);color:var(--neon-cyan);letter-spacing:5px;margin-bottom:20px}
      .hero-name{font-family:var(--font-cyber);font-size:6rem;font-weight:900;line-height:1;margin-bottom:10px;text-transform:uppercase;position:relative}
      .hero-tagline{font-size:1.5rem;font-weight:400;margin-bottom:30px}
      #typing-text{color:var(--neon-cyan);text-shadow:var(--glow-cyan)}
      .hero-description{max-width:500px;color:var(--text-gray);margin-bottom:40px}
      .hero-btns{display:flex;gap:25px;margin-bottom:40px}
      .btn-neon{padding:15px 35px;background:transparent;border:2px solid;font-family:var(--font-cyber);font-weight:700;color:#fff;cursor:pointer;text-transform:uppercase;letter-spacing:3px;transition:var(--transition)}
      .cyan-glow{border-color:var(--neon-cyan);box-shadow:inset 0 0 10px rgba(0,247,255,.2)}.cyan-glow:hover{background:var(--neon-cyan);color:#000;box-shadow:var(--glow-cyan)}
      .pink-glow{border-color:var(--neon-pink);box-shadow:inset 0 0 10px rgba(255,0,234,.2)}.pink-glow:hover{background:var(--neon-pink);color:#000;box-shadow:var(--glow-pink)}
      .social-icons{display:flex;gap:20px}.social-item{font-size:1.5rem;transition:var(--transition)}.social-item:hover{transform:translateY(-5px) scale(1.2)}
      .cyan-text{color:var(--neon-cyan);text-shadow:var(--glow-cyan)}.purple-text{color:var(--neon-purple);text-shadow:var(--glow-purple)}.pink-text{color:var(--neon-pink);text-shadow:var(--glow-pink)}
      .section-header{margin-bottom:60px;text-align:left}
      .section-title{font-family:var(--font-cyber);font-size:2.5rem;letter-spacing:5px}
      .cyan-glow-text{color:var(--neon-cyan);text-shadow:var(--glow-cyan)}.pink-glow-text{color:var(--neon-pink);text-shadow:var(--glow-pink)}.purple-glow-text{color:var(--neon-purple);text-shadow:var(--glow-purple)}
      .header-line{width:100px;height:4px;background:var(--neon-cyan);margin-top:10px;box-shadow:var(--glow-cyan)}
      .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
      .cyber-card{background:rgba(20,20,20,.8);border:1px solid var(--neon-purple);padding:40px;position:relative}
      .cyber-card::before{content:'';position:absolute;top:-5px;left:-5px;width:20px;height:20px;border-top:2px solid var(--neon-purple);border-left:2px solid var(--neon-purple)}
      .cyber-card::after{content:'';position:absolute;bottom:-5px;right:-5px;width:20px;height:20px;border-bottom:2px solid var(--neon-purple);border-right:2px solid var(--neon-purple)}
      .attribute-grid{display:grid;gap:15px;margin-top:30px}.attr-label{color:var(--neon-purple);font-weight:700;margin-right:10px}
      .about-avatar{width:100%;height:350px;background:linear-gradient(135deg,#111,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:6rem;color:var(--neon-cyan);border:1px solid var(--neon-cyan);position:relative}
      .about-avatar img{width:100%;height:100%;object-fit:cover;filter:saturate(.5) contrast(1.2)}
      .skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
      .skill-module{background:rgba(10,10,10,.8);padding:30px;border:1px solid;border-left:10px solid}
      .cyan-edge{border-color:var(--neon-cyan)}.purple-edge{border-color:var(--neon-purple)}.pink-edge{border-color:var(--neon-pink)}
      .skill-info{display:flex;justify-content:space-between;align-items:center}
      .circle-progress{position:relative;width:80px;height:80px}.circle-progress svg{transform:rotate(-90deg)}
      .bg-circle{fill:none;stroke:#222;stroke-width:8}.progress-circle{fill:none;stroke-width:8;stroke-linecap:round}
      .cyan-pulse{stroke:var(--neon-cyan);filter:drop-shadow(0 0 5px var(--neon-cyan))}
      .purple-pulse{stroke:var(--neon-purple);filter:drop-shadow(0 0 5px var(--neon-purple))}
      .pink-pulse{stroke:var(--neon-pink);filter:drop-shadow(0 0 5px var(--neon-pink))}
      .percent-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:.8rem;font-weight:700}
      .project-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:30px}
      .project-card{background:#111;border:1px solid #222;transition:var(--transition)}.project-card:hover{border-color:var(--neon-purple);transform:scale(1.02);box-shadow:0 0 20px rgba(191,0,255,.2)}
      .card-img{position:relative;height:250px;overflow:hidden}
      .card-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:var(--transition)}
      .project-card:hover .card-overlay{opacity:1}
      .view-op{padding:10px 20px;border:1px solid var(--neon-purple);color:var(--neon-purple);font-family:var(--font-cyber)}
      .card-body{padding:25px}.card-tag{font-size:.7rem;color:var(--neon-purple);letter-spacing:2px}
      .cyber-timeline{position:relative;padding-left:30px}
      .cyber-timeline::before{content:'';position:absolute;left:30px;top:0;width:2px;height:100%;background:#222}
      .timeline-item{position:relative;padding-left:50px;margin-bottom:50px}
      .node{position:absolute;left:24px;top:0;width:14px;height:14px;border-radius:50%;z-index:2}
      .time-stamp{color:var(--text-gray);font-size:.8rem}
      .contact-box{display:grid;grid-template-columns:1.5fr 1fr;gap:60px}
      .input-wrap{position:relative;margin-bottom:30px}
      .input-wrap input,.input-wrap textarea{width:100%;background:transparent;border:none;border-bottom:2px solid #222;padding:15px 0;color:#fff;font-family:inherit;outline:none}
      .input-border{position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--neon-pink);transition:var(--transition)}
      .input-wrap input:focus~.input-border,.input-wrap textarea:focus~.input-border{width:100%;box-shadow:var(--glow-pink)}
      .btn-cyber{width:100%;padding:20px;background:transparent;border:2px solid var(--neon-pink);color:#fff;font-family:var(--font-cyber);cursor:pointer;transition:var(--transition)}.btn-cyber:hover{background:var(--neon-pink);color:#000;box-shadow:var(--glow-pink)}
      .direct-uplink h3{color:var(--neon-cyan);font-family:var(--font-cyber);margin-bottom:20px}.direct-uplink p{color:var(--text-gray);margin-bottom:10px;font-size:.85rem}
      .reveal-cyber{opacity:0;transform:translateY(30px);transition:all .8s ease-out}.reveal-cyber.active{opacity:1;transform:translateY(0)}
      footer{padding:40px 0;border-top:1px solid rgba(0,247,255,.1);text-align:center}
      .footer-grid{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
      .footer-logo{font-family:var(--font-cyber);font-size:1.5rem;font-weight:900}.footer-logo span{color:var(--neon-cyan)}
      .footer-status,.footer-copy{color:var(--text-gray);font-size:.75rem}
      @media(max-width:991px){.hero{flex-direction:column;text-align:center;justify-content:center}.hero-name{font-size:4rem}.about-grid,.contact-box{grid-template-columns:1fr}}
      @media(max-width:768px){.nav-links{display:none}.skills-grid{grid-template-columns:1fr}}
    `;

    const script = `
document.addEventListener('DOMContentLoaded',()=>{
  const navbar=document.getElementById('navbar');
  window.addEventListener('scroll',()=>navbar.classList.toggle('sticky',window.scrollY>50));
  const words=${titleWords};let wi=0,ci=0,del=false;
  const el=document.getElementById('typing-text');
  function type(){const w=words[wi];el.textContent=del?w.substring(0,ci-1):w.substring(0,ci+1);if(!del&&el.textContent===w){del=true;setTimeout(type,2000);return;}if(del&&el.textContent===''){del=false;wi=(wi+1)%words.length;setTimeout(type,500);return;}ci=del?ci-1:ci+1;setTimeout(type,del?40:80);}
  if(el)type();
  const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('active');});},{threshold:0.15});
  document.querySelectorAll('.reveal-cyber').forEach(el=>obs.observe(el));
  const form=document.querySelector('.cyber-form');
  if(form){form.addEventListener('submit',ev=>{ev.preventDefault();const btn=form.querySelector('button');const orig=btn.textContent;btn.textContent='TRANSMITTING...';btn.style.borderColor='${accent}';btn.style.color='${accent}';btn.disabled=true;setTimeout(()=>{btn.textContent='DATA_SYNC_COMPLETE';btn.style.borderColor='#00ff88';btn.style.color='#00ff88';setTimeout(()=>{btn.textContent=orig;btn.style.borderColor='';btn.style.color='';btn.disabled=false;form.reset();},3000);},2000);});}
});`;

    const body = `
<div class="scanlines"></div>
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="#" class="nav-logo">Port<span>Edge</span></a>
    <ul class="nav-links" id="nav-links">
      <li><a href="#home"       class="nav-item active">HOME</a></li>
      <li><a href="#about"      class="nav-item">ABOUT</a></li>
      ${safeSkills.length    ?`<li><a href="#skills"     class="nav-item">SKILLS</a></li>`:''}
      ${safeProjects.length  ?`<li><a href="#projects"   class="nav-item">PROJECTS</a></li>`:''}
      ${safeEducation.length ?`<li><a href="#experience" class="nav-item">CHRONICLE</a></li>`:''}
      <li><a href="#contact" class="nav-item">CONTACT</a></li>
    </ul>
  </div>
</nav>

<main>
  <section class="hero" id="home">
    <div class="hero-content">
      <div class="hero-top-decor reveal-cyber">SYSTEM_READY // 0101-X</div>
      <h1 class="hero-name reveal-cyber">${e((personal.name||'YOUR NAME').toUpperCase())}</h1>
      <h2 class="hero-tagline reveal-cyber">DEPLOYING <span id="typing-text"></span></h2>
      <div class="hero-description reveal-cyber">${e(personal.bio||'Architecting the digital frontier. Cyber-enhanced interfaces for the next generation.')}</div>
      <div class="hero-btns reveal-cyber">
        <button class="btn-neon cyan-glow" onclick="document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})">VIEW_ARCHIVE</button>
        <button class="btn-neon pink-glow" onclick="document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})">INITIATE_CONTACT</button>
      </div>
      <div class="social-icons reveal-cyber">${socialHTML||'<a href="#" class="social-item cyan-text"><i class="fab fa-github"></i></a>'}</div>
    </div>
  </section>

  <section class="about section" id="about">
    <div class="container">
      <div class="section-header reveal-cyber"><h2 class="section-title cyan-glow-text">ABOUT_S_01</h2><div class="header-line"></div></div>
      <div class="about-grid">
        <div class="about-data reveal-cyber">
          <div class="cyber-card">
            <h3 class="purple-text">${e(personal.name||'The Developer')}</h3>
            <p style="color:#888;margin-top:15px">${e(personal.bio||'I specialize in building immersive digital environments where high-performance code meets radical aesthetics.')}</p>
            <div class="attribute-grid">
              <div class="attr-item"><span class="attr-label">CLASS:</span> ${e(personal.title||'Full-Stack Architect')}</div>
              ${contact.location?`<div class="attr-item"><span class="attr-label">REGION:</span> ${e(contact.location)}</div>`:''}
              ${safeProjects.length?`<div class="attr-item"><span class="attr-label">OPS:</span> ${safeProjects.length}+ COMPLETED</div>`:''}
            </div>
          </div>
        </div>
        <div class="about-visual reveal-cyber">
          <div class="about-avatar">
            ${personal.avatar?`<img src="${e(personal.avatar)}" alt="${e(personal.name||'')}" onerror="this.style.display='none'">`:e((personal.name||'?').charAt(0))}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${safeSkills.length?`
  <section class="skills section" id="skills">
    <div class="container">
      <div class="section-header reveal-cyber"><h2 class="section-title pink-glow-text">SKILL_MODULES</h2><div class="header-line"></div></div>
      <div class="skills-grid reveal-cyber">${skillModules}</div>
    </div>
  </section>`:''}

  ${safeProjects.length?`
  <section class="projects section" id="projects">
    <div class="container">
      <div class="section-header reveal-cyber"><h2 class="section-title purple-glow-text">OPERATIONS_LOG</h2><div class="header-line"></div></div>
      <div class="project-grid">${projectsHTML}</div>
    </div>
  </section>`:''}

  ${safeEducation.length?`
  <section class="experience section" id="experience">
    <div class="container">
      <div class="section-header reveal-cyber"><h2 class="section-title cyan-glow-text">TIMELINE_SYNC</h2><div class="header-line"></div></div>
      <div class="cyber-timeline">${timelineHTML}</div>
    </div>
  </section>`:''}

  <section class="contact section" id="contact">
    <div class="container">
      <div class="section-header reveal-cyber"><h2 class="section-title pink-glow-text">SEND_PULSE</h2><div class="header-line"></div></div>
      <div class="contact-box reveal-cyber">
        <form class="cyber-form">
          <div class="input-wrap"><input type="text" placeholder="IDENTITY_AUTH" required><div class="input-border"></div></div>
          <div class="input-wrap"><input type="email" placeholder="CONTACT_UPLINK" required><div class="input-border"></div></div>
          <div class="input-wrap"><textarea placeholder="MESSAGE_PAYLOAD" rows="5" required></textarea><div class="input-border"></div></div>
          <button type="submit" class="btn-cyber pink-glow">TRANSMIT_DATA</button>
        </form>
        <div class="direct-uplink">
          <h3>DIRECT_CHANNELS</h3>
          ${contact.email?`<p>UPLINK: ${e(contact.email)}</p>`:''}
          ${contact.location?`<p>SECTOR: ${e(contact.location)}</p>`:''}
          ${contact.github?`<p>GITHUB: <a href="${e(norm(contact.github))}" target="_blank" style="color:${accent}">${e(contact.github)}</a></p>`:''}
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-logo">Port<span>Edge</span></div>
      <div class="footer-status">STATUS: ONLINE // ${e(personal.name||'PORTFOLIO')}</div>
      <div class="footer-copy">&copy; ${new Date().getFullYear()}_NO_RIGHTS_RESERVED</div>
    </div>
  </div>
</footer>
<script>${script}</script>`;

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${e(personal.name||'Portfolio')} | Cyberpunk</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
<style>${css}</style></head><body class="cyber-theme">${body}</body></html>`;
  }
  // ─── end renderTemp3 ──────────────────────────────────────────────────────────


  // ─── renderTemp4 ─────────────────────────────────────────────────────────────
  // Modern Startup Portfolio (Inter / Outfit)
  function renderTemp4(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const e = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const accent = (theme && theme.accent) ? theme.accent : '#6f42c1';

    const titleWords = JSON.stringify((personal.bio || '').split('.').map(s=>s.trim()).filter(s=>s.length>4));

    const skillsHTML = safeSkills.map((s, i) => {
      const p = Math.max(70, 95 - i*4);
      const c = ['teal', 'purple', 'blue'][i % 3];
      return `<div class="skill-item"><div class="skill-info"><span>${e(s)}</span><span class="skill-val">${p}%</span></div><div class="skill-bar"><div class="skill-progress ${c}" style="width: 0%" data-width="${p}%"></div></div></div>`;
    }).join('');

    const projectsHTML = safeProjects.map(p => `
      <div class="project-card reveal">
        <div class="project-img" style="height:300px;background:linear-gradient(135deg,#f8f9fa,#e9ecef);display:flex;align-items:center;justify-content:center;font-size:3rem;color:${accent};position:relative">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="${e(p.title)}" style="width:100%;height:100%;object-fit:cover">
          <div class="project-tag">${e((p.tech || '').split(',')[0] || 'Tech')}</div>
        </div>
        <div class="project-info">
          <h3>${e(p.title)}</h3>
          <p>${e(p.description)}</p>
          ${p.link ? `<a href="${norm(p.link)}" target="_blank" class="project-link">Explore Work <i class="fas fa-arrow-right"></i></a>` : ''}
        </div>
      </div>`).join('');

    const timelineHTML = safeEducation.map(edu => {
      const dates = [edu.from, edu.to?(edu.current?'Present':edu.to):''].filter(Boolean).join(' - ');
      return `<div class="timeline-item reveal">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <span class="timeline-date">${e(dates)}</span>
          <h3>${e(edu.degree||edu.institution)}</h3>
          <p class="timeline-org">${e(edu.institution)}</p>
          ${edu.field?`<p>${e(edu.field)}</p>`:''}
        </div>
      </div>`;
    }).join('');

    const socialHTML = [
      contact.github   && `<a href="${norm(contact.github)}"   target="_blank"><i class="fab fa-github"></i></a>`,
      contact.linkedin && `<a href="${norm(contact.linkedin)}" target="_blank"><i class="fab fa-linkedin-in"></i></a>`,
      contact.twitter  && `<a href="${norm(contact.twitter)}"  target="_blank"><i class="fab fa-twitter"></i></a>`,
      contact.website  && `<a href="${norm(contact.website)}"  target="_blank"><i class="fas fa-globe"></i></a>`,
    ].filter(Boolean).join('');

    const css = `
      :root{--primary:${accent};--accent:#20c997;--secondary:#007bff;--bg-light:#f8f9fa;--bg-dark:#0f172a;--text-main:#1e293b;--text-muted:#64748b;--white:#fff;--gradient-1:linear-gradient(135deg,${accent} 0%,#007bff 100%);--gradient-2:linear-gradient(135deg,#20c997 0%,#007bff 100%);--shadow-soft:0 10px 30px rgba(0,0,0,.05);--shadow-bold:0 20px 40px rgba(111,66,193,.15);--border-radius:16px;--transition:all .4s cubic-bezier(.4,0,.2,1);--font-heading:'Outfit',sans-serif;--font-body:'Inter',sans-serif}
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
      body{font-family:var(--font-body);color:var(--text-main);background:var(--bg-light);line-height:1.6;overflow-x:hidden;position:relative}
      a{text-decoration:none;transition:var(--transition)}ul{list-style:none}img{max-width:100%;height:auto;display:block}
      section{padding:120px 0;position:relative}.container{max-width:1200px;margin:0 auto;padding:0 30px}
      .blob-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;filter:blur(80px)}
      .blob{position:absolute;width:600px;height:600px;border-radius:50%;opacity:.15;animation:blobMove 20s infinite alternate}
      .blob-1{background:${accent};top:-100px;left:-100px}.blob-2{background:#20c997;bottom:-100px;right:-100px;animation-delay:-5s}.blob-3{background:#007bff;top:40%;left:20%;width:400px;height:400px;animation-delay:-10s}
      @keyframes blobMove{0%{transform:translate(0,0) scale(1)}100%{transform:translate(100px,50px) scale(1.2)}}
      h1,h2,h3,h4{font-family:var(--font-heading);color:var(--text-main);font-weight:700}
      .section-header{text-align:center;margin-bottom:80px}
      .section-title{font-size:3rem;margin-bottom:15px}
      .section-title span,.hero-title span,.nav-logo span{background:var(--gradient-1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .section-header p{color:var(--text-muted);font-size:1.1rem}
      .btn{display:inline-block;padding:16px 36px;border-radius:40px;font-weight:600;font-size:1rem;cursor:pointer;border:none;transition:var(--transition)}
      .btn-primary{background:var(--gradient-1);color:#fff;box-shadow:var(--shadow-bold)}.btn-primary:hover{transform:translateY(-5px);box-shadow:0 25px 50px rgba(111,66,193,.25)}
      .btn-outline{background:transparent;border:2px solid var(--primary);color:var(--primary)}.btn-outline:hover{background:var(--primary);color:#fff;transform:translateY(-5px)}
      .header{position:fixed;top:0;left:0;width:100%;z-index:1000;padding:30px 0;transition:var(--transition)}
      .header.sticky{padding:15px 0;background:rgba(255,255,255,.85);backdrop-filter:blur(15px);box-shadow:var(--shadow-soft)}
      .nav{display:flex;justify-content:space-between;align-items:center}
      .nav-logo{font-family:var(--font-heading);font-size:1.8rem;font-weight:800;color:var(--text-main)}
      .nav-list{display:flex;gap:40px}.nav-link{font-weight:500;color:var(--text-muted);font-size:1rem}.nav-link:hover,.nav-link.active{color:var(--primary)}
      .nav-toggle,.nav-close{display:none}
      .hero{min-height:100vh;display:flex;align-items:center}
      .hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:60px;align-items:center}
      .hero-label{display:block;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;font-size:.9rem;margin-bottom:15px}
      .hero-title{font-size:5rem;line-height:1.1;margin-bottom:20px}
      .hero-subtitle{font-size:1.8rem;font-weight:500;margin-bottom:25px;color:var(--text-main)}
      #typing-text{background:var(--gradient-1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .hero-description{font-size:1.2rem;color:var(--text-muted);margin-bottom:40px;max-width:550px}
      .hero-btns{display:flex;gap:20px}
      .visual-card{background:var(--bg-dark);padding:30px;border-radius:var(--border-radius);box-shadow:var(--shadow-bold);color:#fff;width:100%;max-width:400px}
      .card-header{display:flex;gap:8px;margin-bottom:20px}.dot{width:12px;height:12px;border-radius:50%}
      .red{background:#ff5f56}.yellow{background:#ffbd2e}.green{background:#27c93f}
      .card-content code{font-family:'Fira Code',monospace;font-size:1rem;line-height:1.8}
      .c-purple{color:#c678dd}.c-blue{color:#61afef}.c-teal{color:#98c379}
      @keyframes floating{0%{transform:translateY(0)}100%{transform:translateY(-20px)}}.floating{animation:floating 3s ease-in-out infinite alternate}
      .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
      .img-wrapper{position:relative;border-radius:var(--border-radius);overflow:hidden;box-shadow:var(--shadow-bold)}
      .gradient-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom right,rgba(111,66,193,.3),rgba(0,123,255,.3))}
      .about-text{font-size:1.15rem;color:var(--text-muted);margin-bottom:25px}
      .about-stats{display:flex;gap:50px;margin-top:40px}
      .stat-num{display:block;font-size:2.5rem;font-weight:800;font-family:var(--font-heading);color:var(--primary)}
      .stat-label{font-size:.9rem;font-weight:600;color:var(--text-muted);text-transform:uppercase}
      .skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px}
      .skill-item{margin-bottom:30px}.skill-info{display:flex;justify-content:space-between;margin-bottom:15px;font-weight:600}
      .skill-bar{width:100%;height:10px;background:rgba(0,0,0,.05);border-radius:5px;overflow:hidden}
      .skill-progress{height:100%;border-radius:5px;transition:width 1.5s cubic-bezier(.4,0,.2,1)}
      .skill-progress.teal{background:var(--gradient-2)}.skill-progress.purple{background:var(--gradient-1)}.skill-progress.blue{background:var(--secondary)}
      .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:40px}
      .project-card{background:#fff;border-radius:var(--border-radius);overflow:hidden;box-shadow:var(--shadow-soft);transition:var(--transition)}.project-card:hover{transform:translateY(-15px);box-shadow:var(--shadow-bold)}
      .project-img{position:relative;height:300px;overflow:hidden}
      .project-tag{position:absolute;top:20px;right:20px;padding:8px 18px;background:rgba(255,255,255,.9);backdrop-filter:blur(5px);border-radius:30px;font-weight:600;font-size:.8rem;color:var(--primary)}
      .project-info{padding:35px}.project-info h3{font-size:1.6rem;margin-bottom:15px}.project-info p{color:var(--text-muted);margin-bottom:25px}
      .project-link{font-weight:700;color:var(--primary);display:flex;align-items:center;gap:10px}
      .timeline{max-width:800px;margin:0 auto;position:relative;padding-left:50px}
      .timeline::before{content:'';position:absolute;left:10px;top:0;width:2px;height:100%;background:var(--bg-dark);opacity:.1}
      .timeline-item{position:relative;margin-bottom:60px}
      .timeline-marker{position:absolute;left:-48px;top:8px;width:14px;height:14px;border-radius:50%;background:var(--gradient-1);box-shadow:0 0 15px rgba(111,66,193,.4);z-index:1}
      .timeline-date{display:block;font-weight:700;color:var(--accent);margin-bottom:10px}
      .timeline-org{color:var(--primary);font-weight:600;margin-bottom:15px}
      .contact-card{background:var(--bg-dark);border-radius:24px;display:grid;grid-template-columns:1fr 1.2fr;overflow:hidden;color:#fff;box-shadow:var(--shadow-bold)}
      .contact-info{padding:80px 60px;background:var(--gradient-1)}
      .contact-info h2{color:#fff;font-size:2.8rem;margin-bottom:20px}
      .contact-details{margin-top:50px}.contact-item{display:flex;align-items:center;gap:20px;margin-bottom:25px}
      .contact-item i{width:45px;height:45px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
      .contact-form{padding:80px 60px;background:#fff;color:var(--text-main)}
      .form-group{position:relative;margin-bottom:40px}
      .form-group input,.form-group textarea{width:100%;padding:15px 0;background:transparent;border:none;font-family:inherit;font-size:1rem;outline:none;color:var(--text-main)}
      .form-group label{position:absolute;left:0;top:15px;color:var(--text-muted);transition:.3s;pointer-events:none}
      .form-line{width:100%;height:2px;background:#e2e8f0;position:relative}
      .form-line::after{content:'';position:absolute;left:0;bottom:0;width:0;height:100%;background:var(--gradient-1);transition:.4s}
      .form-group input:focus~label,.form-group input:valid~label,.form-group textarea:focus~label,.form-group textarea:valid~label{top:-15px;font-size:.85rem;color:var(--primary)}
      .form-group input:focus~.form-line::after,.form-group textarea:focus~.form-line::after{width:100%}
      .submit-btn{width:100%;padding:20px}
      footer{background:var(--bg-dark);padding:80px 0;color:#fff;text-align:center}
      .footer-content{display:flex;flex-direction:column;align-items:center;gap:40px}
      .footer-social{display:flex;gap:30px}.footer-social a{font-size:1.5rem;color:rgba(255,255,255,.5)}.footer-social a:hover{color:#fff}
      .footer-logo span{background:var(--gradient-1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .fade-in{opacity:0;transform:translateY(30px);transition:.8s ease-out}.fade-in.active{opacity:1;transform:translateY(0)}
      .reveal{opacity:0;transform:translateY(60px);transition:1s cubic-bezier(.4,0,.2,1)}.reveal.active{opacity:1;transform:translateY(0)}
      @media(max-width:991px){.hero-grid,.about-grid,.contact-card{grid-template-columns:1fr}.hero-title{font-size:3.5rem}.skills-grid{grid-template-columns:1fr}}
      @media(max-width:768px){.nav-list{display:none}.hero-title{font-size:2.8rem}.projects-grid{grid-template-columns:1fr}}
    `;

    const nameFirst = (personal.name||'').split(' ')[0]||'Your';
    const nameLast  = (personal.name||'').split(' ').slice(1).join(' ')||'Name';

    const body = `
<div class="blob-container"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>
<header class="header" id="header">
  <nav class="nav container">
    <a href="#" class="nav-logo">Port<span>Edge</span></a>
    <ul class="nav-list">
      <li><a href="#home" class="nav-link active">Home</a></li>
      <li><a href="#about" class="nav-link">About</a></li>
      ${safeSkills.length    ?`<li><a href="#skills"     class="nav-link">Skills</a></li>`:''}
      ${safeProjects.length  ?`<li><a href="#projects"   class="nav-link">Projects</a></li>`:''}
      ${safeEducation.length ?`<li><a href="#experience" class="nav-link">Experience</a></li>`:''}
      <li><a href="#contact" class="nav-link">Contact</a></li>
    </ul>
  </nav>
</header>

<main>
  <section class="hero" id="home">
    <div class="container hero-grid">
      <div class="hero-content">
        <span class="hero-label fade-in">Creative Tech Partner</span>
        <h1 class="hero-title fade-in">${e(nameFirst)} <span>${e(nameLast)}</span></h1>
        <p class="hero-subtitle fade-in">Building the next generation of <span id="typing-text"></span></p>
        <p class="hero-description fade-in">${e(personal.bio||'I craft high-performance, visually stunning digital solutions for forward-thinking brands and startups.')}</p>
        <div class="hero-btns fade-in">
          <a href="#projects" class="btn btn-primary">View Portfolio</a>
          <a href="#contact"  class="btn btn-outline">Let's Talk</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-card floating">
          <div class="card-header"><div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div></div>
          <div class="card-content"><code>
            <span class="c-purple">const</span> <span class="c-blue">developer</span> = {<br>
            &nbsp;&nbsp;name: <span class="c-teal">'${e(personal.name||'Developer')}'</span>,<br>
            &nbsp;&nbsp;role: <span class="c-teal">'${e(personal.title||'Architect')}'</span>,<br>
            &nbsp;&nbsp;drivenBy: <span class="c-teal">'Innovation'</span><br>
            };
          </code></div>
        </div>
      </div>
    </div>
  </section>

  <section class="about section" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-img reveal">
          <div class="img-wrapper" style="height:400px;background:linear-gradient(135deg,#f8f9fa,#e9ecef);display:flex;align-items:center;justify-content:center;font-size:6rem;color:${accent}">
            ${personal.avatar?`<img src="${e(personal.avatar)}" alt="${e(personal.name||'')}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'"><div class="gradient-overlay"></div>`:e((personal.name||'?').charAt(0))}
          </div>
        </div>
        <div class="about-content reveal">
          <h2 class="section-title">Elevating <span>Digital</span> Experiences</h2>
          <p class="about-text">${e(personal.bio||'My approach is centered around Modern Engineering and Vibrant Design.')}</p>
          <div class="about-stats">
            ${safeProjects.length?`<div class="stat-item"><span class="stat-num">${safeProjects.length}+</span><span class="stat-label">Projects Completed</span></div>`:''}
            ${contact.location?`<div class="stat-item"><span class="stat-num" style="font-size:1.2rem">${e(contact.location)}</span><span class="stat-label">Location</span></div>`:''}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${safeSkills.length?`
  <section class="skills section" id="skills">
    <div class="container">
      <div class="section-header"><h2 class="section-title">Core <span>Expertise</span></h2><p>Technological stack used to build high-converting platforms.</p></div>
      <div class="skills-grid">
        <div class="skills-column reveal">${safeSkills.slice(0,3).map((s,i)=>{const p=Math.max(70,95-i*4);const c=['teal','purple','blue'][i%3];return`<div class="skill-item"><div class="skill-info"><span>${e(s)}</span><span class="skill-val">${p}%</span></div><div class="skill-bar"><div class="skill-progress ${c}" style="width:0%" data-width="${p}%"></div></div></div>`;}).join('')}</div>
        <div class="skills-column reveal">${safeSkills.slice(3,6).map((s,i)=>{const p=Math.max(65,88-i*4);const c=['blue','teal','purple'][i%3];return`<div class="skill-item"><div class="skill-info"><span>${e(s)}</span><span class="skill-val">${p}%</span></div><div class="skill-bar"><div class="skill-progress ${c}" style="width:0%" data-width="${p}%"></div></div></div>`;}).join('')}</div>
      </div>
    </div>
  </section>`:''}

  ${safeProjects.length?`
  <section class="projects section" id="projects">
    <div class="container">
      <div class="section-header"><h2 class="section-title">Featured <span>Work</span></h2><p>Selected projects that demonstrate my commitment to excellence.</p></div>
      <div class="projects-grid">${projectsHTML}</div>
    </div>
  </section>`:''}

  ${safeEducation.length?`
  <section class="experience section" id="experience">
    <div class="container">
      <div class="section-header"><h2 class="section-title">The <span>Journey</span></h2><p>Professional path and milestones.</p></div>
      <div class="timeline">${timelineHTML}</div>
    </div>
  </section>`:''}

  <section class="contact section" id="contact">
    <div class="container">
      <div class="contact-card reveal">
        <div class="contact-info">
          <h2>Ready to <span style="-webkit-text-fill-color:#fff">collaborate?</span></h2>
          <p>Let's build something extraordinary together.</p>
          <div class="contact-details">
            ${contact.email?`<div class="contact-item"><i class="fas fa-envelope"></i><span>${e(contact.email)}</span></div>`:''}
            ${contact.location?`<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>${e(contact.location)}</span></div>`:''}
          </div>
        </div>
        <form class="contact-form">
          <div class="form-group"><input type="text" id="name" required><label for="name">Full Name</label><div class="form-line"></div></div>
          <div class="form-group"><input type="email" id="email" required><label for="email">Email Address</label><div class="form-line"></div></div>
          <div class="form-group"><textarea id="message" rows="4" required></textarea><label for="message">Project Brief</label><div class="form-line"></div></div>
          <button type="submit" class="btn btn-primary submit-btn">Send Request <i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <a href="#" class="nav-logo footer-logo">Port<span>Edge</span></a>
      <p>&copy; ${new Date().getFullYear()} ${e(personal.name||'PortEdge')}. All rights reserved.</p>
      <div class="footer-social">${socialHTML||'<a href="#"><i class="fab fa-github"></i></a>'}</div>
    </div>
  </div>
</footer>
<script>
  const header=document.getElementById('header');
  if(header) window.addEventListener('scroll',()=>header.classList.toggle('sticky',window.scrollY>100));
  
  const words=${titleWords};
  const el=document.getElementById('typing-text');
  if(el && words.length > 0){
    let wi=0,ci=0,del=false;
    function type(){
      const w=words[wi];
      el.textContent=del?w.substring(0,ci-1):w.substring(0,ci+1);
      if(!del&&el.textContent===w){del=true;setTimeout(type,2000);return;}
      if(del&&el.textContent===''){del=false;wi=(wi+1)%words.length;setTimeout(type,500);return;}
      ci=del?ci-1:ci+1;setTimeout(type,del?50:100);
    }
    type();
  }

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('active');
      if(entry.target.classList.contains('skills-grid')){
        entry.target.querySelectorAll('.skill-progress').forEach(b=>{b.style.width=b.getAttribute('data-width');});
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('.reveal,.fade-in,.skills-grid').forEach(el=>obs.observe(el));
  setTimeout(()=>document.querySelectorAll('.hero .fade-in').forEach(el=>el.classList.add('active')),100);

  const form=document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit',ev=>{
      ev.preventDefault();
      const btn=form.querySelector('.submit-btn');
      const orig=btn.innerHTML;
      btn.innerHTML='Sending... <i class="fas fa-spinner fa-spin"></i>';
      btn.style.pointerEvents='none';
      setTimeout(()=>{
        btn.innerHTML='Success <i class="fas fa-check"></i>';
        btn.style.background='linear-gradient(135deg,#20c997 0%,#007bff 100%)';
        setTimeout(()=>{
          btn.innerHTML=orig;
          btn.style.background='';
          btn.style.pointerEvents='all';
          form.reset();
        },3000);
      },2000);
    });
  }
</script>`;

    return buildDocument(body, css, personal.name, 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
  }

  // ─── renderTemp5 ─────────────────────────────────────────────────────────────
  // Neo-Brutalist 2.0 / Modern Developer (Inter / JetBrains Mono)
  function renderTemp5(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const e = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const accent = (theme && theme.accent) ? theme.accent : '#ff6b00';

    const itemsHTML = safeSkills.map(s => `<li>${e(s)}</li>`).join('');

    const projectsHTML = safeProjects.map((p, i) => `
      <div class="project-box" style="--img: url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800');">
        <div class="project-overlay">
          <div class="project-info">
            <h3>${e(p.title)}</h3>
            <p>${e(p.description)}</p>
            <div class="tags"><span>${e((p.tech || '').split(',')[0] || 'Dev')}</span></div>
            <div class="project-links">${p.link ? `<a href="${norm(p.link)}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}</div>
          </div>
        </div>
      </div>`).join('');

    const timelineHTML = safeEducation.map(edu => `
      <div class="timeline-item">
        <div class="timeline-date">${e(edu.from)} - ${edu.current ? 'Present' : e(edu.to)}</div>
        <div class="timeline-card"><h3>${e(edu.degree)}</h3><h4>${e(edu.institution)}</h4><p>${e(edu.field)}</p></div>
      </div>`).join('');

    const css = `
      :root { --bg-primary: #0a0a0a; --bg-secondary: #0d0d0f; --accent: ${accent}; --text-primary: #fafafa; --text-secondary: #a1a1aa; --border: rgba(255,255,255,0.08); --font-mono: 'JetBrains Mono', monospace; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background: var(--bg-primary); background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 80px 80px; background-attachment: fixed; color: var(--text-primary); font-family: 'Inter', sans-serif; line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
      .section { padding: 8rem 0; }
      .section-header h2 { font-size: 2.5rem; text-transform: uppercase; letter-spacing: -1px; display: inline-flex; align-items: center; gap: 15px; }
      .section-header h2::before { content: '['; color: var(--accent); }
      .section-header h2::after { content: ']'; color: var(--accent); }
      #navbar { position: fixed; top: 0; width: 100%; z-index: 1000; background: rgba(10,10,10,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 2px solid var(--border); padding: 1.5rem 0; }
      .hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem; align-items: center; min-height: calc(100vh - 80px); }
      .hero-title { font-size: 5rem; font-weight: 800; letter-spacing: -2px; line-height: 1; }
      .about-card { padding: 2.5rem; background: var(--bg-secondary); border: 2px solid var(--border); border-radius: 8px; transition: 0.3s; }
      .about-card:hover { border-color: var(--accent); transform: translate(-4px, -4px); box-shadow: 8px 8px 0px var(--accent); }
      .btn { display: inline-block; padding: 1rem 2.5rem; border-radius: 4px; cursor: pointer; border: 2px solid var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; }
      .btn-primary { background: var(--accent); color: #000; }
      .btn-primary:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0px #000; }
      .timeline::before { content:''; position: absolute; left: 200px; top:10px; width: 2px; height: calc(100% - 20px); background: var(--border); }
      .timeline-item { display: flex; margin-bottom: 4rem; position: relative; }
      .timeline-date { width: 180px; font-family: var(--font-mono); color: var(--accent); font-weight:700; }
      @media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr; text-align: center; } .hero-title { font-size: 3.5rem; } .timeline::before { left: 20px; } .timeline-item { flex-direction: column; } .timeline-date { margin-bottom: 1rem; padding-left: 2.5rem; } }
    `;

    const body = `
      <nav id="navbar"><div class="nav-container container"><a href="#" style="font-family:var(--font-mono);font-weight:800;font-size:1.5rem;color:var(--text-primary)">Port<span style="color:var(--accent)">Edge</span>.exe</a></div></nav>
      <section id="hero" class="container"><div class="hero-grid">
        <div class="reveal">
          <p style="font-family:var(--font-mono);color:var(--accent);margin-bottom:1rem">SYSTEM_READY</p>
          <h1 class="hero-title">${e(personal.name)}</h1>
          <p style="font-size:1.25rem;color:var(--text-secondary);margin:2rem 0;max-width:600px">${e(personal.bio)}</p>
          <div style="display:flex;gap:1.5rem"><a href="#projects" class="btn btn-primary">Init_View(Works)</a><a href="#contact" class="btn" style="color:var(--text-primary)">Open_Comm()</a></div>
        </div>
        <div class="hero-pattern" style="background:var(--bg-secondary);padding:3rem;border-radius:12px;border:3px solid var(--accent);box-shadow:12px 12px 0px var(--border)">
          <pre style="font-family:var(--font-mono);color:var(--text-secondary);font-size:1.1rem"><code><span style="color:#c678dd">class</span> <span style="color:#e06c75">Architect</span> {<br>&nbsp;&nbsp;name: <span style="color:#98c379">'${e(personal.name)}'</span>,<br>&nbsp;&nbsp;vision: <span style="color:#98c379">'Neo-Brutalist'</span>,<br>&nbsp;&nbsp;status: <span style="color:#98c379">'Designing'</span><br>};</code></pre>
        </div>
      </div></section>
      <section id="skills" class="section container"><div class="section-header"><h2>Expertise</h2></div><div class="skills-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem">
        <div class="about-card"><i class="fas fa-terminal" style="font-size:2rem;color:var(--accent);margin-bottom:1.5rem"></i><h3>Core Dev</h3><ul style="list-style:none;margin-top:1rem;color:var(--text-secondary)">${itemsHTML}</ul></div>
      </div></section>
      <section id="projects" class="section container"><div class="section-header"><h2>Works</h2></div><div class="projects-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:2.5rem">${projectsHTML}</div></section>
      <section id="experience" class="section container"><div class="section-header"><h2>Journey</h2></div><div class="timeline">${timelineHTML}</div></section>
      <script>
        const obs = new IntersectionObserver(entries => {
          entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('active'); });
        });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      </script>
    `;

    return buildDocument(body, css, personal.name, 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
  }

  // ─── renderTemp6 ─────────────────────────────────────────────────────────────
  // Artistic Elegance / Highly Creative (Space Grotesk / Outfit)
  function renderTemp6(d) {
    const { personal, skills, projects, education, contact, theme } = d;
    const e = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const norm = v => { const r=String(v||'').trim(); return r&&!/^https?:\/\//i.test(r)?'https://'+r:r; };

    const accent = (theme && theme.accent) ? theme.accent : '#db2777';

    const projectsHTML = (projects || []).map(p => `
      <div class="project-item reveal">
        <div class="project-img-wrapper"><img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" alt="${e(p.title)}"></div>
        <div class="project-info"><h3>${e(p.title)}</h3><a href="${norm(p.link)}" target="_blank" class="project-link">View Project</a></div>
      </div>`).join('');

    const css = `
      :root { --bg-dark: #0a0a0c; --accent: ${accent}; --text-main: #f8fafc; --font-heading: 'Space Grotesk', sans-serif; --font-body: 'Outfit', sans-serif; }
      body { background: var(--bg-dark); color: var(--text-main); font-family: var(--font-body); overflow-x: hidden; }
      .container { max-width: 1300px; margin: 0 auto; padding: 0 40px; }
      .floating-blob { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.15; z-index: -1; animation: orbit 30s infinite alternate ease-in-out; }
      @keyframes orbit { from { transform: translate(0,0) rotate(0deg); } to { transform: translate(100px, 50px) rotate(360deg); } }
      .hero-section { min-height: 100vh; display: flex; align-items: center; position: relative; }
      .hero-title { font-family: var(--font-heading); font-size: clamp(4rem, 12vw, 10rem); line-height: 0.85; font-weight: 700; letter-spacing: -6px; display:flex; flex-wrap:wrap; align-items:baseline; gap:0 40px; width:100% }
      .hero-title .accent { color: var(--accent); text-shadow: 0 0 40px rgba(219, 39, 119, 0.4); }
      #navbar { position: fixed; top: 0; width: 100%; z-index: 1000; padding: 25px 0; transition: 0.5s; }
      #navbar.scrolled { background: rgba(10, 10, 12, 0.4); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-bottom: 2px solid rgba(255,255,255,0.08); padding: 15px 0; }
      .asymmetric-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 100px; align-items: center; }
      .section-title { font-family: var(--font-heading); font-size: clamp(3rem, 6vw, 5rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -3px; }
      .project-item { position: relative; border-radius: 40px; overflow: hidden; margin-bottom: 40px; transition: 0.8s cubic-bezier(0.2,0,0.2,1); }
      .project-item:hover { transform: scale(1.02); }
      .project-info { position: absolute; bottom: 0; padding: 10%; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); width: 100%; transition: 0.5s; transform: translateY(20px); opacity: 0; }
      .project-item:hover .project-info { transform: translateY(0); opacity: 1; }
      .reveal { opacity: 0; transform: translateY(30px); transition: 1.2s cubic-bezier(0.1, 0, 0.2, 1); }
      .reveal.active { opacity: 1; transform: translateY(0); }
      .image-stack { position: relative; height: 600px; width: 100%; border-radius: 30px; overflow: hidden; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5); }
      .contact-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border-radius: 40px; padding: 10%; border: 1px solid rgba(255,255,255,0.1); }
      @media (max-width: 1024px) { .asymmetric-grid { grid-template-columns: 1fr; } .hero-title { font-size: 4rem; } }
    `;

    const body = `
      <div class="floating-blob" style="width:600px;height:600px;background:var(--accent);top:-10%;left:-10%"></div>
      <div class="floating-blob" style="width:400px;height:400px;background:#6d28d9;bottom:10%;right:-5%;animation-delay:-10s"></div>
      <nav id="navbar" class="container" style="display:flex;justify-content:space-between;align-items:center"><a href="#" style="font-family:var(--font-heading);font-weight:700;font-size:2rem">Port.<span>Edge</span></a></nav>
      <header class="hero-section container">
        <div class="hero-text-wrapper reveal">
          <p style="font-family:var(--font-heading);text-transform:uppercase;letter-spacing:10px;color:var(--accent);margin-bottom:20px">Visionary Engineering</p>
          <h1 class="hero-title"><span>${e(personal.name)}</span> <span class="accent">Artis</span></h1>
          <p style="font-size:1.8rem;color:#94a3b8;margin-top:2rem;max-width:700px;line-height:1.4">${e(personal.bio)}</p>
        </div>
      </header>
      <section class="container"><div class="asymmetric-grid">
        <div class="image-stack reveal">
          ${personal.avatar?`<img src="${e(personal.avatar)}" style="width:100%;height:100%;object-fit:cover">`: `<div style="width:100%;height:100%;background:linear-gradient(45deg,var(--bg-dark),var(--accent));display:flex;align-items:center;justify-content:center;font-size:8rem;font-weight:700">${personal.name.charAt(0)}</div>` }
        </div>
        <div class="reveal" style="padding:40px">
          <h2 class="section-title">The Philosophy</h2>
          <p style="font-size:1.5rem;color:#94a3b8;font-weight:300;line-height:1.6">${e(personal.bio)}</p>
          <div style="margin-top:3rem"><a href="#contact" style="font-size:1.2rem;color:var(--accent);text-transform:uppercase;letter-spacing:4px;font-weight:600;display:flex;align-items:center;gap:15px">Start Project <i class="fas fa-arrow-right"></i></a></div>
        </div>
      </div></section>
      <section class="container" style="margin-top:150px"><h2 class="section-title">Gallery</h2><div class="projects-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:3rem">${projectsHTML}</div></section>
      <section class="container" style="margin:150px 0"><div class="contact-card reveal">
        <h2 class="section-title">Let's Create</h2>
        <p style="font-size:1.25rem;color:#94a3b8;margin-bottom:3rem">No boundaries. Just pure innovation.</p>
        <div style="display:flex;gap:40px;flex-wrap:wrap">
          <div style="flex:1;min-width:300px">
            <p style="font-size:0.9rem;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px">Digital Address</p>
            <p style="font-size:1.5rem;font-weight:600">${e(contact.email||'hello@portedge.io')}</p>
          </div>
          <div style="flex:1;min-width:300px">
            <p style="font-size:0.9rem;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px">Location</p>
            <p style="font-size:1.5rem;font-weight:600">${e(contact.location||'Global / Remote')}</p>
          </div>
        </div>
      </div></section>
      <script>
        const nav=document.getElementById('navbar');
        window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>50));
        const obs = new IntersectionObserver(entries => {
          entries.forEach((entry, i) => { 
            if(entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('active'), i * 150);
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      </script>
    `;

    return buildDocument(body, css, personal.name, 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Space+Grotesk:wght@500;700;800&display=swap');
  }

  function render() {
    const source = State.data();
    const d = source;
    const tpl = d.selectedTemplate || 'temp1';

    switch (tpl) {
      case 'temp1': return renderTemp1(d);
      case 'temp2': return renderTemp2(d);
      case 'temp3': return renderTemp3(d);
      case 'temp4': return renderTemp4(d);
      case 'temp5': return renderTemp5(d);
      case 'temp6': return renderTemp6(d);
      default:      return renderTemp1(d);
    }
  }

  return { render, buildDocument };
})();
