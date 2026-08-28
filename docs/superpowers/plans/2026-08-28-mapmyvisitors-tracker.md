# MapMyVisitors Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the owner-provided MapMyVisitors tracker to every portfolio visit without displaying its map or disrupting the site, while accurately disclosing anonymous analytics.

**Architecture:** Embed the provider's HTTPS JavaScript URL once, inside an inert one-pixel fixed host at the end of `index.html`. Keep the provider isolated from first-party interactions, add a subdued footer privacy link, document the data flow, and bump the existing service-worker cache so returning visitors receive the changed HTML and CSS.

**Tech Stack:** Static HTML5, CSS, MapMyVisitors JavaScript embed, PowerShell verification, GitHub Pages service worker

**Spec:** `docs/superpowers/specs/2026-08-28-mapmyvisitors-tracker-design.md`

## Global Constraints

- Use widget ID `1c7rv` and token `y-LSQTqPdEAlU_HX4pVBFWTaMZ8wus8LPiLTGWaBqYY` exactly once.
- Load the tracker eagerly from `https://mapmyvisitors.com/map.js` between `<body>` and `</body>`.
- Do not expose a map, add an interactive tracker control, or change the portfolio layout.
- Keep the generated widget out of the accessibility tree and keyboard/pointer navigation.
- Tell visitors that anonymous traffic analytics are provided by MapMyVisitors and link to `https://mapmyvisitors.com/b/policy`.
- Do not claim that MapMyVisitors identifies visitors by name.
- The portfolio must remain usable when the third-party request is blocked or unavailable.
- Do not add npm packages, build tooling, cookies, or first-party analytics storage.

## File structure

- Create `tests/verify-mapmyvisitors.ps1`: dependency-free contract test for the embed, concealment, disclosure, documentation, and cache version.
- Modify `index.html`: footer disclosure and one isolated MapMyVisitors embed at the end of the body.
- Modify `styles.css`: subdued disclosure link and fixed one-pixel tracker host.
- Modify `README.md`: accurate anonymous analytics documentation.
- Modify `service-worker.js`: update the cache name from `tarun-portfolio-v6` to `tarun-portfolio-v7` so cached HTML and CSS are refreshed.

---

### Task 1: Add and verify the discreet analytics integration

**Files:**
- Create: `tests/verify-mapmyvisitors.ps1`
- Modify: `index.html:274-283`
- Modify: `styles.css:247-251`
- Modify: `README.md:79-88`
- Modify: `service-worker.js:1`

**Interfaces:**
- Consumes: the owner-provided MapMyVisitors token `y-LSQTqPdEAlU_HX4pVBFWTaMZ8wus8LPiLTGWaBqYY`, public dashboard ID `1c7rv`, and the existing `.footer-meta` footer layout.
- Produces: one `#mapmyvisitors` script inside `.visitor-tracker`, one `.analytics-disclosure` footer notice, cache version `tarun-portfolio-v7`, and a zero-exit verification script.

- [ ] **Step 1: Create the failing integration contract test**

Create `tests/verify-mapmyvisitors.ps1` with this content:

