# Creative Builder Portfolio Website Project Plan

## Background and Motivation
This project aims to create a minimalist, visually striking portfolio website that effectively demonstrates the combination of creative vision and technical execution. The goal is to establish a personal brand as a "Creative Builder" - someone who balances technical and creative skills. The website itself will serve as the primary demonstration of this duality, showcasing technical skill through interactive elements while maintaining a strong aesthetic derived from minimalist principles, inspired by sites like rauno.me.

## Key Challenges and Analysis
1. **Technical-Creative Balance**: The core challenge is creating a website that effectively demonstrates both technical proficiency and creative design sensibilities. This requires careful implementation of interactive elements that are both visually appealing and technically impressive.

2. **Performance**: The interactive elements, particularly the Canvas-based background, must maintain high performance (60+ fps) to create a smooth user experience.

3. **Minimalist Design vs Functionality**: Balancing the minimalist aesthetic with sufficient functionality and content to effectively communicate the portfolio information.

4. **Technical Implementation**: Implementing the interactive background with Canvas API and the floating portfolio element with Motion One library requires careful planning and execution.

5. **Browser Compatibility**: Ensuring the website functions correctly across major desktop browsers (Chrome, Firefox, Safari, Edge) while maintaining performance.

6. **Camera Panning**: adjusting the view pivot to center letters and grid simultaneously while preserving their relative transforms

## Depth of Field Landing Page Effect (Rauno.me Style)

### Background and Motivation
Create a visually striking landing page where the grid and the main text ("GOLDFINE") appear to exist in a 3D space, with a sense of depth and separation, inspired by rauno.me.

### Key Challenges and Analysis
- Layer separation for independent manipulation
- Subtle 3D transforms and/or blur for the grid
- Text remains crisp and visually "in front"
- Responsive and performant
- Camera Panning Complexity: aligning coordinate spaces between canvas projection and CSS-transformed text; ensuring group translation does not override individual letter transforms; preserving performance and responsiveness

### High-level Task Breakdown
1. Ensure grid (canvas) and text are on separate DOM layers (z-index)
2. Apply CSS 3D transform (perspective, rotateX/Y, translate) and optional blur to the grid canvas
3. Keep text sharp, apply text-shadow and optional opposing transform
4. Fine-tune grid opacity, blur, and color for visual recession
5. Fine-tune text color and shadow for legibility and pop
6. Test responsiveness and visual effect on all viewport sizes
7. (Optional) Add mouse parallax for extra depth
8. Declare and initialize `let cameraOffsetX = 0`, `cameraOffsetY = 0` in `script.js` to represent the view pivot.
9. Abstract out projection center in the `project` helper: compute `centerX = (windowWidth * 0.83) + cameraOffsetX`, `centerY = (windowHeight * 0.25) + cameraOffsetY`.
10. Expose CSS variables `--camera-offset-x`, `--camera-offset-y` on `:root` in `style.css`, default to `0px`.
11. Update `.landing-title` transform in `style.css` to prepend `translate3d(var(--camera-offset-x), var(--camera-offset-y), 0)` before existing perspective and rotation transforms.
12. In `script.js`, after any cameraOffset change (e.g. window resize or UI input), call `document.documentElement.style.setProperty('--camera-offset-x', `${cameraOffsetX}px`)` and similarly for Y.
13. Add two range slider UI controls labeled "Pan X" and "Pan Y" in the existing control panel, bound to `cameraOffsetX` and `cameraOffsetY`, with reasonable ranges (e.g. ±50% of viewport) and live-update logic.
14. Compute initial offsets automatically: measure `.landing-title` bounding box and center it within the viewport by setting `cameraOffsetX` and `cameraOffsetY` accordingly.
15. Test default centering and verify that dragging the sliders pans grid and text together, maintaining relative letter positions.

### Success Criteria
- Grid and text appear on different planes, with clear depth
- Grid is visually behind, possibly blurred/faded
- Text is crisp, sharp, and visually in front
- Effect is visually similar to the reference screenshot and works responsively
- Default view centers the group of letters over the grid; panning sliders shift both grid and letters uniformly without breaking relative transforms

## High-level Task Breakdown

### Epic 0: Initial Project Set Up and Structure
1. **Create Project Directory and Initialize Git Repository**
   - Create new directory named `creative-builder-portfolio`
   - Initialize Git repository using `git init`
   - Create .gitignore file with the following entries:
     ```
     # Dependencies
     /node_modules

     # Logs
     *.log
     npm-debug.log*
     yarn-debug.log*
     yarn-error.log*
     lerna-debug.log*

     # Editor directories and files
     .vscode
     .idea
     *.swp
     *.swo

     # OS generated files
     .DS_Store
     Thumbs.db
     ```
   - Make initial commit: `git add . && git commit -m "feat: Initial project setup and boilerplate"`
   - *Success Criteria*: Repository initialized with basic structure and .gitignore properly configured

