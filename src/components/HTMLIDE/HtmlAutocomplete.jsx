import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getCompletions } from './completions';

const POPUP_WIDTH = 240;
const POPUP_MAX_HEIGHT = 230;

const HtmlAutocomplete = ({ value, cursorPosition, textareaRef, onAccept }) => {
  const [completion, setCompletion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [active, setActive] = useState(false);
  const listRef = useRef(null);
  const matches = completion?.items || [];

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !cursorPosition || cursorPosition <= 0) {
      setActive(false);
      return;
    }

    const result = getCompletions(value, cursorPosition);
    if (!result) {
      setActive(false);
      return;
    }

    setCompletion(result);
    setSelectedIndex(0);
    setActive(true);
    setPosition(getPopupPosition(textarea, cursorPosition));
  }, [value, cursorPosition, textareaRef]);

  const acceptItem = (item) => {
    setActive(false);
    if (!onAccept || !item) return;

    // Multi-line snippets follow the indentation of the line they are inserted on.
    const { start } = completion;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const indent = value.slice(lineStart, start).match(/^[ \t]*/)[0];
    const head = item.text.slice(0, item.cursor).replace(/\n/g, `\n${indent}`);
    const tail = item.text.slice(item.cursor).replace(/\n/g, `\n${indent}`);

    const updated = value.slice(0, start) + head + tail + value.slice(cursorPosition);
    onAccept({ value: updated, start: start + head.length });
  };

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      if (event.target !== textareaRef.current) return;

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
        acceptItem(matches[selectedIndex]);
      } else if (event.key === 'Escape') {
        event.stopImmediatePropagation();
        setActive(false);
      }
    };

    const close = () => setActive(false);
    const textarea = textareaRef.current;
    const reposition = () => setPosition(getPopupPosition(textarea, cursorPosition));

    document.addEventListener('keydown', handleKeyDown, true);
    textarea?.addEventListener('scroll', reposition);
    textarea?.addEventListener('blur', close);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      textarea?.removeEventListener('scroll', reposition);
      textarea?.removeEventListener('blur', close);
      window.removeEventListener('resize', close);
    };
  });

  // Scroll only the list itself; scrollIntoView would also scroll the page/editor containers.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !active) return;
    const item = list.children[selectedIndex];
    if (!item) return;
    if (item.offsetTop < list.scrollTop) {
      list.scrollTop = item.offsetTop;
    } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
    }
  }, [selectedIndex, active]);

  if (!active || matches.length === 0) return null;

  return createPortal(
    <div
      className="fixed z-50 bg-slate-800 border border-slate-600 rounded-md shadow-2xl overflow-hidden"
      style={{ left: position.left, top: position.top, width: POPUP_WIDTH }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="px-2 py-1 text-xs text-slate-400 border-b border-slate-600 bg-slate-900">
        {completion.title}
      </div>
      <div className="relative max-h-48 overflow-y-auto py-1" ref={listRef}>
        {matches.map((item, index) => (
          <div
            key={item.label}
            onClick={() => acceptItem(item)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`flex items-center justify-between px-3 py-1 text-sm cursor-pointer transition-colors ${
              index === selectedIndex ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
            }`}
          >
            <span className="font-mono truncate">{item.label}</span>
            <span className="text-xs text-slate-300 ml-2 shrink-0">
              {index === selectedIndex ? 'Enter' : item.detail || ''}
            </span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

// Viewport position for the popup, kept fully on screen (flips above the caret near the bottom).
function getPopupPosition(textarea, position) {
  const caret = getCaretCoordinates(textarea, position);
  const rect = textarea.getBoundingClientRect();
  const lineHeight = caret.height;

  const caretLeft = rect.left + caret.left - textarea.scrollLeft;
  const caretTop = rect.top + caret.top - textarea.scrollTop;

  let left = Math.min(caretLeft, window.innerWidth - POPUP_WIDTH - 8);
  left = Math.max(8, left);

  let top = caretTop + lineHeight + 4;
  if (top + POPUP_MAX_HEIGHT > window.innerHeight - 8) {
    top = Math.max(8, caretTop - POPUP_MAX_HEIGHT - 4);
  }

  return { left, top };
}

// Measures the caret by mirroring the textarea's text and styles in a hidden div.
function getCaretCoordinates(textarea, position) {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement('div');
  const props = [
    'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight',
    'tabSize', 'textIndent', 'wordSpacing', 'whiteSpace', 'overflowWrap', 'wordBreak',
  ];
  props.forEach((prop) => {
    mirror.style[prop] = style[prop];
  });
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.top = '0';
  mirror.style.left = '-9999px';
  const wraps = textarea.getAttribute('wrap') !== 'off';
  mirror.style.whiteSpace = wraps ? 'pre-wrap' : 'pre';
  mirror.style.overflowWrap = wraps ? 'break-word' : 'normal';
  mirror.style.overflow = 'hidden';

  mirror.textContent = textarea.value.slice(0, position);
  const marker = document.createElement('span');
  marker.textContent = '​';
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const coords = {
    left: marker.offsetLeft,
    top: marker.offsetTop,
    height: marker.offsetHeight || parseFloat(style.fontSize) * 1.5,
  };
  document.body.removeChild(mirror);
  return coords;
}

export default HtmlAutocomplete;
