# Creative Builder Portfolio Website PRD

## Status: Draft

## Intro

This document outlines the product requirements for the Minimum Viable Product (MVP) of a personal portfolio website for the "Creative Builder" brand. The goal is to create a minimalist, visually striking online presence that effectively demonstrates the combination of creative vision and technical execution, addressing the challenge of being perceived as solely one or the other. The website itself will serve as the primary demonstration of this duality, showcasing technical skill through interactive elements while maintaining a strong aesthetic derived from minimalist principles, inspired by sites like rauno.me.

## Goals and Context

The primary objective of this project is to launch an MVP website that establishes and promotes the personal brand of a "creative builder."

* **Clear Project Objectives:**
    * Develop a functional, aesthetically pleasing, and technically engaging personal portfolio website.
    * Effectively communicate the "creative builder" brand identity to visitors immediately upon arrival.
    * Provide a clear and engaging path for visitors to explore the featured work.
* **Measurable Outcomes:**
    * Successful deployment of the MVP website to a live URL.
    * Positive feedback regarding the website's design, interactivity, and clarity of the brand message (measured informally initially, potentially via direct contact/social media mentions).
    * Increased inquiries or interest from the target audience (employers, recruiters, clients, peers) citing the website as an initial touchpoint.
* **Success Criteria:**
    * The deployed website successfully implements all features defined within the MVP scope.
    * The website is performant and responsive across common desktop browsers.
    * The core interactive feature functions as intended, providing a compelling visual experience.
    * The single featured portfolio project is clearly presented and accessible.
    * Essential contact information is readily available.
* **Key Performance Indicators (KPIs):**
    * Website uptime and loading speed.
    * Visitor engagement metrics (time on site, interaction with interactive elements - could be added later if analytics are included post-MVP).
    * Number of direct inquiries received via listed contact methods.

## Features and Requirements

* **Functional Requirements:**
    * The website must display a landing screen featuring large text ("GOLDFINE").
    * The landing screen must include an interactive background graphic.
    * The website must display at least one interactive element representing a featured portfolio project.
    * Clicking/interacting with the featured project element must reveal detailed information about that project.
    * The website must include a brief "About Me" summary section.
    * The website must display essential contact links (Email, X).
    * Basic navigation must be present to access the "About Me" section and potentially return to the landing screen.
* **Non-Functional Requirements:**
    * **Performance:** Interactive elements and overall site must be performant, targeting smooth animations (60+ fps where applicable) and fast loading times.
    * **Responsiveness:** The layout should adapt gracefully to different desktop screen sizes (mobile and tablet are out of scope for this MVP).
    * **Browser Compatibility:** Must function correctly in the latest versions of major desktop browsers (Chrome, Firefox, Safari, Edge).
    * **Maintainability:** Code should be well-structured and commented to facilitate future updates and expansions.
* **User Experience Requirements:**
    * The design must embody minimalism and good taste, inspired by rauno.me.
    * The interactive elements should feel engaging and contribute to the "creative builder" brand.
    * Navigation should be intuitive and unobtrusive.
    * The overall experience should leave a strong positive impression regarding the creator's technical and creative abilities.
* **Integration Requirements:**
    * No external service integrations are required for this MVP beyond standard web technologies.
* **Testing Requirements:**
    * All features and requirements for each story must be manually tested and verified by the developer before marking the story as complete.
    * Testing should cover functionality, layout (on desktop), and basic performance/smoothness of interactive elements.

## Epic Story List

### Epic 0: Initial Project Set Up and Structure