2. **Set Up Basic File Structure**
   - Create `index.html` with HTML5 boilerplate, including:
     - Proper doctype, charset (UTF-8), viewport meta tag
     - Title tag with "GOLDFINE | Creative Builder" or similar
     - Links to CSS with proper rel attributes
     - Script tag for JavaScript with defer attribute
   - Create `style.css` with CSS reset/normalize and CSS Variables for consistent styling (colors, fonts, spacing)
   - Create `script.js` with initialization code and console log to verify loading
   - Create directory structure:
     ```
     /creative-builder-portfolio
     ├── index.html
     ├── style.css
     ├── script.js
     ├── /assets
     │   ├── /images
     │   ├── /fonts
     │   └── /videos
     └── .gitignore
     ```
   - *Success Criteria*: Files created with appropriate starter content and proper linking, following the structure defined in architecture.md

3. **Set Up Local Development Environment**
   - Install live-server globally: `npm install -g live-server`
   - Start server in project directory: `live-server`
   - Verify setup by loading page locally and checking console for JavaScript loading message
   - Test that CSS is correctly applied by adding a simple style rule
   - *Success Criteria*: Website loads locally with no errors in console, CSS applies correctly

### Epic 1: Core Layout & Content
4. **Implement Core HTML Layout**
   - Add semantic HTML5 elements for main sections:
     - `<header>` for the landing section with "GOLDFINE" text
     - `<canvas>` element for the interactive background with appropriate id/class
     - `<section>` or `<div>` for the portfolio element container
     - `<div>` for the project detail modal (initially hidden)
     - `<section>` for the "About Me" content
     - `<footer>` or `<nav>` for contact links and navigation
   - Create containers for interactive elements with appropriate id/class attributes
   - Use clear, semantic class naming (following kebab-case per architecture.md)
   - *Success Criteria*: HTML structure matches the architectural design with semantic elements and proper container hierarchy

5. **Apply Basic CSS Styling and Typography**
   - Implement CSS variables for consistent styling:
     ```css
     :root {
       /* Colors */
       --primary-color: #...;
       --secondary-color: #...;
       --background-color: #...;
       --text-color: #...;
       
       /* Typography */
       --heading-font: '...', sans-serif;
       --body-font: '...', sans-serif;
       
       /* Spacing */
       --spacing-sm: ...px;
       --spacing-md: ...px;
       --spacing-lg: ...px;
     }
     ```
   - Set up typography for the main "GOLDFINE" text (large, bold, visually striking)
   - Apply base styles using Flexbox/Grid for layout
   - Position elements according to design (navigation/contact fixed to bottom-center per architecture.md)
   - Style the main content sections for proper visual hierarchy
   - *Success Criteria*: Page displays with proper layout and typography, matching minimalist aesthetic

6. **Add "About Me" and Contact Content**
   - Add brief "About Me" summary text conveying the "creative builder" brand identity
   - Add contact links:
     - Email link using `mailto:` protocol
     - X/Twitter link using direct URL
   - Style content appropriately using the CSS variables defined in task 5
   - Position the navigation/contact fixed to the bottom-center of the viewport per architecture.md
   - *Success Criteria*: About section and contact links are visible, properly styled, and functional (links work when clicked)

7. **Add interactive sliders for each letter (J, A, C, O, B) to control their X, Y, and Z positions in real time**

### Epic 2: Interactive Background Implementation
8. **Canvas Setup and Basic Grid Drawing**
   - Set up canvas element to fill viewport with appropriate sizing
   - Get 2D rendering context in JavaScript:
     ```javascript
     const canvas = document.getElementById('background-canvas');
     const ctx = canvas.getContext('2d');
     ```
   - Implement window resize handler to maintain full viewport canvas
   - Create function to draw a basic perspective grid (per architecture.md: lines changing color on mouse hover/proximity)
   - Set up initial grid parameters (number of lines, spacing, etc.)
   - Implement clear canvas and grid drawing functionality
   - *Success Criteria*: Static grid displays properly on canvas at all viewport sizes, and the drawing approach follows clear function patterns per coding standards (Airbnb JavaScript Style Guide)

9. **Implement Mouse Interaction for Canvas**
   - Add mouse event listeners for tracking position:
     ```javascript
     document.addEventListener('mousemove', handleMouseMove);
     ```
   - Create mouse position tracking with proper coordinate mapping to canvas
   - Update grid drawing based on mouse position (lines should change color on proximity)
   - Implement color transition effect (lines change color on hover/proximity and fade back)
   - Use requestAnimationFrame for smooth rendering:
     ```javascript
     function animate() {
       // Clear canvas and redraw grid with current mouse position
       requestAnimationFrame(animate);
     }
     ```
   - Ensure performance optimization for smooth 60+ fps animation
   - *Success Criteria*: Grid reacts smoothly to mouse movement with color change effects, maintaining 60+ fps, and following the specific interaction pattern described in architecture.md

