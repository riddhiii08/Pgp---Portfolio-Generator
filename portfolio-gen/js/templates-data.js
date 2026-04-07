/* ═══════════════════════════════════════════════
   TEMPLATES-DATA.JS — Template Registry
   
   Defines all available templates with metadata.
   The actual HTML generation is in renderer.js.
═══════════════════════════════════════════════ */

const TEMPLATES = [
  // ── PROFESSIONAL ──────────────────────────────
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'professional',
    description: 'A clean, typography-driven layout with generous whitespace.',
    tags: ['Minimal', 'Clean', 'ATS-friendly'],
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    textColor: '#2d3748'
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'professional',
    description: 'Bold header with structured content blocks for senior roles.',
    tags: ['Bold', 'Structured', 'Corporate'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    textColor: 'white'
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    category: 'professional',
    description: 'Two-column layout with dark sidebar and clean content area.',
    tags: ['Two-column', 'Sidebar', 'Modern'],
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    textColor: 'white'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'professional',
    description: 'Chronological timeline layout perfect for experience-heavy profiles.',
    tags: ['Timeline', 'Experience', 'Linear'],
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    textColor: '#5a3825'
  },

  // ── CREATIVE ──────────────────────────────────
  {
    id: 'glassmorphic',
    name: 'Glassmorphic',
    category: 'creative',
    description: 'Frosted glass cards on a vivid gradient background.',
    tags: ['Glass', 'Gradient', 'Vivid'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: 'white'
  },
  {
    id: 'editorial',
    name: 'Editorial',
    category: 'creative',
    description: 'Magazine-style asymmetric layout for designers and artists.',
    tags: ['Magazine', 'Asymmetric', 'Artistic'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: 'white'
  },
  {
    id: 'neon-dark',
    name: 'Neon Dark',
    category: 'creative',
    description: 'Dark mode with electric neon accents — bold and unmissable.',
    tags: ['Dark', 'Neon', 'Electric'],
    gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
    textColor: '#00ffcc'
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    category: 'creative',
    description: 'Raw, unapologetic brutalist design that demands attention.',
    tags: ['Brutalist', 'Bold', 'Unique'],
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ff6b00 100%)',
    textColor: '#000'
  },

  // ── TECH ──────────────────────────────────────
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'tech',
    description: 'Terminal/code aesthetic with monospace fonts and CLI styling.',
    tags: ['Terminal', 'Code', 'CLI'],
    gradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    textColor: '#7ee787'
  },
  {
    id: 'matrix-grid',
    name: 'Matrix Grid',
    category: 'tech',
    description: 'Structured grid layout with data-driven visual hierarchy.',
    tags: ['Grid', 'Data', 'Structured'],
    gradient: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)',
    textColor: '#64ffda'
  },
  {
    id: 'devcard',
    name: 'DevCard',
    category: 'tech',
    description: 'GitHub-inspired card layout tailored for developers.',
    tags: ['GitHub', 'Cards', 'Developer'],
    gradient: 'linear-gradient(135deg, #24292f 0%, #1f2328 100%)',
    textColor: '#f0f6fc'
  },
  {
    id: 'startup',
    name: 'Startup',
    category: 'tech',
    description: 'Modern SaaS-inspired layout with metric callouts.',
    tags: ['SaaS', 'Modern', 'Metrics'],
    gradient: 'linear-gradient(135deg, #1DB954 0%, #1a8f3f 100%)',
    textColor: 'white'
  }
];