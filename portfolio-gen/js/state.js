/* ═══════════════════════════════════════════════
   STATE.JS — Global App State & localStorage Sync
   
   Single source of truth for all app data.
   Every mutation calls State.save() to persist.
═══════════════════════════════════════════════ */

const State = (() => {
  const STORAGE_KEY = 'portfolioforge_v1';

  // ── Default State Shape ──
  const DEFAULT = {
    currentScreen: 'landing',

    // Form data
    personal: {
      name: '', title: '', bio: '', avatar: ''
    },
    skills: [],          // ['JavaScript', 'React', ...]
    projects: [],        // [{ id, title, description, tech, link }]
    education: [],       // [{ id, institution, degree, field, from, to, current }]
    contact: {
      email: '', phone: '', location: '',
      github: '', linkedin: '', website: '', twitter: ''
    },

    // Template & customization
    selectedTemplate: 'minimal-clean',
    theme: {
      accent: '#5b4cf5',
      font: 'DM Sans',
      layout: 'single',
      showPhoto: true,
      showSkills: true,
      darkMode: false
    }
  };

  // ── Load from localStorage or use defaults ──
  let data = (() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Deep merge stored with defaults (handles new fields gracefully)
        const parsed = JSON.parse(stored);
        return deepMerge(JSON.parse(JSON.stringify(DEFAULT)), parsed);
      }
    } catch (e) { console.warn('State load error:', e); }
    return JSON.parse(JSON.stringify(DEFAULT));
  })();

  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  // ── Save to localStorage ──
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Update save indicator
      const el = document.getElementById('save-status');
      if (el) {
        el.textContent = 'Saved just now';
        setTimeout(() => { if (el) el.textContent = 'Auto-saved'; }, 2000);
      }
    } catch (e) { console.warn('State save error:', e); }
  }

  // ── Reset all data ──
  function reset() {
    data = JSON.parse(JSON.stringify(DEFAULT));
    save();
  }

  // ── Getters & Setters ──
  function get(path) {
    if (!path) return data;
    return path.split('.').reduce((obj, key) => obj?.[key], data);
  }

  function set(path, value) {
    const keys = path.split('.');
    let obj = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    save();
  }

  // ── Expose public API ──
  return { get, set, save, reset, data: () => data };
})();