10. **Implement 3D Perspective Grid (matching screenshot)**
    - Updated the grid rendering logic in script.js to use a perspective projection, matching the vanishing point and receding lines seen in the provided screenshot.
    - The grid now appears to recede into the distance, with lines converging toward a vanishing point near the top center of the canvas, closely matching the reference image.
    - All highlight and dot effects remain functional and are now projected in perspective.
    - Please visually verify the effect in the browser and provide feedback. If further adjustments to the angle, vanishing point, or density are needed, let me know before marking this task complete.

### Epic 3: Featured Portfolio Element
11. **Create and Style Portfolio Element**
    - Create HTML element for the featured project with appropriate markup
    - Style element with CSS for visual appeal:
      - Use subtle box-shadow for depth
      - Apply appropriate sizing and positioning
      - Create visually distinct appearance using CSS variables
    - Add hover effects using CSS transitions:
      ```css
      .portfolio-element {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .portfolio-element:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }
      ```
    - Ensure element is properly positioned in the layout
    - *Success Criteria*: Portfolio element displays with proper styling and hover effects, following the minimalist aesthetic while being visually distinct

12. **Implement Floating Movement Effect**
    - Add Motion One library to the project:
      ```html
      <script src="https://cdn.jsdelivr.net/npm/motion@10.16.2/dist/motion.min.js"></script>
      ```
    - Implement subtle floating/parallax effect based on mouse position:
      ```javascript
      // Example pseudocode using Motion One
      const portfolioElement = document.querySelector('.portfolio-element');
      document.addEventListener('mousemove', (e) => {
        // Calculate movement based on mouse position
        // Apply movement using Motion One
      });
      ```
    - Limit movement range to keep effect subtle
    - Ensure effect is performant by optimizing calculations and minimizing repaints
    - Add damping/smoothing to movement for natural feel
    - *Success Criteria*: Portfolio element moves smoothly in response to mouse position with subtle, natural-feeling parallax effect, maintaining performance standards

### Epic 4: Project Detail Display
13. **Implement Project Detail Modal**
    - Create HTML structure for modal overlay:
      ```html
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close">×</button>
          <h2 class="project-title"></h2>
          <div class="project-description"></div>
          <img class="project-thumbnail" src="" alt="">
          <video class="project-video" controls></video>
        </div>
      </div>
      ```
    - Style modal with CSS:
      - Full-screen overlay with semi-transparent background
      - Centered content box with appropriate padding/margins
      - Styling for title, description, media elements
      - Animation for appearing/disappearing
    - Add close button and style appropriately
    - Initially hide modal using `display: none`
    - *Success Criteria*: Modal structure exists with proper styling, is hidden by default, and includes all necessary elements for project content (title, description, thumbnail, video) as specified in architecture.md

14. **Connect Portfolio Element to Modal**
    - Add click event listener to portfolio element:
      ```javascript
      document.querySelector('.portfolio-element').addEventListener('click', showProjectDetails);
      ```
    - Create function to populate modal with project details from hardcoded data:
      ```javascript
      const projectData = {
        "title": "Project Title",
        "description": "Project description text goes here...",
        "thumbnailUrl": "assets/images/project-thumbnail.jpg",
        "videoUrl": "assets/videos/project-video.mp4"
      };
      ```
    - Implement show/hide functionality for modal
    - Add event listeners for closing modal (close button, background click, ESC key)
    - Ensure smooth transitions for showing/hiding
    - *Success Criteria*: Clicking portfolio element shows modal with complete project details, and modal can be closed via multiple methods (button, background click, ESC key)

### Epic 5: Testing and Deployment
15. **Cross-browser Testing**
    - Test in Chrome, Firefox, Safari, and Edge (latest versions)
    - Verify all functionality works correctly in each browser:
      - Canvas background renders properly
      - Interactive elements respond as expected
      - Modal shows/hides correctly
      - Styles apply consistently
    - Document and fix any browser-specific issues
    - *Success Criteria*: Website functions correctly with consistent user experience in all specified browsers

16. **Performance Optimization**
    - Audit performance using browser developer tools:
      - Canvas rendering performance (fps)
      - Animation smoothness
      - General page performance
    - Optimize Canvas rendering if needed (reduce complexity, use requestAnimationFrame efficiently)
    - Optimize JavaScript event handlers (debounce/throttle if necessary)
    - Ensure CSS transitions/animations are hardware-accelerated where possible
    - *Success Criteria*: Interactive elements maintain 60+ fps in all target browsers, no visible performance issues

