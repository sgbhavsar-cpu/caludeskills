"use client";

import React, { useEffect, useState } from 'react';

export interface VisualAnnotation {
  id: string;
  target_selector: string;
  target_tag: string;
  target_text?: string;
  target_component?: string;
  dom_hierarchy?: string;
  context_title?: string;
  category: 'UI / Style' | 'Bug' | 'Feature' | 'Content';
  comment: string;
  page_url: string;
  x: number;
  y: number;
  screen_width: number;
  screen_height: number;
  created_at: string;
}

export interface VisualAnnotatorProps {
  /** Optional backend API URL (e.g. "/api/feedback" or "http://localhost:8000/api/feedback"). If omitted, uses LocalStorage. */
  apiEndpoint?: string;
  /** Storage key for LocalStorage caching (defaults to "app_visual_annotations") */
  storageKey?: string;
  /** Floating trigger button position (defaults to "bottom-right") */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

interface HoveredElementInfo {
  rect: DOMRect;
  selector: string;
  tagName: string;
  componentName: string;
  domHierarchy: string;
  contextTitle: string;
  textSnippet: string;
  element: HTMLElement;
}

// Built-in lightweight SVG Icons (zero external package dependencies)
const Icons = {
  Crosshair: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  ),
  Layers: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
};

export const VisualAnnotator: React.FC<VisualAnnotatorProps> = ({
  apiEndpoint = '/api/feedback',
  storageKey = 'app_visual_annotations',
  position = 'bottom-right',
}) => {
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState<VisualAnnotation[]>([]);
  const [showPins, setShowPins] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<HoveredElementInfo | null>(null);

  // Active modal for adding a new note
  const [activeNewNote, setActiveNewNote] = useState<{
    x: number;
    y: number;
    selector: string;
    tagName: string;
    componentName: string;
    domHierarchy: string;
    contextTitle: string;
    textSnippet: string;
  } | null>(null);

  const [noteComment, setNoteComment] = useState('');
  const [noteCategory, setNoteCategory] = useState<'UI / Style' | 'Bug' | 'Feature' | 'Content'>('UI / Style');
  const [selectedPin, setSelectedPin] = useState<VisualAnnotation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load existing annotations on mount
  useEffect(() => {
    const loadSaved = async () => {
      if (apiEndpoint) {
        try {
          const res = await fetch(`${apiEndpoint}/annotations`);
          if (res.ok) {
            const remote: VisualAnnotation[] = await res.json();
            if (remote && Array.isArray(remote) && remote.length > 0) {
              setAnnotations(remote);
              return;
            }
          }
        } catch {
          // Fallback to localStorage
        }
      }
      const local = localStorage.getItem(storageKey);
      if (local) {
        try {
          setAnnotations(JSON.parse(local));
        } catch {}
      }
    };
    loadSaved();
  }, [apiEndpoint, storageKey]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(annotations));
  }, [annotations, storageKey]);

  // Global Keyboard Shortcut: Alt+A toggles annotation mode, Esc closes popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAnnotating((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (activeNewNote) {
          setActiveNewNote(null);
        } else if (selectedPin) {
          setSelectedPin(null);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (isAnnotating) {
          setIsAnnotating(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNewNote, selectedPin, isDrawerOpen, isAnnotating]);

  // Helper to extract React component name from Fiber
  const getReactComponentName = (domNode: HTMLElement): string => {
    try {
      const fiberKey = Object.keys(domNode).find((k) =>
        k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
      );
      if (!fiberKey) return '';
      let fiber = (domNode as any)[fiberKey];
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
  };

  // Extract clean component / selector name
  const extractComponentInfo = (el: HTMLElement) => {
    // 1. Try React Fiber component name
    const reactComp = getReactComponentName(el);

    // 2. Find nearest semantic container / context title
    let contextTitle = '';
    const container = el.closest('.card-lte, .salesforce-record-card, [data-card], tr, article, section, header, main');
    if (container) {
      const heading = container.querySelector('h1, h2, h3, h4, th, .font-black, .font-extrabold, button.font-extrabold');
      if (heading && heading !== el) {
        contextTitle = (heading.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      }
    }

    // 3. Build DOM hierarchy breadcrumbs (up to 4 levels)
    const hierarchyParts: string[] = [];
    let currNode: HTMLElement | null = el;
    while (currNode && currNode !== document.body && hierarchyParts.length < 5) {
      if (currNode.id) {
        hierarchyParts.unshift(`#${currNode.id}`);
        break;
      }
      const tag = currNode.tagName.toLowerCase();
      const testId = currNode.getAttribute('data-testid') || currNode.getAttribute('data-component');
      if (testId) {
        hierarchyParts.unshift(`[${testId}]`);
        break;
      }
      const meaningfulClass = Array.from(currNode.classList)
        .filter((c) => !c.startsWith('annotator-') && !c.includes(':') && !c.startsWith('hover:') && c.length > 2)
        .slice(0, 1)
        .map((c) => `.${c}`)
        .join('');
      hierarchyParts.unshift(`${tag}${meaningfulClass}`);
      currNode = currNode.parentElement;
    }
    const domHierarchy = hierarchyParts.join(' > ');

    // 4. Selector
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classList = Array.from(el.classList)
      .filter((c) => !c.startsWith('annotator-'))
      .slice(0, 3)
      .map((c) => `.${c}`)
      .join('');

    const selector = `${tag}${id}${classList}`;
    const textSnippet = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);

    return {
      tagName: tag,
      componentName: reactComp || el.getAttribute('data-component') || (hierarchyParts[0] || tag),
      selector: selector || tag,
      domHierarchy,
      contextTitle,
      textSnippet: textSnippet ? `"${textSnippet}"` : '',
    };
  };

  // Hover and Click Listeners during Annotation Mode
  useEffect(() => {
    if (!isAnnotating) {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (activeNewNote) return;

      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target.closest('.annotator-ui-layer')) {
        setHoveredElement(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const info = extractComponentInfo(target);

      setHoveredElement({
        rect,
        selector: info.selector,
        tagName: info.tagName,
        componentName: info.componentName,
        domHierarchy: info.domHierarchy,
        contextTitle: info.contextTitle,
        textSnippet: info.textSnippet,
        element: target,
      });
    };

    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('.annotator-ui-layer')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const info = extractComponentInfo(target);

      setActiveNewNote({
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        selector: info.selector,
        tagName: info.tagName,
        componentName: info.componentName,
        domHierarchy: info.domHierarchy,
        contextTitle: info.contextTitle,
        textSnippet: info.textSnippet,
      });
      setNoteComment('');
      setHoveredElement(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickCapture, true);
    };
  }, [isAnnotating, activeNewNote]);

  const handleSaveNote = async () => {
    if (!activeNewNote || !noteComment.trim()) return;

    const newAnnotation: VisualAnnotation = {
      id: `ann-${Date.now()}`,
      target_selector: activeNewNote.selector,
      target_tag: activeNewNote.tagName,
      target_text: activeNewNote.textSnippet,
      target_component: activeNewNote.componentName,
      dom_hierarchy: activeNewNote.domHierarchy,
      context_title: activeNewNote.contextTitle,
      category: noteCategory,
      comment: noteComment.trim(),
      page_url: window.location.pathname,
      x: activeNewNote.x,
      y: activeNewNote.y,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      created_at: new Date().toISOString(),
    };

    const updated = [...annotations, newAnnotation];
    setAnnotations(updated);
    setActiveNewNote(null);
    setNoteComment('');

    if (apiEndpoint) {
      fetch(`${apiEndpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
    }
  };

  const handleDeleteAnnotation = async (id: string) => {
    const updated = annotations.filter((a) => a.id !== id);
    setAnnotations(updated);
    if (selectedPin?.id === id) {
      setSelectedPin(null);
    }
    if (apiEndpoint) {
      fetch(`${apiEndpoint}/annotations/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all visual annotations?')) return;
    setAnnotations([]);
    setSelectedPin(null);
    if (apiEndpoint) {
      fetch(`${apiEndpoint}/annotations`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleSyncToBackend = async () => {
    if (!apiEndpoint) return;
    setIsSaving(true);
    try {
      await fetch(`${apiEndpoint}/annotations?append_to_user_input=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annotations),
      });
      alert('Annotations successfully persisted and appended to project docs!');
    } catch (e) {
      alert(`Backend sync failed: ${e}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate standardized Markdown prompt for AI Agent
  const formatMarkdownForAI = () => {
    if (annotations.length === 0) return 'No visual annotations recorded.';
    let md = '# Requested UI Changes & Visual Annotations\n\n';
    md += 'Please implement the following visual feedback changes into the project code:\n\n';

    annotations.forEach((ann, idx) => {
      const comp = ann.target_component || ann.target_tag;
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

    return md;
  };

  const handleCopyForAI = () => {
    const text = formatMarkdownForAI();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2200);
  };

  // Compute position coordinates for floating button
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'bottom-right':
      default:
        return { bottom: '20px', right: '20px' };
    }
  };

  return (
    <div className="annotator-ui-layer" style={{ pointerEvents: 'none' }}>
      {/* 1. Floating Action Toolbar */}
      <div
        style={{
          position: 'fixed',
          ...getPositionStyles(),
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(23, 23, 28, 0.94)',
          backdropFilter: 'blur(12px)',
          padding: '6px 12px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          pointerEvents: 'auto',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '12px',
          userSelect: 'none',
        }}
      >
        <button
          onClick={() => setIsAnnotating(!isAnnotating)}
          title="Toggle Click-to-Annotate Mode (Alt+A)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isAnnotating ? '#7C1B9F' : 'transparent',
            color: '#fff',
            border: isAnnotating ? '1px solid #A855F7' : '1px solid transparent',
            padding: '5px 12px',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.18s ease',
          }}
        >
          <Icons.Crosshair />
          <span>{isAnnotating ? 'Annotating (Click any UI)' : 'Annotate UI'}</span>
          <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '2px' }}>(Alt+A)</span>
        </button>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />

        <button
          onClick={() => setShowPins(!showPins)}
          title={showPins ? 'Hide Pin Badges' : 'Show Pin Badges'}
          style={{
            background: 'transparent',
            border: 'none',
            color: showPins ? '#A855F7' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          {showPins ? <Icons.Eye /> : <Icons.EyeOff />}
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          title="Open Annotations Drawer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          <Icons.Layers />
          <span>Notes ({annotations.length})</span>
        </button>
      </div>

      {/* 2. Hover Bounding Box Inspector */}
      {isAnnotating && hoveredElement && (
        <div
          style={{
            position: 'fixed',
            top: hoveredElement.rect.top,
            left: hoveredElement.rect.left,
            width: hoveredElement.rect.width,
            height: hoveredElement.rect.height,
            border: '2px dashed #A855F7',
            background: 'rgba(168, 85, 247, 0.12)',
            boxSizing: 'border-box',
            zIndex: 999990,
            pointerEvents: 'none',
            transition: 'all 0.06s ease-out',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: 0,
              background: '#7C1B9F',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {hoveredElement.componentName} &bull; {hoveredElement.tagName}
          </div>
        </div>
      )}

      {/* 3. Rendered Pin Badges */}
      {showPins &&
        annotations.map((ann, idx) => (
          <div
            key={ann.id}
            onClick={() => setSelectedPin(ann)}
            style={{
              position: 'fixed',
              left: ann.x,
              top: ann.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 999995,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#7C1B9F',
              border: '2px solid #fff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11.5px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(124, 27, 159, 0.65)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'transform 0.15s ease',
            }}
            title={`#${idx + 1}: ${ann.comment}`}
          >
            {idx + 1}
          </div>
        ))}

      {/* 4. Popover for Adding New Note */}
      {activeNewNote && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(activeNewNote.x, window.innerWidth - 320),
            top: Math.min(activeNewNote.y + 12, window.innerHeight - 280),
            width: '300px',
            background: '#1A1A24',
            border: '1px solid #7C1B9F',
            borderRadius: '10px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            padding: '14px',
            zIndex: 999998,
            pointerEvents: 'auto',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#C084FC' }}>
              Add Visual Note
            </span>
            <button
              onClick={() => setActiveNewNote(null)}
              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
              <Icons.X />
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px', wordBreak: 'break-all' }}>
            Target: <code style={{ color: '#E9D5FF' }}>{activeNewNote.componentName}</code> ({activeNewNote.selector})
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {(['UI / Style', 'Bug', 'Feature', 'Content'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNoteCategory(cat)}
                style={{
                  flex: 1,
                  fontSize: '10px',
                  padding: '3px 2px',
                  borderRadius: '4px',
                  border: noteCategory === cat ? '1px solid #C084FC' : '1px solid rgba(255,255,255,0.1)',
                  background: noteCategory === cat ? '#7C1B9F' : 'rgba(255,255,255,0.04)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: noteCategory === cat ? 700 : 400,
                }}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>

          <textarea
            autoFocus
            rows={3}
            value={noteComment}
            onChange={(e) => setNoteComment(e.target.value)}
            placeholder="Describe requested change (e.g. 'Collapse tree by default', 'Increase contrast')..."
            style={{
              width: '100%',
              background: '#111116',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '8px',
              color: '#fff',
              fontSize: '12px',
              resize: 'none',
              boxSizing: 'border-box',
              outline: 'none',
              marginBottom: '10px',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button
              onClick={() => setActiveNewNote(null)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#D1D5DB',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={!noteComment.trim()}
              style={{
                background: '#7C1B9F',
                border: 'none',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: noteComment.trim() ? 'pointer' : 'not-allowed',
                opacity: noteComment.trim() ? 1 : 0.5,
              }}
            >
              Save Pin
            </button>
          </div>
        </div>
      )}

      {/* 5. Selected Pin Details Modal */}
      {selectedPin && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(selectedPin.x, window.innerWidth - 300),
            top: Math.min(selectedPin.y + 12, window.innerHeight - 200),
            width: '280px',
            background: '#1A1A24',
            border: '1px solid #7C1B9F',
            borderRadius: '10px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            padding: '12px',
            zIndex: 999998,
            pointerEvents: 'auto',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', background: '#7C1B9F', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {selectedPin.category}
            </span>
            <button
              onClick={() => setSelectedPin(null)}
              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
              <Icons.X />
            </button>
          </div>
          <p style={{ fontSize: '12px', margin: '6px 0', lineHeight: 1.4 }}>{selectedPin.comment}</p>
          <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '8px' }}>
            <code>{selectedPin.target_component}</code> &bull; <code>{selectedPin.target_selector}</code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: '#6B7280' }}>
              {new Date(selectedPin.created_at).toLocaleTimeString()}
            </span>
            <button
              onClick={() => handleDeleteAnnotation(selectedPin.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EF4444',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Icons.Trash />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Slide-Out Annotations Drawer */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '380px',
            maxWidth: '100vw',
            height: '100vh',
            background: '#121218',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
            zIndex: 999999,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#C084FC' }}>
                Visual UI Feedback ({annotations.length})
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#9CA3AF' }}>
                Annotated notes for AI & Developers
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
              <Icons.X />
            </button>
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              onClick={handleCopyForAI}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: copySuccess ? '#059669' : '#7C1B9F',
                border: 'none',
                color: '#fff',
                padding: '7px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copySuccess ? <Icons.Check /> : <Icons.Copy />}
              <span>{copySuccess ? 'Copied Prompt!' : 'Copy for AI'}</span>
            </button>

            {apiEndpoint && (
              <button
                onClick={handleSyncToBackend}
                disabled={isSaving}
                title="Save annotations to project documents"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  cursor: isSaving ? 'wait' : 'pointer',
                }}
              >
                <Icons.Save />
                <span>Save</span>
              </button>
            )}

            {annotations.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all annotations"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#EF4444',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                }}
              >
                <Icons.Trash />
              </button>
            )}
          </div>

          {/* List of Annotations */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {annotations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#6B7280', fontSize: '13px' }}>
                <div style={{ marginBottom: '8px' }}><Icons.Crosshair /></div>
                No annotations yet.<br />Click <strong>Annotate UI</strong> or press <strong>Alt+A</strong> to point and click on elements.
              </div>
            ) : (
              annotations.map((ann, idx) => (
                <div
                  key={ann.id}
                  style={{
                    background: '#1A1A24',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '10px',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#7C1B9F',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.15)', color: '#C084FC', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {ann.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnotation(ann.id)}
                      style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', padding: '2px' }}
                    >
                      <Icons.X />
                    </button>
                  </div>

                  <p style={{ fontSize: '12px', margin: '6px 0', color: '#F3F4F6', lineHeight: 1.4 }}>
                    {ann.comment}
                  </p>

                  <div style={{ fontSize: '10.5px', color: '#9CA3AF', background: '#111116', padding: '4px 6px', borderRadius: '4px', wordBreak: 'break-all' }}>
                    <span style={{ color: '#C084FC' }}>{ann.target_component}</span> &bull; <code>{ann.target_selector}</code>
                    {ann.target_text && <div style={{ color: '#6B7280', marginTop: '2px' }}>{ann.target_text}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

