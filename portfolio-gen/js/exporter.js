

const Exporter = (() => {
  function withTimeout(promise, timeoutMs = 8000) {
    return Promise.race([
      promise,
      new Promise((resolve) => setTimeout(resolve, timeoutMs))
    ]);
  }
  function addPdfExportStyles(html) {
    const exportStyle = `
<style id="pdf-export-overrides">
  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }

  @media print {
    @page { size: A4; margin: 10mm; }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    * {
      animation: none !important;
      transition: none !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }

    img, svg {
      max-width: 100% !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .portfolio-shell {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
    }
  }
</style>`;

    if (html.includes('</head>')) {
      return html.replace('</head>', `${exportStyle}\n</head>`);
    }

    return `${exportStyle}\n${html}`;
  }
  async function waitForPrintableContent(iframe) {
    const doc = iframe.contentDocument;
    if (!doc) return;

    const fontsReady = doc.fonts && doc.fonts.ready
      ? withTimeout(doc.fonts.ready, 8000)
      : Promise.resolve();

    const pendingImages = Array.from(doc.images || []).filter((img) => !img.complete);
    const imagesReady = withTimeout(
      Promise.all(
        pendingImages.map((img) => new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }))
      ),
      8000
    );

    await Promise.allSettled([fontsReady, imagesReady]);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }
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
  function downloadHTML() {
    App.toast('Generating HTML file...');
    try {
      const html = Renderer.render();
      const name = State.get('personal.name') || 'portfolio';
      const filename = name.toLowerCase().replace(/\s+/g, '-') + '-portfolio.html';
      downloadFile(filename, html, 'text/html');
      App.toast('HTML downloaded! OK');
    } catch (e) {
      console.error('HTML export error:', e);
      App.toast('Export failed - see console', 'error');
    }
  }
  function downloadPDF() {
    App.toast('Building PDF document...');

    const d = State.data();
    const { personal, skills, projects, education, contact } = d;
    const accent = (d.theme && d.theme.accent) ? d.theme.accent : '#2563eb';

    const esc = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const norm = val => {
      const r = String(val || '').trim();
      return r && !/^https?:\/\//i.test(r) ? `https://${r}` : r;
    };
    const getHandle = (url) => {
      if (!url) return '';
      return String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    };

    /* ── Contact items ── */
    const cParts = [
      contact.email    && `<a href="mailto:${contact.email}">${esc(contact.email)}</a>`,
      contact.phone    && `<span>${esc(contact.phone)}</span>`,
      contact.location && `<span>&#128205; ${esc(contact.location)}</span>`,
      contact.github   && `<span>GitHub: <a href="${norm(contact.github)}" target="_blank">${esc(getHandle(contact.github))}</a></span>`,
      contact.linkedin && `<span>LinkedIn: <a href="${norm(contact.linkedin)}" target="_blank">${esc(getHandle(contact.linkedin))}</a></span>`,
      contact.website  && `<span>Portfolio: <a href="${norm(contact.website)}" target="_blank">${esc(getHandle(contact.website))}</a></span>`,
      contact.twitter  && `<span>X: <a href="${norm(contact.twitter)}" target="_blank">${esc(getHandle(contact.twitter))}</a></span>`,
    ].filter(Boolean);

    /* ── Skills ── */
    const skillsHTML = (Array.isArray(skills) && skills.length)
      ? `<div class="sec">
           <div class="sec-title">Skills</div>
           <div class="skills-row">${skills.map(s => `<span class="stag">${esc(s)}</span>`).join('')}</div>
         </div>` : '';

    /* ── Projects ── */
    const projectsHTML = (Array.isArray(projects) && projects.length)
      ? `<div class="sec">
           <div class="sec-title">Projects</div>
           ${projects.map(p => {
             const href = norm(p.link);
             const tags = String(p.tech || '').split(',').map(t => t.trim()).filter(Boolean)
               .map(t => `<span class="ttag">${esc(t)}</span>`).join('');
             return `<div class="pcard">
               <div class="prow">
                 <strong class="ptitle">${esc(p.title) || 'Untitled'}</strong>
                 ${href ? `<a class="plink" href="${href}" target="_blank">${esc(getHandle(p.link))}</a>` : ''}
               </div>
               ${p.description ? `<p class="pdesc">${esc(p.description)}</p>` : ''}
               ${tags ? `<div class="tags-row">${tags}</div>` : ''}
             </div>`;
           }).join('')}
         </div>` : '';

    /* ── Education ── */
    const educationHTML = (Array.isArray(education) && education.length)
      ? `<div class="sec">
           <div class="sec-title">Education</div>
           ${education.map(e => `
             <div class="eitem">
               <div class="erow">
                 <div>
                   <strong>${esc(e.institution) || '—'}</strong>
                   <span class="edeg">${esc(e.degree) || ''}${e.field ? `, ${esc(e.field)}` : ''}</span>
                 </div>
                 <span class="edates">${esc(e.from || '')}${e.to ? ` – ${e.current ? 'Present' : esc(e.to)}` : ''}</span>
               </div>
             </div>`).join('')}
         </div>` : '';

    /* ── CSS — flat, no wrapper clipping ── */
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      @page { size: A4 portrait; margin: 0; }

      html, body {
        /* Removed fixed width here so the browser manages print pagination naturally */
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.6;
        color: #1a1a2e;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* ── Colored header band ── */
      .hdr {
        background: ${accent};
        color: #fff;
        padding: 28px 32px 22px;
        width: 100%;
        page-break-inside: avoid;
      }
      .hdr-name  { font-size: 22pt; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 3pt; }
      .hdr-role  { font-size: 11pt; font-weight: 500; opacity: 0.9; margin-bottom: 12pt; }
      .cbar      { display: flex; flex-wrap: wrap; align-items: center; gap: 4pt 12pt; font-size: 8pt; }
      .cbar a, .cbar span { color: rgba(255,255,255,0.9); text-decoration: none; }
      .cbar a    { text-decoration: underline; text-underline-offset: 2px; }
      .cdot      { opacity: 0.4; }

      /* ── Body ── */
      .body { padding: 20px 32px 28px; }

      /* ── Bio ── */
      .bio {
        font-size: 9.5pt; color: #444; line-height: 1.7;
        padding-bottom: 14pt; margin-bottom: 14pt;
        border-bottom: 1px solid #e0e4ea;
      }

      /* ── Sections ── */
      .sec { margin-bottom: 14pt; padding-bottom: 12pt; border-bottom: 1px solid #e0e4ea; }
      .sec:last-child { border-bottom: none; margin-bottom: 0; }
      .sec-title {
        font-size: 7pt; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.14em; color: ${accent};
        margin-bottom: 8pt; padding-bottom: 4pt;
        border-bottom: 1.5px solid ${accent}44;
      }

      /* ── Skills ── */
      .skills-row { display: flex; flex-wrap: wrap; gap: 4pt 5pt; }
      .stag {
        padding: 2pt 8pt; font-size: 8pt; font-weight: 500; color: #1e2a45;
        background: ${accent}16; border: 0.5px solid ${accent}40; border-radius: 3pt;
      }

      /* ── Projects ── */
      .pcard {
        padding: 8pt 10pt; margin-bottom: 8pt;
        background: #f8fafd; border-left: 2.5pt solid ${accent};
        page-break-inside: avoid; break-inside: avoid;
      }
      .pcard:last-child { margin-bottom: 0; }
      .prow  { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4pt 10pt; margin-bottom: 3pt; }
      .ptitle { font-size: 10pt; font-weight: 600; color: #1a1a2e; }
      .plink  { font-size: 7.5pt; color: ${accent}; word-break: break-all; text-decoration: none; }
      .pdesc  { font-size: 8.5pt; color: #4a5568; line-height: 1.5; margin-bottom: 4pt; }
      .tags-row { display: flex; flex-wrap: wrap; gap: 2pt 4pt; }
      .ttag { font-size: 7pt; font-weight: 600; color: ${accent}; background: ${accent}15; padding: 1pt 5pt; border-radius: 2pt; }

      /* ── Education ── */
      .eitem { margin-bottom: 8pt; page-break-inside: avoid; break-inside: avoid; }
      .eitem:last-child { margin-bottom: 0; }
      .erow  { display: flex; justify-content: space-between; align-items: flex-start; gap: 8pt; flex-wrap: wrap; }
      .erow strong { font-size: 10pt; font-weight: 600; display: block; }
      .edeg  { font-size: 8.5pt; color: #555; display: block; margin-top: 1pt; }
      .edates { font-size: 8pt; color: #888; font-weight: 600; white-space: nowrap; }

      /* ── Footer ── */
      .foot { text-align: center; font-size: 7pt; color: #b0b8c8; margin-top: 16pt; padding-top: 8pt; border-top: 0.5px solid #dde3ed; page-break-inside: avoid; break-inside: avoid; }

      @media print {
        @page { size: portrait; margin: 10mm; }
        html, body { width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; display: block !important; overflow: visible !important; position: static !important; }
        .sheet { width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; display: block !important; overflow: visible !important; position: static !important; border: none !important; box-shadow: none !important; background: #fff !important; }
        .hdr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { animation: none !important; transition: none !important; }
      }

      /* Screen preview chrome */
      @media screen {
        body { background: #e8edf4; padding: 20px 0; }
        .sheet { background: #fff; width: 210mm; max-width: 95%; margin: 0 auto; box-shadow: 0 4px 32px rgba(0,0,0,.14); min-height: 297mm; }
      }
    `;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(personal.name || 'Portfolio')} — PDF</title>
<style>${css}</style>
</head>
<body>
<div class="sheet">

  <div class="hdr" style="${personal.avatar ? 'display:flex; gap:24px; align-items:center;' : ''}">
    ${personal.avatar ? `<img src="${esc(personal.avatar)}" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2.5px solid #fff;" />` : ''}
    <div>
      <div class="hdr-name">${esc(personal.name) || 'Your Name'}</div>
      <div class="hdr-role">${esc(personal.title) || 'Professional Title'}</div>
      <div class="cbar">${cParts.length
        ? cParts.join('<span class="cdot">&nbsp;·&nbsp;</span>')
        : '<span>No contact info provided</span>'
      }</div>
    </div>
  </div>

  <div class="body">
    ${personal.bio ? `<p class="bio">${esc(personal.bio)}</p>` : ''}
    ${skillsHTML}
    ${projectsHTML}
    ${educationHTML}
    <p class="foot">Generated by PortEdge &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-GB',{year:'numeric',month:'long',day:'numeric'})}</p>
  </div>

</div>
<script>
  window.onload = function(){ setTimeout(function(){ window.print(); }, 700); };
<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) {
      App.toast('Pop-ups blocked — allow pop-ups and retry.', 'error');
      return;
    }
    win.document.write(html);
    win.document.close();
    App.toast('PDF ready — choose "Save as PDF" in print dialog ✓');
  }

  function generateCV() {
    App.toast('Building full one-page CV...');
    const d = State.data();
    const { personal, skills, projects, education, contact } = d;

    const esc = str => String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const norm = val => {
      const r = String(val || '').trim();
      return r && !/^https?:\/\//i.test(r) ? `https://${r}` : r;
    };
    const getHandle = (url) => {
      if (!url) return '';
      return String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    };

    const css = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { margin: 8mm; size: A4; }
      body {
        font-family: 'Times New Roman', serif;
        font-size: 9.5pt; color: #000; line-height: 1.25;
        background: #fff; padding: 0;
      }
      .cv-container { 
        display: flex; width: 100%; max-width: 800px; margin: 0 auto; 
        min-height: 280mm; background: #fff; border: 1px solid #eee;
      }
      
      .cv-sidebar { 
        width: 32%; background: #fdfdfd; border-right: 1px solid #ddd; 
        padding: 20pt 15pt; display: flex; flex-direction: column; gap: 15pt;
      }
      .cv-avatar-wrap { text-align: center; }
      .cv-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 1px solid #000; }
      
      .sidebar-sec-title { 
        font-size: 10pt; font-weight: bold; text-transform: uppercase; 
        border-bottom: 1.5px solid #000; margin-bottom: 6pt; padding-bottom: 2pt;
      }
      .sidebar-item { font-size: 8.5pt; margin-bottom: 4pt; word-break: break-all; }
      .sidebar-item a { color: #000; text-decoration: none; }
      .sidebar-item strong { display: block; font-size: 7.5pt; text-transform: uppercase; color: #444; }

      .cv-main { width: 68%; padding: 20pt 25pt; display: flex; flex-direction: column; gap: 15pt; }
      .cv-header-block { margin-bottom: 5pt; }
      .cv-name { font-size: 22pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2pt; }
      .cv-role { font-size: 11pt; font-style: italic; color: #333; margin-bottom: 10pt; }
      
      .sec-title { 
        font-size: 11pt; font-weight: bold; text-transform: uppercase; 
        border-bottom: 1.5px solid #000; margin-bottom: 8pt; padding-bottom: 2pt;
      }
      .cv-summary { text-align: justify; margin-bottom: 2pt; }
      
      .cv-item { margin-bottom: 10pt; }
      .cv-item-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1pt; }
      .cv-item-title { font-weight: bold; font-size: 10.5pt; }
      .cv-item-meta { font-style: italic; font-size: 8.5pt; }
      .cv-item-desc { text-align: justify; margin-bottom: 2pt; }
      .cv-tech { font-style: italic; font-size: 8.5pt; color: #444; }
      
      @media print {
        body, .cv-container { margin: 0 !important; width: 100% !important; border: none !important; }
        .cv-sidebar { background: #fdfdfd !important; -webkit-print-color-adjust: exact; }
      }
    `;

    const body = `
      <div class="cv-container">
        <div class="cv-sidebar">
          <div class="cv-avatar-wrap">
            ${personal.avatar ? `<img src="${esc(personal.avatar)}" class="cv-avatar" />` : ''}
          </div>

          <div class="sidebar-section">
            <div class="sidebar-sec-title">Contact</div>
            <div class="sidebar-item"><strong>Email</strong><a href="mailto:${contact.email}">${esc(contact.email)}</a></div>
            ${contact.phone ? `<div class="sidebar-item"><strong>Phone</strong>${esc(contact.phone)}</div>` : ''}
            ${contact.location ? `<div class="sidebar-item"><strong>Location</strong>${esc(contact.location)}</div>` : ''}
            ${contact.github ? `<div class="sidebar-item"><strong>GitHub</strong>${esc(getHandle(contact.github))}</div>` : ''}
            ${contact.linkedin ? `<div class="sidebar-item"><strong>LinkedIn</strong>${esc(getHandle(contact.linkedin))}</div>` : ''}
          </div>

          ${skills.length ? `
          <div class="sidebar-section">
            <div class="sidebar-sec-title">Skills</div>
            <div class="sidebar-item" style="line-height:1.4;">${skills.join(', ')}</div>
          </div>` : ''}

          ${education.length ? `
          <div class="sidebar-section">
            <div class="sidebar-sec-title">Education</div>
            ${education.map(e => `
              <div class="sidebar-item" style="margin-bottom:8pt;">
                <strong>${esc(e.from)} - ${e.current ? 'Present' : esc(e.to)}</strong>
                <div style="font-weight:bold;">${esc(e.institution)}</div>
                <div>${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}
        </div>

        <div class="cv-main">
          <div class="cv-header-block">
            <div class="cv-name">${esc(personal.name) || 'Name'}</div>
            <div class="cv-role">${esc(personal.title) || 'Title'}</div>
          </div>
          
          <div class="cv-section">
            <div class="sec-title">Professional Summary</div>
            <div class="cv-summary">${esc(personal.bio) || 'Professional summary...'}</div>
          </div>

          ${projects.length ? `
          <div class="cv-section">
            <div class="sec-title">Key Projects</div>
            ${projects.map(p => `
            <div class="cv-item">
              <div class="cv-item-head">
                <span class="cv-item-title">${esc(p.title)}</span>
                <span class="cv-item-meta">${esc(getHandle(p.link))}</span>
              </div>
              <div class="cv-item-desc">${esc(p.description)}</div>
              <div class="cv-tech"><strong>Stack:</strong> ${esc(p.tech)}</div>
            </div>`).join('')}
          </div>` : ''}
        </div>
      </div>`;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Full CV</title><style>${css}</style></head>
    <body onload="setTimeout(function(){window.print()}, 800)">${body}</body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
  }


  return { downloadHTML, downloadPDF, generateCV };
})();
