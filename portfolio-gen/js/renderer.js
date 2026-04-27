/**
 * renderer.js — Data-driven portfolio renderer
 * Public API: Renderer.render(), Renderer.buildDocument(), Renderer.loadTemplate(), Renderer.renderSelectedTemplate()
 *
 * Architecture:
 *  TEMPLATE_CONFIGS  — one config object per template (replaces per-template functions)
 *  BASE_CSS          — shared resets, typography, common components
 *  LAYOUT_CSS        — 4 layout variants (single | sidebar | grid | timeline)
 *  STYLE_CSS         — 6 visual personalities (futuristic | minimal | cyberpunk | startup | brutalist | artistic)
 *  Section builders  — buildHero, buildSkills, buildProjects, buildEducation, buildContact
 *  render()          — picks config, assembles everything, returns full HTML string
 *  loadTemplate()    — template file first, generic renderer fallback
 */

const Renderer = (() => {

  // ─── Utilities ────────────────────────────────────────────────────────────────
  const esc  = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const norm = v => { const r = String(v || '').trim(); return r && !/^https?:\/\//i.test(r) ? `https://${r}` : r; };
  const normImage = (v) => {
    const r = String(v || '').trim().replace(/^['\"]|['\"]$/g, '');
    if (!r) return '';
    if (/^[a-zA-Z]:[\\/]/.test(r)) return encodeURI(`file:///${r.replace(/\\/g, '/')}`);
    if (/^\\\\/.test(r)) return encodeURI(`file:${r.replace(/\\/g, '/')}`);
    if (/^(https?:|data:|blob:)/i.test(r)) return r;
    if (r.startsWith('//')) return `https:${r}`;
    if (/^www\./i.test(r)) return `https://${r}`;
    if (/^(\.{1,2}[\\/]|[\\/])/.test(r)) {
      try {
        return new URL(r.replace(/\\/g, '/'), window.location.href).toString();
      } catch (_) {
        return r.replace(/\\/g, '/');
      }
    }
    return r;
  };
  const initials = n => n ? n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : '?';
  const safe = (arr) => Array.isArray(arr) ? arr.filter(Boolean) : [];

  // ─── Font registry ────────────────────────────────────────────────────────────
  const FONTS = {
    'DM Sans':  { url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',         stack: "'DM Sans', sans-serif" },
    Inter:      { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',            stack: "'Inter', sans-serif" },
    Poppins:    { url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',      stack: "'Poppins', sans-serif" },
    Montserrat: { url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',       stack: "'Montserrat', sans-serif" },
    'Playfair Display': { url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', stack: "'Playfair Display', serif" },
    Playfair:   { url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', stack: "'Playfair Display', serif" },
    Roboto:     { url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',               stack: "'Roboto', sans-serif" },
    Orbitron:   { url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@400;700&display=swap', stack: "'Orbitron', sans-serif" },
    Outfit:     { url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Space+Grotesk:wght@500;700;800&display=swap', stack: "'Outfit', sans-serif" },
    JetBrains:  { url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',           stack: "'JetBrains Mono', monospace" },
  };

  // ─── Template configs ─────────────────────────────────────────────────────────
  // Each entry drives the entire render — no per-template function needed.
  // Adding a new template = adding one object here.
  const TEMPLATE_CONFIGS = {
    temp1: {
      name: 'Futuristic',
      font: 'Inter',
      monoFont: 'Poppins',
      layout: 'single',
      style: 'futuristic',
      vars: { bg: '#050510', bgCard: 'rgba(255,255,255,.03)', ink: '#e0e0e0', muted: '#a0a0c0', border: 'rgba(255,255,255,0.1)', accent: '#00d2ff', radius: '20px' },
      extraCSS: `
        body { background: radial-gradient(circle at 10% 20%, var(--accent-a11) 0%, transparent 40%), radial-gradient(circle at 90% 80%, #3a7bd511 0%, transparent 40%), var(--bg); }
        .hero { min-height: 100vh; display: flex; align-items: center; padding: 0 8%; gap: 60px; }
        .hero-visual { flex: 0 0 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, var(--accent), #3a7bd5); filter: blur(60px); opacity: .35; }
        .project-card:hover { border-color: var(--accent); box-shadow: 0 0 24px var(--accent-a33); }
        nav { position: sticky; top: 0; background: rgba(5,5,16,.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
      `
    },
    temp2: {
      name: 'Minimal Elegant',
      font: 'Montserrat',
      monoFont: 'Playfair',
      layout: 'single',
      style: 'minimal',
      vars: { bg: '#ffffff', bgCard: '#f8f9fa', ink: '#2d3436', muted: '#636e72', border: '#eeeeee', accent: '#f7a072', radius: '12px' },
      extraCSS: `
        body { background: linear-gradient(135deg, #fff 0%, #fdeff9 50%, #ecf2ff 100%); background-attachment: fixed; }
        .section-title { font-family: 'Playfair Display', serif; letter-spacing: -1px; }
        .section-title::after { content: ''; display: block; width: 50px; height: 2px; background: var(--accent); margin-top: 8px; }
        .skill-bar { height: 4px; border-radius: 2px; }
        nav { background: rgba(255,255,255,.85); backdrop-filter: blur(14px); }
      `
    },
    temp3: {
      name: 'Cyberpunk',
      font: 'Orbitron',
      monoFont: 'Orbitron',
      layout: 'single',
      style: 'cyberpunk',
      vars: { bg: '#050505', bgCard: 'rgba(20,20,20,.8)', ink: '#fafafa', muted: '#888888', border: 'rgba(255,255,255,0.08)', accent: '#00f7ff', radius: '4px' },
      extraCSS: `
        body { background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 40px 40px; }
        .section-title::before { content: '['; color: var(--accent); margin-right: 6px; }
        .section-title::after  { content: ']'; color: var(--accent); margin-left: 6px; }
        .project-card { border: 1px solid #222; }
        .project-card:hover { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-a22); transform: scale(1.02); }
        nav { border-bottom: 1px solid var(--accent); }
        .skill-bar { background: #111; } .skill-fill { box-shadow: 0 0 8px var(--accent); }
      `
    },
    temp4: {
      name: 'Modern Startup',
      font: 'Outfit',
      monoFont: 'Inter',
      layout: 'single',
      style: 'startup',
      vars: { bg: '#f8f9fa', bgCard: '#ffffff', ink: '#1e293b', muted: '#64748b', border: '#e2e8f0', accent: '#6f42c1', radius: '16px' },
      extraCSS: `
        body { background: var(--bg); }
        .hero { min-height: 100vh; }
        .hero-visual-card { background: #0f172a; border-radius: 16px; padding: 28px; font-family: 'JetBrains Mono', monospace; color: #e6edf3; font-size: .9rem; line-height: 1.8; }
        .project-card { border-top: 3px solid var(--accent); }
        .project-card:hover { transform: translateY(-12px); }
        nav { background: rgba(248,249,250,.85); backdrop-filter: blur(14px); }
        .skill-bar { height: 10px; border-radius: 5px; }
      `
    },
    temp5: {
      name: 'Neo-Brutalist',
      font: 'Inter',
      monoFont: 'JetBrains',
      layout: 'single',
      style: 'brutalist',
      vars: { bg: '#0a0a0a', bgCard: '#111111', ink: '#fafafa', muted: '#71717a', border: 'rgba(255,255,255,0.08)', accent: '#ff6b00', radius: '4px' },
      extraCSS: `
        body { background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 80px 80px; background-attachment: fixed; }
        .project-card:hover { transform: translate(-4px,-4px); box-shadow: 8px 8px 0 var(--accent); border-color: var(--accent); }
        .hero-code-block { background: #0d1117; border: 1px solid var(--border); border-radius: 8px; padding: 28px; font-family: 'JetBrains Mono', monospace; font-size: .9rem; line-height: 1.9; color: #e6edf3; }
        nav { border-bottom: 2px solid var(--border); font-family: 'JetBrains Mono', monospace; }
        .skill-bar { height: 8px; border-radius: 2px; background: #222; }
      `
    },
    temp6: {
      name: 'Artistic',
      font: 'Outfit',
      monoFont: 'Outfit',
      layout: 'single',
      style: 'artistic',
      vars: { bg: '#0a0a0c', bgCard: 'rgba(255,255,255,.04)', ink: '#f8fafc', muted: '#94a3b8', border: 'rgba(255,255,255,0.1)', accent: '#db2777', radius: '30px' },
      extraCSS: `
        body { background: var(--bg); }
        .hero { min-height: 100vh; display: flex; align-items: center; }
        .hero-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(4rem,12vw,9rem); line-height: .9; font-weight: 700; letter-spacing: -5px; }
        .project-card { border-radius: 40px; overflow: hidden; }
        .project-card:hover { transform: scale(1.02); }
        nav { background: rgba(10,10,12,.4); backdrop-filter: blur(40px); }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.5rem,6vw,5rem); font-weight: 700; letter-spacing: -3px; }
      `
    },
    // ── Adding a new template is just a new entry below ──
    // temp7: { name: '...', font: '...', layout: '...', style: '...', vars: {...}, extraCSS: '' }
  };

  // ─── Base CSS (shared across all templates) ───────────────────────────────────
  const BASE_CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font-body); color: var(--ink); line-height: 1.6; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    a { text-decoration: none; color: inherit; transition: all .3s ease; }
    ul { list-style: none; }
    img { max-width: 100%; display: block; }
    section { padding: 100px 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 28px; }

    /* Nav */
    nav { position: sticky; top: 0; z-index: 100; padding: 18px 0; }
    .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { font-weight: 800; font-size: 1.4rem; }
    .nav-logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 32px; }
    .nav-link { font-size: .88rem; font-weight: 500; color: var(--muted); letter-spacing: .04em; }
    .nav-link:hover { color: var(--ink); }

    /* Buttons */
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 40px; font-weight: 700; font-size: .9rem; cursor: pointer; border: none; transition: all .3s ease; }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { filter: brightness(1.12); transform: translateY(-2px); box-shadow: 0 14px 28px var(--accent-a33); }
    .btn-outline { background: transparent; border: 2px solid var(--accent); color: var(--accent); }
    .btn-outline:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }

    /* Hero */
    .hero-content { max-width: 700px; }
    .hero-pre { font-size: .85rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--accent); margin-bottom: 16px; }
    .hero-name { font-size: clamp(2.6rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.08; margin-bottom: 12px; }
    .hero-role { font-size: 1.15rem; color: var(--muted); margin-bottom: 20px; }
    .hero-bio  { font-size: 1.05rem; color: var(--muted); max-width: 56ch; margin-bottom: 36px; line-height: 1.75; }
    .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }

    /* Avatar */
    .avatar { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 700; color: #fff; flex-shrink: 0; border: 3px solid var(--border); }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }

    /* Section heading */
    .section-title { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800; margin-bottom: 40px; }

    /* Skills */
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill-chip { padding: 6px 16px; border-radius: 999px; font-size: .82rem; font-weight: 600; border: 1px solid var(--border); background: var(--bgCard); color: var(--ink); }
    .skill-item { margin-bottom: 22px; }
    .skill-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: .88rem; font-weight: 600; }
    .skill-bar { width: 100%; height: 8px; background: var(--border); border-radius: 999px; overflow: hidden; }
    .skill-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 1.4s cubic-bezier(.4,0,.2,1); }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px; }
    .project-card { background: var(--bgCard); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all .35s ease; }
    .project-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,.18); }
    .project-thumb { height: 220px; background: linear-gradient(135deg, var(--bgCard), var(--border)); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--accent); overflow: hidden; position: relative; }
    .project-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .project-body { padding: 22px; }
    .project-tag { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--accent); margin-bottom: 8px; }
    .project-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
    .project-desc { font-size: .88rem; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
    .project-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
    .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-tag { padding: 3px 10px; border-radius: 999px; font-size: .72rem; font-weight: 600; background: var(--accent-a11); border: 1px solid var(--accent-a33); color: var(--accent); }
    .project-link { font-size: .82rem; font-weight: 700; color: var(--accent); }
    .project-link:hover { text-decoration: underline; }

    /* Education */
    .edu-list { display: grid; gap: 16px; }
    .edu-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 18px 20px; background: var(--bgCard); border: 1px solid var(--border); border-radius: var(--radius); }
    .edu-name { font-weight: 700; font-size: .98rem; margin-bottom: 4px; }
    .edu-deg  { font-size: .85rem; color: var(--muted); }
    .edu-dates { font-size: .8rem; color: var(--muted); font-weight: 600; white-space: nowrap; }

    /* Contact */
    .contact-links { display: flex; flex-wrap: wrap; gap: 12px; }
    .contact-links a { padding: 10px 22px; border: 1.5px solid var(--border); border-radius: 999px; font-size: .88rem; font-weight: 600; color: var(--ink); transition: all .25s; }
    .contact-links a:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-a11); }

    /* Footer */
    .site-footer { margin-top: 80px; padding: 32px 0; border-top: 1px solid var(--border); text-align: center; font-size: .8rem; color: var(--muted); }

    /* Reveal animation */
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .75s ease, transform .75s ease; }
    .reveal.active { opacity: 1; transform: translateY(0); }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      section { padding: 70px 0; }
      .hero-name { font-size: 2.4rem; }
      .projects-grid { grid-template-columns: 1fr; }
      .edu-card { flex-direction: column; }
    }
  `;

  // ─── Layout CSS ───────────────────────────────────────────────────────────────
  // 'single' is the default; add more layouts here as needed
  const LAYOUT_CSS = {
    single: `
      .hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; min-height: 92vh; padding-top: 60px; }
      @media (max-width: 900px) { .hero { grid-template-columns: 1fr; } .hero-visual { display: none; } }
    `,
    sidebar: `
      .page-wrap { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
      .sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 40px 28px; background: var(--bgCard); border-right: 1px solid var(--border); }
      .main-content { padding: 60px 48px; }
      @media (max-width: 860px) { .page-wrap { display: block; } .sidebar { position: static; height: auto; } }
    `,
    grid: `
      .main-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
      .col-full { grid-column: 1 / -1; }
      .col-left { grid-column: 1 / 5; }
      .col-right { grid-column: 5 / -1; }
      @media (max-width: 860px) { .main-grid { display: block; } }
    `,
    timeline: `
      .hero { min-height: 80vh; display: flex; align-items: center; }
      .tl-wrap { position: relative; padding-left: 48px; }
      .tl-wrap::before { content: ''; position: absolute; left: 16px; top: 0; bottom: 0; width: 2px; background: var(--border); }
      .tl-item { position: relative; margin-bottom: 40px; padding-left: 28px; }
      .tl-dot { position: absolute; left: -38px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px var(--accent-a22); }
    `
  };

  // ─── Style CSS (visual personalities) ────────────────────────────────────────
  const STYLE_CSS = {
    futuristic: `
      .hero-visual { border-radius: 50%; }
      .nav-link { font-family: monospace; font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; }
      .section-title { letter-spacing: .04em; }
      .skill-fill { background: linear-gradient(90deg, var(--accent), #3a7bd5); }
      .btn-primary { border-radius: 4px; }
    `,
    minimal: `
      .project-card { box-shadow: none; border-radius: 8px; }
      .project-card:hover { box-shadow: 0 12px 30px rgba(0,0,0,.08); border-color: var(--accent); }
      .skill-bar { height: 4px; }
      .section-title { font-family: 'Playfair Display', serif; }
      .hero-name { font-family: 'Playfair Display', serif; letter-spacing: -.02em; }
    `,
    cyberpunk: `
      .nav-logo, .section-title, .hero-pre, .nav-link { font-family: 'Orbitron', sans-serif; }
      .btn-primary { border-radius: 2px; border: 2px solid var(--accent); background: transparent; color: var(--accent); }
      .btn-primary:hover { background: var(--accent); color: #000; }
      .project-card:hover { transform: scale(1.02); }
      body::before { content: ''; position: fixed; inset: 0; background: linear-gradient(rgba(0,247,255,0) 50%, rgba(0,0,0,.06) 50%); background-size: 100% 4px; pointer-events: none; z-index: 9999; opacity: .35; }
    `,
    startup: `
      body { background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%); }
      .hero-name { background: linear-gradient(135deg, var(--accent), #007bff); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
      .skill-fill { background: linear-gradient(90deg, var(--accent), #007bff); }
      .btn-primary { background: linear-gradient(135deg, var(--accent), #007bff); border-radius: 40px; }
    `,
    brutalist: `
      .hero-name, .section-title { letter-spacing: -2px; }
      .btn-primary { border-radius: 4px; border: 2px solid var(--ink); box-shadow: 4px 4px 0 var(--ink); }
      .btn-primary:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--ink); }
      .nav-link { font-family: 'JetBrains Mono', monospace; font-size: .78rem; }
      .skill-bar { border-radius: 0; }
      .skill-fill { border-radius: 0; }
    `,
    artistic: `
      .hero-name { background: linear-gradient(135deg, #fff, var(--accent)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
      .project-card { backdrop-filter: blur(16px); }
      .btn-primary { border-radius: 999px; background: linear-gradient(135deg, var(--accent), #6d28d9); }
      .section-title { letter-spacing: -2px; }
    `
  };

  // ─── Shared inline JS (runs in the output iframe/page) ────────────────────────
  const SHARED_SCRIPT = `
    (function(){
      // Reveal on scroll
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('active'); } });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });

      // Sticky nav class
      var nav = document.querySelector('nav');
      if(nav) window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 60); });

      // Skill bar animate
      var sbObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            e.target.querySelectorAll('.skill-fill').forEach(function(bar){
              bar.style.width = bar.getAttribute('data-pct') || '80%';
            });
            sbObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      var sw = document.querySelector('.skills-section');
      if(sw) sbObs.observe(sw);
    })();
  `;

  // ─── HTML section builders ────────────────────────────────────────────────────

  function buildNav(personal, cfg) {
    const links = ['About','Skills','Projects','Education','Contact']
      .map(s => `<a href="#${s.toLowerCase()}" class="nav-link">${s}</a>`).join('');
    return `
      <nav>
        <div class="nav-inner">
          <span class="nav-logo">Port<span>Edge</span></span>
          <div class="nav-links">${links}</div>
        </div>
      </nav>`;
  }

  function buildHeroVisual(personal, cfg) {
    // Each style gets a slightly different hero visual element
    const style = cfg.style;
    if (style === 'futuristic') {
      return `<div class="hero-visual"></div>`;
    }
    if (style === 'startup') {
      const name = esc(personal.name || '');
      const role = esc(personal.title || '');
      return `<div class="hero-visual-card">
        <div style="display:flex;gap:6px;margin-bottom:14px">
          <span style="width:10px;height:10px;border-radius:50%;background:#ef4444"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#f59e0b"></span>
          <span style="width:10px;height:10px;border-radius:50%;background:#22c55e"></span>
        </div>
        <code style="font-family:'JetBrains Mono',monospace;font-size:.88rem;line-height:1.9;color:#e6edf3">
          <span style="color:#c678dd">const</span> <span style="color:#61afef">dev</span> = {<br>
          &nbsp;&nbsp;name: <span style="color:#98c379">'${name}'</span>,<br>
          &nbsp;&nbsp;role: <span style="color:#98c379">'${role}'</span>,<br>
          &nbsp;&nbsp;status: <span style="color:#98c379">'building'</span><br>
          };
        </code>
      </div>`;
    }
    if (style === 'brutalist') {
      return `<div class="hero-code-block">
        <span style="color:#c678dd">class</span> <span style="color:#e06c75">Dev</span> {<br>
        &nbsp;&nbsp;name = <span style="color:#98c379">'${esc(personal.name || '')}'</span>;<br>
        &nbsp;&nbsp;vision = <span style="color:#98c379">'Neo-Brutalist'</span>;<br>
        }
      </div>`;
    }
    if (style === 'cyberpunk') {
      return `<div style="border:1px solid var(--accent);padding:28px;font-family:'Roboto Mono',monospace;font-size:.88rem;line-height:1.8;color:var(--muted)">
        <div style="color:var(--accent);margin-bottom:8px">SYSTEM_READY // ${new Date().getFullYear()}</div>
        <div>USER: <span style="color:var(--ink)">${esc(personal.name || '')}</span></div>
        <div>CLASS: <span style="color:var(--ink)">${esc(personal.title || '')}</span></div>
        <div>STATUS: <span style="color:#22c55e">ONLINE</span></div>
      </div>`;
    }
    // artistic / minimal — show avatar large
    const avatarUrl = normImage(personal.avatar);
    if (avatarUrl) {
      return `<div style="width:100%;aspect-ratio:1;border-radius:var(--radius);overflow:hidden;max-width:480px">
        <img src="${esc(avatarUrl)}" style="width:100%;height:100%;object-fit:cover" alt="${esc(personal.name||'')}">
      </div>`;
    }
    return `<div style="width:100%;aspect-ratio:1;border-radius:var(--radius);background:linear-gradient(135deg,var(--bgCard),var(--border));display:flex;align-items:center;justify-content:center;font-size:6rem;font-weight:800;color:var(--accent);max-width:480px">${initials(personal.name)}</div>`;
  }

  function buildHero(d, cfg) {
    const { personal, contact } = d;
    const avatarUrl = normImage(personal.avatar);
    const avatarHTML = avatarUrl
      ? `<div class="avatar"><img src="${esc(avatarUrl)}" alt="${esc(personal.name||'')}" onerror="this.style.display='none'"></div>`
      : '';

    const heroTitle = esc(personal.name || '');
    const heroRole = esc(personal.title || '');
    const heroBio = esc(personal.bio || '');
    const heroLocation = esc(contact.location || '');

    if (!heroTitle && !heroRole && !heroBio) {
      return '';
    }

    return `
      <section class="hero container" id="about">
        <div class="hero-content reveal">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
            ${avatarHTML}
            <div>
              ${heroRole ? `<div class="hero-pre">${heroRole}</div>` : ''}
              ${heroLocation ? `<div style="font-size:.82rem;color:var(--muted)">${heroLocation}</div>` : ''}
            </div>
          </div>
          ${heroTitle ? `<h1 class="hero-name">${heroTitle}</h1>` : ''}
          ${heroBio ? `<p class="hero-bio">${heroBio}</p>` : ''}
          <div class="hero-btns">
            <a href="#projects" class="btn btn-primary">View Projects</a>
            <a href="#contact"  class="btn btn-outline">Get In Touch</a>
          </div>
        </div>
        <div class="hero-visual-wrap reveal" style="display:flex;justify-content:center;align-items:center">
          ${buildHeroVisual(personal, cfg)}
        </div>
      </section>`;
  }

  function buildSkills(skills, cfg) {
    if (!skills.length) return '';
    // Chip-only for artistic/minimal, bar style for others
    const useBar = ['futuristic','startup','brutalist','cyberpunk'].includes(cfg.style);
    const inner = useBar
      ? skills.map((s, i) => {
          const pct = Math.max(68, 96 - i * 4);
          return `<div class="skill-item">
            <div class="skill-label"><span>${esc(s)}</span><span>${pct}%</span></div>
            <div class="skill-bar"><div class="skill-fill" style="width:0" data-pct="${pct}%"></div></div>
          </div>`;
        }).join('')
      : `<div class="skills-wrap">${skills.map(s => `<span class="skill-chip">${esc(s)}</span>`).join('')}</div>`;

    return `
      <section class="skills-section container" id="skills">
        <h2 class="section-title reveal">Skills</h2>
        <div class="reveal">${inner}</div>
      </section>`;
  }

  function buildProjects(projects, cfg) {
    if (!projects.length) return '';
    const cards = projects.map(p => {
      const tags = (p.tech || '').split(',').filter(Boolean)
        .map(t => `<span class="tech-tag">${esc(t.trim())}</span>`).join('');
      const href = norm(p.link);
      return `
        <div class="project-card reveal">
          <div class="project-thumb">&#128187;</div>
          <div class="project-body">
            <div class="project-tag">${esc((p.tech||'').split(',')[0]||'')}</div>
            <div class="project-title">${esc(p.title)}</div>
            <div class="project-desc">${esc(p.description)}</div>
            <div class="project-footer">
              <div class="tech-tags">${tags}</div>
              ${href ? `<a href="${esc(href)}" target="_blank" class="project-link">View &#8599;</a>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
    return `
      <section class="container" id="projects">
        <h2 class="section-title reveal">Projects</h2>
        <div class="projects-grid">${cards}</div>
      </section>`;
  }

  function buildEducation(education) {
    if (!education.length) return '';
    const items = education.map(e => {
      const dates = [e.from, e.to ? (e.current ? 'Present' : e.to) : ''].filter(Boolean).join(' – ');
      return `
        <div class="edu-card reveal">
          <div>
            <div class="edu-name">${esc(e.institution)}</div>
            <div class="edu-deg">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
          </div>
          <div class="edu-dates">${esc(dates)}</div>
        </div>`;
    }).join('');
    return `
      <section class="container" id="education">
        <h2 class="section-title reveal">Education</h2>
        <div class="edu-list">${items}</div>
      </section>`;
  }

  function buildContact(contact) {
    const links = [
      contact.email    && `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`,
      contact.github   && `<a href="${esc(norm(contact.github))}"   target="_blank">GitHub</a>`,
      contact.linkedin && `<a href="${esc(norm(contact.linkedin))}" target="_blank">LinkedIn</a>`,
      contact.twitter  && `<a href="${esc(norm(contact.twitter))}"  target="_blank">Twitter</a>`,
      contact.website  && `<a href="${esc(norm(contact.website))}"  target="_blank">Website</a>`,
    ].filter(Boolean).join('');
    if (!links) return '';
    return `
      <section class="container" id="contact">
        <h2 class="section-title reveal">Contact</h2>
        <div class="contact-links reveal">${links}</div>
      </section>`;
  }

  // ─── CSS variable block from config ──────────────────────────────────────────
  function buildVars(cfg, userAccent) {
    const accent = userAccent || cfg.vars.accent;
    // derive alpha variants from accent (simple hex → rgba not needed, use CSS custom props trick)
    return `
      :root {
        --bg:       ${cfg.vars.bg};
        --bgCard:   ${cfg.vars.bgCard};
        --ink:      ${cfg.vars.ink};
        --muted:    ${cfg.vars.muted};
        --border:   ${cfg.vars.border};
        --accent:   ${accent};
        --accent-a11: ${accent}1a;
        --accent-a22: ${accent}38;
        --accent-a33: ${accent}55;
        --radius:   ${cfg.vars.radius};
        --font-body: ${FONTS[cfg.font]?.stack || "'Inter', sans-serif"};
      }
      body { background: var(--bg); }
    `;
  }

  // ─── Master buildDocument ─────────────────────────────────────────────────────
  function buildDocument(bodyHTML, css, title, fontURL) {
    const fontLink = fontURL
      ? `<link rel="preconnect" href="https://fonts.googleapis.com">
         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
         <link href="${fontURL}" rel="stylesheet">`
      : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title || 'My Portfolio')}</title>
${fontLink}
<style>${css}</style>
</head>
<body>${bodyHTML}</body>
</html>`;
  }

  function getValueByPath(obj, path) {
    if (!path) return '';
    return String(path).split('.').reduce((acc, key) => acc?.[key], obj);
  }

  function replacePlaceholders(html, data) {
    // Example: {{personal.name}} or {{contact.email}}
    return String(html || '').replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, token) => {
      const value = getValueByPath(data, token);
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return esc(value.join(', '));
      if (typeof value === 'object') return '';
      return esc(String(value));
    });
  }

  function templateEntry(templateId) {
    const list = Array.isArray(window.templates) ? window.templates : [];
    return list.find((t) => t.id === templateId) || null;
  }

  function resolveTemplatePath(templateId) {
    const id = String(templateId || '').trim();
    if (!id) return null;
    const entry = templateEntry(id);
    if (entry?.path) return entry.path;
    return `../templates/${id}/index.html`;
  }

  function isExternalUrl(path) {
    const value = String(path || '').trim();
    return /^(?:https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('mailto:');
  }

  function absoluteTemplateAssetPath(baseHref, assetPath) {
    try {
      const base = new URL(baseHref, window.location.href);
      return new URL(assetPath, base).toString();
    } catch (_) {
      return assetPath;
    }
  }

  function templateBaseHref(templatePath) {
    const clean = String(templatePath || '').split('#')[0].split('?')[0];
    const idx = clean.lastIndexOf('/');
    return idx === -1 ? './' : `${clean.slice(0, idx + 1)}`;
  }

  function ensureBaseTag(doc, baseHref) {
    if (!doc?.head || !baseHref) return;
    if (doc.head.querySelector('base')) return;
    const base = doc.createElement('base');
    base.setAttribute('href', baseHref);
    doc.head.prepend(base);
  }

  function firstMatch(root, selectors) {
    for (const selector of selectors) {
      const found = root.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  function matchesTemplatePath(templatePath, templateId) {
    const path = String(templatePath || '').trim();
    if (!path || !templateId) return false;
    const safeId = String(templateId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`[\\\\/]${safeId}[\\\\/]`, 'i').test(path);
  }

  function setNameText(el, fullName) {
    if (!el || !fullName) return;
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const span = el.querySelector('span');
    if (span && parts.length > 1) {
      span.textContent = parts.slice(1).join(' ');
      if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
        el.firstChild.nodeValue = `${parts[0]} `;
      } else {
        el.insertBefore(el.ownerDocument.createTextNode(`${parts[0]} `), span);
      }
      if (el.hasAttribute('data-text')) {
        el.setAttribute('data-text', fullName);
      }
      return;
    }
    el.textContent = fullName;
    if (el.hasAttribute('data-text')) {
      el.setAttribute('data-text', fullName);
    }
  }

  function ensureAvatarImage(doc, name) {
    const existing = firstMatch(doc, [
      '.about-img img',
      '.avatar img',
      '.about-visual img',
      '.img-box img',
      '.hero img',
      '.profile-visual img',
      '.editorial-visual img',
      '.creative-visual img',
      '.visual-card img'
    ]);
    if (existing) return existing;

    const container = firstMatch(doc, [
      '.about-img',
      '.avatar',
      '.about-visual',
      '.img-box',
      '.profile-visual',
      '.editorial-visual',
      '.creative-visual',
      '.visual-card',
      '.hero-visual'
    ]);
    if (!container) return null;

    container.querySelectorAll('span').forEach((node) => {
      if (/profile|slot|zone/i.test(node.textContent || '')) {
        node.remove();
      }
    });

    const img = doc.createElement('img');
    img.setAttribute('alt', name || 'Profile Image');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    container.prepend(img);
    return img;
  }

  function injectPersonal(doc, data) {
    const personal = data.personal || {};
    const contact = data.contact || {};

    const name = String(personal.name || '').trim();
    const title = String(personal.title || '').trim();
    const bio = String(personal.bio || '').trim();
    const avatar = normImage(personal.avatar);
    const location = String(contact.location || '').trim();

    const nameEl = firstMatch(doc, ['#hero-name', '.hero-name', '.hero-title', 'h1']);
    if (nameEl) {
      if (name) setNameText(nameEl, name);
      else nameEl.textContent = '';
    }
    doc.title = name ? `${name} | Portfolio` : 'Portfolio';

    const titleEl = firstMatch(doc, ['.hero-subtitle', '.hero-role', '.hero-pre', '.hero-tag']);
    if (titleEl && !titleEl.querySelector('#typing-text')) {
      titleEl.textContent = title;
    }
    const typingEl = doc.getElementById('typing-text');
    if (typingEl) typingEl.textContent = title;

    const heroBioEl = firstMatch(doc, ['.hero-description', '.hero-bio', '.hero-sub']);
    if (heroBioEl) {
      heroBioEl.textContent = bio;
    }

    if (avatar) {
      const avatarEl = ensureAvatarImage(doc, name);
      if (avatarEl) {
        avatarEl.setAttribute('src', avatar);
        avatarEl.setAttribute('alt', name || 'Profile Image');
      }
    } else {
      doc.querySelectorAll('.about-img img, .about-visual img, .img-box img, .profile-visual img, .editorial-visual img, .creative-visual img, .visual-card img').forEach((img) => img.remove());
    }

    const locationEl = firstMatch(doc, [
      '.contact-item span',
      '.method span',
      '.hero-content .hero-subtitle',
      '.direct-uplink p:last-child'
    ]);
    if (locationEl && !locationEl.textContent.includes('@')) {
      locationEl.textContent = location;
    }

    if (!bio && !name && !title) {
      doc.querySelector('#about')?.remove();
    }
  }

  function injectTemp1AboutBio(doc, bio, templatePath) {
    if (!matchesTemplatePath(templatePath, 'temp1')) return;
    const value = String(bio || '').trim();
    if (!value) return;

    const paragraphs = Array.from(doc.querySelectorAll('#about .about-text p'));
    if (paragraphs.length) {
      paragraphs[0].textContent = value;
      return;
    }

    const fallback = firstMatch(doc, ['#about .about-text', '#about .about-content']);
    if (fallback) fallback.textContent = value;
  }

  function injectAboutBio(doc, bio) {
    const value = String(bio || '').trim();
    if (!value) return;

    const aboutSection = doc.querySelector('#about');
    if (!aboutSection) return;

    const target = firstMatch(aboutSection, [
      '.about-copy p',
      '.story-card p',
      '.content-box p',
      '.detail-card p',
      '.about-shell p',
      '.section-shell p:last-of-type',
      'p'
    ]);

    if (!target) return;
    target.textContent = value;
  }

  function fixTemp3DuplicateName(doc, templatePath) {
    if (!matchesTemplatePath(templatePath, 'temp3')) return;
    const heroName = doc.querySelector('.hero-name.glitch');
    if (!heroName) return;
    heroName.classList.remove('glitch');
    heroName.removeAttribute('data-text');
  }

  function removeTemp4DownloadPortfolio(doc, templatePath) {
    if (!matchesTemplatePath(templatePath, 'temp4')) return;
    doc.querySelectorAll('a, button').forEach((el) => {
      if (/^\s*download\s+portfolio\s*$/i.test(el.textContent || '')) {
        el.remove();
      }
    });
  }

  function injectTemp4AccentBindings(doc, templatePath, accent) {
    if (!matchesTemplatePath(templatePath, 'temp4') || !doc?.head || !accent) return;
    const style = doc.createElement('style');
    style.id = 'pgp-temp4-accent-fix';
    style.textContent = `
      :root {
        --shadow-bold: 0 20px 40px ${accent}26;
      }
      .btn-primary:hover,
      .visual-card,
      .img-wrapper {
        box-shadow: var(--shadow-bold) !important;
      }
      .timeline-marker {
        box-shadow: 0 0 15px ${accent}40 !important;
      }
      .gradient-overlay {
        background: linear-gradient(to bottom right, ${accent}4d, ${accent}1f) !important;
      }
      .c-purple { color: var(--primary) !important; }
      .c-blue { color: var(--secondary) !important; }
      .c-teal { color: var(--accent) !important; }
    `;
    doc.head.appendChild(style);
  }

  function applyVisibilityOptions(doc, theme) {
    const showPhoto = theme?.showPhoto !== false;
    const showSkills = theme?.showSkills !== false;

    if (!showPhoto) {
      doc.querySelectorAll(
        '.avatar, .about-img, .about-visual, .img-box, .hero-visual, .hero-visual-wrap'
      ).forEach((el) => el.remove());
      doc.querySelectorAll('img').forEach((img) => {
        const alt = String(img.getAttribute('alt') || '').toLowerCase();
        if (/(profile|avatar|about me|cyberpunk profile)/i.test(alt)) {
          img.remove();
        }
      });
    }

    if (!showSkills) {
      doc.querySelector('#skills')?.remove();
      doc.querySelectorAll('a[href="#skills"]').forEach((link) => {
        const item = link.closest('li');
        if (item) item.remove();
        else link.remove();
      });
    }
  }

  function injectSkills(doc, skills) {
    const list = safe(skills).map((s) => String(s).trim()).filter(Boolean);
    const section = doc.querySelector('#skills');
    if (!section) return;
    if (!list.length) {
      section.remove();
      return;
    }

    const targets = Array.from(section.querySelectorAll(
      '.skills-name, .skill-info > span:first-child, .skill-label > span:first-child, .skill-category li, .skill-tags li, .skill-top > span:first-child, .skill-head > span:first-child, .stack-list span, .tag-wall span, .chip-row span, .tags-card span, .skill-tags span'
    ));

    if (!targets.length) return;

    targets.forEach((node, idx) => {
      if (idx < list.length) node.textContent = list[idx];
    });
  }

  function applyProjectCardData(card, project) {
    const titleEl = firstMatch(card, ['.project-title', 'h3']);
    const descEl = firstMatch(card, ['.project-desc', 'p']);
    const linkEl = firstMatch(card, ['.project-link', '.view-btn', '.project-btn', '.view-op', 'a[href]']);

    if (titleEl) titleEl.textContent = project.title || '';
    if (descEl) descEl.textContent = project.description || '';

    const href = norm(project.link);
    if (linkEl && href) {
      linkEl.setAttribute('href', href);
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('rel', 'noopener noreferrer');
    } else if (linkEl) {
      linkEl.remove();
    }

    const tags = String(project.tech || '').split(',').map((t) => t.trim()).filter(Boolean);
    const tagEls = Array.from(card.querySelectorAll('.tech-tag, .project-tags span, .tags span, .project-tag'));
    if (tags.length && tagEls.length) {
      tagEls.forEach((el, idx) => {
        if (idx < tags.length) el.textContent = tags[idx];
      });
    }
  }

  function injectProjects(doc, projects) {
    const list = safe(projects);
    const section = doc.querySelector('#projects');
    if (!section) return;
    if (!list.length) {
      section.remove();
      return;
    }

    const cards = Array.from(section.querySelectorAll('.project-card, .project-box, article'));
    if (!cards.length) return;

    const templateCard = cards[0];
    const cardParent = templateCard.parentElement;
    const mutableCards = [...cards];

    while (cardParent && mutableCards.length < list.length) {
      const clone = templateCard.cloneNode(true);
      cardParent.appendChild(clone);
      mutableCards.push(clone);
    }

    mutableCards.forEach((card, idx) => {
      if (!list[idx]) {
        card.remove();
        return;
      }
      applyProjectCardData(card, list[idx]);
    });
  }

  function injectEducation(doc, education) {
    const list = safe(education);
    const sections = Array.from(doc.querySelectorAll('#experience, #education'));
    if (!sections.length) return;

    if (!list.length) {
      sections.forEach((section) => section.remove());
      return;
    }

    const section = sections[0];
    let items = Array.from(section.querySelectorAll('.timeline-item, .eitem, .edu-card'));
    if (!items.length) {
      items = Array.from(section.querySelectorAll('.timeline-content'));
    }
    if (!items.length) {
      items = Array.from(section.querySelectorAll('article'));
    }
    if (!items.length) return;

    const templateNode = items[0];
    const parent = templateNode.parentElement;
    while (parent && items.length < list.length) {
      const clone = templateNode.cloneNode(true);
      parent.appendChild(clone);
      items.push(clone);
    }

    items.forEach((node, idx) => {
      const item = list[idx];
      if (!item) {
        node.remove();
        return;
      }

      const date = [item.from, item.to ? (item.current ? 'Present' : item.to) : ''].filter(Boolean).join(' - ');
      const title = String(item.degree || item.institution || '').trim();
      const meta = [item.institution, item.field].filter(Boolean).join(' - ');

      const dateEl = firstMatch(node, ['.timeline-date', '.date', '.time-stamp', '.edates', 'span']);
      if (dateEl) dateEl.textContent = date;

      const titleEl = firstMatch(node, ['.timeline-title', '.edu-name', 'h3', 'strong']);
      if (titleEl) titleEl.textContent = title;

      const metaEl = firstMatch(node, ['.timeline-company', '.timeline-org', '.edu-deg', 'p']);
      if (metaEl) metaEl.textContent = meta;
    });
  }

  function injectContact(doc, contact) {
    const c = contact || {};
    const iconMap = [
      { key: 'github', selector: '.fa-github' },
      { key: 'linkedin', selector: '.fa-linkedin, .fa-linkedin-in' },
      { key: 'twitter', selector: '.fa-twitter' },
      { key: 'website', selector: '.fa-globe, .fa-external-link-alt' }
    ];

    iconMap.forEach(({ key, selector }) => {
      const icon = doc.querySelector(selector);
      const anchor = icon?.closest('a');
      if (!anchor) return;

      const href = norm(c[key]);
      if (anchor) {
        if (!href) {
          anchor.remove();
        } else {
          anchor.setAttribute('href', href);
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });

    const mail = doc.querySelector('a[href^="mailto:"]');
    if (mail) {
      if (c.email) {
        mail.setAttribute('href', `mailto:${c.email}`);
        mail.textContent = c.email;
      } else {
        mail.remove();
      }
    }

    if (c.email) {
      const uplinkEmail = doc.querySelector('.direct-uplink p');
      if (uplinkEmail) uplinkEmail.textContent = `STABLE_CONNECTION: ${c.email}`;
    }

    if (c.location) {
      const locationNode = firstMatch(doc, ['.contact-item strong', '.method span:last-child']);
      if (locationNode) locationNode.textContent = c.location;
    }

    if (c.phone) {
      const phoneNode = Array.from(doc.querySelectorAll('.contact-item')).find((node) => {
        return /phone/i.test(node.textContent || '');
      })?.querySelector('strong');
      if (phoneNode) phoneNode.textContent = c.phone;
    }

    if (!c.email && !c.phone && !c.location && !c.github && !c.linkedin && !c.twitter && !c.website) {
      doc.querySelector('#contact')?.remove();
    }
  }

  function injectRuntimeData(doc, data) {
    if (!doc?.body) return;
    const payload = {
      personal: {
        name: String(data.personal?.name || ''),
        title: String(data.personal?.title || ''),
        bio: String(data.personal?.bio || ''),
        avatar: normImage(data.personal?.avatar)
      }
    };

    const script = doc.createElement('script');
    script.id = 'pgp-runtime-data';
    script.textContent = `window.__PORTEDGE_DATA__ = ${JSON.stringify(payload).replace(/<\//g, '<\\/')};`;
    doc.body.insertBefore(script, doc.body.firstChild);
  }

  function injectAccent(doc, accent) {
    if (!doc?.head || !accent) return;
    const style = doc.createElement('style');
    style.id = 'pgp-template-accent';
    style.textContent = `
      :root {
        --accent: ${accent};
        --primary: ${accent};
        --secondary: ${accent};
        --primary-color: ${accent};
        --accent-color: ${accent};
        --cyan: ${accent};
        --gradient-1: linear-gradient(135deg, ${accent} 0%, ${accent} 100%);
        --gradient-2: linear-gradient(135deg, ${accent} 0%, ${accent} 100%);
      }
    `;
    doc.head.appendChild(style);
  }

  function injectFont(doc, selectedFont) {
    const fontName = String(selectedFont || '').trim();
    if (!fontName) return;
    const meta = FONTS[fontName];
    if (!meta) return;

    const style = doc.createElement('style');
    style.id = 'pgp-template-font';
    style.textContent = `
      :root {
        --font-body: ${meta.stack};
        --font-heading: ${meta.stack};
        --font-mono: ${meta.stack};
        --font-cyber: ${meta.stack};
      }
      body, input, textarea, button, select {
        font-family: ${meta.stack} !important;
      }
      h1, h2, h3, h4, h5, h6, .hero-title, .hero-name, .section-title,
      .nav-logo, .nav-link, .hero-label, .hero-subtitle, .hero-description,
      .about-text, .skill-info, .project-info, .timeline-content, .contact-item {
        font-family: ${meta.stack} !important;
      }
      code, pre, .card-content code, .hero-visual-card, .hero-code-block {
        font-family: ${meta.stack} !important;
      }
    `;
    doc.head.appendChild(style);

    if (meta.url) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = meta.url;
      doc.head.appendChild(link);
    }
  }

  function injectTemplateData(templateHTML, data, templatePath) {
    const hydrated = replacePlaceholders(templateHTML, data);
    const doc = new DOMParser().parseFromString(hydrated, 'text/html');

    ensureBaseTag(doc, templateBaseHref(templatePath));
    injectAccent(doc, data.theme?.accent);
    injectTemp4AccentBindings(doc, templatePath, data.theme?.accent);
    injectFont(doc, data.theme?.font);
    injectPersonal(doc, data);
    injectAboutBio(doc, data.personal?.bio);
    applyVisibilityOptions(doc, data.theme);
    injectTemp1AboutBio(doc, data.personal?.bio, templatePath);
    fixTemp3DuplicateName(doc, templatePath);
    removeTemp4DownloadPortfolio(doc, templatePath);
    injectSkills(doc, data.skills);
    injectProjects(doc, data.projects);
    injectEducation(doc, data.education);
    injectContact(doc, data.contact);
    injectRuntimeData(doc, data);

    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }

  async function inlineTemplateAssets(html, templatePath) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const baseHref = templateBaseHref(templatePath);

    const styleLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'));
    for (const link of styleLinks) {
      const href = link.getAttribute('href') || '';
      if (isExternalUrl(href)) continue;
      try {
        const absPath = absoluteTemplateAssetPath(baseHref, href);
        const cssText = await fetch(absPath, { cache: 'no-store' }).then((r) => r.ok ? r.text() : '');
        if (!cssText) continue;
        const styleEl = doc.createElement('style');
        styleEl.setAttribute('data-inlined-from', href);
        styleEl.textContent = cssText;
        link.replaceWith(styleEl);
      } catch (_) {
        // Keep original link if inlining fails.
      }
    }

    const scriptLinks = Array.from(doc.querySelectorAll('script[src]'));
    for (const scriptTag of scriptLinks) {
      const src = scriptTag.getAttribute('src') || '';
      if (isExternalUrl(src)) continue;
      try {
        const absPath = absoluteTemplateAssetPath(baseHref, src);
        const jsText = await fetch(absPath, { cache: 'no-store' }).then((r) => r.ok ? r.text() : '');
        if (!jsText) continue;
        const inlineScript = doc.createElement('script');
        inlineScript.setAttribute('data-inlined-from', src);
        inlineScript.textContent = jsText;
        scriptTag.replaceWith(inlineScript);
      } catch (_) {
        // Keep original script tag if inlining fails.
      }
    }

    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }

  async function loadTemplate(templateId, options = {}) {
    const opts = options || {};
    const data = State.data();
    const resolvedId = templateId || data.selectedTemplate || 'temp1';
    const path = resolveTemplatePath(resolvedId);

    if (!path) return render();

    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Template fetch failed: ${response.status}`);
      }
      const html = await response.text();
      let rendered = injectTemplateData(html, data, path);
      if (opts.inlineLocalAssets) {
        rendered = await inlineTemplateAssets(rendered, path);
      }
      return rendered;
    } catch (err) {
      console.warn(`Template load failed for ${resolvedId}. Falling back to generic renderer.`, err);
      return render();
    }
  }

  async function renderSelectedTemplate(options = {}) {
    const d = State.data();
    return loadTemplate(d.selectedTemplate || 'temp1', options);
  }

  // ─── Main render() ────────────────────────────────────────────────────────────
  function render() {
    const d   = State.data();
    const tplId = d.selectedTemplate || 'temp1';
    const cfg   = TEMPLATE_CONFIGS[tplId] || TEMPLATE_CONFIGS['temp1'];

    const safeSkills    = safe(d.skills).map(s => String(s).trim()).filter(Boolean);
    const safeProjects  = safe(d.projects);
    const safeEducation = safe(d.education);

    // CSS assembly: vars → base → layout → style → template-specific overrides
    const css = [
      buildVars(cfg, d.theme?.accent),
      BASE_CSS,
      LAYOUT_CSS[cfg.layout] || LAYOUT_CSS.single,
      STYLE_CSS[cfg.style]   || '',
      cfg.extraCSS           || ''
    ].join('\n');

    // HTML assembly
    const body = [
      buildNav(d.personal, cfg),
      buildHero({ personal: d.personal, contact: d.contact }, cfg),
      buildSkills(safeSkills, cfg),
      buildProjects(safeProjects, cfg),
      buildEducation(safeEducation),
      buildContact(d.contact),
      `<footer class="site-footer">Built with PortfolioForge · ${new Date().getFullYear()}</footer>`,
      `<script>${SHARED_SCRIPT}</script>`
    ].join('\n');

    const fontURL = FONTS[cfg.font]?.url || FONTS.Inter.url;
    return buildDocument(body, css, d.personal?.name || 'Portfolio', fontURL);
  }

  return { render, buildDocument, loadTemplate, renderSelectedTemplate };
})();
