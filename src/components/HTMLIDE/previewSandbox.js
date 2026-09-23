// Builds the document that runs student code inside the preview iframe.
//
// Safety model:
// - The iframe uses `sandbox="allow-scripts allow-modals allow-forms"` WITHOUT
//   `allow-same-origin`, so the page gets a unique opaque origin: it cannot touch the
//   app (window.parent DOM), its localStorage/cookies, or remove its own sandbox.
//   No allow-popups / allow-top-navigation, so it cannot open windows or redirect the app.
// - A Content-Security-Policy blocks fetch/XHR/WebSocket, form posts and <base> tricks.
// - Loops in inline scripts get a time guard so `while (true) {}` cannot freeze the tab.
// - console.*, runtime errors and form submits are forwarded to the parent via postMessage.
//   The parent only accepts messages from this iframe carrying the per-run token and
//   renders them as plain text.
//
// Nothing injected here contains newlines, so error line numbers match the editor.

export const PREVIEW_SANDBOX = 'allow-scripts allow-modals allow-forms';

const CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline' https:",
  "style-src 'unsafe-inline' https:",
  'img-src data: blob: https:',
  'media-src data: blob: https:',
  'font-src data: https:',
  'frame-src https:',
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
].join('; ');

const LOOP_TIME_LIMIT_MS = 2000;

const bridgeSource = (token) => `(function(){
var TOKEN=${JSON.stringify(token)};
function send(kind,text){try{parent.postMessage({__codehero:TOKEN,kind:kind,text:String(text).slice(0,5000)},'*');}catch(e){}}
function fmt(v,depth,seen){
if(v===null)return 'null';var t=typeof v;
if(t==='undefined')return 'undefined';
if(t==='string')return depth?JSON.stringify(v):v;
if(t==='number'||t==='boolean'||t==='bigint'||t==='symbol')return String(v);
if(t==='function')return 'function '+(v.name||'(anonymous)')+'()';
if(v instanceof Error)return v.name+': '+v.message;
if(typeof Element!=='undefined'&&v instanceof Element){var s='<'+v.tagName.toLowerCase();if(v.id)s+=' id="'+v.id+'"';if(v.className&&typeof v.className==='string')s+=' class="'+v.className+'"';return s+'>';}
if(seen.indexOf(v)!==-1)return '[Circular]';
if(depth>2)return Array.isArray(v)?'[…]':'{…}';
seen=seen.concat([v]);
if(Array.isArray(v)||(typeof NodeList!=='undefined'&&v instanceof NodeList)){var a=[];for(var i=0;i<v.length&&i<50;i++)a.push(fmt(v[i],depth+1,seen));if(v.length>50)a.push('…');return '['+a.join(', ')+']';}
var parts=[];var keys=Object.keys(v);for(var k=0;k<keys.length&&k<30;k++){var val;try{val=fmt(v[keys[k]],depth+1,seen);}catch(e){val='?';}parts.push(keys[k]+': '+val);}
if(keys.length>30)parts.push('…');return '{'+parts.join(', ')+'}';}
function join(args){var out=[];for(var i=0;i<args.length;i++){try{out.push(fmt(args[i],0,[]));}catch(e){out.push('?');}}return out.join(' ');}
['log','info','warn','error','debug'].forEach(function(level){var orig=console[level];console[level]=function(){send(level==='debug'?'log':level,join(arguments));if(orig)orig.apply(console,arguments);};});
var origTable=console.table;console.table=function(d){send('log',join([d]));if(origTable)origTable.apply(console,arguments);};
var origClear=console.clear;console.clear=function(){send('clear','');if(origClear)origClear.call(console);};
function studentLine(e){var line=e.lineno;var stack=e.error&&e.error.stack?String(e.error.stack):'';if(stack.indexOf('__cgLoop')!==-1||line===1){var m=stack.match(/:(\\d+):\\d+/g)||[];for(var i=0;i<m.length;i++){var n=parseInt(m[i].slice(1),10);if(n>1){line=n;break;}}}return line;}
window.addEventListener('error',function(e){if(e.error===undefined&&!e.message)return;var line=studentLine(e);send('error',(e.message||'Error')+(line?' (line '+line+')':''));});
window.addEventListener('unhandledrejection',function(e){var r=e.reason;send('error','Uncaught (in promise) '+(r&&r.message?r.message:fmt(r,0,[])));});
document.addEventListener('submit',function(e){e.preventDefault();var f=e.target,parts=[];try{new FormData(f).forEach(function(v,k){parts.push(k+'='+(typeof v==='string'?v:'[file]'));});}catch(x){}send('info','Form submitted (not sent in preview): '+(parts.join(', ')||'(no named fields)'));});
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;var h=a.getAttribute('href')||'';if(h.charAt(0)==='#'||/^javascript:/i.test(h))return;e.preventDefault();send('info','Link navigation is disabled in preview: '+h);});
var loopStart=0;
window.__cgLoop=function(){var now=Date.now();if(!loopStart){loopStart=now;setTimeout(function(){loopStart=0;},0);}else if(now-loopStart>${LOOP_TIME_LIMIT_MS}){throw new Error('Possible infinite loop: stopped a loop that ran for more than ${LOOP_TIME_LIMIT_MS / 1000} seconds');}};
['alert','confirm','prompt'].forEach(function(name){var orig=window[name];if(!orig)return;window[name]=function(){try{return orig.apply(window,arguments);}finally{if(loopStart)loopStart=Date.now();}};});
})();`.replace(/\n/g, '');