```powershell
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw (Join-Path $repoRoot 'index.html')
$css = Get-Content -Raw (Join-Path $repoRoot 'styles.css')
$readme = Get-Content -Raw (Join-Path $repoRoot 'README.md')
$serviceWorker = Get-Content -Raw (Join-Path $repoRoot 'service-worker.js')

function Assert-Match {
  param([string]$Content, [string]$Pattern, [string]$Message)
  if ($Content -notmatch $Pattern) { throw $Message }
}

$embedIds = [regex]::Matches($html, 'id="mapmyvisitors"')
if ($embedIds.Count -ne 1) { throw "Expected one MapMyVisitors embed; found $($embedIds.Count)." }

Assert-Match $html 'src="https://mapmyvisitors\.com/map\.js\?d=y-LSQTqPdEAlU_HX4pVBFWTaMZ8wus8LPiLTGWaBqYY&amp;cl=ffffff&amp;w=a"' 'The exact HTTPS MapMyVisitors script URL is missing.'
Assert-Match $html '<div class="visitor-tracker" aria-hidden="true" inert>' 'The tracker must be inside an inert, aria-hidden host.'
Assert-Match $html 'class="analytics-disclosure"' 'The footer analytics disclosure is missing.'
Assert-Match $html 'href="https://mapmyvisitors\.com/b/policy"' 'The MapMyVisitors privacy-policy link is missing.'

$embedPosition = $html.IndexOf('id="mapmyvisitors"')
$bodyStart = $html.IndexOf('<body')
$bodyEnd = $html.IndexOf('</body>')
if ($embedPosition -lt $bodyStart -or $embedPosition -gt $bodyEnd) { throw 'The tracker script must be inside the body.' }

$trackerRule = [regex]::Match($css, '(?s)\.visitor-tracker\s*\{(?<rules>[^}]*)\}')
if (-not $trackerRule.Success) { throw 'The .visitor-tracker CSS rule is missing.' }
$trackerCss = $trackerRule.Groups['rules'].Value
Assert-Match $trackerCss 'position:\s*fixed' 'Tracker host must use fixed positioning.'
Assert-Match $trackerCss 'width:\s*1px' 'Tracker host width must be one pixel.'
Assert-Match $trackerCss 'height:\s*1px' 'Tracker host height must be one pixel.'
Assert-Match $trackerCss 'overflow:\s*hidden' 'Tracker host must clip generated content.'
Assert-Match $trackerCss 'opacity:\s*0' 'Tracker host must be visually transparent.'
Assert-Match $trackerCss 'pointer-events:\s*none' 'Tracker host must not receive pointer input.'

Assert-Match $readme 'MapMyVisitors' 'README must name the analytics provider.'
Assert-Match $readme 'approximate location' 'README must describe approximate-location analytics.'
Assert-Match $serviceWorker "const CACHE = 'tarun-portfolio-v7';" 'Service-worker cache version must be v7.'

Write-Output 'MapMyVisitors integration checks passed.'
```

- [ ] **Step 2: Run the contract test and verify that it fails before implementation**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/verify-mapmyvisitors.ps1
```

Expected: non-zero exit with `Expected one MapMyVisitors embed; found 0.`

- [ ] **Step 3: Add the disclosure and exact tracker embed to the document body**

Replace the current `.footer-meta`, toast, and script tail in `index.html` with:

```html
      <div class="footer-meta">
        <span>© <span id="currentYear">2026</span> Tarun Kumar Kulshrestha</span>
        <span class="analytics-disclosure">Anonymous traffic analytics by <a href="https://mapmyvisitors.com/b/policy" target="_blank" rel="noopener noreferrer">MapMyVisitors</a></span>
        <button id="copyEmail" type="button">Copy email</button>
      </div>
    </div>
  </footer>
  <div class="toast" id="toast" role="status" aria-live="polite">Email copied</div>
  <div class="visitor-tracker" aria-hidden="true" inert>
    <script type="text/javascript" id="mapmyvisitors" src="https://mapmyvisitors.com/map.js?d=y-LSQTqPdEAlU_HX4pVBFWTaMZ8wus8LPiLTGWaBqYY&amp;cl=ffffff&amp;w=a"></script>
  </div>
  <script src="script.js" defer></script>
