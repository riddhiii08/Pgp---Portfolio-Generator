/* ═══════════════════════════════════════════════
   APP.JS — Main Application Controller
   
   Handles: screen routing, initialization,
   preview rendering, device toggle, toast notifications.
   
   Loaded LAST — all modules must exist first.
═══════════════════════════════════════════════ */

const App = (() => {

  // ── Screen map ──
  const SCREENS = {
    landing:   'screen-landing',
    form:      'screen-form',
    templates: 'screen-templates',
    customize: 'screen-customize',
    preview:   'screen-preview'
  };

  // ── Current active screen ──
  let currentScreen = 'landing';

  // ── Navigate to a screen ──
  function goTo(screenName) {
    if (!SCREENS[screenName]) { console.warn('Unknown screen:', screenName); return; }

    // Run pre-screen hooks
    if (screenName === 'templates')  onEnterTemplates();
    if (screenName === 'customize')  onEnterCustomize();
    if (screenName === 'preview')    onEnterPreview();

    // Hide current screen
    const prev = document.getElementById(SCREENS[currentScreen]);
    if (prev) prev.classList.remove('active');

    // Show new screen
    currentScreen = screenName;
    State.set('currentScreen', screenName);

    const next = document.getElementById(SCREENS[screenName]);
    if (next) {
      next.classList.add('active', 'entering');
      setTimeout(() => next.classList.remove('entering'), 400);
    }

    // Update progress indicator
    updateProgressIndicator(screenName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Alias for landing → form ──
  function goToForm() { goTo('form'); }

  // ── Pre-screen hooks ──
  function onEnterTemplates() {
    Customizer.initTemplateGrid();
    initUiRevealAnimations();
    bindPremium3D(document.getElementById(SCREENS.templates));
  }

  function onEnterCustomize() {
    Customizer.initCustomizePanel();
    initUiRevealAnimations();
    bindPremium3D(document.getElementById(SCREENS.customize));
  }

  function onEnterPreview() {
    renderFullPreview();
    initUiRevealAnimations();
    bindPremium3D(document.getElementById(SCREENS.preview));
  }

  function bindPremium3D(root = document) {
    if (window.Premium3D && typeof window.Premium3D.bindCardTilt === 'function') {
      window.Premium3D.bindCardTilt(root || document);
    }
  }

  // ── Progress Step Indicator ──
  function updateProgressIndicator(screen) {
    const stepMap = { form: 1, templates: 2, customize: 3, preview: 3 };
    const currentStep = stepMap[screen] || 0;
    document.querySelectorAll('.prog-step').forEach(el => {
      const step = parseInt(el.dataset.step);
      el.classList.remove('active', 'done');
      if (step < currentStep) el.classList.add('done');
      else if (step === currentStep) el.classList.add('active');
    });
  }

  // ── Render Full Preview ──
  function renderFullPreview() {
    const loading = document.getElementById('preview-loading');
    const iframe = document.getElementById('preview-iframe');
    if (!iframe) return;

    if (loading) loading.classList.remove('hidden');

    // Small delay so loading shows
    setTimeout(() => {
      try {
        const html = Renderer.render();
        iframe.srcdoc = html;
        iframe.onload = () => {
          if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.classList.add('hidden'), 400);
          }
        };
        // Safety fallback
        setTimeout(() => {
          if (loading) { loading.style.opacity = '0'; setTimeout(() => loading.classList.add('hidden'), 400); }
        }, 3000);
      } catch(e) {
        console.error('Render error:', e);
        if (loading) loading.classList.add('hidden');
        toast('Render error — check console', 'error');
      }
    }, 400);
  }

  // ── Device Toggle (preview screen) ──
  function initDeviceToggle() {
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.dataset.device;
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
          iframe.className = `preview-iframe ${device}`;
        }
      });
    });
  }

  // ── Toast Notifications ──
  function toast(message, type = 'info') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = `toast show ${type}`;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 3000);
  }

  // ── Lightweight UI reveal animations ──
  let revealObserver = null;
  function initUiRevealAnimations() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
    }

    const targets = document.querySelectorAll(
      '.template-card, .font-option, .layout-option, .cust-group, .dynamic-card, .btn-add-item, .field-group'
    );

    targets.forEach((el, index) => {
      if (el.dataset.revealBound === '1') return;
      el.dataset.revealBound = '1';
      el.classList.add('ui-reveal');
      el.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
      revealObserver.observe(el);
    });
  }

  // ── Initialize the entire app ──
  function init() {
    // Restore saved screen or default to landing
    const savedScreen = State.get('currentScreen') || 'landing';

    // Always start on landing for fresh experience
    // (Comment next line to restore last screen across refreshes)
    // const startScreen = savedScreen === 'landing' ? 'landing' : savedScreen;

    // Show landing
    const landing = document.getElementById(SCREENS.landing);
    if (landing) landing.classList.add('active');

    // Init sub-modules
    FormManager.init();
    FormManager.restoreChecks();
    initDeviceToggle();
    initUiRevealAnimations();
    bindPremium3D(document);

    console.log('%c PortfolioForge ⬡ ', 'background:#5b4cf5;color:white;padding:4px 8px;border-radius:4px;font-weight:bold;');
    console.log('State:', State.data());
  }

  // ── Kick off on DOM ready ──
  document.addEventListener('DOMContentLoaded', init);

  return { goTo, goToForm, toast, renderFullPreview };
})();