* **Story 1: Project Initialization & Boilerplate**
    * Requirements:
        * Create a new project directory for the website.
        * Initialize a Git repository and make an initial commit.
        * Create the basic HTML structure (`index.html`) including necessary meta tags, title, and links for CSS and JavaScript files.
        * Create initial placeholder files for CSS (`style.css`) and JavaScript (`script.js`).
        * Set up a simple local development server (e.g., using Python's `http.server` or a simple npm package like `live-server`) to view the site locally.
        * Ensure the placeholder files are correctly linked and accessible in the browser console.

### Epic 1: Core Layout, Typography, and Basic Content

* **Story 2: Implement Core HTML Layout**
    * Requirements:
        * Add the main HTML elements for the landing section, the interactive background canvas, the portfolio element container, the project detail view container (initially hidden), the about section, and the navigation/contact area.
        * Use semantic HTML5 elements where appropriate.
* **Story 3: Apply Basic CSS Styling and Typography**
    * Requirements:
        * Add a CSS reset or normalize stylesheet.
        * Apply basic body styling (e.g., background color, font family).
        * Implement the bold "GOLDFINE" typography for the landing screen, ensuring it is large and centrally positioned (or positioned per design inspiration).
        * Apply basic styling to the "About Me" section and contact links.
        * Style the basic navigation element (e.g., fix it to a corner, minimal styling).
* **Story 4: Add "About Me" and Contact Content**
    * Requirements:
        * Add the brief "About Me" summary text into the designated HTML element.
        * Add links for Email (using `mailto:`) and X (Twitter) into the contact/navigation area.
        * Ensure these links are functional.

### Epic 2: Interactive Background Implementation

* **Story 5: Canvas Setup and Basic Grid Drawing**
    * Requirements:
        * Get a reference to the Canvas element in `script.js`.
        * Get the 2D rendering context.
        * Set the Canvas dimensions to fill the viewport.
        * Implement a function to draw a basic perspective grid onto the canvas. This function should clear the canvas and redraw the grid.
        * Call the drawing function initially to display the static grid.
* **Story 6: Implement Mouse Interaction for Canvas Reactivity**
    * Requirements:
        * Add event listeners to the Canvas or document to track mouse movement (`mousemove`).
        * In the mousemove handler, calculate how the grid should react based on the mouse position (e.g., shift perspective, change line density slightly).
        * Call the grid drawing function from the mousemove handler, passing parameters based on the mouse position to make the drawing dynamic.
        * Ensure the animation is smooth (potentially using `requestAnimationFrame`).

### Epic 3: Featured Portfolio Element

* **Story 7: Create and Style the Interactive Portfolio Element**
    * Requirements:
        * Create an HTML element to represent the single featured portfolio project.
        * Style this element to appear visually distinct and potentially "float" using CSS (e.g., absolute positioning, basic transforms, box-shadow).
        * Implement a basic hover effect using CSS transitions to add interactivity (e.g., slight scale change, shadow change).
* **Story 8: Implement Basic Floating/Movement Effect**
    * Requirements:
        * Using JavaScript, apply a subtle "floating" or parallax effect to the portfolio element, perhaps based on mouse position or a simple CSS animation.
        * Ensure this effect is performant and doesn't interfere with clicking.

### Epic 4: Project Detail Display

* **Story 9: Implement Project Detail Modal Structure**
    * Requirements:
        * Add HTML structure for a modal or overlay that will display project details. This structure should include a title area, a description area, and a close button.
        * Initially hide the modal using CSS (`display: none` or `visibility: hidden`).
        * Add basic CSS to style the modal, centering it on the screen and giving it a background overlay.
* **Story 10: Populate and Display Single Project Details**
    * Requirements:
        * Add a click event listener to the interactive portfolio element (from Epic 3).
        * When clicked, populate the modal structure with hardcoded content for the single featured project (Title, Description, potentially placeholders for images/links if needed later, though MVP focuses on text).
        * Make the modal visible.
        * Add a click event listener to the close button within the modal to hide it.
        * Consider adding a click listener to the overlay background to close the modal as well.

### Epic-N: Future Epic Enhancements (Beyond Scope of current PRD)

* Multiple Portfolio Projects and detailed views.
* Implementation of additional or more complex interactive features.
* A comprehensive, detailed "About Me" page.
* A functional contact form.
* Integration of additional social media links (GitHub, LinkedIn, etc.).
* Mobile and tablet responsiveness.
* Server-side rendering or a build framework (e.g., React, Vue, Next.js) for better structure and potential SEO.
* Analytics integration (e.g., Google Analytics).
* CMS integration for project content management.

## Technology Stack

| Technology              | Version        | Description                                                                  |
| :---------------------- | :------------- | :--------------------------------------------------------------------------- |
| HTML5                   | -              | Standard markup language for structuring web content.                          |
| CSS3                    | -              | Standard stylesheet language for styling web content.                        |
| JavaScript (ES6+)       | ES6+           | Core language for interactivity and DOM manipulation.                        |
| HTML Canvas API         | -              | Used for drawing graphics for the interactive background.                    |
| Optional JS Animation Lib | Latest Stable* | Consideration for libraries like Anime.js or Motion for enhanced animations. |
| Static Web Server       | -              | Simple server for local development/serving static files (e.g., `live-server`). |
| Git                     | -              | Version control system.                                                      |

*Note: Specific animation library and version TBD if deemed necessary during development, otherwise pure JS will be used.*

## Project Structure

/creative-builder-portfolio
├── index.html
├── style.css
├── script.js
├── /assets
│   └── /images  (for potential future use)
│   └── /fonts   (for potential future use)
└── .gitignore


## POST MVP / PRD Features

* Support for multiple portfolio projects.
* Advanced interactive features (beyond the single background effect).
* Full "About Me" page.
* Contact form implementation.
* Inclusion of GitHub, LinkedIn, and other social profiles.
* Optimizations for mobile and tablet devices.
* Transition to a frontend framework (e.g., React) or static site generator.
* Search Engine Optimization (SEO).
* Website analytics tracking.

## Change Log

| Change           | Story ID | Description         |
| :--------------- | :------- | :------------------ |
| Initial draft    | N/A      | Initial draft PRD |

---

**Unknowns, Assumptions, and Risks:**

* **Assumption (Interactive Background):** The specific visual style and interaction pattern for the perspective grid will be a relatively simple 2D effect reacting primarily to mouse position to subtly shift or distort the grid visually. Complex 3D rendering or physics are out of scope for MVP.
* **Assumption (Floating Element):** The "floating" effect for the portfolio element will be achieved using simple CSS transforms and transitions or basic JavaScript animation, not complex physics simulations.
* **Assumption (Project Detail View):** The method for displaying project details will be a modal overlay that appears on top of the main content.
* **Assumption (Basic Navigation):** The navigation will be a minimal, potentially fixed element containing links to the "About Me" section and contact info, and possibly a link back to the landing/home state. The specific positioning (e.g., bottom left/right) is TBD.
* **Assumption (Build Process):** For MVP, the project will be built and served as static HTML, CSS, and JS files. No complex build tools (like Webpack, Parcel, etc.) are strictly required initially, though a simple one like `live-server` is assumed for local development.
* **Assumption (Testing):** Testing for this MVP will primarily rely on manual verification by the developer completing each story to ensure the specific requirements of that story are met and don't break existing functionality. Automated testing is out of scope for MVP.
* **Risk:** The performance of the Canvas interactive background could be challenging to optimize across all target desktop browsers, potentially requiring iteration or simplification.

---