/* ═══════════════════════════════════════════════
   TEMPLATES-DATA.JS — Template Registry
   
   Defines all available templates with metadata.
   The actual HTML generation is in renderer.js.
═══════════════════════════════════════════════ */

const TEMPLATES = [
  // ── PROFESSIONAL ──────────────────────────────
  {
    id: 'minimal-clean',
    name: 'Minimal',
    category: 'professional',
    description: 'Editorial white-space system with strong hierarchy and polished sections.',
    tags: ['Professional', 'Minimal', 'Typography'],
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
    name: 'Dark Dev',
    category: 'professional',
    description: 'Modern dark tech aesthetic with neon accents and elevated cards.',
    tags: ['Dark', 'Developer', 'Tech UI'],
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    textColor: 'white'
  },

  // ── CREATIVE ──────────────────────────────────
  {
    id: 'glassmorphic',
    name: 'Creative Portfolio',
    category: 'creative',
    description: 'Expressive gradients, asymmetric rhythm, and strong visual personality.',
    tags: ['Creative', 'Asymmetric', 'Gradient'],
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

  // ── TECH ──────────────────────────────────────
  {
    id: 'matrix-grid',
    name: 'Matrix Grid',
    category: 'tech',
    description: 'Structured grid layout with data-driven visual hierarchy.',
    tags: ['Grid', 'Data', 'Structured'],
    gradient: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)',
    textColor: '#64ffda'
  }
];