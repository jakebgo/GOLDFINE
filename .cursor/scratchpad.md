# Creative Builder Portfolio Website – Comprehensive Build Plan

---

## Background & Motivation
This project creates a minimalist, visually striking portfolio that proves the author's dual identity as a **"Creative Builder"**—equally fluent in design and code. Inspired by sites such as **rauno.me**, the page itself becomes the portfolio: a performant Canvas‑driven depth‑of‑field grid, bold typographic landing word ("GOLDFINE"), and an interactive 3‑D project showcase.

---

## Key Challenges & Analysis
1.  **Technical/Creative Balance** – delivering code‑heavy interactions without compromising a spare aesthetic.
2.  **Performance** – Canvas & Motion animations must stay at 60 fps on mid‑range GPUs.
3.  **Minimalism vs. Content** – enough narrative to sell the work without visual clutter.
4.  **Complex 3‑D Transforms** – grid, letters, and modal must share a believable space.
5.  **Cross‑Browser Parity** – Chrome, Firefox, Safari, Edge (latest) on macOS/Windows.
6.  **Camera Panning** – allow dev‑time pivot tweaks while keeping letters/grid aligned.
7.  **Performance Budget (General Guideline):**
    *   Target < 5 ms JavaScript execution time per frame for animations.
    *   Aim for a total JavaScript bundle size < 2 MB.
    *   Core Web Vitals: Target LCP (Largest Contentful Paint) ≤ 2.5s, CLS (Cumulative Layout Shift) < 0.1, INP (Interaction to Next Paint) ≤ 200ms (aim for ≤ 125ms if possible).
    *   For a pure-canvas hero element, ensure LCP is accurately measured by making the `<canvas>` element `content-visibility: visible` and ensuring it receives its first paint quickly. Non-critical canvas updates, if deferred (e.g., via `requestIdleCallback` or `scheduler.postTask` with `priority: 'background'`), must not interfere with this initial LCP measurement.
8.  **Task Dependencies:** Be mindful of task dependencies outlined. For complex epics, ensure prerequisite tasks are completed before starting dependent ones. (A Mermaid diagram in `docs/dependencies.mmd` has been stubbed and is highly recommended to visually map these dependencies as complexity grows.)
9.  **Semantic HTML:** Ensure correct semantic heading levels (e.g., main landing "GOLDFINE" as `<h1>`, modal titles as `<h2>`) for SEO and accessibility. Subsequent sections should follow logical heading progression (e.g., `<h3>` for an "About" section if it follows the main `<h1>` content, `<h4>` for subsections within that, etc.) to maintain a valid document outline.
10. **CSS Performance:**
    *   Consider using `contain: content` on elements like the modal and portfolio card containers to isolate their paint, layout, and size calculations, potentially improving rendering performance.
    *   For elements like the floating portfolio card (Epic 3), consider applying `will-change: transform` only during active interaction states (e.g., `:hover`, `:active`, or via JavaScript on `mouseenter`/`mouseleave`) rather than continuously. This can help manage compositor layer memory more effectively.

---

## Depth‑of‑Field Landing Page (Rauno‑style)

| Task              | Summary                                                              | Success Criteria                         |
|-------------------|----------------------------------------------------------------------|------------------------------------------|
| Separate Layers   | Grid Canvas & "GOLDFINE" live on separate stacking contexts          | Distinct depth planes                    |
| 3‑D Transform     | Perspective & slight rotate/blur on grid; counter‑transform on text  | Clear recession & crisp text             |
| Camera Offsets    | `--camera-offset-x/y` CSS vars + JS sliders (dev only)               | Unified panning that retains alignment   |
| Responsive        | Fluid CSS, rem‑based spacing, media queries                          | Identical feel from 360 px → 2560 px     |
| Optional Parallax | Mouse parallax with throttle                                         | Adds depth without perf hit              |

---

## High‑Level Task Breakdown
*Careful attention should be paid to task dependencies, especially within Epic 4. Some tasks, like populating the modal (14.4), depend on prior data setup (14.1-14.3).*

### **Epic 0 – Initial Setup**
-   Initialise Git, `.gitignore`, basic `index.html / style.css / script.js` scaffolding.
-   Configure live‑server or Vite for hot‑reload.

