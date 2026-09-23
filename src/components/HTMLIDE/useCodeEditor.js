import { useCallback } from 'react';
import {
  copyLines,
  deleteLines,
  getCloseBracketEdit,
  getEnterEdit,
  getLineRange,
  indentLines,
  insertBlankLine,
  insertIndent,
  moveLines,
  outdentLines,
  toggleComment,
} from './editorUtils';

// VS Code-style key handling for a plain <textarea>.
//
// Edits go through `document.execCommand('insertText')` so they land on the browser's
// native undo stack (Ctrl+Z / Ctrl+Y keep working); if that is unavailable we fall back
// to setting the value directly.
export function useCodeEditor({ textareaRef, setValue, onCursorChange }) {
  const applyEdit = useCallback(
    ({ value: nextValue, start, end = start }) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setValue(nextValue);
        return;
      }

      const current = textarea.value;
      if (current !== nextValue) {
        // Replace only the changed span so undo restores exactly that span.
        let prefix = 0;
        const maxPrefix = Math.min(current.length, nextValue.length);
        while (prefix < maxPrefix && current[prefix] === nextValue[prefix]) prefix += 1;
        let suffix = 0;
        const maxSuffix = Math.min(current.length, nextValue.length) - prefix;
        while (
          suffix < maxSuffix &&
          current[current.length - 1 - suffix] === nextValue[nextValue.length - 1 - suffix]
        ) {
          suffix += 1;
        }

        const inserted = nextValue.slice(prefix, nextValue.length - suffix);
        textarea.focus();
        textarea.setSelectionRange(prefix, current.length - suffix);

        let ok = false;
        try {
          ok = document.execCommand(inserted ? 'insertText' : 'delete', false, inserted);
        } catch {
          ok = false;
        }
        if (!ok || textarea.value !== nextValue) {
          setValue(nextValue);
          requestAnimationFrame(() => textarea.setSelectionRange(start, end));
        }
      }

      textarea.setSelectionRange(start, end);
      onCursorChange?.(start);
    },
    [textareaRef, setValue, onCursorChange]
  );

  const handleKeyDown = useCallback(
    (event) => {
      const textarea = event.target;
      const { value, selectionStart: start, selectionEnd: end } = textarea;
      const { key, shiftKey, altKey } = event;
      const mod = event.ctrlKey || event.metaKey;
      const multiLine = value.slice(start, end).includes('\n');

      let edit;
      let handled = true;

      if (altKey && !mod && (key === 'ArrowUp' || key === 'ArrowDown')) {
        const direction = key === 'ArrowUp' ? 'up' : 'down';
        edit = shiftKey ? copyLines(value, start, end, direction) : moveLines(value, start, end, direction);
      } else if (mod && shiftKey && key.toLowerCase() === 'k') {
        edit = deleteLines(value, start, end);
      } else if (mod && !altKey && key === 'Enter') {
        edit = insertBlankLine(value, start, end, shiftKey ? 'above' : 'below');
      } else if (mod && !altKey && (key === '/' || event.code === 'Slash')) {
        edit = toggleComment(value, start, end);
      } else if (mod && !altKey && key === ']') {
        edit = indentLines(value, start, end);
      } else if (mod && !altKey && key === '[') {
        edit = outdentLines(value, start, end);
      } else if (mod && !altKey && !shiftKey && key.toLowerCase() === 'l') {
        const { lineStart, lineEnd } = getLineRange(value, start, end);
        textarea.setSelectionRange(lineStart, Math.min(value.length, lineEnd + 1));
      } else if (key === 'Tab' && !mod && !altKey) {
        if (shiftKey) edit = outdentLines(value, start, end);
        else edit = multiLine ? indentLines(value, start, end) : insertIndent(value, start, end);
      } else if (key === 'Enter' && !mod && !altKey && !shiftKey) {
        edit = getEnterEdit(value, start, end);
      } else if ((key === '}' || key === ']' || key === ')') && !mod && !altKey) {
        edit = getCloseBracketEdit(value, start, end, key);
        handled = Boolean(edit);
      } else if (key === 'Home' && !mod && !altKey) {
        // Smart Home: toggle between first non-space character and line start.
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const firstChar = lineStart + value.slice(lineStart).match(/^[ \t]*/)[0].length;
        const caret = textarea.selectionDirection === 'backward' ? start : end;
        const target = caret === firstChar ? lineStart : firstChar;
        const anchor = textarea.selectionDirection === 'backward' ? end : start;
        if (shiftKey) {
          textarea.setSelectionRange(Math.min(anchor, target), Math.max(anchor, target), target < anchor ? 'backward' : 'forward');
        } else {
          textarea.setSelectionRange(target, target);
        }
        onCursorChange?.(target);
      } else {
        handled = false;
      }

      if (!handled) return;
      event.preventDefault();
      if (edit) applyEdit(edit);
    },
    [applyEdit, onCursorChange]
  );

  return { applyEdit, handleKeyDown };
}