17. **Deployment**
    - Select static hosting platform (GitHub Pages, Vercel, or Netlify)
    - Set up account/project on chosen platform
    - Configure deployment settings (build commands if needed)
    - Connect Git repository if using Git-based deployment
    - Deploy website to production URL
    - Verify all functionality works in production environment
    - *Success Criteria*: Website is accessible online at the chosen URL with all functionality working correctly

## Project Status Board

### Epic 0: Initial Project Set Up and Structure
- [x] Create Project Directory and Initialize Git Repository
- [x] Set Up Basic File Structure
- [x] Set Up Local Development Environment

### Epic 1: Core Layout & Content
- [x] Implement Core HTML Layout
- [x] Apply Basic CSS Styling and Typography
- [x] Add "About Me" and Contact Content
- [x] Add interactive sliders for each letter (J, A, C, O, B) to control their X, Y, and Z positions in real time

### Epic 2: Interactive Background Implementation
- [x] Canvas Setup and Basic Grid Drawing
- [x] Implement Mouse Interaction for Canvas
- [x] Implement 3D Perspective Grid (matching screenshot)
- [x] Introduce cameraOffsetX and cameraOffsetY variables in `script.js`
- [x] Abstract projection center logic in `project` function
- [x] Expose CSS variables for camera offsets and update `.landing-title` transform
- [x] Add "Pan X" and "Pan Y" sliders to control camera offsets
- [x] Compute and apply initial camera offsets to center letters
- [x] Verify that panning keeps grid and text aligned

### Epic 3: Featured Portfolio Element
- [ ] Create and Style Portfolio Element
- [ ] Implement Floating Movement Effect

### Epic 4: Project Detail Display
- [ ] Implement Project Detail Modal Structure
- [ ] Connect Portfolio Element to Modal

### Epic 5: Testing and Deployment
- [ ] Cross-browser Testing
- [ ] Performance Optimization

## Executor's Feedback or Assistance Requests

### Task: Add Camera Panning for Centering Letters and Grid
- Added camera offset variables (`cameraOffsetX`, `cameraOffsetY`) in the script.js file
- Modified the projection function to incorporate camera offsets
- Added CSS variables for camera offsets to the :root
- Updated the .landing-title transform to use the camera offset variables
- Added Pan X and Pan Y sliders to control camera offsets
- Added an Auto-Center button to automatically calculate and apply offsets to center the letters
- Implemented a function to update CSS variables when offsets change
- Updated the resizeCanvas function to update CSS variables on window resize
- Added a global updateCameraOffsetCSSVars function to ensure it's always available
- The camera panning functionality enables users to center the letters on the screen while maintaining their relative positions to the grid
- Features are working well, with smooth transitions between different offset values

### Task: Lock Camera Position and Hide Sliders
- Per user request, the current camera position has been locked with the current offset values
- Removed the Pan X and Pan Y sliders from the control panel
- Removed the Auto-Center button as it's no longer needed
- Kept the Grid Rotation and Tilt controls to allow those adjustments
- Renamed the reset button to "Reset Grid Angles" to clarify it only resets the rotation/tilt 
- Current camera offsets remain applied via CSS variables, ensuring the letters stay in their centered position
- Control panel is now simpler and focused only on grid angle adjustments

### Task: Hide Control Panel Completely
- Per user's latest request, the entire control panel has been hidden from view
- Set the control panel div's display property to 'none'
- All functionality remains intact behind the scenes, just not visible to users
- The grid and letters remain in their current positions with the previously set camera offsets
- The code structure is preserved so the panel can be easily re-enabled if needed in the future
- The result is a clean interface without any control panels or UI elements

### Task: Enhance Grid Highlighting
- Reimplemented the grid highlighting functionality to be more visually appealing
- Increased the highlight duration for better visibility (750ms → 1500ms)
- Reduced color opacity for a softer glow effect (1.0 → 0.7)
- Implemented randomized highlight generation for more organic visual interest
- Added occasional neighboring cell highlights for a more expansive effect
- Introduced size variation and pulsation effects to make highlights more dynamic
- Added proper fade-in/fade-out with easing functions for smoother transitions
- Implemented rounded rectangles for a softer, more modern aesthetic
- Added subtle glow effects using canvas shadows
- Ensured the highlight trail has a reasonable maximum length (50 items)
- The result is a more vibrant, dynamic grid highlighting system that responds naturally to mouse movement

## Lessons
- When implementing canvas animations, use requestAnimationFrame for smooth rendering
- For color transitions, interpolate RGBA values individually for smoother effects
- Calculate line distances using vector math for accurate proximity detection
- Initialize arrays for state management to avoid recreation on each frame

### New Subtask for Epic 1: Add interactive sliders for each letter (J, A, C, O, B) to control their X, Y, and Z positions in real time. This will allow the user to visually adjust each letter's position and copy the resulting CSS for production use. Add success criteria: User can adjust each letter's position with sliders and see changes live.