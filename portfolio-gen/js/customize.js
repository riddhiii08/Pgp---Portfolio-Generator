/* ═══════════════════════════════════════════════
   CUSTOMIZE.JS — Template Selection + Style Picker
   
   Manages the template grid (screen 3) and
   the customization panel (screen 4) with
   live mini-preview updates.
═══════════════════════════════════════════════ */

const Customizer = (() => {

  // ── Color Themes ──
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

  // ── Font Options ──
  const FONTS = [
    { name: 'DM Sans',    sample: 'Clean & modern' },
    { name: 'Inter',      sample: 'The web standard' },
    { name: 'Poppins',    sample: 'Friendly & round' },
    { name: 'Playfair Display', sample: 'Editorial serif' },
    { name: 'Montserrat', sample: 'Geometric & bold' },
    { name: 'Roboto',     sample: 'Material classic' }
  ];

  // ── Layout Options ──
  const LAYOUTS = [
    { id: 'single',  label: 'Single', icon: '▬' },
    { id: 'two-col', label: 'Two Col', icon: '▐▌' },
    { id: 'grid',    label: 'Grid',   icon: '⊞' }
  ];

  // ── Template Grid ──
  function initTemplateGrid() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    grid.innerHTML = TEMPLATES.map(t => `
      <div class="template-card ${State.get('selectedTemplate') === t.id ? 'selected' : ''}"
           data-template="${t.id}" onclick="Customizer.selectTemplate('${t.id}')">
        <div class="template-thumb">
          <div class="template-thumb-inner" style="background:${t.gradient}">
            <!-- Thumbnail visual -->
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
            </div>
          </div>
          <span class="template-badge badge-${t.category}">${t.category}</span>
          <div class="selected-checkmark">✓</div>
        </div>
        <div class="template-info">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
          <div class="template-tags">${t.tags.map(tag => `<span class="t-tag">${tag}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');

    // Filter buttons
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
    State.set('selectedTemplate', id);
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.template === id);
    });
    App.toast(`Template "${TEMPLATES.find(t=>t.id===id)?.name}" selected`);
  }

  // ── Customization Panel ──
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
        <span class="font-check">✓</span>
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

  // ── Setters ──
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
    State.set('theme.layout', layout);
    document.querySelectorAll('.layout-option').forEach(el => {
      el.classList.toggle('active', el.querySelector('.layout-label')?.textContent.toLowerCase().replace(' ', '-') === layout ||
        el.querySelector('.layout-label')?.textContent === LAYOUTS.find(l=>l.id===layout)?.label);
    });
    schedulePreview();
  }

  // ── Mini Preview ──
  let previewTimeout = null;
  function schedulePreview() {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(updateMiniPreview, 600);
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