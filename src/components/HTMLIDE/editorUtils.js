import { getBlockContext } from './completions';

export const INDENT = '    ';

export const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'source', 'track', 'wbr',
]);

// All edit helpers take the textarea value and selection and return
// `{ value, start, end }` (the new text and selection), or null for "no change".

// Builds the text edit for pressing Enter: keeps the current line's indentation,
// adds one level after an opening tag, and splits `<tag>|</tag>` onto three lines.
export function getEnterEdit(value, start, end) {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const currentIndent = value.slice(lineStart, start).match(/^[ \t]*/)[0];
  const before = value.slice(0, start);
  const after = value.slice(end);

  const openTag = before.match(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^<>]*)?>$/);
  const opensTag =
    openTag && !VOID_TAGS.has(openTag[1].toLowerCase()) && !openTag[0].endsWith('/>');
  // CSS rules and JS blocks: `.card {`, `function () {`, `[`, `(`.
  const openBracket = before.match(/([{[(])[ \t]*$/);
  const opensBlock = opensTag || Boolean(openBracket);

  const closesPair = opensTag
    ? /^[ \t]*<\//.test(after)
    : openBracket && after.replace(/^[ \t]*/, '').startsWith({ '{': '}', '[': ']', '(': ')' }[openBracket?.[1]]);

  if (opensBlock && closesPair) {
    const inner = `\n${currentIndent}${INDENT}`;
    const text = `${inner}\n${currentIndent}`;
    const cursor = start + inner.length;
    return { value: before + text + after.replace(/^[ \t]*/, ''), start: cursor, end: cursor };
  }

  const text = `\n${currentIndent}${opensBlock ? INDENT : ''}`;
  const cursor = start + text.length;
  return { value: before + text + after, start: cursor, end: cursor };
}

// Typing a closing `}`, `]` or `)` on an otherwise blank line removes one indent level.
export function getCloseBracketEdit(value, start, end, char) {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const beforeOnLine = value.slice(lineStart, start);
  if (start !== end || !/^[ \t]+$/.test(beforeOnLine)) return null;

  const dedented = beforeOnLine.endsWith(INDENT)
    ? beforeOnLine.slice(0, -INDENT.length)
    : beforeOnLine.replace(/[ \t]$/, '');
  const text = dedented + char;
  const cursor = lineStart + text.length;
  return { value: value.slice(0, lineStart) + text + value.slice(end), start: cursor, end: cursor };
}

// Start of the first selected line and end (before `\n`) of the last selected line.
// Like VS Code, a selection ending at column 0 does not include that last line.
export function getLineRange(value, start, end) {
  let last = end;
  if (end > start && value[end - 1] === '\n') last = end - 1;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const nextBreak = value.indexOf('\n', last);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  return { lineStart, lineEnd };
}

// Alt+Up / Alt+Down
export function moveLines(value, start, end, direction) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const block = value.slice(lineStart, lineEnd);

  if (direction === 'up') {
    if (lineStart === 0) return null;
    const prevStart = value.lastIndexOf('\n', lineStart - 2) + 1;
    const prevLine = value.slice(prevStart, lineStart - 1);
    const shift = -(prevLine.length + 1);
    return {
      value: value.slice(0, prevStart) + block + '\n' + prevLine + value.slice(lineEnd),
      start: start + shift,
      end: end + shift,
    };
  }

  if (lineEnd >= value.length) return null;
  const nextBreak = value.indexOf('\n', lineEnd + 1);
  const nextEnd = nextBreak === -1 ? value.length : nextBreak;
  const nextLine = value.slice(lineEnd + 1, nextEnd);
  const shift = nextLine.length + 1;
  return {
    value: value.slice(0, lineStart) + nextLine + '\n' + block + value.slice(nextEnd),
    start: start + shift,
    end: end + shift,
  };
}

// Alt+Shift+Up / Alt+Shift+Down
export function copyLines(value, start, end, direction) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const block = value.slice(lineStart, lineEnd);

  if (direction === 'up') {
    return { value: value.slice(0, lineStart) + block + '\n' + value.slice(lineStart), start, end };
  }
  const shift = block.length + 1;
  return {
    value: value.slice(0, lineEnd) + '\n' + block + value.slice(lineEnd),
    start: start + shift,
    end: end + shift,
  };
}