</body>
```

Do not add `loading="lazy"`, `display: none`, a second image fallback, or custom code in `script.js`.

- [ ] **Step 4: Constrain the provider output and style the disclosure**

Add these rules after the existing `.footer-meta` rules in `styles.css`:

```css
.analytics-disclosure { line-height: 1.45; }
.analytics-disclosure a { color: inherit; text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 3px; }
.analytics-disclosure a:hover { color: var(--text); }
.visitor-tracker { position: fixed; right: 0; bottom: 0; width: 1px; height: 1px; overflow: hidden; opacity: 0; pointer-events: none; contain: strict; }
```

Keep the existing responsive `.footer-meta` column layout at `max-width: 640px`; it will stack the disclosure naturally on narrow screens.

- [ ] **Step 5: Correct the analytics documentation**

Replace the last sentence in `README.md` with:

```markdown
The contact form opens a pre-filled email in the visitor's default email application; its form data is not stored by the site. The live site uses [MapMyVisitors](https://mapmyvisitors.com/) for anonymous traffic analytics such as page views, approximate location, referrer, and device/browser information. It does not identify visitors by name; MapMyVisitors processes analytics requests under its [privacy policy](https://mapmyvisitors.com/b/policy).
```

- [ ] **Step 6: Invalidate the existing static-asset cache**

Change line 1 of `service-worker.js` to:

```javascript
const CACHE = 'tarun-portfolio-v7';
```

This allows the already-installed service worker to activate a new cache and serve the updated `styles.css` to returning visitors.

- [ ] **Step 7: Run the contract and repository checks**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/verify-mapmyvisitors.ps1
git diff --check
```

Expected: `MapMyVisitors integration checks passed.`, zero exit from `git diff --check`, and no whitespace errors.

- [ ] **Step 8: Review and commit the integration**

Run:

```powershell
git diff -- index.html styles.css README.md service-worker.js tests/verify-mapmyvisitors.ps1
git add index.html styles.css README.md service-worker.js tests/verify-mapmyvisitors.ps1
git commit -m "feat: add discreet visitor analytics"
```

Expected: the diff contains one provider embed, one disclosure, the CSS containment rule, accurate README copy, cache version `v7`, and the verification script. The commit completes successfully.

---

### Task 2: Verify runtime behavior and publish

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `service-worker.js`

**Interfaces:**
- Consumes: the committed `.visitor-tracker`, `.analytics-disclosure`, and MapMyVisitors script URL from Task 1.
- Produces: evidence that desktop/mobile layouts are unchanged, first-party interactions work if the analytics request fails, and the verified commits are pushed to `origin/main`.

- [ ] **Step 1: Start a local static server**

Run from the repository root:

```powershell
py -m http.server 8000
```

Expected: the server listens on `http://127.0.0.1:8000/` without modifying tracked files.

- [ ] **Step 2: Verify desktop rendering and tracker loading**

Open `http://127.0.0.1:8000/` at a 1440×900 viewport and confirm:

- No map or tracker control is visible in the bottom-right corner.
- The footer contains the subdued `Anonymous traffic analytics by MapMyVisitors` disclosure.
- The page has no horizontal overflow.
- The browser requests `https://mapmyvisitors.com/map.js?d=y-LSQTqPdEAlU_HX4pVBFWTaMZ8wus8LPiLTGWaBqYY&cl=ffffff&w=a`.
- Navigation, theme toggle, copy-email toast, and contact form remain functional.

- [ ] **Step 3: Verify mobile and blocked-provider behavior**

At a 390×844 viewport, confirm the footer disclosure wraps without overlap or horizontal overflow. Block or disable the `mapmyvisitors.com` request, reload, and confirm the page, navigation, theme toggle, and contact form still work without an uncaught first-party JavaScript error.

- [ ] **Step 4: Run final verification from a clean process**

Stop the server, then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tests/verify-mapmyvisitors.ps1
git diff --check
git status --short --branch
```

Expected: contract checks pass, no whitespace errors appear, and `main` is ahead of `origin/main` only by the design and implementation commits with no uncommitted files.

- [ ] **Step 5: Push and verify synchronization**

Run:

```powershell
git push origin main
git status --short --branch
```

Expected: push succeeds and status reports `## main...origin/main` with no ahead/behind marker and no changed files.

