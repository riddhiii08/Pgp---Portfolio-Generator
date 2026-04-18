

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
  function buildDocument(bodyHTML, css, title, fontURL) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
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
    //new functn added for temp1 testing //
    function rendertemp1(d) {
  return `
    <h1>${d.personal.name}</h1>
    <p>${d.personal.title}</p>
  `;
}

    const safeSkills = Array.isArray(skills) ? skills.map((s) => String(s || '').trim()).filter(Boolean) : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeEducation = Array.isArray(education) ? education : [];

    const normalizeLink = (value) => {
      const raw = String(value || '').trim();
      if (!raw) return '';
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    };

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
  function renderGeneric(d, theme, tpl) {
    const meta = TEMPLATES.find(t => t.id === tpl) || TEMPLATES[0];
    const base = renderMinimalClean(d, theme);
    return base.replace(
      '<div class="container">',
      `<div style="height:8px;background:${meta.gradient}"></div><div class="container">`
    );
  }
  function render() {
    const source = State.data();
    const previewLayoutOverride = typeof window !== 'undefined' ? window.__previewLayoutOverride : null;
    const d = previewLayoutOverride
      ? {
          ...source,
          theme: {
            ...source.theme,
            layout: previewLayoutOverride
          }
        }
      : source;
    const allowedTemplates = new Set([
      'minimal-clean',
      'executive',
      'sidebar-pro',
      'glassmorphic',
      'editorial',
      'matrix-grid'
    ]);
    const tpl = allowedTemplates.has(d.selectedTemplate) ? d.selectedTemplate : 'minimal-clean';

    switch (tpl) {
      case 'minimal-clean': return renderModernPortfolio(d, 'theme-minimal', 'minimal-clean');
      case 'executive':     return renderModernPortfolio(d, 'theme-minimal', 'executive');
      case 'sidebar-pro':   return renderModernPortfolio(d, 'theme-dark', 'sidebar-pro');
      case 'glassmorphic':  return renderModernPortfolio(d, 'theme-creative', 'glassmorphic');
      case 'editorial':     return renderModernPortfolio(d, 'theme-creative', 'editorial');
      case 'matrix-grid':   return renderModernPortfolio(d, 'theme-grid', 'matrix-grid');
      case 'temp1':         return renderTemp1(d);
      default:              return renderModernPortfolio(d, 'theme-minimal', 'minimal-clean');
    }
  }

  return { render, buildDocument };
})();