// Inserts `__cgLoop();` at the start of every braced for/while/do loop body.
// Skips strings and comments; does not add or remove newlines.
export function addLoopGuards(code) {
  let out = '';
  let i = 0;
  const n = code.length;

  const skipString = (from) => {
    const quote = code[from];
    let j = from + 1;
    while (j < n && code[j] !== quote) {
      if (code[j] === '\\') j += 1;
      j += 1;
    }
    return j + 1;
  };

  while (i < n) {
    const ch = code[i];
    const next = code[i + 1];

    if (ch === '/' && next === '/') {
      const e = code.indexOf('\n', i);
      const end = e === -1 ? n : e;
      out += code.slice(i, end);
      i = end;
      continue;
    }
    if (ch === '/' && next === '*') {
      const e = code.indexOf('*/', i + 2);
      const end = e === -1 ? n : e + 2;
      out += code.slice(i, end);
      i = end;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const end = skipString(i);
      out += code.slice(i, end);
      i = end;
      continue;
    }

    const keyword = ['while', 'for', 'do'].find(
      (kw) => code.startsWith(kw, i) && !/[\w$]/.test(code[i + kw.length] || '')
    );
    if (keyword && !/[\w$.]/.test(code[i - 1] || '')) {
      let j = i + keyword.length;
      while (j < n && /\s/.test(code[j])) j += 1;

      if (keyword !== 'do') {
        if (code[j] !== '(') {
          out += code.slice(i, j);
          i = j;
          continue;
        }
        let depth = 0;
        while (j < n) {
          if (code[j] === '"' || code[j] === "'" || code[j] === '`') {
            j = skipString(j);
            continue;
          }
          if (code[j] === '(') depth += 1;
          if (code[j] === ')') {
            depth -= 1;
            if (depth === 0) break;
          }
          j += 1;
        }
        j += 1;
        while (j < n && /\s/.test(code[j])) j += 1;
      }

      if (code[j] === '{') {
        out += `${code.slice(i, j + 1)}__cgLoop();`;
        i = j + 1;
        continue;
      }
      out += code.slice(i, j);
      i = j;
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
}

const guardInlineScripts = (html) =>
  html.replace(/(<script\b([^>]*)>)([\s\S]*?)(<\/script>)/gi, (match, open, attrs, body, close) => {
    if (/\bsrc\s*=/i.test(attrs)) return match;
    const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    if (type && !['text/javascript', 'module', 'application/javascript'].includes(type)) return match;
    return open + addLoopGuards(body) + close;
  });

export function buildSandboxedDocument(html, token) {
  const preamble =
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">` +
    `<script>${bridgeSource(token)}</script>`;

  const source = guardInlineScripts(html || '');
  // Keep <!DOCTYPE> first (standards mode) and put our tags right after it on the same line.
  const doctype = source.match(/^\s*<!doctype[^>]*>/i);
  if (doctype) {
    return doctype[0] + preamble + source.slice(doctype[0].length);
  }
  return preamble + source;
}

export const createPreviewToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
