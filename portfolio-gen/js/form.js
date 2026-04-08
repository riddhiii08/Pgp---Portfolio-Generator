/* ═══════════════════════════════════════════════
   FORM.JS — Multi-Step Form Manager
   
   Handles: section navigation, field binding,
   skill tags, dynamic project/education cards,
   validation, and data syncing to State.
═══════════════════════════════════════════════ */

const FormManager = (() => {

  // ── Ordered section list ──
  const SECTIONS = ['personal', 'skills', 'projects', 'education', 'contact'];
  const SECTION_LABELS = {
    personal: 'Personal Info',
    skills: 'Skills',
    projects: 'Projects',
    education: 'Education',
    contact: 'Contact & Social'
  };
  let currentSection = 0;

  // ── Skill input suggestions ──
  const SKILL_SUGGESTIONS = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
    'Python', 'Django', 'FastAPI', 'SQL', 'PostgreSQL', 'MongoDB',
    'Docker', 'Kubernetes', 'AWS', 'Git', 'Figma', 'CSS', 'GraphQL'
  ];

  // ── Initialize form ──
  function init() {
    bindPersonalFields();
    bindContactFields();
    initSkillsInput();
    renderSuggestions();
    loadProjectsFromState();
    loadEducationFromState();
    goToSection(0);
    bindSidebarNav();
    bindAvatarPreview();
    bindBioCounter();
  }

  // ── Bind plain input fields to State ──
  function bindPersonalFields() {
    const d = State.data();
    ['name', 'title', 'bio', 'avatar'].forEach(key => {
      const el = document.getElementById(`f-${key}`);
      if (!el) return;
      el.value = d.personal[key] || '';
      el.addEventListener('input', () => {
        State.set(`personal.${key}`, el.value);
        updateSectionCheck('personal');
      });
    });
  }

  function bindContactFields() {
    const d = State.data();
    ['email', 'phone', 'location', 'github', 'linkedin', 'website', 'twitter'].forEach(key => {
      const el = document.getElementById(`f-${key}`);
      if (!el) return;
      el.value = d.contact[key] || '';
      el.addEventListener('input', () => {
        State.set(`contact.${key}`, el.value);
        updateSectionCheck('contact');
      });
    });
  }

  // ── Avatar preview ──
  function bindAvatarPreview() {
    const input = document.getElementById('f-avatar');
    const preview = document.getElementById('avatar-preview');
    if (!input || !preview) return;

    function updatePreview(url) {
      if (url && url.startsWith('http')) {
        const img = document.createElement('img');
        img.src = url;
        img.onerror = () => { preview.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`; };
        preview.innerHTML = '';
        preview.appendChild(img);
      }
    }
    updatePreview(input.value);
    input.addEventListener('input', () => updatePreview(input.value));
  }

  // ── Bio character counter ──
  function bindBioCounter() {
    const bio = document.getElementById('f-bio');
    const counter = document.getElementById('bio-count');
    if (!bio || !counter) return;
    const update = () => { counter.textContent = bio.value.length; };
    bio.addEventListener('input', update);
    update();
  }

  // ── Skills Tag Input ──
  function initSkillsInput() {
    const input = document.getElementById('skill-input');
    const container = document.getElementById('skills-tags');
    if (!input || !container) return;

    // Load existing skills
    renderSkillTags();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, '');
        if (val) addSkill(val);
        input.value = '';
      }
      // Backspace to remove last tag
      if (e.key === 'Backspace' && !input.value) {
        const skills = State.get('skills');
        if (skills.length) removeSkill(skills.length - 1);
      }
    });
  }

  function addSkill(name) {
    const skills = [...State.get('skills')];
    if (skills.includes(name)) return;
    skills.push(name);
    State.set('skills', skills);
    renderSkillTags();
    updateSectionCheck('skills');
  }

  function removeSkill(index) {
    const skills = [...State.get('skills')];
    skills.splice(index, 1);
    State.set('skills', skills);
    renderSkillTags();
    updateSectionCheck('skills');
  }

  function renderSkillTags() {
    const container = document.getElementById('skills-tags');
    if (!container) return;
    const skills = State.get('skills');
    // Remove existing tags (keep input)
    container.querySelectorAll('.skill-tag').forEach(t => t.remove());
    // Insert tags before input
    const input = document.getElementById('skill-input');
    skills.forEach((s, i) => {
      const tag = document.createElement('div');
      tag.className = 'skill-tag';
      tag.innerHTML = `<span>${s}</span><button onclick="FormManager.removeSkillByIndex(${i})" title="Remove">×</button>`;
      container.insertBefore(tag, input);
    });
  }

  function removeSkillByIndex(i) { removeSkill(i); }

  function renderSuggestions() {
    const wrap = document.getElementById('skill-suggestions');
    if (!wrap) return;
    wrap.innerHTML = SKILL_SUGGESTIONS.map(s =>
      `<span class="sug-tag" onclick="FormManager.addSkillFromSuggestion('${s}')">${s}</span>`
    ).join('');
  }

  function addSkillFromSuggestion(name) {
    addSkill(name);
    // Dim the suggestion
    document.querySelectorAll('.sug-tag').forEach(el => {
      if (el.textContent === name) el.style.opacity = '.35';
    });
  }

  // ── Projects ──
  let projectCounter = 0;

  function loadProjectsFromState() {
    const projects = State.get('projects');
    projects.forEach(p => addProject(p));
  }

  function addProject(data = null) {
    const id = data?.id || `proj_${Date.now()}_${projectCounter++}`;
    if (!data) {
      // New project — push to state
      const projects = [...State.get('projects'), { id, title: '', description: '', tech: '', link: '' }];
      State.set('projects', projects);
      data = { id, title: '', description: '', tech: '', link: '' };
    }

    const container = document.getElementById('projects-list');
    const idx = State.get('projects').findIndex(p => p.id === id);
    const card = document.createElement('div');
    card.className = 'dynamic-card';
    card.id = `project-card-${id}`;
    card.innerHTML = `
      <div class="card-header">
        <h4>Project ${State.get('projects').length}</h4>
        <button class="card-remove" onclick="FormManager.removeProject('${id}')" title="Remove">✕</button>
      </div>
      <div class="form-grid">
        <div class="field-group full">
          <label>Project Title</label>
          <input type="text" value="${esc(data.title)}" placeholder="My Awesome App" data-proj="${id}" data-field="title"/>
        </div>
        <div class="field-group full">
          <label>Description</label>
          <textarea rows="2" placeholder="What it does, what problem it solves..." data-proj="${id}" data-field="description">${esc(data.description)}</textarea>
        </div>
        <div class="field-group">
          <label>Tech Stack</label>
          <input type="text" value="${esc(data.tech)}" placeholder="React, Node.js, MongoDB" data-proj="${id}" data-field="tech"/>
        </div>
        <div class="field-group">
          <label>Live Link</label>
          <input type="url" value="${esc(data.link)}" placeholder="https://..." data-proj="${id}" data-field="link"/>
        </div>
      </div>`;
    container.appendChild(card);

    // Bind inputs
    card.querySelectorAll('[data-proj]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.getAttribute('data-field');
        const projects = [...State.get('projects')];
        const idx = projects.findIndex(p => p.id === id);
        if (idx >= 0) {
          projects[idx][field] = el.value;
          State.set('projects', projects);
          updateSectionCheck('projects');
        }
      });
    });

    if (window.Premium3D && typeof window.Premium3D.bindCardTilt === 'function') {
      window.Premium3D.bindCardTilt(container);
    }
  }

  function removeProject(id) {
    const projects = State.get('projects').filter(p => p.id !== id);
    State.set('projects', projects);
    const card = document.getElementById(`project-card-${id}`);
    if (card) { card.style.opacity = '0'; card.style.transform = 'scale(.97)'; card.style.transition = 'all .2s'; setTimeout(() => card.remove(), 200); }
    updateSectionCheck('projects');
  }

  // ── Education ──
  let eduCounter = 0;

  function loadEducationFromState() {
    const education = State.get('education');
    education.forEach(e => addEducation(e));
  }

  function addEducation(data = null) {
    const id = data?.id || `edu_${Date.now()}_${eduCounter++}`;
    if (!data) {
      const education = [...State.get('education'), { id, institution: '', degree: '', field: '', from: '', to: '', current: false }];
      State.set('education', education);
      data = { id, institution: '', degree: '', field: '', from: '', to: '', current: false };
    }

    const container = document.getElementById('education-list');
    const card = document.createElement('div');
    card.className = 'dynamic-card';
    card.id = `edu-card-${id}`;
    card.innerHTML = `
      <div class="card-header">
        <h4>Education / Certification</h4>
        <button class="card-remove" onclick="FormManager.removeEducation('${id}')" title="Remove">✕</button>
      </div>
      <div class="form-grid">
        <div class="field-group full">
          <label>Institution / School</label>
          <input type="text" value="${esc(data.institution)}" placeholder="MIT, Coursera, etc." data-edu="${id}" data-field="institution"/>
        </div>
        <div class="field-group">
          <label>Degree / Certificate</label>
          <input type="text" value="${esc(data.degree)}" placeholder="B.Sc., M.Sc., Certificate" data-edu="${id}" data-field="degree"/>
        </div>
        <div class="field-group">
          <label>Field of Study</label>
          <input type="text" value="${esc(data.field)}" placeholder="Computer Science" data-edu="${id}" data-field="field"/>
        </div>
        <div class="field-group">
          <label>From (Year)</label>
          <input type="text" value="${esc(data.from)}" placeholder="2018" data-edu="${id}" data-field="from"/>
        </div>
        <div class="field-group">
          <label>To (Year)</label>
          <input type="text" value="${esc(data.to)}" placeholder="2022" data-edu="${id}" data-field="to" id="edu-to-${id}"/>
        </div>
      </div>`;
    container.appendChild(card);

    card.querySelectorAll('[data-edu]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.getAttribute('data-field');
        const education = [...State.get('education')];
        const idx = education.findIndex(e => e.id === id);
        if (idx >= 0) {
          education[idx][field] = el.value;
          State.set('education', education);
          updateSectionCheck('education');
        }
      });
    });

    if (window.Premium3D && typeof window.Premium3D.bindCardTilt === 'function') {
      window.Premium3D.bindCardTilt(container);
    }
  }

  function removeEducation(id) {
    const education = State.get('education').filter(e => e.id !== id);
    State.set('education', education);
    const card = document.getElementById(`edu-card-${id}`);
    if (card) { card.style.opacity = '0'; card.style.transition = 'all .2s'; setTimeout(() => card.remove(), 200); }
  }

  // ── Section Navigation ──
  function goToSection(idx) {
    const sections = SECTIONS;
    if (idx < 0 || idx >= sections.length) return;

    // Deactivate all
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.snav-item').forEach(s => s.classList.remove('active'));

    // Activate target
    const sectionId = `section-${sections[idx]}`;
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    const navBtn = document.querySelector(`.snav-item[data-section="${sections[idx]}"]`);
    if (navBtn) navBtn.classList.add('active');

    currentSection = idx;
    updateFooter();
  }

  function nextSection() {
    if (currentSection === 0 && !validatePersonal()) return;
    if (currentSection < SECTIONS.length - 1) {
      goToSection(currentSection + 1);
    } else {
      // Last section — go to templates
      App.goTo('templates');
    }
  }

  function prevSection() {
    if (currentSection > 0) goToSection(currentSection - 1);
  }

  function updateFooter() {
    const prevBtn = document.getElementById('btn-prev-section');
    const nextBtn = document.getElementById('btn-next-section');
    const label = document.getElementById('current-section-label');
    const count = document.getElementById('section-count-display');

    if (prevBtn) prevBtn.style.display = currentSection === 0 ? 'none' : 'inline-flex';
    if (label) label.textContent = SECTION_LABELS[SECTIONS[currentSection]];
    if (count) count.textContent = `${currentSection + 1} / ${SECTIONS.length}`;
    if (nextBtn) {
      nextBtn.textContent = currentSection === SECTIONS.length - 1 ? 'Choose Template →' : 'Next →';
    }
  }

  function bindSidebarNav() {
    document.querySelectorAll('.snav-item').forEach((btn, i) => {
      btn.addEventListener('click', () => goToSection(i));
    });
  }

  // ── Validation ──
  function validatePersonal() {
    const name = document.getElementById('f-name');
    const title = document.getElementById('f-title');
    let valid = true;

    [name, title].forEach(el => {
      if (!el || !el.value.trim()) {
        el.classList.add('error');
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
        valid = false;
      }
    });

    if (!valid) App.toast('Please fill in your Name and Title', 'error');
    return valid;
  }

  // ── Section completion check ──
  function updateSectionCheck(section) {
    const d = State.data();
    let complete = false;
    switch (section) {
      case 'personal': complete = !!(d.personal.name && d.personal.title); break;
      case 'skills': complete = d.skills.length > 0; break;
      case 'projects': complete = d.projects.length > 0; break;
      case 'education': complete = d.education.length > 0; break;
      case 'contact': complete = !!(d.contact.email); break;
    }
    const check = document.getElementById(`check-${section}`);
    if (check) check.classList.toggle('visible', complete);
  }

  // ── HTML escape (local helper) ──
  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Restore section checks from loaded state ──
  function restoreChecks() {
    ['personal','skills','projects','education','contact'].forEach(updateSectionCheck);
  }

  return {
    init, nextSection, prevSection, goToSection,
    addProject, removeProject, addEducation, removeEducation,
    addSkillFromSuggestion, removeSkillByIndex, restoreChecks,
    updateSectionCheck
  };
})();