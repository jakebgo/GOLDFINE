# Test info

- Name: Accessibility Tests >> Understandable - Input Assistance
- Location: /Users/jacobgoldfine/Documents/portfolio-v2/tests/accessibility.spec.js:145:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: null
    at /Users/jacobgoldfine/Documents/portfolio-v2/tests/accessibility.spec.js:151:21
```

# Page snapshot

```yaml
- banner:
  - heading "J A C O B" [level=1]
- main:
  - region "Portfolio Projects":
    - button "View Featured Project":
      - heading "Featured Project" [level=2]
      - text: Click to view details Web Design Development Interactive
- contentinfo:
  - link "Email":
    - /url: mailto:contact@example.com
  - link "GitHub":
    - /url: https://github.com/yourusername
  - link "LinkedIn":
    - /url: https://linkedin.com/in/yourusername
  - link "Twitter":
    - /url: https://twitter.com/yourusername
```

# Test source

```ts
   51 |     await page.evaluate(() => {
   52 |       document.body.style.fontSize = '200%';
   53 |     });
   54 |     const newFontSize = await body.evaluate(el => window.getComputedStyle(el).fontSize);
   55 |     expect(newFontSize).toBe('32px'); // Assuming base font size is 16px
   56 |   });
   57 |
   58 |   test('Perceivable - Distinguishable Content', async ({ page }) => {
   59 |     // Check color contrast
   60 |     const textElements = await page.$$('p, h1, h2, h3, span, a');
   61 |     for (const element of textElements) {
   62 |       const color = await element.evaluate(el => window.getComputedStyle(el).color);
   63 |       const bgColor = await element.evaluate(el => window.getComputedStyle(el).backgroundColor);
   64 |       // Note: This is a basic check. For production, use a proper color contrast checking library
   65 |       expect(color).not.toBe('rgba(0, 0, 0, 0)');
   66 |       expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
   67 |     }
   68 |   });
   69 |
   70 |   test('Operable - Keyboard Accessible', async ({ page }) => {
   71 |     // Check tab navigation
   72 |     await page.keyboard.press('Tab');
   73 |     const portfolioElement = await page.$('.portfolio-element');
   74 |     expect(await portfolioElement.evaluate(el => document.activeElement === el)).toBeTruthy();
   75 |     
   76 |     // Check modal keyboard interaction
   77 |     await portfolioElement.click();
   78 |     await page.keyboard.press('Tab');
   79 |     const closeButton = await page.$('.modal-close');
   80 |     expect(await closeButton.evaluate(el => document.activeElement === el)).toBeTruthy();
   81 |     
   82 |     // Check ESC key closes modal
   83 |     await page.keyboard.press('Escape');
   84 |     const modal = await page.$('.modal-overlay');
   85 |     expect(await modal.evaluate(el => window.getComputedStyle(el).display)).toBe('none');
   86 |   });
   87 |
   88 |   test('Operable - Enough Time', async ({ page }) => {
   89 |     // Check animations respect reduced motion
   90 |     const reducedMotion = await page.evaluate(() => {
   91 |       return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   92 |     });
   93 |     
   94 |     if (reducedMotion) {
   95 |       const modal = await page.$('.modal-overlay');
   96 |       const transition = await modal.evaluate(el => window.getComputedStyle(el).transition);
   97 |       expect(transition).toBe('none');
   98 |     }
   99 |   });
  100 |
  101 |   test('Operable - Seizures and Physical Reactions', async ({ page }) => {
  102 |     // Check no flashing content
  103 |     const animations = await page.$$('*[style*="animation"]');
  104 |     for (const element of animations) {
  105 |       const animationDuration = await element.evaluate(el => 
  106 |         window.getComputedStyle(el).animationDuration
  107 |       );
  108 |       const duration = parseFloat(animationDuration);
  109 |       expect(duration).toBeGreaterThan(0.5); // No rapid animations
  110 |     }
  111 |   });
  112 |
  113 |   test('Operable - Navigable', async ({ page }) => {
  114 |     // Check focus order
  115 |     await page.keyboard.press('Tab');
  116 |     const portfolioElement = await page.$('.portfolio-element');
  117 |     expect(await portfolioElement.evaluate(el => document.activeElement === el)).toBeTruthy();
  118 |     
  119 |     // Check focus trap in modal
  120 |     await portfolioElement.click();
  121 |     const modal = await page.$('.modal-overlay');
  122 |     expect(await modal.evaluate(el => el.getAttribute('aria-modal'))).toBe('true');
  123 |   });
  124 |
  125 |   test('Understandable - Readable', async ({ page }) => {
  126 |     // Check language attribute
  127 |     const html = await page.$('html');
  128 |     const lang = await html.getAttribute('lang');
  129 |     expect(lang).toBeTruthy();
  130 |   });
  131 |
  132 |   test('Understandable - Predictable', async ({ page }) => {
  133 |     // Check consistent navigation
  134 |     const navElements = await page.$$('nav, [role="navigation"]');
  135 |     expect(navElements.length).toBeGreaterThan(0);
  136 |     
  137 |     // Check consistent identification
  138 |     const similarComponents = await page.$$('.portfolio-element, .tag');
  139 |     for (const component of similarComponents) {
  140 |       const role = await component.getAttribute('role');
  141 |       expect(role).toBeTruthy();
  142 |     }
  143 |   });
  144 |
  145 |   test('Understandable - Input Assistance', async ({ page }) => {
  146 |     // Check form labels and error messages
  147 |     const formElements = await page.$$('input, select, textarea');
  148 |     for (const element of formElements) {
  149 |       const id = await element.getAttribute('id');
  150 |       const label = await page.$(`label[for="${id}"]`);
> 151 |       expect(label).toBeTruthy();
      |                     ^ Error: expect(received).toBeTruthy()
  152 |     }
  153 |   });
  154 |
  155 |   test('Robust - Compatible', async ({ page }) => {
  156 |     // Check ARIA attributes
  157 |     const modal = await page.$('.modal-overlay');
  158 |     expect(await modal.evaluate(el => el.getAttribute('role'))).toBe('dialog');
  159 |     expect(await modal.evaluate(el => el.getAttribute('aria-modal'))).toBe('true');
  160 |     
  161 |     // Check semantic HTML
  162 |     const semanticElements = await page.$$('header, main, footer, section, article');
  163 |     expect(semanticElements.length).toBeGreaterThan(0);
  164 |   });
  165 | }); 
```