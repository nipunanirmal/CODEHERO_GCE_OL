import { VOID_TAGS } from './editorUtils';

export const HTML_TAGS = [
  'html', 'head', 'body', 'title', 'meta', 'link', 'script', 'style',
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'img', 'br', 'hr', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
  'thead', 'tbody', 'tfoot', 'form', 'input', 'button', 'textarea',
  'select', 'option', 'label', 'video', 'audio', 'source', 'track',
  'iframe', 'header', 'footer', 'nav', 'section', 'article', 'aside',
  'main', 'figure', 'figcaption', 'strong', 'em', 'b', 'i', 'u', 's',
  'small', 'code', 'pre', 'canvas', 'blockquote', 'cite', 'dl', 'dt', 'dd',
];

const CSS_PROPERTIES = [
  'color', 'background', 'background-color', 'background-image', 'background-size',
  'background-repeat', 'background-position', 'width', 'height', 'min-width', 'max-width',
  'min-height', 'max-height', 'margin', 'margin-top', 'margin-right', 'margin-bottom',
  'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color',
  'border-width', 'border-style', 'border-radius', 'box-shadow', 'box-sizing', 'display',
  'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear', 'overflow',
  'visibility', 'opacity', 'font', 'font-family', 'font-size', 'font-weight', 'font-style',
  'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'text-transform',
  'text-shadow', 'white-space', 'vertical-align', 'list-style', 'list-style-type',
  'cursor', 'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items',
  'align-content', 'gap', 'grid-template-columns', 'grid-template-rows', 'transition',
  'transform', 'animation', 'outline', 'content',
];

const COLORS = [
  'red', 'blue', 'green', 'black', 'white', 'gray', 'orange', 'yellow', 'purple', 'pink',
  'brown', 'navy', 'teal', 'lightblue', 'lightgreen', 'lightgray', 'darkblue', 'darkgreen',
  'bisque', 'gold', 'silver', 'transparent',
];