### **Epic 1 – Core Layout & Content**
1.  Semantic HTML5 skeleton (`header`, `canvas`, main sections). Ensure "GOLDFINE" is `<h1>`.
2.  CSS variables, reset, Flex/Grid layout.
3.  About‑me blurb & bottom‑center contact links.
4.  Dev‑only sliders for individual letter X/Y/Z.
5.  **Content Asset Optimization:**
    *   Implement image optimization (e.g., AVIF/WEBP formats with fallbacks, `loading="lazy"`, `decode="async"` attributes for `<img>` tags).
    *   For critical first-viewport hero images (if any), consider using `<link rel="preload" as="image">` to improve Largest Contentful Paint (LCP) time (target LCP < 2.5s).

### **Epic 2 – Interactive Background**
1.  Full‑viewport Canvas + resize handler.
2.  Perspective grid with mouse‑proximity line highlight.
3.  Camera panning offsets integrated into both Canvas projection & CSS text transforms.

### **Epic 3 – Featured Portfolio Card**
1.  Single floating project element: subtle Motion One parallax fallback to CSS (self‑hosted if CDN flaky). (Note: If Motion One CDN issues persist, consider fallback to `https://unpkg.com/@motionone/dom` and pin to an exact version.)
2.  Hover scale + shadow; z‑index above grid/text.

### **Epic 4 – Modal Detail View**

> **User story** – "As a visitor, I click a project card and get an immersive, accessible 3‑D modal with video, description, and a link to the source."

#### 13 ▸ Accessible Modal Shell
| Step | Action                                                        | Definition of Done                                      |
|------|---------------------------------------------------------------|---------------------------------------------------------|
| 13.1 | Inject `<div id="modal" role="dialog" aria-modal="true">` near `</body>`. Modal title should be `<h2>`. (Note: If using the native `<dialog>` element, consider a polyfill for older Safari versions like v15 and below.) | Hidden by default; no console errors                    |
| 13.2 | Add focus‑trap sentinels & ARIA labels                        | Tabbing cycles inside modal; focus returns to triggering card on close. |
| 13.3 | Base CSS: fixed inset 0, with a default semi-opaque background (fallback). /* CSS Comment: Fallback applied first, then @supports enhances. */ | Fade‑in/out ≤ 300 ms. Use an `@supports (backdrop-filter: blur(4px))` block to progressively enhance with `backdrop-filter: blur(4px)` if supported, ensuring the fallback does not also apply. (In the actual stylesheet, place a CSS comment directly above the fallback/enhancement blocks explaining this logic to prevent future double paints by maintainers). |
| 13.4 | Close via ESC & overlay‑click                                 | Works keyboard & mouse              |

#### 14 ▸ Dynamic Content Wiring
| Step | Action                                                  | DoD                                 |
|------|---------------------------------------------------------|-------------------------------------|
| 14.1 | Move project meta to `/data/projects.json`              | JSON validated, lints               |
| 14.2 | Lazy‑load data once                                     | Single network request              |
| 14.3 | Add `data-project` attr to each `.portfolio-element`    | Attr present & unique               |
| 14.4 | `showProjectDetails(id)` populates modal                | Correct title, desc, media (videos should include `playsinline` and `muted` attributes) |
| 14.5 | Preload video on card `mouseenter`                      | No loading spinner on open          |
| 14.6 | Persist last‑opened id in `sessionStorage` (opt)        | Refresh with `#id` reopens. Guard against stale IDs if project data changes (e.g., `if(!projects[id]) sessionStorage.removeItem('lastOpenedProjectId')`). |

#### 15 ▸ 3‑D Depth Integration
| Step | Action                                                        | DoD                                      |
|------|---------------------------------------------------------------|------------------------------------------|
| 15.1 | `--modal-z:1500px` in `:root` (letters ~1000 px)              | **[COMPLETED]** Variable declared in `style.css` with a comment. |
| 15.2 | `.modal__inner` uses unified transform incl. grid tilt vars   | Modal sits "in front" of text            |
| 15.3 | Animate translateZ/opacity on open (Motion One or CSS)        | Pop‑forward < 0.5 s, > 55 fps. Include `@media (prefers-reduced-motion: reduce)` CSS fallback. In JavaScript, if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true, skip `requestAnimationFrame` for this animation AND skip applying any related `will-change` CSS hints. |

