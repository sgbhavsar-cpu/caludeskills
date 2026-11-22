/**
 * Standalone Vanilla JS Visual Annotator Overlay (Zero-Dependency)
 * 
 * Drop this script into any web application or run it in the browser DevTools console
 * or save it as a Chrome Bookmarklet to enable instant point-and-click UI inspection
 * and structured visual bug/change annotation for AI coding agents.
 * 
 * Features:
 * - Keyboard shortcut: Alt+A toggles annotation mode on/off. Esc cancels active modal.
 * - Automatic React Fiber component name detection (if running on a React app).
 * - Automatic DOM hierarchy breadcrumbs (e.g. div.bg-white > div.p-5 > h2.text-lg).
 * - Semantic context container title detection (closest card/table/section heading).
 * - Category selection: UI / Style, Bug, Feature, Content.
 * - Numbered coordinate pins placed at exact click location.
 * - One-click "Copy for AI" clipboard export matching standard AI prompt schema.
 * - Persistent storage in localStorage (and optional POST to /api/feedback/annotations).
 */

(function () {
  if (window.__UI_VISUAL_ANNOTATOR_LOADED__) {
    if (window.__UI_VISUAL_ANNOTATOR_TOGGLE__) {
      window.__UI_VISUAL_ANNOTATOR_TOGGLE__();
    }
    return;
  }
  window.__UI_VISUAL_ANNOTATOR_LOADED__ = true;

  const STORAGE_KEY = 'app_visual_annotations';
  const API_ENDPOINT = window.__VISUAL_ANNOTATOR_API__ || null; // e.g. "/api/feedback"

  let isAnnotating = false;
  let showPins = true;
  let hoveredEl = null;
  let annotations = [];
  let selectedCategory = 'UI / Style';

  try {
    annotations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    annotations = [];
  }

  // Inject Styles
  const styleEl = document.createElement('style');
  styleEl.id = 'vanilla-annotator-styles';
  styleEl.textContent = `
    .va-root {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }
    .va-toolbar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(24, 24, 27, 0.94);
      backdrop-filter: blur(12px);
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 12px;
    }
    .va-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #e4e4e7;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .va-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .va-btn.active {
      background: #7C1B9F;
      border-color: #A855F7;
      color: #fff;
      box-shadow: 0 0 12px rgba(124, 27, 159, 0.6);
    }
    .va-hover-box {
      position: fixed;
      border: 2px dashed #A855F7;
      background: rgba(168, 85, 247, 0.14);
      pointer-events: none;
      z-index: 999990;
      box-sizing: border-box;
      display: none;
      border-radius: 4px;
      transition: top 0.05s ease, left 0.05s ease, width 0.05s ease, height 0.05s ease;
    }
    .va-hover-label {
      position: absolute;
      top: -26px;
      left: 0;
      background: #7C1B9F;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      max-width: 380px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .va-pin {
      position: fixed;
      transform: translate(-50%, -50%);
      z-index: 999995;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #7C1B9F;
      border: 2px solid #ffffff;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      transition: transform 0.15s ease;
    }
    .va-pin:hover {
      transform: translate(-50%, -50%) scale(1.15);
      background: #9333ea;
    }
    .va-modal {
      position: fixed;
      z-index: 1000000;
      background: #ffffff;
      color: #18181b;
      border: 1px solid #e4e4e7;
      border-radius: 14px;
      width: 360px;
      padding: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.28);
      display: none;
      font-size: 12px;
    }
    .va-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-weight: 800;
      font-size: 13px;
    }
    .va-category-group {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      margin-bottom: 10px;
    }
    .va-cat-btn {
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      padding: 4px 2px;
      font-size: 10px;
      font-weight: 700;
      color: #52525b;
      cursor: pointer;
      text-align: center;
    }
    .va-cat-btn.active {
      background: #7C1B9F;
      border-color: #7C1B9F;
      color: #fff;
    }
    .va-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d4d4d8;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      font-family: inherit;
      resize: vertical;
      min-height: 65px;
      outline: none;
      margin-bottom: 10px;
    }
    .va-textarea:focus {
      border-color: #7C1B9F;
      box-shadow: 0 0 0 2px rgba(124, 27, 159, 0.15);
    }
    .va-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `;
  document.head.appendChild(styleEl);

  // Build UI Container
  const rootEl = document.createElement('div');
  rootEl.className = 'va-root';
  rootEl.innerHTML = `
    <div id="va-hover-box" class="va-hover-box">
      <div id="va-hover-label" class="va-hover-label"></div>
    </div>

    <div class="va-toolbar">
      <button id="va-toggle-btn" class="va-btn" title="Toggle point-and-click annotation (Alt+A)">
        <span>⌖ Annotate UI (Alt+A)</span>
      </button>
      <button id="va-pins-btn" class="va-btn" title="Toggle pin visibility">
        <span>👁 Pins (<span id="va-count">0</span>)</span>
      </button>
      <button id="va-copy-btn" class="va-btn" title="Copy structured markdown prompt for AI agents">
        <span>📋 Copy for AI</span>
      </button>
      <button id="va-clear-btn" class="va-btn" title="Clear all pins on this page">
        <span>🗑 Clear</span>
      </button>
    </div>

    <div id="va-modal" class="va-modal">
      <div class="va-modal-header">
        <span>New Visual Pin Note</span>
        <button id="va-modal-close" style="background:none;border:none;cursor:pointer;font-size:16px;color:#71717a;">&times;</button>
      </div>
      <div id="va-modal-target" style="font-size:11px;color:#71717a;margin-bottom:8px;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
      <div id="va-modal-context" style="font-size:10.5px;color:#7C1B9F;margin-bottom:8px;font-weight:700;display:none;"></div>
      
      <div class="va-category-group">
        <button type="button" class="va-cat-btn active" data-cat="UI / Style">UI / Style</button>
        <button type="button" class="va-cat-btn" data-cat="Bug">Bug</button>
        <button type="button" class="va-cat-btn" data-cat="Feature">Feature</button>
        <button type="button" class="va-cat-btn" data-cat="Content">Content</button>
      </div>

      <textarea id="va-modal-text" class="va-textarea" placeholder="Describe the requested UI or behavioral change..."></textarea>
      
      <div class="va-actions">
        <button id="va-modal-cancel" class="va-btn" style="color:#52525b;border:1px solid #d4d4d8;background:#fff;">Cancel</button>
        <button id="va-modal-save" class="va-btn" style="background:#7C1B9F;color:#fff;">Save Pin</button>
      </div>
    </div>
  `;
  document.body.appendChild(rootEl);

  const toggleBtn = document.getElementById('va-toggle-btn');
  const pinsBtn = document.getElementById('va-pins-btn');
  const copyBtn = document.getElementById('va-copy-btn');
  const clearBtn = document.getElementById('va-clear-btn');
  const countSpan = document.getElementById('va-count');
  const hoverBox = document.getElementById('va-hover-box');
  const hoverLabel = document.getElementById('va-hover-label');
  const modal = document.getElementById('va-modal');
  const modalClose = document.getElementById('va-modal-close');
  const modalCancel = document.getElementById('va-modal-cancel');
  const modalSave = document.getElementById('va-modal-save');
  const modalTarget = document.getElementById('va-modal-target');
  const modalContext = document.getElementById('va-modal-context');
  const modalText = document.getElementById('va-modal-text');
  const catButtons = document.querySelectorAll('.va-cat-btn');

  let currentPendingNote = null;

  // React Fiber introspection
  function getReactComponentName(domNode) {
    try {
      const fiberKey = Object.keys(domNode).find((k) =>
        k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
      );
      if (!fiberKey) return '';
      let fiber = domNode[fiberKey];
      while (fiber) {
        if (typeof fiber.type === 'function') {
          const name = fiber.type.displayName || fiber.type.name;
          if (name && !name.startsWith('_') && name !== 'Anonymous') {
            return name;
          }
        } else if (typeof fiber.type === 'object' && fiber.type) {
          const name = fiber.type.displayName || fiber.type.name;
          if (name) return name;
        }
        fiber = fiber.return;
      }
    } catch {}
    return '';
  }

  // Element Inspector & DOM Hierarchy extraction
  function inspectElement(el) {
    const reactComp = getReactComponentName(el);

    // Find nearest semantic context title
    let contextTitle = '';
    const container = el.closest('article, section, header, main, table, tr, .card, [data-card], form');
    if (container) {
      const heading = container.querySelector('h1, h2, h3, h4, th, .font-black, .font-extrabold, [data-title]');
      if (heading && heading !== el) {
        contextTitle = (heading.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      }
    }

    // Build DOM hierarchy breadcrumbs (up to 4 levels)
    const hierarchyParts = [];
    let curr = el;
    while (curr && curr !== document.body && hierarchyParts.length < 5) {
      if (curr.id) {
        hierarchyParts.unshift(`#${curr.id}`);
        break;
      }
      const tag = curr.tagName.toLowerCase();
      const testId = curr.getAttribute('data-testid') || curr.getAttribute('data-component');
      if (testId) {
        hierarchyParts.unshift(`[${testId}]`);
        break;
      }
      const meaningfulClasses = Array.from(curr.classList || [])
        .filter((c) => !c.startsWith('va-') && !c.includes(':') && !c.startsWith('hover:') && c.length > 2)
        .slice(0, 1)
        .map((c) => `.${c}`)
        .join('');
      hierarchyParts.unshift(`${tag}${meaningfulClasses}`);
      curr = curr.parentElement;
    }
    const domHierarchy = hierarchyParts.join(' > ');

    // Selector
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = Array.from(el.classList || [])
      .filter((c) => !c.startsWith('va-') && !c.includes(':') && !c.startsWith('hover:'))
      .slice(0, 3)
      .map((c) => `.${c}`)
      .join('');
    const selector = `${tag}${id}${classes}`;
    const textSnippet = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);

    return {
      tag,
      selector: selector || tag,
      componentName: reactComp || el.getAttribute('data-component') || (hierarchyParts[0] || tag),
      domHierarchy,
      contextTitle,
      textSnippet,
    };
  }

  function renderPins() {
    document.querySelectorAll('.va-pin').forEach((p) => p.remove());
    countSpan.textContent = String(annotations.length);
    if (!showPins) return;

    annotations.forEach((ann, idx) => {
      const pin = document.createElement('div');
      pin.className = 'va-pin';
      pin.style.left = `${ann.x}px`;
      pin.style.top = `${ann.y}px`;
      pin.textContent = String(idx + 1);
      pin.title = `#${idx + 1} [${ann.category}]: ${ann.comment}\nTarget: ${ann.target_selector}`;
      pin.onclick = (e) => {
        e.stopPropagation();
        alert(`#${idx + 1} [${ann.category}]: ${ann.comment}\nTarget: ${ann.target_selector}\nContext: ${ann.context_title || 'N/A'}`);
      };
      document.body.appendChild(pin);
    });
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
    renderPins();

    if (API_ENDPOINT) {
      fetch(`${API_ENDPOINT}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annotations),
      }).catch((e) => console.warn('[UI Visual Annotator] Sync error:', e));
    }
  }

  function setAnnotating(state) {
    isAnnotating = state;
    if (isAnnotating) {
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '<span>⌖ Annotating (Click UI)</span>';
      document.body.style.cursor = 'crosshair';
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '<span>⌖ Annotate UI (Alt+A)</span>';
      hoverBox.style.display = 'none';
      document.body.style.cursor = '';
    }
  }

  window.__UI_VISUAL_ANNOTATOR_TOGGLE__ = () => setAnnotating(!isAnnotating);
  toggleBtn.onclick = () => setAnnotating(!isAnnotating);

  pinsBtn.onclick = () => {
    showPins = !showPins;
    pinsBtn.style.opacity = showPins ? '1' : '0.6';
    renderPins();
  };

  // Category Selection in modal
  catButtons.forEach((btn) => {
    btn.onclick = () => {
      catButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.getAttribute('data-cat') || 'UI / Style';
    };
  });

  // Keyboard shortcut: Alt+A
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      setAnnotating(!isAnnotating);
    } else if (e.key === 'Escape') {
      modal.style.display = 'none';
      setAnnotating(false);
    }
  });

  // Hover Inspector
  window.addEventListener('mousemove', (e) => {
    if (!isAnnotating || modal.style.display === 'block') return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target || target.closest('.va-root') || target.closest('.va-pin')) {
      hoverBox.style.display = 'none';
      return;
    }
    const rect = target.getBoundingClientRect();
    hoverBox.style.display = 'block';
    hoverBox.style.top = `${rect.top}px`;
    hoverBox.style.left = `${rect.left}px`;
    hoverBox.style.width = `${rect.width}px`;
    hoverBox.style.height = `${rect.height}px`;

    const info = inspectElement(target);
    hoverLabel.textContent = `${info.componentName ? `<${info.componentName}> ` : ''}${info.selector}`;
  });

  // Click-to-Pin
  window.addEventListener(
    'click',
    (e) => {
      if (!isAnnotating) return;
      const target = e.target;
      if (!target || target.closest('.va-root') || target.closest('.va-pin')) return;

      e.preventDefault();
      e.stopPropagation();

      const info = inspectElement(target);
      currentPendingNote = {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        ...info,
      };

      modalTarget.textContent = `Target: ${info.selector}`;
      if (info.contextTitle) {
        modalContext.textContent = `Context: "${info.contextTitle}"`;
        modalContext.style.display = 'block';
      } else {
        modalContext.style.display = 'none';
      }

      modalText.value = '';
      modal.style.display = 'block';
      modal.style.left = `${Math.min(e.clientX + 10, window.innerWidth - 380)}px`;
      modal.style.top = `${Math.min(e.clientY + 10, window.innerHeight - 260)}px`;
      modalText.focus();
    },
    true
  );

  modalClose.onclick = modalCancel.onclick = () => {
    modal.style.display = 'none';
  };

  modalSave.onclick = () => {
    const val = modalText.value.trim();
    if (!val || !currentPendingNote) return;

    annotations.push({
      id: `ann-${Date.now()}`,
      target_selector: currentPendingNote.selector,
      target_tag: currentPendingNote.tag,
      target_text: currentPendingNote.textSnippet ? `"${currentPendingNote.textSnippet}"` : undefined,
      target_component: currentPendingNote.componentName,
      dom_hierarchy: currentPendingNote.domHierarchy,
      context_title: currentPendingNote.contextTitle,
      category: selectedCategory,
      comment: val,
      page_url: window.location.pathname,
      x: currentPendingNote.x,
      y: currentPendingNote.y,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      created_at: new Date().toISOString(),
    });

    saveToStorage();
    modal.style.display = 'none';
    setAnnotating(false);
  };

  clearBtn.onclick = () => {
    if (confirm('Clear all visual annotations?')) {
      annotations = [];
      saveToStorage();
    }
  };

  // Copy For AI Generator
  copyBtn.onclick = () => {
    if (annotations.length === 0) {
      alert('No annotations recorded yet. Click "Annotate UI (Alt+A)" and click on any element to leave a pin!');
      return;
    }
    let md = '# Requested UI Changes & Visual Annotations\n\n';
    md += 'Please implement the following visual feedback changes into the project code:\n\n';
    annotations.forEach((ann, idx) => {
      const comp = ann.target_component || ann.target_tag || 'Element';
      md += `### Annotation #${idx + 1}: [${ann.category}] ${comp}\n`;
      md += `- **Selector**: \`${ann.target_selector}\`\n`;
      if (ann.dom_hierarchy) {
        md += `- **DOM Hierarchy**: \`${ann.dom_hierarchy}\`\n`;
      }
      if (ann.context_title) {
        md += `- **Context Container**: "${ann.context_title}"\n`;
      }
      if (ann.target_text) {
        md += `- **Target Text**: ${ann.target_text}\n`;
      }
      md += `- **Coordinates**: x=${ann.x}, y=${ann.y} (Screen: ${ann.screen_width}x${ann.screen_height})\n`;
      md += `- **Page**: \`${ann.page_url || '/'}\`\n`;
      md += `- **Requested Change**: ${ann.comment}\n\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      copyBtn.innerHTML = '<span>✅ Copied Prompt!</span>';
      setTimeout(() => {
        copyBtn.innerHTML = '<span>📋 Copy for AI</span>';
      }, 2000);
    });
  };

  renderPins();
  console.log('[UI Visual Annotator] Ready. Press Alt+A to toggle annotation mode.');
})();
