/* ═══════════════════════════════════════════════
   EXPORTER.JS — Export: HTML, PDF, CV
   
   Three export modes:
   1. HTML — Full standalone file download
   2. PDF  — Print dialog (window.print)
   3. CV   — Simplified resume layout
═══════════════════════════════════════════════ */

const Exporter = (() => {

  // ── Utility: trigger file download ──
  function downloadFile(filename, content, mimeType = 'text/html') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── 1. Download as HTML ──
  function downloadHTML() {
    App.toast('Generating HTML file...');
    try {
      const html = Renderer.render();
      const name = State.get('personal.name') || 'portfolio';
      const filename = name.toLowerCase().replace(/\s+/g, '-') + '-portfolio.html';
      downloadFile(filename, html, 'text/html');
      App.toast('HTML downloaded! ✓');
    } catch (e) {
      console.error('HTML export error:', e);
      App.toast('Export failed — see console', 'error');
    }
  }

  // ── 2. Download as PDF (print dialog) ──
  function downloadPDF() {
    App.toast('Opening print dialog...');
    const iframe = document.getElementById('preview-iframe');
    if (!iframe) { App.toast('Preview not ready', 'error'); return; }

    const previousClassName = iframe.className;
    const restoreFrameClass = () => { iframe.className = previousClassName; };

    try {
      // Always print a fresh desktop-width render for sharp, consistent PDF output.
      iframe.className = 'preview-iframe desktop';
      const html = Renderer.render();

      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch (err) {
            console.error('Iframe print error:', err);
          } finally {
            restoreFrameClass();
          }
        }, 120);
      };

      iframe.srcdoc = html;
    } catch (e) {
      // Fallback: open in new window and print
      const html = Renderer.render();
      const win = window.open('', '_blank');
      win.document.write(html);
      win.document.close();
      win.onload = () => { win.focus(); win.print(); restoreFrameClass(); };
    }
  }

  // ── 3. Generate CV / Resume ──
  function generateCV() {
    App.toast('Building your CV...');
    const d = State.data();
    const { personal, skills, projects, education, contact } = d;
    const accent = d.theme.accent || '#5b4cf5';
    const esc = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { margin: 14mm 14mm 16mm; size: A4; }
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        font-size: 10.5pt;
        color: #1a1a2e;
        line-height: 1.5;
        background: #f8fafc;
        padding: 28px;
      }
      .cv-page {
        width: 100%;
        max-width: 820px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 34px 38px;
      }
      /* Header */
      .cv-header { border-bottom: 2.5pt solid ${accent}; padding-bottom: 12pt; margin-bottom: 16pt; }
      .cv-name { font-size: 22pt; font-weight: 700; letter-spacing: -.02em; color: #0a0a1a; margin-bottom: 3pt; }
      .cv-role { font-size: 11pt; color: ${accent}; font-weight: 500; margin-bottom: 6pt; }
      .cv-contact-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4pt 10pt; font-size: 9pt; color: #555; }
      .cv-sep { color: #c7cbd1; }
      .cv-contact-row a { color: ${accent}; text-decoration: none; }
      /* Sections */
      .cv-section { margin-bottom: 16pt; }
      .cv-section-title {
        font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        color: ${accent}; border-bottom: 1pt solid ${accent}33; padding-bottom: 4pt; margin-bottom: 10pt;
      }
      /* Summary */
      .cv-summary { font-size: 9.5pt; color: #444; line-height: 1.65; }
      /* Skills */
      .cv-skills { display: flex; flex-wrap: wrap; gap: 5pt; }
      .cv-skill { padding: 2pt 8pt; background: ${accent}15; border: .5pt solid ${accent}33; border-radius: 3pt; font-size: 8.5pt; }
      /* Projects */
      .cv-item { margin-bottom: 10pt; }
      .cv-item-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 2pt 12pt; margin-bottom: 2pt; }
      .cv-item-title { font-size: 10.5pt; font-weight: 600; }
      .cv-item-meta { font-size: 8.5pt; color: #888; word-break: break-word; }
      .cv-item-desc { font-size: 9pt; color: #444; line-height: 1.55; margin-bottom: 3pt; }
      .cv-tech { font-size: 8pt; color: ${accent}; font-style: italic; }
      /* Education */
      .cv-edu { margin-bottom: 10pt; }
      .cv-edu-name { font-weight: 600; font-size: 10.5pt; }
      .cv-edu-deg { font-size: 9.5pt; color: #555; }
      .cv-edu-dates { font-size: 8.5pt; color: #888; }
      /* Footer */
      .cv-footer { margin-top: 20pt; padding-top: 10pt; border-top: .5pt solid #ddd; text-align: center; font-size: 7.5pt; color: #bbb; }
      @media (max-width: 760px) {
        body { padding: 12px; background: #ffffff; }
        .cv-page {
          border: none;
          border-radius: 0;
          padding: 18px 14px;
          max-width: 100%;
        }
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: #ffffff;
          padding: 0;
        }
        .cv-page {
          max-width: 100%;
          margin: 0;
          border: none;
          border-radius: 0;
          padding: 0;
        }
      }
    `;

    const projectsHTML = projects.slice(0, 5).map(p => `
      <div class="cv-item">
        <div class="cv-item-header">
          <div class="cv-item-title">${esc(p.title)}</div>
          ${p.link ? `<span class="cv-item-meta">${esc(p.link)}</span>` : ''}
        </div>
        ${p.description ? `<div class="cv-item-desc">${esc(p.description)}</div>` : ''}
        ${p.tech ? `<div class="cv-tech">Stack: ${esc(p.tech)}</div>` : ''}
      </div>`).join('');

    const eduHTML = education.map(e => `
      <div class="cv-edu">
        <div class="cv-edu-name">${esc(e.institution)}</div>
        <div class="cv-edu-deg">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ''}</div>
        <div class="cv-edu-dates">${esc(e.from || '')}${e.to ? ` – ${e.current ? 'Present' : esc(e.to)}` : ''}</div>
      </div>`).join('');

    const contactItems = [
      contact.email && `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`,
      contact.phone && `<span>${esc(contact.phone)}</span>`,
      contact.location && `<span>${esc(contact.location)}</span>`,
      contact.github && `<a href="${esc(contact.github)}" target="_blank">GitHub</a>`,
      contact.linkedin && `<a href="${esc(contact.linkedin)}" target="_blank">LinkedIn</a>`,
      contact.website && `<a href="${esc(contact.website)}" target="_blank">Portfolio</a>`,
    ].filter(Boolean).join('<span class="cv-sep">|</span>');

    const body = `
    <main class="cv-page">
      <div class="cv-header">
        <div class="cv-name">${esc(personal.name) || 'Your Name'}</div>
        <div class="cv-role">${esc(personal.title) || 'Your Professional Title'}</div>
        <div class="cv-contact-row">${contactItems}</div>
      </div>

      ${personal.bio ? `<div class="cv-section">
        <div class="cv-section-title">Professional Summary</div>
        <p class="cv-summary">${esc(personal.bio)}</p>
      </div>` : ''}

      ${skills.length ? `<div class="cv-section">
        <div class="cv-section-title">Technical Skills</div>
        <div class="cv-skills">${skills.map(s => `<span class="cv-skill">${esc(s)}</span>`).join('')}</div>
      </div>` : ''}

      ${projects.length ? `<div class="cv-section">
        <div class="cv-section-title">Projects</div>
        ${projectsHTML}
      </div>` : ''}

      ${education.length ? `<div class="cv-section">
        <div class="cv-section-title">Education</div>
        ${eduHTML}
      </div>` : ''}

      <div class="cv-footer">Generated by PortfolioForge · ${new Date().getFullYear()}</div>
    </main>`;

    const html = Renderer.buildDocument(body, css, `${personal.name || 'My'} — CV`);
    const name = (personal.name || 'cv').toLowerCase().replace(/\s+/g, '-');
    downloadFile(`${name}-resume.html`, html, 'text/html');
    App.toast('CV downloaded! Open in browser and Ctrl+P to save as PDF ✓');
  }

  return { downloadHTML, downloadPDF, generateCV };
})();