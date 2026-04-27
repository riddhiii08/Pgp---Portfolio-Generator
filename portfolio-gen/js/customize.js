const Customizer = (() => {
  const COLOR_THEMES = [
    { name: 'Violet', accent: '#5b4cf5' },
    { name: 'Ocean', accent: '#0ea5e9' },
    { name: 'Forest', accent: '#22c55e' },
    { name: 'Sunset', accent: '#f97316' },
    { name: 'Rose', accent: '#e11d48' },
    { name: 'Gold', accent: '#d97706' },
    { name: 'Teal', accent: '#14b8a6' },
    { name: 'Magenta', accent: '#d946ef' },
    { name: 'Slate', accent: '#475569' },
    { name: 'Midnight', accent: '#1e1b4b' }
  ];
  const FONTS = [
    { name: 'DM Sans', sample: 'Clean & modern' },
    { name: 'Inter', sample: 'The web standard' },
    { name: 'Poppins', sample: 'Friendly & round' },
    { name: 'Playfair Display', sample: 'Editorial serif' },
    { name: 'Montserrat', sample: 'Geometric & bold' },
    { name: 'Roboto', sample: 'Material classic' }
  ];

  function templateScreenshotCandidates(t) {
    const id = String(t?.id || '').trim();
    const screenshot = String(t?.screenshot || '').trim();
    const candidates = [];

    if (screenshot) candidates.push(screenshot);
    if (id) {
      ['jpg', 'jpeg', 'png', 'webp'].forEach((ext) => {
        candidates.push(`assets/templates/${id}.${ext}`);
      });
    }

    return [...new Set(candidates)];
  }

  function buildMissingPreview(name) {
    return `
      <div class="template-preview-fallback">
        <div class="template-preview-fallback__icon">Preview</div>
        <strong>${name}</strong>
        <span>Screenshot asset not found</span>
      </div>`;
  }

  function renderTemplateThumb(t) {
    const name = t.name || 'Template';
    const candidates = templateScreenshotCandidates(t);

    if (!candidates.length) {
      return buildMissingPreview(name);
    }

    return `
      <img src="${candidates[0]}"
           alt="${name} Preview"
           class="template-screenshot"
           data-candidates="${candidates.join('|')}"
           style="width:100%;height:100%;object-fit:cover;display:block;">
    `;
  }

  function bindTemplateImageFallbacks(root) {
    root.querySelectorAll('.template-screenshot').forEach((img) => {
      if (img.dataset.fallbackBound === '1') return;
      img.dataset.fallbackBound = '1';

      img.addEventListener('error', () => {
        const candidates = String(img.dataset.candidates || '')
          .split('|')
          .map((value) => value.trim())
          .filter(Boolean);

        const currentSrc = img.getAttribute('src');
        const currentIndex = candidates.indexOf(currentSrc);
        const nextSrc = candidates[currentIndex + 1];

        if (nextSrc) {
          img.setAttribute('src', nextSrc);
          return;
        }

        const thumb = img.closest('.template-thumb-inner');
        const card = img.closest('.template-card');
        const title = card?.querySelector('.template-info h3')?.textContent?.trim() || 'Template';
        if (thumb) thumb.innerHTML = buildMissingPreview(title);
      });
    });
  }

  function initTemplateGrid() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    const availableIds = new Set(templates.map(t => t.id));
    const selected = State.get('selectedTemplate');
    if (!availableIds.has(selected)) {
      State.set('selectedTemplate', templates[0].id);
    }

    const newGrid = grid.cloneNode(false);
    grid.parentNode.replaceChild(newGrid, grid);

    newGrid.innerHTML = templates.map(t => `
      <div class="template-card ${State.get('selectedTemplate') === t.id ? 'selected' : ''}"
           data-template="${t.id}">
        <div class="template-thumb">
          <div class="template-thumb-inner" style="background:${t.gradient || '#333'}">
            ${renderTemplateThumb(t)}
          </div>
          <div class="template-hover-overlay">
            <button class="template-select-btn" type="button" data-template="${t.id}">Select Template</button>
          </div>
          <span class="template-badge badge-${t.category || 'default'}">${t.category || 'default'}</span>
          <div class="selected-checkmark">OK</div>
        </div>
        <div class="template-info">
          <h3>${t.name}</h3>
          <p>${t.description || ''}</p>
          <div class="template-tags">
            ${(t.tags || []).map(tag => `<span class="t-tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    bindTemplateImageFallbacks(newGrid);

    newGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.template-card');
      if (!card) return;
      selectTemplate(card.dataset.template);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        newBtn.classList.add('active');
        const filter = newBtn.dataset.filter;
        newGrid.querySelectorAll('.template-card').forEach(card => {
          const tpl = templates.find(t => t.id === card.dataset.template);
          card.style.display = (filter === 'all' || tpl?.category === filter) ? '' : 'none';
        });
      });
    });
  }

  function selectTemplate(id) {
    if (!templates.some(t => t.id === id)) return;
    State.set('selectedTemplate', id);
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.template === id);
    });
    App.toast(`Template "${templates.find(t => t.id === id)?.name}" selected`);
  }

  function initCustomizePanel() {
    renderColorSwatches();
    renderFontOptions();
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
        <span class="font-check">OK</span>
      </div>
    `).join('');
  }

  function bindToggleOptions() {
    const photo = document.getElementById('opt-show-photo');
    const skills = document.getElementById('opt-show-skills');
    if (photo) {
      photo.checked = State.get('theme.showPhoto') !== false;
      photo.addEventListener('change', () => { State.set('theme.showPhoto', photo.checked); schedulePreview(0); });
    }
    if (skills) {
      skills.checked = State.get('theme.showSkills') !== false;
      skills.addEventListener('change', () => { State.set('theme.showSkills', skills.checked); schedulePreview(0); });
    }
  }

  function setAccent(color) {
    State.set('theme.accent', color);
    document.querySelectorAll('.color-swatch').forEach(el => {
      el.classList.toggle('active', el.style.background === color || el.style.backgroundColor === color);
    });
    schedulePreview(0);
  }

  function setFont(font) {
    State.set('theme.font', font);
    document.querySelectorAll('.font-option').forEach(el => {
      el.classList.toggle('active', el.querySelector('.font-name')?.textContent === font);
    });
    document.querySelectorAll('.font-option .font-check').forEach((el, i) => {
      el.style.opacity = FONTS[i]?.name === font ? '1' : '0';
    });
    schedulePreview(0);
  }

  let previewTimeout = null;
  let miniRenderToken = 0;

  function schedulePreview(delay = 300) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(updateMiniPreview, delay);
  }

  async function updateMiniPreview() {
    const iframe = document.getElementById('mini-preview-iframe');
    if (!iframe) return;

    const renderToken = ++miniRenderToken;
    try {
      const html = await Renderer.renderSelectedTemplate();
      if (renderToken !== miniRenderToken) return;
      iframe.srcdoc = html;
    } catch (e) {
      console.warn('Preview error:', e);
    }
  }

  return {
    initTemplateGrid, initCustomizePanel, selectTemplate,
    setAccent, setFont, updateMiniPreview
  };
})();