const CSS_VALUES = {
  color: COLORS,
  'background-color': COLORS,
  'border-color': COLORS,
  background: COLORS,
  display: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  'text-align': ['left', 'center', 'right', 'justify'],
  'font-weight': ['normal', 'bold', 'lighter', 'bolder', '400', '700'],
  'font-style': ['normal', 'italic', 'oblique'],
  'font-family': ['Arial, sans-serif', "'Times New Roman', serif", "'Courier New', monospace", 'Verdana, sans-serif', 'Georgia, serif'],
  'text-decoration': ['none', 'underline', 'overline', 'line-through'],
  'text-transform': ['none', 'uppercase', 'lowercase', 'capitalize'],
  'flex-direction': ['row', 'row-reverse', 'column', 'column-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
  'align-items': ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
  'align-content': ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
  overflow: ['visible', 'hidden', 'scroll', 'auto'],
  visibility: ['visible', 'hidden'],
  float: ['left', 'right', 'none'],
  clear: ['left', 'right', 'both', 'none'],
  cursor: ['pointer', 'default', 'text', 'move', 'not-allowed', 'wait'],
  'border-style': ['solid', 'dashed', 'dotted', 'double', 'none'],
  'box-sizing': ['content-box', 'border-box'],
  'background-repeat': ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
  'background-size': ['cover', 'contain', 'auto'],
  'list-style-type': ['none', 'disc', 'circle', 'square', 'decimal'],
  'white-space': ['normal', 'nowrap', 'pre', 'pre-wrap'],
  'vertical-align': ['baseline', 'top', 'middle', 'bottom'],
};

// `|` marks where the cursor goes after inserting the snippet.
const JS_GLOBALS = [
  ['console.log', 'console.log(|);'],
  ['document.getElementById', "document.getElementById('|')"],
  ['document.querySelector', "document.querySelector('|')"],
  ['document.querySelectorAll', "document.querySelectorAll('|')"],
  ['document.createElement', "document.createElement('|')"],
  ['document.body', 'document.body'],
  ['document.write', 'document.write(|);'],
  ['alert', 'alert(|);'],
  ['prompt', 'prompt(|)'],
  ['confirm', 'confirm(|)'],
  ['parseInt', 'parseInt(|)'],
  ['parseFloat', 'parseFloat(|)'],
  ['Number', 'Number(|)'],
  ['String', 'String(|)'],
  ['Math.random', 'Math.random()|'],
  ['Math.floor', 'Math.floor(|)'],
  ['Math.round', 'Math.round(|)'],
  ['Math.max', 'Math.max(|)'],
  ['Math.min', 'Math.min(|)'],
  ['setTimeout', 'setTimeout(() => {\n    |\n}, 1000);'],
  ['setInterval', 'setInterval(() => {\n    |\n}, 1000);'],
  ['function', 'function |() {\n    \n}'],
  ['const', 'const |'],
  ['let', 'let |'],
  ['var', 'var |'],
  ['if', 'if (|) {\n    \n}'],
  ['else', 'else {\n    |\n}'],
  ['for', 'for (let i = 0; i < |; i++) {\n    \n}'],
  ['while', 'while (|) {\n    \n}'],
  ['return', 'return |'],
  ['true', 'true|'],
  ['false', 'false|'],
  ['null', 'null|'],
  ['window', 'window|'],
  ['localStorage.setItem', "localStorage.setItem('|', )"],
  ['localStorage.getItem', "localStorage.getItem('|')"],
];

const JS_MEMBERS = [
  ['addEventListener', "addEventListener('|', () => {\n    \n});"],
  ['innerHTML', 'innerHTML|'],
  ['innerText', 'innerText|'],
  ['textContent', 'textContent|'],
  ['value', 'value|'],
  ['style', 'style.|'],
  ['classList.add', "classList.add('|')"],
  ['classList.remove', "classList.remove('|')"],
  ['classList.toggle', "classList.toggle('|')"],
  ['appendChild', 'appendChild(|)'],
  ['remove', 'remove()|'],
  ['setAttribute', "setAttribute('|', )"],
  ['getAttribute', "getAttribute('|')"],
  ['length', 'length|'],
  ['push', 'push(|)'],
  ['pop', 'pop()|'],
  ['forEach', 'forEach((item) => {\n    |\n});'],
  ['map', 'map((item) => |)'],
  ['filter', 'filter((item) => |)'],
  ['includes', 'includes(|)'],
  ['indexOf', 'indexOf(|)'],
  ['join', "join('|')"],
  ['split', "split('|')"],
  ['toUpperCase', 'toUpperCase()|'],
  ['toLowerCase', 'toLowerCase()|'],
  ['trim', 'trim()|'],
  ['toFixed', 'toFixed(|)'],
  ['preventDefault', 'preventDefault();|'],
  ['checked', 'checked|'],
  ['disabled', 'disabled|'],
];

const snippet = (label, template, detail) => {
  const cursor = template.indexOf('|');
  return { label, detail, text: template.replace('|', ''), cursor: cursor === -1 ? template.length : cursor };
};

const byPrefix = (list, prefix) => {
  const lower = prefix.toLowerCase();
  return list.filter((entry) => {
    const label = typeof entry === 'string' ? entry : entry[0];
    return label.toLowerCase().startsWith(lower);
  });
};

// Finds the innermost <style>/<script> block containing the cursor, if any.
export function getBlockContext(before) {
  for (const tag of ['style', 'script']) {
    const openRe = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    let lastOpenEnd = -1;
    let m;
    while ((m = openRe.exec(before))) lastOpenEnd = m.index + m[0].length;
    if (lastOpenEnd === -1) continue;
    const closeIdx = before.toLowerCase().lastIndexOf(`</${tag}`);
    if (closeIdx < lastOpenEnd) return { tag, contentStart: lastOpenEnd };
  }
  return null;
}

function htmlCompletions(before, cursor) {
  const match = before.match(/<([a-zA-Z][a-zA-Z0-9]*)$/);
  if (!match) return null;
  const items = byPrefix(HTML_TAGS, match[1]).map((tag) => {
    const opening = `<${tag}>`;
    const text = VOID_TAGS.has(tag) ? opening : `${opening}</${tag}>`;
    return { label: opening, text, cursor: opening.length };
  });
  return { title: 'HTML tag suggestions', start: cursor - match[0].length, items };
}

// `declarations` is the CSS text of the current rule body (after `{` or inside style="").
function cssDeclarationCompletions(declarations, cursor) {
  const current = declarations.slice(declarations.lastIndexOf(';') + 1);
  const colon = current.indexOf(':');

  if (colon === -1) {
    const match = current.match(/([a-zA-Z-]+)$/);
    if (!match) return null;
    const items = byPrefix(CSS_PROPERTIES, match[1]).map((prop) => snippet(prop, `${prop}: |;`, 'property'));
    return { title: 'CSS property suggestions', start: cursor - match[1].length, items };
  }

  const property = current.slice(0, colon).trim().toLowerCase();
  const values = CSS_VALUES[property];
  if (!values) return null;
  const valueText = current.slice(colon + 1);
  const match = valueText.match(/([a-zA-Z0-9-]*)$/);
  // Only suggest for the first word of the value, e.g. `display: fl|`.
  if (valueText.trim().length > match[1].length) return null;
  const items = byPrefix(values, match[1]).map((v) => snippet(v, `${v}|`, 'value'));
  return { title: `CSS values: ${property}`, start: cursor - match[1].length, items };
}

function cssCompletions(css, cursor) {
  const depth = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
  if (depth > 0) {
    return cssDeclarationCompletions(css.slice(css.lastIndexOf('{') + 1), cursor);
  }

  // Selector position: suggest element names (not after `.` or `#`).
  const match = css.match(/(^|[\s,>+~}])([a-zA-Z][a-zA-Z0-9]*)$/);
  if (!match) return null;
  const items = byPrefix(HTML_TAGS, match[2]).map((tag) => snippet(tag, `${tag}|`, 'selector'));
  return { title: 'CSS selector suggestions', start: cursor - match[2].length, items };
}