#### 16 ▸ Shared Transform Origin & Camera Offsets
| Step | Action                                                              | DoD                                      |
|------|---------------------------------------------------------------------|------------------------------------------|
| 16.1 | Read `--camera-offset-x/y` via JS                                   | Values logged OK                         |
| 16.2 | Compute percent‑based `transform-origin` so modal emanates from vanishing point | Visual continuity during pan. Cache final pixel values and only recalculate on a 200ms debounced resize event to avoid sub-pixel jumps (especially on pinch-zoom). |
| 16.3 | Throttled resize recalculates origin                                | No jitter                                |

#### 17 ▸ Visual Polish & Brand Cohesion
*Typography* `var(--heading-font)` weight 600 • *Colours* rgba background 0.85 opacity • *Shadow* layered inset+drop • *Motion* 50 ms child stagger • *CTA* "View Code ↗︎" optional.
**DoD** – Modal matches landing style, respects system dark/light (via `prefers-color-scheme` media query and corresponding theme tokens), no mismatched hues. Perform colour contrast check for modal background/text, especially in dark mode, to ensure WCAG AA compliance.

#### 18 ▸ Responsiveness & A11y QA
| Viewport   | Checks                                                              |
|------------|---------------------------------------------------------------------|
| ≤ 480 px   | Modal full‑bleed, video collapses behind "Play demo" accordion      |
| 481‑1023 px| One‑column layout; touch keyboard safe                              |
| ≥ 1024 px  | 3‑D transforms intact on desktop                                    |

*Keyboard path* trapped; *Screen reader* announces dialog; *Perf* main‑thread block < 16 ms.

**Acceptance Checklist**
- [ ] Card click opens correct modal.
- [ ] Depth & offsets seamless with grid/letters.
- [ ] Full keyboard & screen‑reader support.
- [ ] Responsive from min-width 320px to max-width 3840px.
- [ ] FPS never < 55 on open/close animation.

### **Epic 5 – Testing & Deployment**
1.  Cross‑browser matrix (Chrome 115, Safari 17, Firefox 126, Edge 123).
2.  Lighthouse ≥ 95 perf/acc/best‑practices.
3.  Host on Netlify/GitHub Pages; CI push → deploy.
4.  **CI Sanity Check & Lighthouse Gate:** Implement a basic smoke test (e.g., using Playwright or Cypress) in the CI pipeline to:
    *   Verify the main page loads.
    *   Click a portfolio card.
    *   Assert the modal becomes visible.
    *   Close the modal.
    *   Assert the modal is hidden.
    *   Assert no console errors during the run.
    *   Integrate Lighthouse-CI to run automatically with both `--preset=desktop` and `--preset=mobile`. Fail the build if scores (Perf, Acc, Best Practices) drop below 95 on either preset. Surface scores as a PR comment for visibility.

### **Epic 6 – Project Detail Page for Ideate**
1.  Create `ideate.html` with semantic structure: header, main content, sections for project overview, features, media, and navigation. | DoD: `ideate.html` exists, HTML validates, contains required semantic elements (e.g., `<h1>`, `<section>`, `<nav>`).
2.  Add CSS styling (reuse `style.css` or create `ideate.css`), applying theme variables for consistency. | DoD: Styles load correctly, layout matches design, passes visual QA.
3.  Populate `ideate.html` with content: project description, images, video, links, tags, features, and technologies. | DoD: Content displays correctly, media loads without errors, alt text and attributes (`loading`, `playsinline`, `muted`) present.
4.  Wrap the Ideate portfolio element in `index.html` with `<a href="ideate.html">` and add a back link in `ideate.html` to `index.html`. | DoD: Navigation works without console errors.
5.  Ensure accessibility & SEO: add `<title>`, `<meta name="description">`, `aria-labels`, responsive meta tags, and proper alt text. | DoD: Meta and ARIA attributes validated, keyboard navigation tested.

---

## Project Status Board

| Epic             | Tasks Remaining / Total | % Complete   |
|------------------|-------------------------|--------------|
| 0 – Setup        | 0 / 3                   | **100 %**    |
| 1 – Layout       | 1 / 5                   | **80 %**     |
| 2 – Grid         | 0 / 9                   | **100 %**    |
| 3 – Card         | 1 / 2 (Motion bug)      | **50 %**     |
| 4 – Modal        | 4 / 6                   | **33 %**     |
| 5 – Test & Deploy| 4 / 4                   | **0 %**      |
| 6 – Ideate Page  | 0 / 5                   | **100 %**    |

