import React, { useState, useEffect, useRef } from 'react';

const HTML_TAGS = [
  'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style',
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img', 'br', 'hr', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
  'thead', 'tbody', 'tfoot', 'form', 'input', 'button', 'textarea',
  'select', 'option', 'label', 'video', 'audio', 'source', 'track',
  'iframe', 'header', 'footer', 'nav', 'section', 'article', 'aside',
  'main', 'figure', 'figcaption', 'strong', 'em', 'b', 'i', 'u', 's',
  'small', 'code', 'pre', 'canvas', 'blockquote', 'cite', 'dl', 'dt', 'dd',
];

const HtmlAutocomplete = ({ value, cursorPosition, textareaRef }) => {
  const [matches, setMatches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [active, setActive] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current || !cursorPosition || cursorPosition <= 0) {
      setActive(false);
      return;
    }

    const textBeforeCursor = value.slice(0, cursorPosition);
    const match = textBeforeCursor.match(/<([a-zA-Z][a-zA-Z0-9]*)$/);

    if (!match) {
      setActive(false);
      return;
    }

    const query = match[1].toLowerCase();
    const filtered = HTML_TAGS.filter((tag) => tag.startsWith(query));
    if (filtered.length === 0) {
      setActive(false);
      return;
    }

    setMatches(filtered);
    setSelectedIndex(0);
    setActive(true);

    const textarea = textareaRef.current;
    const coords = getCaretCoordinates(textarea, cursorPosition);
    setPosition({
      left: coords.left + 12,
      top: coords.top + 24,
    });
  }, [value, cursorPosition, textareaRef]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setSelectedIndex((i) => (i + 1) % matches.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setSelectedIndex((i) => (i - 1 + matches.length) % matches.length);
      } else if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setActive(false);
      } else if (event.key === 'Escape') {
        event.stopImmediatePropagation();
        setActive(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [active, matches, selectedIndex]);

  useEffect(() => {
    if (listRef.current && active) {
      const activeItem = listRef.current.children[selectedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, active]);

  if (!active || matches.length === 0) return null;

  return (
    <div
      className="absolute z-40 bg-slate-800 border border-slate-600 rounded-md shadow-2xl overflow-hidden min-w-[200px] max-w-[280px]"
      style={{ left: position.left, top: position.top }}
    >
      <div className="px-2 py-1 text-xs text-slate-400 border-b border-slate-600 bg-slate-900">
        HTML tag suggestions
      </div>
      <div className="max-h-48 overflow-y-auto py-1" ref={listRef}>
        {matches.map((tag, index) => (
          <div
            key={tag}
            onClick={() => setActive(false)}
            className={`flex items-center justify-between px-3 py-1 text-sm cursor-pointer transition-colors ${
              index === selectedIndex ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="font-mono">&lt;{tag}&gt;</span>
            <span className="text-xs text-slate-400">
              {index === selectedIndex ? 'Enter' : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Lightweight caret coordinate approximation for monospaced textareas
function getCaretCoordinates(textarea, position) {
  const value = textarea.value;
  const textBefore = value.slice(0, position);
  const lines = textBefore.split('\n');
  const currentLine = lines[lines.length - 1];
  const lineIndex = lines.length - 1;

  const style = window.getComputedStyle(textarea);
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.5;
  const paddingLeft = parseFloat(style.paddingLeft);
  const paddingTop = parseFloat(style.paddingTop);

  const charWidth = fontSize * 0.6;
  return {
    left: paddingLeft + currentLine.length * charWidth,
    top: paddingTop + lineIndex * lineHeight,
  };
}

export default HtmlAutocomplete;