function jsCompletions(code, cursor) {
  const line = code.slice(code.lastIndexOf('\n') + 1);
  if (/\/\//.test(line)) return null;
  const quotes = (line.match(/['"`]/g) || []).length;
  if (quotes % 2 === 1) return null;

  const match = code.match(/(^|[^\w$.])([A-Za-z_$][\w$]*(\.[A-Za-z_$]?[\w$]*)*)$/);
  const word = match?.[2];

  if (word && (word.includes('.') || word.length >= 2)) {
    const globals = byPrefix(JS_GLOBALS, word).map(([label, t]) => snippet(label, t, 'js'));
    if (globals.length) {
      return { title: 'JavaScript suggestions', start: cursor - word.length, items: globals };
    }
  }

  // Member access on any expression, e.g. `input.val` or `getElementById('x').inn`.
  const memberMatch = code.match(/[A-Za-z_$)\]]\.([A-Za-z_$][\w$]*)?$/);
  if (!memberMatch) return null;
  const member = memberMatch[1] || '';
  const items = byPrefix(JS_MEMBERS, member).map(([label, t]) => snippet(label, t, 'member'));
  return { title: 'JavaScript suggestions', start: cursor - member.length, items };
}

// Returns { title, start, items: [{ label, detail, text, cursor }] } or null.
export function getCompletions(value, cursor) {
  const before = value.slice(0, cursor);
  const block = getBlockContext(before);

  let result;
  if (block?.tag === 'style') {
    result = cssCompletions(before.slice(block.contentStart), cursor);
  } else if (block?.tag === 'script') {
    result = jsCompletions(before.slice(block.contentStart), cursor);
  } else {
    const inlineStyle = before.match(/style\s*=\s*["']([^"'<>]*)$/i);
    result = inlineStyle
      ? cssDeclarationCompletions(inlineStyle[1], cursor)
      : htmlCompletions(before, cursor);
  }

  if (!result) return null;
  // Drop suggestions that would insert exactly what is already typed.
  const typed = before.slice(result.start);
  const items = result.items.filter((item) => item.text !== typed);
  if (items.length === 0) return null;
  return { ...result, items };
}