// Ctrl+Shift+K
export function deleteLines(value, start, end) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const column = start - lineStart;

  let next;
  let cursorLineStart;
  if (lineEnd < value.length) {
    next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
    cursorLineStart = lineStart;
  } else {
    const removeFrom = Math.max(0, lineStart - 1);
    next = value.slice(0, removeFrom);
    cursorLineStart = next.lastIndexOf('\n') + 1;
  }

  const lineBreak = next.indexOf('\n', cursorLineStart);
  const lineLength = (lineBreak === -1 ? next.length : lineBreak) - cursorLineStart;
  const cursor = cursorLineStart + Math.min(column, lineLength);
  return { value: next, start: cursor, end: cursor };
}

// Ctrl+Enter (below) / Ctrl+Shift+Enter (above)
export function insertBlankLine(value, start, end, direction) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const indent = value.slice(lineStart).match(/^[ \t]*/)[0];

  if (direction === 'above') {
    const cursor = lineStart + indent.length;
    return { value: value.slice(0, lineStart) + indent + '\n' + value.slice(lineStart), start: cursor, end: cursor };
  }
  const cursor = lineEnd + 1 + indent.length;
  return { value: value.slice(0, lineEnd) + '\n' + indent + value.slice(lineEnd), start: cursor, end: cursor };
}

// Tab / Ctrl+] on a selection: indent every selected line.
export function indentLines(value, start, end) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split('\n');
  const block = lines.map((line) => (line.trim() ? INDENT + line : line)).join('\n');
  const firstShift = lines[0].trim() ? INDENT.length : 0;
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: start + firstShift,
    end: end + (block.length - (lineEnd - lineStart)),
  };
}

// Shift+Tab / Ctrl+[: remove one indent level from every selected line.
export function outdentLines(value, start, end) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split('\n');
  const removed = lines.map((line) => line.match(/^( {1,4}|\t)?/)[0].length);
  if (removed.every((n) => n === 0)) return null;

  const block = lines.map((line, i) => line.slice(removed[i])).join('\n');
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: Math.max(lineStart, start - removed[0]),
    end: Math.max(lineStart, end - (lineEnd - lineStart - block.length)),
  };
}

// Tab without a multi-line selection: insert spaces at the cursor.
export function insertIndent(value, start, end) {
  const cursor = start + INDENT.length;
  return { value: value.slice(0, start) + INDENT + value.slice(end), start: cursor, end: cursor };
}

// Ctrl+/ : `<!-- -->` in HTML, `/* */` in <style>, `//` in <script>.
export function toggleComment(value, start, end) {
  const { lineStart, lineEnd } = getLineRange(value, start, end);
  const block = value.slice(lineStart, lineEnd);
  const context = getBlockContext(value.slice(0, lineStart))?.tag;

  if (context === 'script') {
    const lines = block.split('\n');
    const codeLines = lines.filter((line) => line.trim());
    if (!codeLines.length) return null;
    const allCommented = codeLines.every((line) => /^\s*\/\//.test(line));

    let firstDelta = 0;
    let next;
    if (allCommented) {
      next = lines.map((line, i) => {
        const updated = line.replace(/^(\s*)\/\/ ?/, '$1');
        if (i === 0) firstDelta = updated.length - line.length;
        return updated;
      });
    } else {
      const minIndent = Math.min(...codeLines.map((line) => line.match(/^\s*/)[0].length));
      next = lines.map((line, i) => {
        if (!line.trim()) return line;
        if (i === 0) firstDelta = 3;
        return `${line.slice(0, minIndent)}// ${line.slice(minIndent)}`;
      });
    }
    const text = next.join('\n');
    return {
      value: value.slice(0, lineStart) + text + value.slice(lineEnd),
      start: Math.max(lineStart, start + firstDelta),
      end: Math.max(lineStart, end + (text.length - block.length)),
    };
  }

  const [open, close] = context === 'style' ? ['/* ', ' */'] : ['<!-- ', ' -->'];
  const indent = block.match(/^\s*/)[0];
  const content = block.slice(indent.length);
  const openRe = new RegExp(`^${escapeRe(open.trim())} ?`);
  const closeRe = new RegExp(` ?${escapeRe(close.trim())}\\s*$`);

  let text;
  let firstDelta;
  if (openRe.test(content) && closeRe.test(content)) {
    const inner = content.replace(openRe, '').replace(closeRe, '');
    firstDelta = -content.match(openRe)[0].length;
    text = indent + inner;
  } else {
    firstDelta = open.length;
    text = indent + open + content + close;
  }
  const minStart = lineStart + indent.length;
  return {
    value: value.slice(0, lineStart) + text + value.slice(lineEnd),
    start: start < minStart ? start : Math.max(minStart, start + firstDelta),
    end: end === start
      ? (start < minStart ? start : Math.max(minStart, start + firstDelta))
      : end + (text.length - block.length),
  };
}

function escapeRe(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
