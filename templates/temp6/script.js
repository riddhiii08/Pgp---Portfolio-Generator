(() => {
  const PLANS = [
    {
      name: "Essential",
      price: 25,
      data: "5GB",
      badge: "",
      features: ["Unlimited Talk & Text", "5G Data", "Wi-Fi Calling", "Mobile Hotspot 2GB"]
    },
    {
      name: "Unlimited",
      price: 40,
      data: "Unlimited",
      badge: "Most Popular",
      features: ["Unlimited Talk & Text", "Unlimited 5G Data", "Wi-Fi Calling", "Mobile Hotspot 15GB", "International SMS"]
    },
    {
      name: "Family",
      price: 65,
      data: "Unlimited+",
      badge: "Best Value",
      features: ["Up to 4 Lines", "Unlimited 5G Data", "Wi-Fi Calling", "Hotspot 25GB/line", "Intl Calling 30+ Countries"]
    }
  ];

  const PERKS = [
    { logo: "🎵", name: "Music+", benefit: "3 months free on any plan" },
    { logo: "☁️", name: "Cloud Vault", benefit: "100GB secure storage included" },
    { logo: "📺", name: "StreamPass", benefit: "Ad-free streaming bundle" },
    { logo: "🛡️", name: "SecureNet", benefit: "Device protection plan" },
    { logo: "✈️", name: "Roam Free", benefit: "10-day international pass" },
    { logo: "🎮", name: "GameZone", benefit: "Priority data for gaming" }
  ];

  const MARQUEE_ITEMS = [
    "⚡ Instant Activation",
    "📶 Nationwide 5G",
    "🔓 No Contract Ever",
    "💰 Plans from $25/mo",
    "📱 Works on Any Unlocked Phone",
    "🌍 International Calling Available",
    "✅ $0 Activation Fee",
    "🔄 Keep Your Number"
  ];

  const USAGE_CATEGORIES = [
    { label: "Social & Messaging", icon: "💬", gbPerMonth: 1.2 },
    { label: "Video Streaming (HD)", icon: "📺", gbPerMonth: 12.0 },
    { label: "Music & Podcasts", icon: "🎵", gbPerMonth: 1.8 },
    { label: "Navigation / Maps", icon: "🗺️", gbPerMonth: 0.8 },
    { label: "Video Calls", icon: "📹", gbPerMonth: 4.5 }
  ];

  const PLAN_THRESHOLDS = [
    { maxGB: 5, plan: "Essential", price: 25, data: "5GB" },
    { maxGB: 999, plan: "Unlimited", price: 40, data: "Unlimited" },
    { maxGB: Infinity, plan: "Family", price: 65, data: "Unlimited+" }
  ];

  const CITIES = [
    { name: "New York", top: 30, left: 78, coverage: "99.9%", speed: "1.2Gbps" },
    { name: "Los Angeles", top: 54, left: 11, coverage: "99.7%", speed: "980Mbps" },
    { name: "Chicago", top: 34, left: 61, coverage: "99.8%", speed: "1.1Gbps" },
    { name: "Houston", top: 67, left: 49, coverage: "99.6%", speed: "890Mbps" },
    { name: "Phoenix", top: 57, left: 20, coverage: "99.5%", speed: "860Mbps" },
    { name: "Philadelphia", top: 32, left: 75, coverage: "99.8%", speed: "1.0Gbps" },
    { name: "Seattle", top: 18, left: 9, coverage: "99.7%", speed: "950Mbps" },
    { name: "Denver", top: 42, left: 31, coverage: "99.4%", speed: "820Mbps" },
    { name: "Atlanta", top: 57, left: 68, coverage: "99.6%", speed: "900Mbps" },
    { name: "Miami", top: 74, left: 73, coverage: "99.5%", speed: "870Mbps" }
  ];

  const POPULAR_MODELS = [
    "iPhone 15 Pro", "iPhone 14", "iPhone 13", "iPhone 12",
    "Samsung Galaxy S24", "Samsung Galaxy S23", "Samsung Galaxy A54",
    "Google Pixel 8", "Google Pixel 7", "OnePlus 12",
    "Motorola Moto G", "LG V60"
  ];

  const ADD_ONS = [
    { id: "intl-calling", icon: "🌍", name: "International Calling", description: "Unlimited calls to 50+ countries", price: 15, category: "International" },
    { id: "intl-data", icon: "✈️", name: "Global Data Pass", description: "10GB roaming in 120+ countries", price: 20, category: "International" },
    { id: "hotspot-boost", icon: "📡", name: "Hotspot Boost", description: "Extra 25GB high-speed hotspot", price: 10, category: "Data" },
    { id: "data-turbo", icon: "⚡", name: "Data Turbo", description: "Priority network access, no throttling", price: 8, category: "Data" },
    { id: "device-prot", icon: "🛡️", name: "Device Protection", description: "Screen repair + theft replacement", price: 12, category: "Protection" },
    { id: "cloud-storage", icon: "☁️", name: "Cloud Vault 100GB", description: "Encrypted cloud backup for your phone", price: 5, category: "Storage" },
    { id: "streaming", icon: "🎵", name: "Music & Streaming Bundle", description: "Ad-free music + 3 streaming apps", price: 10, category: "Entertainment" },
    { id: "family-watch", icon: "👨‍👩‍👧", name: "Family Watch", description: "Location sharing & screen time controls", price: 7, category: "Family" }
  ];

  const BASE_PLANS = [
    { name: "Essential", price: 25 },
    { name: "Unlimited", price: 40 },
    { name: "Family", price: 65 }
  ];

  const state = {
    activeHeroTab: "plans",
    sliderValue: 12,
    activeUsage: new Set([0, 2, 3]),
    selectedBasePlan: 1,
    selectedAddOns: new Set()
  };

  const el = (selector) => document.querySelector(selector);
  const els = (selector) => Array.from(document.querySelectorAll(selector));

  function initHeader() {
    const header = el("#site-header");
    const toggle = el("#menu-toggle");
    const mobileMenu = el("#mobile-menu");

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });

    toggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });

    els("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }

  function initAnchorNav() {
    const wrap = el("#anchor-nav");
    const links = els("#anchor-nav a");
    const sections = links.map((a) => el(`#${a.dataset.section}`)).filter(Boolean);

    const update = () => {
      const heroHeight = window.innerHeight;
      wrap.classList.toggle("visible", window.scrollY > heroHeight * 0.6);

      let activeId = "calculator";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 140) {
          activeId = section.id;
        }
      });

      links.forEach((a) => a.classList.toggle("active", a.dataset.section === activeId));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function renderHeroPlans() {
    return `
      <div id="plans" class="plans-grid">
        ${PLANS.map((plan) => `
          <article class="plan-card ${plan.badge === "Most Popular" ? "featured" : ""}">
            ${plan.badge ? `<span class="badge">${plan.badge}</span>` : ""}
            <div class="plan-price">$${plan.price}<span class="light">/mo</span></div>
            <div class="plan-name">${plan.name}</div>
            <div class="plan-data mono">${plan.data} Data</div>
            <ul class="plan-features">${plan.features.map((f) => `<li>${f}</li>`).join("")}</ul>
            <a href="#plans" class="${plan.badge === "Most Popular" ? "cta-primary full" : "cta-secondary"}">Select ${plan.name}</a>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderHeroCoverage() {
    return `
      <div class="map-mini">
        <svg viewBox="0 0 960 580" class="map-svg" style="position:absolute;inset:0;width:100%;height:100%;opacity:.1">
          <path d="M80,120 L160,80 L320,60 L480,70 L640,60 L800,80 L880,150 L900,280 L860,400 L780,480 L680,520 L560,530 L460,510 L360,530 L240,520 L140,460 L80,360 L60,240 Z" fill="none" stroke="rgba(0,240,255,.7)" stroke-width="2" />
        </svg>
        <div class="map-overlay"></div>
        ${CITIES.slice(0, 8).map((city) => `
          <div class="city-mini city" style="top:${city.top}%;left:${city.left}%">
            <div class="pulse-ring"></div>
            <div class="city-dot"></div>
            <div class="city-name mono">${city.name.slice(0, 3).toUpperCase()}</div>
          </div>
        `).join("")}
        <div class="legend">
          <span class="city-dot"></span>
          <span>5G Active</span>
          <span class="divider"></span>
          <span class="mono cyan">312 cities covered</span>
        </div>
      </div>
    `;
  }

  function renderHeroPerks() {
    return `
      <div class="perks-grid">
        ${PERKS.map((perk) => `
          <article class="perk-card">
            <div style="font-size:2rem">${perk.logo}</div>
            <h4>${perk.name}</h4>
            <p class="muted">${perk.benefit}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderHeroTab() {
    const holder = el("#hero-tab-content");
    holder.classList.add("fade");

    window.setTimeout(() => {
      if (state.activeHeroTab === "plans") holder.innerHTML = renderHeroPlans();
      if (state.activeHeroTab === "coverage") holder.innerHTML = renderHeroCoverage();
      if (state.activeHeroTab === "perks") holder.innerHTML = renderHeroPerks();
      holder.classList.remove("fade");
    }, 120);
  }

  function initHeroTabs() {
    els(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        if (tab === state.activeHeroTab) return;
        state.activeHeroTab = tab;
        els(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        renderHeroTab();
      });
    });
    renderHeroTab();
  }

  function initMarquee() {
    const track = el("#marquee-track");
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
      .map((text) => `<span class="marquee-item">${text}<b>·</b></span>`)
      .join("");
    track.innerHTML = items;
  }

  function getRecommendedPlan(gb) {
    return PLAN_THRESHOLDS.find((item) => gb <= item.maxGB) || PLAN_THRESHOLDS[1];
  }

  function initCalculator() {
    const slider = el("#data-slider");
    const value = el("#slider-value");
    const usageList = el("#usage-list");

    const syncUI = () => {
      const usageSum = [...state.activeUsage].reduce((sum, idx) => sum + USAGE_CATEGORIES[idx].gbPerMonth, 0);
      const displayGB = Math.round(Math.max(state.sliderValue, usageSum));
      const rec = getRecommendedPlan(displayGB);

      value.textContent = state.sliderValue >= 50 ? "50+ GB" : `${state.sliderValue} GB`;
      slider.style.setProperty("--val", `${Math.round((Math.min(state.sliderValue, 50) / 50) * 100)}%`);

      el("#rec-price").textContent = `$${rec.price}`;
      el("#rec-name").textContent = `${rec.plan} Plan`;
      el("#rec-meta").textContent = `${rec.data} · Based on ~${displayGB}GB estimated usage`;
      el("#meter-label").textContent = `${displayGB}GB`;
      el("#meter-fill").style.width = `${Math.min((displayGB / 50) * 100, 100)}%`;
      el("#rec-cta").textContent = `Activate ${rec.plan} - $${rec.price}/mo`;

      els(".usage-item").forEach((item) => {
        const idx = Number(item.dataset.idx);
        item.classList.toggle("active", state.activeUsage.has(idx));
      });
    };

    usageList.innerHTML = USAGE_CATEGORIES.map((cat, idx) => `
      <button class="usage-item ${state.activeUsage.has(idx) ? "active" : ""}" data-idx="${idx}">
        <span>${cat.icon} ${cat.label}</span>
        <span class="row" style="gap:10px"><small class="mono muted">~${cat.gbPerMonth}GB</small><span class="switch"></span></span>
      </button>
    `).join("");

    usageList.addEventListener("click", (event) => {
      const target = event.target.closest(".usage-item");
      if (!target) return;
      const idx = Number(target.dataset.idx);
      if (state.activeUsage.has(idx)) state.activeUsage.delete(idx);
      else state.activeUsage.add(idx);
      syncUI();
    });

    slider.addEventListener("input", () => {
      state.sliderValue = Number(slider.value);
      syncUI();
    });

    syncUI();
  }

  function initNetworkMap() {
    const map = el("#network-map");
    map.innerHTML = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;opacity:.08">
        ${Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${i * 5}" x2="100" y2="${i * 5}" stroke="var(--cyan)" stroke-width="0.2"/>`).join("")}
        ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 5}" y1="0" x2="${i * 5}" y2="100" stroke="var(--cyan)" stroke-width="0.2"/>`).join("")}
      </svg>
      <svg viewBox="0 0 960 580" style="position:absolute;inset:0;width:100%;height:100%;opacity:.1">
        <path d="M80,120 L160,80 L320,60 L480,70 L640,60 L800,80 L880,150 L900,280 L860,400 L780,480 L680,520 L560,530 L460,510 L360,530 L240,520 L140,460 L80,360 L60,240 Z" fill="rgba(0,240,255,.3)" stroke="rgba(0,240,255,.6)" stroke-width="2" />
      </svg>
      <div class="map-overlay"></div>
      ${CITIES.map((city) => `
        <div class="network-node" style="top:${city.top}%;left:${city.left}%">
          <div class="pulse-ring"></div>
          <div class="city-dot"></div>
          <div class="node-tip"><b>${city.name}</b><br><span class="cyan mono">${city.speed}</span><br><span class="muted">${city.coverage} uptime</span></div>
        </div>
      `).join("")}
      <div class="legend">
        <span class="city-dot"></span><span>5G</span><span class="divider"></span><span class="mono muted">Hover a city for details</span>
      </div>
    `;
  }

  function initPhoneChecker() {
    const input = el("#phone-input");
    const clear = el("#clear-input");
    const suggestions = el("#suggestions");
    const checkBtn = el("#check-btn");
    const result = el("#check-result");
    const popular = el("#popular-models");

    const renderSuggestions = (value) => {
      const query = value.trim().toLowerCase();
      if (query.length < 2) {
        suggestions.innerHTML = "";
        suggestions.style.borderColor = "transparent";
        return;
      }

      const matches = POPULAR_MODELS.filter((m) => m.toLowerCase().includes(query)).slice(0, 4);
      if (!matches.length) {
        suggestions.innerHTML = "";
        suggestions.style.borderColor = "transparent";
        return;
      }

      suggestions.style.borderColor = "var(--border-subtle)";
      suggestions.innerHTML = matches.map((m) => `<button type="button" data-model="${m}">📱 ${m}</button>`).join("");
    };

    const renderResult = (model, ok) => {
      if (ok) {
        result.innerHTML = `
          <article class="result ok">
            <h4>Compatible - Good to Go</h4>
            <p><strong>${model}</strong> works on our network. Just snap in your SIM and you are live on 5G.</p>
            <div class="chip-wrap">
              <span class="chip">5G Ready</span>
              <span class="chip">VoLTE</span>
              <span class="chip">Wi-Fi Calling</span>
              <span class="chip">Hotspot</span>
            </div>
          </article>
        `;
      } else {
        result.innerHTML = `
          <article class="result bad">
            <h4>Not Compatible</h4>
            <p><strong>${model}</strong> does not support required network bands. Check compatible devices starting at $49.</p>
          </article>
        `;
      }
    };

    const runCheck = (modelValue) => {
      const model = (modelValue || input.value).trim();
      if (!model) return;
      input.value = model;
      clear.style.display = "block";
      suggestions.innerHTML = "";
      checkBtn.textContent = "Checking...";
      checkBtn.disabled = true;

      window.setTimeout(() => {
        const badList = ["LG V60", "LG G8"];
        const ok = !badList.some((m) => model.toLowerCase().includes(m.toLowerCase()));
        renderResult(model, ok);
        checkBtn.textContent = "Check Compatibility";
        checkBtn.disabled = false;
      }, 950);
    };

    input.addEventListener("input", () => {
      renderSuggestions(input.value);
      result.innerHTML = "";
      clear.style.display = input.value ? "block" : "none";
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") runCheck();
    });

    clear.addEventListener("click", () => {
      input.value = "";
      clear.style.display = "none";
      suggestions.innerHTML = "";
      result.innerHTML = "";
    });

    suggestions.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-model]");
      if (!btn) return;
      runCheck(btn.dataset.model);
    });

    checkBtn.addEventListener("click", () => runCheck());

    popular.innerHTML = POPULAR_MODELS.slice(0, 8)
      .map((m) => `<button class="chip" type="button" data-model="${m}">${m}</button>`)
      .join("");

    popular.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-model]");
      if (!btn) return;
      runCheck(btn.dataset.model);
    });
  }

  function initAddOns() {
    const basePlans = el("#base-plans");
    const groups = el("#addon-groups");
    const floatBar = el("#floating-bar");

    const totalPrice = el("#total-price");
    const totalMeta = el("#total-meta");
    const totalCta = el("#total-cta");

    const floatMeta = el("#float-meta");
    const floatPrice = el("#float-price");
    const floatCta = el("#float-cta");

    const grouped = ADD_ONS.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const syncAddOnUI = () => {
      const plan = BASE_PLANS[state.selectedBasePlan];
      const addOnTotal = [...state.selectedAddOns].reduce((sum, id) => {
        const addOn = ADD_ONS.find((a) => a.id === id);
        return sum + (addOn ? addOn.price : 0);
      }, 0);

      const total = plan.price + addOnTotal;
      const count = state.selectedAddOns.size;

      totalPrice.textContent = `$${total}`;
      totalMeta.textContent = `${plan.name} Plan${count ? ` + ${count} add-on${count > 1 ? "s" : ""}` : ""}`;
      totalCta.textContent = `Activate ${plan.name} - $${total}/mo`;

      floatMeta.textContent = `${plan.name} + ${count} add-on${count !== 1 ? "s" : ""}`;
      floatPrice.textContent = `$${total}/mo`;
      floatCta.textContent = "Activate My Plan";

      floatBar.classList.toggle("show", count > 0);

      els(".base-btn").forEach((btn) => {
        btn.classList.toggle("active", Number(btn.dataset.idx) === state.selectedBasePlan);
      });

      els(".addon-card").forEach((card) => {
        card.classList.toggle("active", state.selectedAddOns.has(card.dataset.id));
      });
    };

    basePlans.innerHTML = BASE_PLANS.map((plan, idx) => `
      <button class="base-btn ${idx === state.selectedBasePlan ? "active" : ""}" data-idx="${idx}">
        <strong class="mono">$${plan.price}</strong>
        <span>${plan.name}</span>
      </button>
    `).join("");

    groups.innerHTML = Object.keys(grouped).map((category) => `
      <section class="addon-group">
        <h4>${category}</h4>
        <div class="addon-grid">
          ${grouped[category].map((item) => `
            <button class="addon-card" data-id="${item.id}">
              <div class="meta">
                <b>${item.icon} ${item.name}</b>
                <p>${item.description}</p>
              </div>
              <div class="row" style="gap:10px;align-items:center;">
                <span class="mono muted">+$${item.price}</span>
                <span class="switch"></span>
              </div>
            </button>
          `).join("")}
        </div>
      </section>
    `).join("");

    basePlans.addEventListener("click", (event) => {
      const btn = event.target.closest(".base-btn");
      if (!btn) return;
      state.selectedBasePlan = Number(btn.dataset.idx);
      syncAddOnUI();
    });

    groups.addEventListener("click", (event) => {
      const card = event.target.closest(".addon-card");
      if (!card) return;
      const id = card.dataset.id;
      if (state.selectedAddOns.has(id)) state.selectedAddOns.delete(id);
      else state.selectedAddOns.add(id);
      syncAddOnUI();
    });

    syncAddOnUI();
  }

  function initAOS() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("run");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    els(".aos").forEach((node) => io.observe(node));
  }

  function init() {
    initHeader();
    initAnchorNav();
    initHeroTabs();
    initMarquee();
    initCalculator();
    initNetworkMap();
    initPhoneChecker();
    initAddOns();
    initAOS();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
