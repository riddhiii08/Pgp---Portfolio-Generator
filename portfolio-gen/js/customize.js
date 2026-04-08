

const Customizer = (() => {
  const COLOR_THEMES = [
    { name: 'Violet',   accent: '#5b4cf5' },
    { name: 'Ocean',    accent: '#0ea5e9' },
    { name: 'Forest',   accent: '#22c55e' },
    { name: 'Sunset',   accent: '#f97316' },
    { name: 'Rose',     accent: '#e11d48' },
    { name: 'Gold',     accent: '#d97706' },
    { name: 'Teal',     accent: '#14b8a6' },
    { name: 'Magenta',  accent: '#d946ef' },
    { name: 'Slate',    accent: '#475569' },
    { name: 'Midnight', accent: '#1e1b4b' }
  ];
  const FONTS = [
    { name: 'DM Sans',    sample: 'Clean & modern' },
    { name: 'Inter',      sample: 'The web standard' },
    { name: 'Poppins',    sample: 'Friendly & round' },
    { name: 'Playfair Display', sample: 'Editorial serif' },
    { name: 'Montserrat', sample: 'Geometric & bold' },
    { name: 'Roboto',     sample: 'Material classic' }
  ];
  const LAYOUTS = [
    { id: 'single',  label: 'Single', icon: 'â–¬' },
    { id: 'two-col', label: 'Two Col', icon: 'â–â–Œ' },
    { id: 'grid',    label: 'Grid',   icon: 'âŠž' }
  ];

  function renderTemplateThumb(t) {
    const commonSurface = 'background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:8px;';

    switch (t.id) {
      case 'minimal-clean':
        return `
          <div style="padding:14px;color:${t.textColor};font-family:Inter,sans-serif">
            <div style="width:56%;height:10px;background:rgba(255,255,255,.78);border-radius:5px;margin-bottom:10px"></div>
            <div style="width:74%;height:6px;background:rgba(255,255,255,.42);border-radius:4px;margin-bottom:18px"></div>
            <div style="${commonSurface}padding:10px">
              <div style="width:68%;height:7px;background:rgba(255,255,255,.72);border-radius:4px;margin-bottom:8px"></div>
              <div style="width:92%;height:5px;background:rgba(255,255,255,.34);border-radius:3px;margin-bottom:5px"></div>
              <div style="width:82%;height:5px;background:rgba(255,255,255,.34);border-radius:3px"></div>
            </div>
          </div>`;

      case 'executive':
        return `
          <div style="display:grid;grid-template-columns:8px 1fr;height:100%">
            <div style="background:rgba(255,255,255,.55)"></div>
            <div style="padding:12px;color:${t.textColor}">
              <div style="width:48%;height:9px;background:rgba(255,255,255,.8);border-radius:4px;margin-bottom:8px"></div>
              <div style="width:88%;height:6px;background:rgba(255,255,255,.35);border-radius:3px;margin-bottom:12px"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div style="${commonSurface}height:48px"></div>
                <div style="${commonSurface}height:48px"></div>
              </div>
            </div>
          </div>`;

      case 'sidebar-pro':
        return `
          <div style="display:grid;grid-template-columns:34% 66%;height:100%">
            <div style="background:rgba(15,23,42,.55);padding:10px">
              <div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.35);margin-bottom:8px"></div>
              <div style="width:80%;height:5px;background:rgba(255,255,255,.45);border-radius:3px;margin-bottom:6px"></div>
              <div style="width:60%;height:5px;background:rgba(255,255,255,.25);border-radius:3px"></div>
            </div>
            <div style="padding:10px">
              <div style="${commonSurface}height:40px;margin-bottom:8px"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div style="${commonSurface}height:36px"></div>
                <div style="${commonSurface}height:36px"></div>
              </div>
            </div>
          </div>`;

      case 'timeline':
        return `
          <div style="padding:12px;position:relative;height:100%">
            <div style="position:absolute;left:20px;top:18px;bottom:14px;width:2px;background:rgba(255,255,255,.4)"></div>
            <div style="margin-left:32px;margin-bottom:12px">
              <div style="width:44%;height:7px;background:rgba(255,255,255,.76);border-radius:3px;margin-bottom:6px"></div>
              <div style="width:75%;height:5px;background:rgba(255,255,255,.35);border-radius:3px"></div>
            </div>
            <div style="margin-left:32px;margin-bottom:12px">
              <div style="width:52%;height:7px;background:rgba(255,255,255,.76);border-radius:3px;margin-bottom:6px"></div>
              <div style="width:82%;height:5px;background:rgba(255,255,255,.35);border-radius:3px"></div>
            </div>
          </div>`;

      case 'resume-blueprint':
        return `
          <div style="padding:12px;background:rgba(255,255,255,.85);height:100%;color:#1e3a8a;font-family:Inter,sans-serif">
            <div style="width:60%;height:9px;background:#1e3a8a;border-radius:3px;margin-bottom:8px"></div>
            <div style="width:86%;height:5px;background:#93c5fd;border-radius:3px;margin-bottom:10px"></div>
            <div style="height:1px;background:#bfdbfe;margin-bottom:10px"></div>
            <div style="width:30%;height:5px;background:#2563eb;border-radius:3px;margin-bottom:6px"></div>
            <div style="width:92%;height:4px;background:#cbd5e1;border-radius:2px;margin-bottom:4px"></div>
            <div style="width:84%;height:4px;background:#cbd5e1;border-radius:2px"></div>
          </div>`;

      case 'glassmorphic':
        return `
          <div style="padding:12px;position:relative;height:100%">
            <div style="${commonSurface}backdrop-filter:blur(8px);height:52px;margin-bottom:8px"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div style="${commonSurface}backdrop-filter:blur(8px);height:46px"></div>
              <div style="${commonSurface}backdrop-filter:blur(8px);height:46px"></div>
            </div>
          </div>`;

      case 'editorial':
        return `
          <div style="display:grid;grid-template-columns:58% 42%;height:100%">
            <div style="padding:12px;background:rgba(255,255,255,.2)">
              <div style="width:74%;height:12px;background:rgba(255,255,255,.85);margin-bottom:8px"></div>
              <div style="width:90%;height:5px;background:rgba(255,255,255,.35);margin-bottom:5px"></div>
              <div style="width:80%;height:5px;background:rgba(255,255,255,.35)"></div>
            </div>
            <div style="background:rgba(0,0,0,.18);position:relative">
              <div style="position:absolute;inset:12px;background:rgba(255,255,255,.32)"></div>
            </div>
          </div>`;

      case 'neon-dark':
        return `
          <div style="padding:12px;background:rgba(2,6,23,.55);height:100%">
            <div style="width:58%;height:8px;background:#22d3ee;box-shadow:0 0 10px rgba(34,211,238,.8);border-radius:4px;margin-bottom:10px"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div style="height:48px;border:1px solid rgba(34,211,238,.55);box-shadow:inset 0 0 12px rgba(34,211,238,.24)"></div>
              <div style="height:48px;border:1px solid rgba(34,211,238,.55);box-shadow:inset 0 0 12px rgba(34,211,238,.24)"></div>
            </div>
          </div>`;

      case 'brutalist':
        return `
          <div style="padding:10px;background:#111;color:#fff;height:100%">
            <div style="height:14px;background:#ffd000;margin-bottom:8px"></div>
            <div style="height:44px;border:2px solid #fff;margin-bottom:8px"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div style="height:34px;background:#ff6b00"></div>
              <div style="height:34px;background:#fff"></div>
            </div>
          </div>`;

      case 'terminal':
        return `
          <div style="padding:10px;background:#0d1117;height:100%;font-family:'JetBrains Mono',monospace;color:#9ca3af">
            <div style="display:flex;gap:4px;margin-bottom:8px">
              <div style="width:8px;height:8px;background:#ef4444;border-radius:50%"></div>
              <div style="width:8px;height:8px;background:#f59e0b;border-radius:50%"></div>
              <div style="width:8px;height:8px;background:#22c55e;border-radius:50%"></div>
            </div>
            <div style="color:#7ee787;font-size:10px;margin-bottom:4px">$ cat profile.md</div>
            <div style="width:64%;height:6px;background:#58a6ff;border-radius:3px;margin-bottom:5px"></div>
            <div style="width:82%;height:4px;background:#30363d;border-radius:2px"></div>
          </div>`;

      case 'matrix-grid':
        return `
          <div style="padding:10px;height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:22px 1fr 1fr;gap:6px;background:rgba(2,6,23,.35)">
            <div style="grid-column:1/-1;${commonSurface}"></div>
            <div style="${commonSurface}"></div>
            <div style="${commonSurface}"></div>
            <div style="${commonSurface}"></div>
            <div style="grid-column:1/3;${commonSurface}"></div>
            <div style="${commonSurface}"></div>
          </div>`;

      case 'devcard':
        return `
          <div style="padding:10px;background:#0f172a;height:100%">
            <div style="${commonSurface}height:28px;margin-bottom:8px"></div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
              <div style="${commonSurface}height:52px"></div>
              <div style="${commonSurface}height:52px"></div>
              <div style="${commonSurface}height:52px"></div>
            </div>
          </div>`;

      case 'startup':
        return `
          <div style="padding:12px;height:100%">
            <div style="${commonSurface}height:56px;margin-bottom:10px;background:linear-gradient(120deg,rgba(255,255,255,.28),rgba(255,255,255,.12))"></div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px">
              <div style="${commonSurface}height:28px"></div>
              <div style="${commonSurface}height:28px"></div>
              <div style="${commonSurface}height:28px"></div>
            </div>
            <div style="${commonSurface}height:36px"></div>
          </div>`;

      default:
        return `
          <div style="padding:12px;color:${t.textColor};font-family:sans-serif">
            <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);margin-bottom:8px"></div>
            <div style="width:60%;height:8px;background:rgba(255,255,255,.6);border-radius:4px;margin-bottom:6px"></div>
            <div style="width:40%;height:6px;background:rgba(255,255,255,.3);border-radius:4px;margin-bottom:12px"></div>
            <div style="display:flex;gap:4px;margin-bottom:8px">
              ${[1,2,3].map(()=>`<div style="width:40px;height:4px;background:rgba(255,255,255,.25);border-radius:2px"></div>`).join('')}
            </div>
            <div style="width:80%;height:5px;background:rgba(255,255,255,.2);border-radius:2px;margin-bottom:4px"></div>
            <div style="width:65%;height:5px;background:rgba(255,255,255,.2);border-radius:2px;margin-bottom:4px"></div>
            <div style="width:70%;height:5px;background:rgba(255,255,255,.2);border-radius:2px"></div>
          </div>`;
    }
  }
  function initTemplateGrid() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    const availableIds = new Set(TEMPLATES.map(t => t.id));
    const selected = State.get('selectedTemplate');
    if (!availableIds.has(selected)) {
      State.set('selectedTemplate', 'minimal-clean');
    }

    grid.innerHTML = TEMPLATES.map(t => `
      <div class="template-card ${State.get('selectedTemplate') === t.id ? 'selected' : ''}"
           data-template="${t.id}" onclick="Customizer.selectTemplate('${t.id}')">
        <div class="template-thumb">
          <div class="template-thumb-inner" style="background:${t.gradient}">
            ${renderTemplateThumb(t)}
          </div>
          <span class="template-badge badge-${t.category}">${t.category}</span>
          <div class="selected-checkmark">âœ“</div>
        </div>
        <div class="template-info">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
          <div class="template-tags">${t.tags.map(tag => `<span class="t-tag">${tag}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        grid.querySelectorAll('.template-card').forEach(card => {
          const tpl = TEMPLATES.find(t => t.id === card.dataset.template);
          card.style.display = (filter === 'all' || tpl?.category === filter) ? '' : 'none';
        });
      });
    });
  }

  function selectTemplate(id) {
    if (!TEMPLATES.some(t => t.id === id)) return;
    State.set('selectedTemplate', id);
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.template === id);
    });
    App.toast(`Template "${TEMPLATES.find(t=>t.id===id)?.name}" selected`);
  }
  function initCustomizePanel() {
    renderColorSwatches();
    renderFontOptions();
    renderLayoutOptions();
    bindToggleOptions();
    updateMiniPreview();
  }

  function renderColorSwatches() {
    const wrap = document.getElementById('color-swatches');
    if (!wrap) return;
    const current = State.get('theme.accent');
    wrap.innerHTML = COLOR_THEMES.map(t => `
      <div class="color-swatch ${t.accent === current ? 'active' : ''}"
           style="background:${t.accent}"
           title="${t.name}"
           onclick="Customizer.setAccent('${t.accent}')"></div>
    `).join('');
  }

  function renderFontOptions() {
    const wrap = document.getElementById('font-options');
    if (!wrap) return;
    const current = State.get('theme.font');
    wrap.innerHTML = FONTS.map(f => `
      <div class="font-option ${f.name === current ? 'active' : ''}"
           onclick="Customizer.setFont('${f.name}')" style="font-family:'${f.name}',sans-serif">
        <div>
          <div class="font-name">${f.name}</div>
          <div class="font-sample">${f.sample}</div>
        </div>
        <span class="font-check">âœ“</span>
      </div>
    `).join('');
  }

  function renderLayoutOptions() {
    const wrap = document.getElementById('layout-options');
    if (!wrap) return;
    const current = State.get('theme.layout');
    wrap.innerHTML = LAYOUTS.map(l => `
      <div class="layout-option ${l.id === current ? 'active' : ''}"
           onclick="Customizer.setLayout('${l.id}')">
        <div class="layout-icon">${l.icon}</div>
        <div class="layout-label">${l.label}</div>
      </div>
    `).join('');
  }

  function bindToggleOptions() {
    const photo = document.getElementById('opt-show-photo');
    const skills = document.getElementById('opt-show-skills');
    const dark = document.getElementById('opt-dark-mode');
    if (photo) {
      photo.checked = State.get('theme.showPhoto') !== false;
      photo.addEventListener('change', () => { State.set('theme.showPhoto', photo.checked); schedulePreview(); });
    }
    if (skills) {
      skills.checked = State.get('theme.showSkills') !== false;
      skills.addEventListener('change', () => { State.set('theme.showSkills', skills.checked); schedulePreview(); });
    }
    if (dark) {
      dark.checked = !!State.get('theme.darkMode');
      dark.addEventListener('change', () => { State.set('theme.darkMode', dark.checked); schedulePreview(); });
    }
  }
  function setAccent(color) {
    State.set('theme.accent', color);
    document.querySelectorAll('.color-swatch').forEach(el => {
      el.classList.toggle('active', el.style.background === color || el.style.backgroundColor === color);
    });
    schedulePreview();
  }

  function setFont(font) {
    State.set('theme.font', font);
    document.querySelectorAll('.font-option').forEach(el => {
      el.classList.toggle('active', el.querySelector('.font-name')?.textContent === font);
    });
    document.querySelectorAll('.font-option .font-check').forEach((el, i) => {
      el.style.opacity = FONTS[i]?.name === font ? '1' : '0';
    });
    schedulePreview();
  }

  function setLayout(layout) {
    const allowed = new Set(LAYOUTS.map(l => l.id));
    if (!allowed.has(layout)) return;

    State.set('theme.layout', layout);
    renderLayoutOptions();
    schedulePreview(0);
  }
  let previewTimeout = null;
  function schedulePreview(delay = 300) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(updateMiniPreview, delay);
  }

  function updateMiniPreview() {
    const iframe = document.getElementById('mini-preview-iframe');
    if (!iframe) return;
    try {
      const html = Renderer.render();
      iframe.srcdoc = html;
    } catch(e) { console.warn('Preview error:', e); }
  }

  return {
    initTemplateGrid, initCustomizePanel, selectTemplate,
    setAccent, setFont, setLayout, updateMiniPreview
  };
})();
