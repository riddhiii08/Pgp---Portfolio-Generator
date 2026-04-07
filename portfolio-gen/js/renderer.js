/* ═══════════════════════════════════════════════
   RENDERER.JS — Portfolio HTML Generator
   
   Takes app state (data + template + theme) and
   outputs a complete standalone HTML document.
   
   3 fully implemented templates:
     - minimal-clean
     - sidebar-pro
     - terminal
   
   Other templates render with correct styling
   using their theme colors/gradients.
═══════════════════════════════════════════════ */

const Renderer = (() => {

  // ── Font imports map ──
  const FONT_IMPORTS = {
    'DM Sans':    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap',
    'Inter':      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'Poppins':    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    'Roboto':     'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
  };

  // ── Helpers ──
  const esc = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const initials = name => name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  const skillsHTML = (skills) => skills.map(s =>
    `<span class="skill-chip">${esc(s)}</span>`).join('');
  const socialLinks = (contact, accent) => {
    const links = [];
    if (contact.github)   links.push(`<a href="${esc(contact.github)}" target="_blank">GitHub</a>`);
    if (contact.linkedin) links.push(`<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>`);
    if (contact.twitter)  links.push(`<a href="${esc(contact.twitter)}" target="_blank">Twitter</a>`);
    if (contact.website)  links.push(`<a href="${esc(contact.website)}" target="_blank">Website</a>`);
    return links.join(' · ');
  };

  // ── Wrapper: build full standalone HTML doc ──
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

  // ══════════════════════════════════════════════
  // TEMPLATE 1: MINIMAL CLEAN
  // ══════════════════════════════════════════════
  function renderMinimalClean(d, theme) {
    const { personal, skills, projects, education, contact } = d;
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
      .container { max-width: 800px; margin: 0 auto; padding: 60px 32px; }
      /* Header */
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
      .contact-line span::before { content: '·'; margin-right: 8px; }
      .contact-line span:first-child::before { content: ''; margin: 0; }
      /* Sections */
      section { margin-bottom: 48px; }
      .section-title {
        font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 8px; margin-bottom: 20px;
      }
      .bio { color: ${muted}; line-height: 1.8; font-size: .97rem; }
      /* Skills */
      .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-chip {
        padding: 5px 14px; background: ${cardBg}; border: 1px solid ${border};
        border-radius: 9999px; font-size: .8rem; font-weight: 500; color: ${ink};
      }
      /* Projects */
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
      /* Education */
      .edu-item { display: flex; gap: 20px; margin-bottom: 20px; }
      .edu-dot { width: 10px; height: 10px; border-radius: 50%; background: ${accent}; margin-top: 6px; flex-shrink: 0; }
      .edu-name { font-weight: 600; margin-bottom: 2px; }
      .edu-degree { font-size: .875rem; color: ${muted}; }
      .edu-dates { font-size: .78rem; color: ${muted}; margin-top: 2px; }
      /* Socials */
      .social-links { display: flex; flex-wrap: wrap; gap: 12px; }
      .social-links a {
        padding: 8px 18px; border: 1.5px solid ${border}; border-radius: 9999px;
        font-size: .85rem; font-weight: 500; color: ${ink}; transition: all .2s;
      }
      .social-links a:hover { background: ${accent}; border-color: ${accent}; color: white; text-decoration: none; }
      /* Footer */
      .footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid ${border}; text-align: center; font-size: .75rem; color: ${muted}; }
    `;

    const projectsHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-title">${esc(p.title)}</div>
        <div class="project-desc">${esc(p.description)}</div>
        <div class="project-footer">
          <div class="tech-tags">${(p.tech || '').split(',').filter(Boolean).map(t =>
            `<span class="tech-tag">${esc(t.trim())}</span>`).join('')}</div>
          ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank">View Project →</a>` : ''}
        </div>
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="edu-item">
        <div class="edu-dot"></div>
        <div>
          <div class="edu-name">${esc(e.institution)}</div>
          <div class="edu-degree">${esc(e.degree)} ${e.field ? `in ${esc(e.field)}` : ''}</div>
          <div class="edu-dates">${esc(e.from || '')}${e.to ? ` – ${e.current ? 'Present' : esc(e.to)}` : ''}</div>
        </div>
      </div>`).join('');

    const contactLine = [
      contact.email && `<span>${esc(contact.email)}</span>`,
      contact.phone && `<span>${esc(contact.phone)}</span>`,
      contact.location && `<span>${esc(contact.location)}</span>`
    ].filter(Boolean).join('');

    const body = `
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

      ${personal.bio ? `<section>
        <div class="section-title">About</div>
        <p class="bio">${esc(personal.bio)}</p>
      </section>` : ''}

      ${theme.showSkills && skills.length ? `<section>
        <div class="section-title">Skills</div>
        <div class="skills-wrap">${skillsHTML(skills)}</div>
      </section>` : ''}

      ${projects.length ? `<section>
        <div class="section-title">Projects</div>
        ${projectsHTML}
      </section>` : ''}

      ${education.length ? `<section>
        <div class="section-title">Education</div>
        ${eduHTML}
      </section>` : ''}

      <section>
        <div class="section-title">Connect</div>
        <div class="social-links">
          ${contact.email ? `<a href="mailto:${esc(contact.email)}">Email</a>` : ''}
          ${contact.github ? `<a href="${esc(contact.github)}" target="_blank">GitHub</a>` : ''}
          ${contact.linkedin ? `<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>` : ''}
          ${contact.twitter ? `<a href="${esc(contact.twitter)}" target="_blank">Twitter</a>` : ''}
          ${contact.website ? `<a href="${esc(contact.website)}" target="_blank">Website</a>` : ''}
        </div>
      </section>

      <div class="footer">Built with PortfolioForge · ${new Date().getFullYear()}</div>
    </div>`;

    return buildDocument(body, css, personal.name, FONT_IMPORTS[font]);
  }

  // ══════════════════════════════════════════════
  // TEMPLATE 2: SIDEBAR PRO
  // ══════════════════════════════════════════════
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
      /* Sidebar */
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
      /* Main */
      .main { flex: 1; padding: 48px 44px; }
      section { margin-bottom: 40px; }
      .section-title {
        font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; border-bottom: 2px solid ${accent}22; padding-bottom: 8px; margin-bottom: 20px;
      }
      .bio { color: ${mainMuted}; line-height: 1.8; font-size: .95rem; }
      /* Projects */
      .projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .project-card {
        padding: 20px; background: ${cardBg}; border-radius: 10px; border: 1px solid ${border};
      }
      .project-title { font-weight: 600; font-size: .95rem; margin-bottom: 6px; }
      .project-desc { font-size: .82rem; color: ${mainMuted}; margin-bottom: 12px; line-height: 1.5; }
      .tech-tags { display: flex; flex-wrap: wrap; gap: 4px; }
      .tech-tag { padding: 2px 8px; background: ${accent}18; border-radius: 9999px; font-size: .7rem; color: ${accent}; }
      .project-link { font-size: .78rem; color: ${accent}; margin-top: 8px; display: block; }
      /* Education */
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
        ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank">View →</a>` : ''}
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="edu-item">
        <div class="edu-name">${esc(e.institution)}</div>
        <div class="edu-degree">${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}</div>
        <div class="edu-dates">${esc(e.from || '')}${e.to ? ` – ${e.current ? 'Present' : esc(e.to)}` : ''}</div>
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
      ${contact.email ? `<div class="s-contact-item">✉ <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div>` : ''}
      ${contact.phone ? `<div class="s-contact-item">☎ ${esc(contact.phone)}</div>` : ''}
      ${contact.location ? `<div class="s-contact-item">📍 ${esc(contact.location)}</div>` : ''}
      ${contact.github ? `<div class="s-contact-item">⌥ <a href="${esc(contact.github)}" target="_blank">GitHub</a></div>` : ''}
      ${contact.linkedin ? `<div class="s-contact-item">in <a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a></div>` : ''}
      ${contact.website ? `<div class="s-contact-item">🌐 <a href="${esc(contact.website)}" target="_blank">Website</a></div>` : ''}
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

  // ══════════════════════════════════════════════
  // TEMPLATE 3: TERMINAL
  // ══════════════════════════════════════════════
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
      /* Window chrome */
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
      /* Prompt lines */
      .prompt { display: flex; gap: 10px; margin-bottom: 4px; font-size: .875rem; }
      .p-user { color: ${green}; } .p-sep { color: ${muted}; } .p-cmd { color: ${ink}; }
      .p-path { color: ${blue}; }
      .output { padding-left: 0; margin-bottom: 20px; }
      /* Comments */
      .comment { color: ${muted}; font-size: .78rem; margin-bottom: 16px; }
      /* Header output */
      .ascii-name {
        color: ${accent}; font-size: 1.1rem; font-weight: 700; letter-spacing: .05em;
        border: 1px solid ${accent}44; padding: 12px 20px; display: inline-block;
        border-radius: 4px; margin-bottom: 8px;
      }
      .role-line { color: ${muted}; font-size: .85rem; margin-bottom: 16px; }
      /* Skills */
      .skill-chip { color: ${green}; margin-right: 6px; font-size: .82rem; }
      /* Section header */
      .s-header { color: ${blue}; font-size: .85rem; font-weight: 700; margin-bottom: 12px; }
      /* Project */
      .project-block { border-left: 2px solid ${accent}; padding: 12px 16px; margin-bottom: 16px; background: #0d1117; border-radius: 0 6px 6px 0; }
      .proj-title { color: ${ink}; font-weight: 700; margin-bottom: 4px; font-size: .9rem; }
      .proj-desc { color: ${muted}; font-size: .8rem; margin-bottom: 8px; line-height: 1.6; }
      .proj-meta { font-size: .75rem; }
      .proj-tech { color: ${accent}; } .proj-link { color: ${blue}; margin-left: 12px; }
      /* Education */
      .edu-block { margin-bottom: 12px; }
      .edu-inst { color: ${ink}; font-weight: 600; font-size: .87rem; }
      .edu-deg { color: ${muted}; font-size: .8rem; }
      .edu-dates { color: ${accent}; font-size: .75rem; }
      /* Contact */
      .contact-row { display: flex; align-items: center; gap: 12px; font-size: .82rem; color: ${muted}; margin-bottom: 6px; }
      .c-key { color: ${blue}; min-width: 90px; } .c-eq { color: ${muted}; } .c-val { color: ${green}; }
      /* Cursor */
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
        <div class="edu-dates">${esc(e.from || '')}${e.to ? ` → ${e.current ? 'now' : esc(e.to)}` : ''}</div>
      </div>`).join('');

    const body = `
    <div class="container">
      <div class="window-bar">
        <div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div>
        <div class="window-title">portfolio.sh — bash — 120×40</div>
      </div>
      <div class="terminal-body">
        <div class="comment">## ${esc(personal.name || 'developer')}'s portfolio — ${new Date().getFullYear()}</div>

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

  // ══════════════════════════════════════════════
  // TEMPLATE 4: GLASSMORPHIC (Creative)
  // ══════════════════════════════════════════════
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
        ${p.link?`<a class="project-link" href="${esc(p.link)}" target="_blank">→ ${esc(p.link)}</a>`:''}
      </div>`).join('');

    const eduHTML = education.map(e=>`
      <div class="edu-item">
        <div class="edu-name">${esc(e.institution)}</div>
        <div class="edu-degree">${esc(e.degree)}${e.field?`, ${esc(e.field)}`:''}</div>
        <div class="edu-dates">${esc(e.from||'')}${e.to?` – ${e.current?'Present':esc(e.to)}`:''}</div>
      </div>`).join('');

    const body = `
    <div class="container">
      <div class="glass header">
        ${theme.showPhoto?`<div class="avatar">${personal.avatar?`<img src="${esc(personal.avatar)}" onerror="this.style.display='none'"/>`:initials(personal.name)}</div>`:``}
        <div>
          <h1>${esc(personal.name)||'Your Name'}</h1>
          <div class="role">${esc(personal.title)||'Your Title'}</div>
          <div class="contact-line">${[contact.email,contact.phone,contact.location].filter(Boolean).map(esc).join(' · ')}</div>
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

  // ══════════════════════════════════════════════
  // GENERIC FALLBACK for other templates
  // ══════════════════════════════════════════════
  function renderGeneric(d, theme, tpl) {
    // Find template meta for gradient
    const meta = TEMPLATES.find(t => t.id === tpl) || TEMPLATES[0];
    // Use minimal-clean as base, apply template gradient as hero
    const base = renderMinimalClean(d, theme);
    // Inject a hero gradient bar
    return base.replace(
      '<div class="container">',
      `<div style="height:8px;background:${meta.gradient}"></div><div class="container">`
    );
  }

  // ══════════════════════════════════════════════
  // MAIN RENDER FUNCTION — Public API
  // ══════════════════════════════════════════════
  function render() {
    const d = State.data();
    const theme = d.theme;
    const tpl = d.selectedTemplate;

    switch (tpl) {
      case 'minimal-clean': return renderMinimalClean(d, theme);
      case 'sidebar-pro':   return renderSidebarPro(d, theme);
      case 'terminal':      return renderTerminal(d, theme);
      case 'glassmorphic':  return renderGlassmorphic(d, theme);
      case 'executive':     return renderMinimalClean(d, { ...theme, darkMode: true });
      case 'neon-dark':     return renderTerminal(d, { ...theme, accent: '#00ffcc' });
      case 'devcard':       return renderSidebarPro(d, { ...theme, darkMode: true });
      default:              return renderGeneric(d, theme, tpl);
    }
  }

  return { render, buildDocument };
})();