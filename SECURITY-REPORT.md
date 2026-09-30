# Security Assessment Report — CodeHero (ol-ict-game)

**Date:** 2026-09-28
**Target:** CODEHERO_GCE_OL — React 19 + Vite SPA (static deploy)
**Method:** Static code review + dynamic testing against production build (`vite build` + `vite preview`, http://localhost:4173), Playwright-driven browser attacks, `npm audit`.
**Status:** Findings confirmed against commit `e4cc81b`. Fixes applied in the same working tree.

---

## Executive Summary

The student-code preview sandbox is **well engineered**: opaque origin, restrictive CSP, per-run postMessage tokens, and `event.source` validation all held up under live attack (Section B3). The real exposure is elsewhere: a **hardcoded admin credential shipped in the public bundle**, an **API key stored in `localStorage` and sent straight from the browser**, a **`Function()`-based expression evaluator**, a **loop-guard bypass**, **18 vulnerable dependencies**, and **no security headers** on any deployment target.

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| F1 | Admin password hardcoded & shipped in bundle | High | Fixed (hash gate; residual limits documented) |
| F2 | Groq API key in `localStorage`, browser-direct call | High | Documented — needs backend proxy |
| F3 | `Function()` expression evaluator in pseudoExecutor | High (latent) | Fixed |
| F4 | `react-router` + transitive dependency vulns (18) | High | Fixed via `npm audit fix` + dead dep removal |
| F5 | No security headers on any deploy target | Medium | Fixed (.htaccess, vercel.json, _headers) |
| F6 | Preview loop-guard bypass (unbraced/unclosed) | Medium | Fixed |
| F7 | `dist/` committed to git; `.env` not gitignored | Medium | `.env` fixed; `dist/` documented |
| F8 | `alt=` attribute injection from localStorage assets | Low | Fixed |
| F9 | Dead/unused deps (`jison`, `pascal.js`) + unreachable builder routes in bundle | Low | Fixed (deps removed) |
| F10 | `handleTest` persists unsaved AI config | Low | Fixed |

---

## Confirmed Exploits (Evidence)

### F1 — Admin gate bypassed two ways — `src/components/AdminPage.jsx`

**1a. Credential recovery from public bundle:**

```
$ curl -s http://localhost:4173/assets/index-CJfI1p8Q.js | grep -o "codehero2025"
codehero2025          <-- plaintext password, zero auth required
```

The constant also lives in `dist/assets/index-*.js`, which is **committed to git** (`git ls-files` shows `dist/` tracked; commit `607bfdc` intentionally un-ignored it). If the GitHub repo `nipunanirmal/CODEHERO_GCE_OL` is public, the password is world-readable.

**1b. Session-flag bypass (no password at all):**

```js
// executed in DevTools on /admin — any visitor can run this
sessionStorage.setItem('admin_unlocked','1'); location.reload();
```

Result: `document.querySelector('h1').textContent` → `"AI Configuration"`. Full admin UI rendered. Screenshot: `security-tests/evidence-admin-bypassed.png`.

**Impact:** anyone can read/modify the AI provider config in their own browser — which matters because of F2.

### F2 — Groq API key theft — `src/utils/aiErrorExplainer.js`

The admin panel stores `{provider, apiKey}` in `localStorage['codehero_ai_config']` and `callGroq()` issues `Authorization: Bearer <key>` directly from the browser. Demonstrated in-browser:

```js
localStorage.setItem('codehero_ai_config',
  JSON.stringify({provider:'groq', apiKey:'gsk_SIMULATED_VICTIM_KEY_123'}));
JSON.parse(localStorage.codehero_ai_config).apiKey
// -> "gsk_SIMULATED_VICTIM_KEY_123"
```

Any of these steals the key: DevTools on a shared school PC, any future XSS, or finding F3 if it becomes reachable. A shared key distributed this way is functionally public to every student.

**Residual risk:** this is architectural — the correct fix is a server-side proxy (Cloudflare Worker / serverless function) that holds the key. Until then, treat any key entered here as compromised.

### F3 — Arbitrary JS via `Function()` — `src/utils/pseudoExecutor.js:70`

```js
return Function('"use strict";return (' + evalStr + ')')();
```

Variables are regex-substituted into a JS expression, then compiled and run **in the app origin** (not the sandboxed iframe — this executes with full access to `localStorage`, including the Groq key from F2).

PoC (`security-tests/poc-function-sink.js`, run: `node security-tests/poc-function-sink.js`):

```
benign : true
hostile: __pwned = PWNED     <-- arbitrary JS executed
```

Payload used: `x'+(()=>{globalThis.__pwned='PWNED';return 'y'})()+'` — the injection must be an *expression* since it lands inside `return (...)`, which is why the naive `');alert(1);//` statement-injection fails.

**Current reachability:** LOW — `executePseudoCode` is only called from `SequenceLevel.jsx` with fixed block text and `levelData.inputs`; students reorder blocks but cannot author expressions or inputs today. This is a **latent** sink: any feature that lets pseudo-code `INPUT` accept free text, or imports custom levels, turns it into immediate arbitrary JS execution → F2 key theft.

### F5 — No security headers (verified)

```
$ curl -sI http://localhost:4173/
HTTP/1.1 200 OK
Vary: Origin
Content-Type: text/html
...no CSP, no X-Frame-Options, no X-Content-Type-Options, no Referrer-Policy
```

`public/.htaccess`, `public/_redirects`, `vercel.json` = SPA rewrites only. `/admin` is clickjackable; no referrer/origin policy; MIME sniffing enabled. `GET /admin -> 200` for everyone.

### F6 — Preview loop-guard bypass — `src/components/HTMLIDE/previewSandbox.js`

`addLoopGuards` only instruments `for/while/do` bodies that begin with `{`. Verified output:

```
"while(1){}"      => "while(1){__cgLoop();}"   GUARDED
"while(1);"       => "while(1);"               *** UNGUARDED ***
"for(;;);"        => "for(;;);"                *** UNGUARDED ***
"do ; while(1);"  => "do ; while(1);"          *** UNGUARDED ***
"while(1) x++;"   => "while(1) x++;"           *** UNGUARDED ***
```

Additionally, an **unclosed `<script>` at EOF** never matches the `guardInlineScripts` regex, so `while(1){}` without a closing tag runs unguarded (verified — no `__cgLoop()` call in the student region).

Impact: student tab/renderer freeze — self-DoS only, but defeats the stated safety goal on the 2-second loop limit.

### Attacks that FAILED (sandbox held) — tested live via injected student HTML

From inside the `srcDoc` iframe (`sandbox="allow-scripts allow-modals allow-forms"`, meta CSP `connect-src 'none'` etc.):

```
PARENT_LS_BLOCKED: SecurityError    parent.localStorage -> opaque origin
PARENT_DOM_BLOCKED: SecurityError   parent.document -> inaccessible
TOPNAV_BLOCKED: SecurityError       top.location write -> denied
FETCH_BLOCKED: TypeError            fetch() -> CSP connect-src 'none'
POPUP_RET=NULL (blocked by sandbox) window.open -> no allow-popups
```

Screenshot: `security-tests/evidence-html-ide-sandbox.png`. The parent-side `postMessage` listener also validates `event.source === iframe.contentWindow` + per-run token + kind allowlist, and renders forwarded text via React (no HTML injection). This is the strongest part of the codebase.

---

## Other Findings

- **F4 — Dependencies** (`npm audit`, 18 findings / 14 high): `react-router-dom@7.12.0` is inside the vulnerable range for 13 advisories (open redirect via `//` paths, route-matching DoS, RSC-mode issues — mostly N/A for a client SPA but should be patched). `underscore ≤1.13.7` DoS arrives via `jison`→`nomnom`; neither `jison` nor `pascal.js` is imported anywhere in `src/` — `pascal_parser.js` is pre-generated and committed. Removed as dead deps. postcss/babel/browserslist/picomatch/flatted are build-time only → `npm audit fix`.
- **F7 — `dist/` in git** bloats history and freezes stale artifacts; `.gitignore` lacked `.env*` (fixed). If the repo is public, also consider the 1.4 MB textbook PDF (copyright) and stray test files at root.
- **F8 — `buildMediaSnippetFromAsset`** interpolates `asset.name` into `alt="..."`; name is sanitized at *registration* but not when read back from `localStorage` → attribute-injection in generated snippets (self-XSS only, into a sandboxed preview — still fixed).
- **F9 — Dead code in bundle**: `VisualBuilder`/`CraftVisualBuilder`/commented routes keep `@craftjs/*` statically imported → part of the 867 KB bundle.
- **F10 — `AdminPage.handleTest`** wrote config to `localStorage` before Save — persisted untested/partial state.
- **Minor**: `PascalIDE.jsx` highlighter regex `'[^']* '` requires a trailing space (strings without one never highlight); `document.execCommand` is deprecated; `MediaLibrary` uses blocking `confirm()`.

## Fixes Applied

1. `pseudoExecutor.js` — `Function()` replaced with a tokenizer + recursive-descent evaluator (strings, numbers, identifiers, `AND/OR/NOT/MOD/DIV`, comparisons, parens). No code compilation.
2. `previewSandbox.js` — unbraced single-statement loop bodies are now wrapped in `{ __cgLoop(); … }`; unclosed `<script>` at EOF is guarded too.
3. `AdminPage.jsx` — password replaced by SHA-256 digest comparison (plaintext no longer in bundle); `handleTest` no longer persists config (uses `explainError` override param).
4. `aiErrorExplainer.js` — `explainError(msg, code, configOverride)` added.
5. `package.json` — removed `jison`, `pascal.js` (unused); `npm audit fix` applied.
6. `.gitignore` — added `.env` / `.env.*` and `.playwright-mcp/` (tool output). `security-tests/` stays tracked as evidence.
7. `vercel.json` + `public/.htaccess` + `public/_headers` — CSP, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`.
8. `mediaAssets.js` — attribute-escaping in snippet builders.
9. `PascalIDE.jsx` — string-literal regex corrected.

**Not fixed (needs architecture change):** real admin auth + Groq key proxying requires a backend. Recommend: Cloudflare Worker holding `GROQ_API_KEY` as a secret; frontend calls `/api/explain` only. Also consider ignoring `dist/` and deploying via CI artifacts.

## Post-Fix Verification (re-built bundle `index-DPra8Fpn.js`)

- `curl dist JS | grep codehero2025` → **0 hits**; `Function("use strict"` → **0 hits**.
- `/admin`: wrong password rejected (`Incorrect password`), `codehero2025` still unlocks via SHA-256 match. *Residual:* `sessionStorage.admin_unlocked='1'` still bypasses — inherent to client-side gating; documented.
- `npm audit` → **0 vulnerabilities**; `react-router` 7.12.0 → 7.18.4; `jison`/`pascal.js` removed.
- `addLoopGuards` re-tested: all six bypass forms now emit `__cgLoop()`; `do STMT while(x)` terminator preserved; no syntax errors introduced. Unclosed `<script>` → guarded.
- Live `/pseudocode` run: `IF age >= 18 THEN` evaluates without error (also fixed a **pre-existing caller bug**: `([^=])=([^=])` mangled `>=` → `>==`, so `>=`/`<=` conditions silently evaluated false before).
- `/html-ide` sandbox re-tested on new build: `LS_BLOCKED: SecurityError`, `NAV_BLOCKED: SecurityError`, bounded `for(;;)` loop runs correctly.
- `dist/.htaccess` + `dist/_headers` ship the security headers automatically (Vite copies `public/`).
- `eslint` clean on all touched files.

## Interpreter Coverage Audit (Round 2)

Automated matrices now run on every change: `security-tests/pascal-coverage.mjs` (93 cases), `security-tests/pseudocode-coverage.mjs` (38 cases), `security-tests/js-sandbox-coverage.mjs` (23 loop-guard cases + bridge probes).

**New bugs found & fixed:**

| # | Bug | Fix |
|---|---|---|
| C1 | `true`/`false` parsed as variables → `if true then` errored | literal handling in `evaluate` |
| C2 | Char literals `'a'` evaluated to `0` (writeln printed `0`) | `character` node → `String.fromCharCode` |
| C3 | `char` type rejected — grammar emits `CHARACTER`, VALID_TYPES had `CHAR` | added `CHARACTER` + NAMED-type resolution |
| C4 | `writeln(x:0:2)` parse error — `preprocessCode()` never called | now invoked before `parse()` |
| C5 | `10 div 0` printed `Infinity` | throws `Division by zero` |
| C6 | `div` used `Math.floor` (−7 div 2 → −4) | `Math.trunc` (Pascal semantics: −3) |
| C7 | `s[1]` was 0-based (`'abc'[1]`='b') | Pascal 1-based string indexing |
| C8 | `a[99]` silently read/write — no bounds check | real `{lo,hi,data}` arrays + bounds errors |
| C9 | procedures/functions parsed but **silently ignored** | full impl: params, VAR-params by ref, local scope, recursion (depth 200 cap), `Result`/name assignment |
| C10 | `record`/`enum`/`subrange` vars → "Unknown type" | `type_decl` registry + `expr_record_deref` |
| C11 | unknown builtins (`chr`, `ord`, `length`…) returned `0` silently | implemented 20 builtins + loud "Unknown function" error |
| C12 | `break`/`continue`/`exit`/`halt` → "Unknown procedure" | flow sentinels implemented |
| C13 | **WHILE loops never looped** — `ENDWHILE` was consumed by the no-op skip before the loop-back handler | removed from skip list |
| C14 | `FOR k = 1 TO 5`/`NEXT` and `REPEAT`/`UNTIL` had no handlers — FOR fell into `=` assignment | full FOR/NEXT + REPEAT/UNTIL impl |
| C15 | `word`/`longint`/`shortint` rejected (lexer makes them NAMED ids) | NAMED_NUMERIC_TYPES fallback |
| C16 | `//` comments unsupported | string-aware `//` stripper in preprocess |
| C17 | `__cgLoop` guard was a writable global — `__cgLoop=fn` neutralized the time guard | `Object.defineProperty` non-writable |

**Still unsupported (documented, errors are clean):** `goto`/`label`, `uses` unit functionality (accepted silently), file I/O (`assign`/`reset`), `with`, `packed`, sets/`in`, pointers (`^`), scientific literals (`1.0e10`), negative array bounds (`array[-2..2]` — generated parser emits null bound; fails closed with clear error), `while(1)` in strings is correctly NOT guarded (strings/comments/templates/regex-aware scanner verified).

**Residual sandbox note:** the iframe token is readable by student JS via `document.scripts[0].textContent` → could forge parent `postMessage` — impact limited to spoofed console lines rendered as text (no XSS). Severity: low.

## Remaining Recommendations

1. Stand up a backend proxy for the Groq key (F2) — the single highest-value fix left.
2. Decide repo visibility: if public, scrub `codehero2025` hash+flag design, the textbook PDF, and consider uncommitting `dist/`.
3. CSP `connect-src` whitelists only `localhost:11434` for Ollama — a LAN/remote Ollama URL needs the header widened or the CSP dropped to report-only.
4. Code-split the 873 KB bundle (Vite warning): lazy-load `AdminPage`, `VisualBuilder`, `CraftVisualBuilder`.