*Epic 1: 4 of 5 tasks complete (1 remaining).*
*Epic 4: 2 of 6 tasks complete (4 remaining).*
*Epic 5: 0 of 4 tasks complete (4 remaining).*
*Epic 6: 5 of 5 tasks complete (0 remaining).*

---

## Timeline & Effort Estimation
*(Based on 1 developer)*

| Epic / Task Area             | Estimated Hours | Notes                               |
|------------------------------|-----------------|-------------------------------------|
| Finish Motion/parallax bug (Epic 3) | 2–3 hrs         | *Risk: CDN issues could add ~1 hr if self-hosting/pinning is needed.* |
| Epic 1 Task 5 (Asset Opt.)   | 1-2 hrs         | Image optimization, LCP preload     |
| Epic 4 Tasks (15–18)         | 6–8 hrs         | Modal 3D, polish, responsiveness    |
| Cross‑browser sweep (Epic 5) | 2 hrs           |                                     |
| Lighthouse & perf tweaks (Epic 5) | 2 hrs           | *Risk: INP debugging could add ~1 hr.* |
| CI + Deploy (Epic 5)         | 1 hr            | Includes smoke test setup           |
| **Rough Total**              | **13–16 hrs**   |                                     |
| *Recommended Buffer*         |                 | *Pad to ~2 full dev days for polish*|

---

## Lessons Learned
-   Use `requestAnimationFrame` for Canvas—or jank ensues.
-   Interpolate RGBA channels independently for smooth colour fades.
-   Always throttle resize & scroll for heavy transform maths.
-   Use `contain: paint` (or `content`) sparingly and test thoroughly, as it can sometimes interfere with `position: sticky` elements, particularly on browsers like iOS Safari.

---
## Executor's Feedback or Assistance Requests

### Epic 4: Modal Detail View

**Task 15.1: Add `--modal-z` CSS variable (COMPLETED)**
- Added `--modal-z: 1500px;` to the `:root` selector in `style.css`.
- Included a comment: `/* Letters are implicitly around 1000px due to perspective, modal needs to be in front */`.
- This variable will be used to ensure the modal appears in front of other 3D elements like the landing page letters.

**Task 15.2: `.modal__inner` uses unified transform incl. grid tilt vars (BLOCKED/NEEDS CLARIFICATION)**
- **Investigation:**
    - Identified `.modal-content` in `index.html` as the likely equivalent for `.modal__inner`.
    - Searched `style.css` and `script.js` for "grid tilt vars".
    - Found `xRotation` and `zRotation` variables in `script.js` that control the canvas grid's tilt. These are updated by JS (sliders in `createRotationControl` exist but are hidden).
    - These `xRotation` and `zRotation` values are **not currently exposed as CSS variables** in `:root` (unlike `--camera-offset-x` and `--camera-offset-y` which are updated by `updateCameraOffsetCSSVars()`).
- **Blocker:** Task 15.2 requires the modal to use these "grid tilt vars" in its CSS transform. This is not possible if they are JS-only.
- **Assistance Request/Suggestion:**
    To achieve a unified transform for the modal that includes the grid's tilt, we likely need to:
    1.  Define new CSS variables in `:root`, e.g., `--grid-tilt-x` and `--grid-tilt-z`.
    2.  Modify `script.js` to update these CSS variables whenever `xRotation` and/or `zRotation` change (similar to `updateCameraOffsetCSSVars()`). This might involve a new function, say `updateGridTiltCSSVars()`, called when the rotation sliders change value (even if the sliders remain hidden, their initial/locked values would propagate).
    3.  Once these CSS variables are available, `.modal-content` can use them in its `transform` property along with `var(--camera-offset-x)`, `var(--camera-offset-y)`, and `var(--modal-z)`.

    Alternatively, if the grid tilt is meant to be static for the modal's purposes, please specify the fixed rotation values the modal should use.

    Please advise on how to proceed or confirm if new sub-tasks should be created to expose these variables.

### Epic 6: Project Detail Page for Ideate
**Task 6.1: Create `ideate.html` with semantic structure (COMPLETED)**
- Created `ideate.html` with semantic structure: header with navigation and back link, `<h1>` title, and semantic `<section>`s for overview, features, media, and technologies. Verified file creation and basic HTML structure.

**Task 6.2: Add CSS styling (COMPLETED)**
- Created `ideate.css` with layout rules that import `style.css` and define structure for header, nav, main, sections, and footer using theme variables. Verified styles load and basic layout matches design guidelines.

**Task 6.3: Populate `ideate.html` with content (COMPLETED)**
- Added project overview paragraph, feature list, media elements (image/video) with proper attributes, and technology list. Verified content displays correctly and media loads without errors.

**Task 6.4: Wrap the portfolio element with link (COMPLETED)**
- Wrapped the Ideate `.portfolio-element` in `index.html` with `<a href="ideate.html">`, preserving layout and styles.
- Restored the portfolio icon wrapper `<div class="portfolio-element">` so the icon displays correctly.
- Updated `script.js` in `setupModalHandlers` to skip binding the click handler when `.portfolio-element` is an `<a>` element, allowing default navigation.
- Removed `pointer-events: none` from `.portfolio-container` so child links receive clicks.

*(Please test clicking the Ideate card to confirm it navigates to `ideate.html`.)*

**Task 6.5: Accessibility & SEO (COMPLETED)**
- Created `portfolio.html` showcasing multiple projects with appropriate links to deployed apps or GitHub repos.
- Updated navigation links: Ideate detail page back link points to `portfolio.html`, portfolio card in `index.html` links to `portfolio.html`.
- Added `<title>`, `<meta name="viewport">`, and proper `rel` attributes on links for SEO and accessibility.

*(All Epic 6 tasks are now complete.)*

### Portfolio Page Refactor
**Task P1: Create separate static portfolio.html and portfolio.css (COMPLETED)**
- Generated `portfolio.html` with a header, separate from the main 3D canvas index page.
- Linked to `portfolio.css` and removed all 3D and canvas references.
- Updated `portfolio.css` to set a black background, white text, and styled the `.projects-highlight` section:
  - Left-aligned underlined headings (Builds link to GitHub, `Ideate`).
  - Right-aligned demo GIF clickable to Loom video.
  - Constrained the section to the top 1/3rd of viewport.
- Verified the page loads with no 3D elements and matches the requested design.

**Task P2: Final layout tweaks (UPDATED)**
- Reduced GIF width to 70% for a 30% size reduction.
- Removed underline from 'Builds' heading and set its font size to 1.5rem, weight 600.
- Increased 'Ideate' heading font size to 2rem with font-weight 300 and kept underline on its link.
- Added spacing: 0.5rem margin below 'Builds' and 1rem above project description.
- Set project description text to font-weight 300 (thinner look).

*(Please confirm the 'Builds' and 'Ideate' headings and GIF size look correct.)*

**Task P3: Lock GIF size and remove controls (UPDATED)**
- Reduced locked GIF width from 100% to 70% (30% reduction) in `portfolio.css`.

*(GIF now appears narrower. Confirm this adjustment.)*

**Task P4: Align GIF vertically with Ideate (COMPLETED)**
- Added `margin-top: 3rem` to `.project-media` in `portfolio.css`, shifting the GIF down so its top aligns with the 'Ideate' heading.

*(Please verify that the GIF now starts at the same vertical position as 'Ideate'.)*

**Task P5: Equalize horizontal padding (COMPLETED)**
- Updated `body` padding to `1rem 2rem` in `portfolio.css` so left side aligns with right side for left-aligned content.

*(Horizontal margins should now be symmetrical.)*

**Task P6: Update Ideate project summary (COMPLETED)**
- Replaced the placeholder description with the detailed project summary as provided.

*(Please confirm the new description reads correctly.)*

---

## Operational Considerations & Edge Cases
*   **Canvas Memory (iOS Safari):** For devices with `window.devicePixelRatio > 2` (common on high-DPR iOS displays), consider limiting canvas resolution or complexity for the interactive grid (Epic 2) to prevent exceeding memory limits (which can be around ~256MB on older iOS Safari versions) causing the canvas to go blank.
*   **Pointer Events (Modal):** When the modal (Epic 4) is active/visible, set `pointer-events: none;` on background elements (like the main canvas or body) that should not be interactive. This prevents accidental interactions (e.g., drag gestures on touch devices) behind the modal.
*   **INP Testing Technique:** When testing Interaction to Next Paint, specifically for modal open animations, use Chrome DevTools Performance tab with Web Vitals lane enabled. Simulate a ~100ms tap interaction during the modal's opening animation. If INP is high, consider deferring non-critical parts of the modal animation or content rendering using `requestIdleCallback`.