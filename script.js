// Script initialization
console.log('Script loaded successfully');

// Canvas setup
document.addEventListener('DOMContentLoaded', () => {
  // Get portfolio element first and set its position immediately
  portfolioElement = document.querySelector('.portfolio-element');
  if (portfolioElement) {
    // Set initial position with no transitions
    portfolioElement.style.transition = 'none';
    portfolioElement.style.transform = 'none';
    updatePortfolioPosition();
  }

  // Setup image hover controls
  const hoverImage = document.querySelector('.portfolio-preview-image');
  const staticImageSrc = 'assets/videos/ideate-static.png';
  const animatedGifSrc = 'assets/videos/ideate.gif';

  const pngXOffset = 2.5;   // Locked X offset for the PNG
  const gifXOffset = 15.5;  // Locked X offset for the GIF

  if (hoverImage && portfolioElement) {
    // Set initial PNG image and its object-position
    hoverImage.src = staticImageSrc;
    hoverImage.style.objectPosition = `calc(50% + ${pngXOffset}px) 50%`;

    portfolioElement.addEventListener('mouseenter', () => {
      hoverImage.src = animatedGifSrc;
      hoverImage.style.objectPosition = `calc(50% + ${gifXOffset}px) 50%`; // Apply fixed GIF offset
    });
    
    portfolioElement.addEventListener('mouseleave', () => {
      hoverImage.src = staticImageSrc;
      hoverImage.style.objectPosition = `calc(50% + ${pngXOffset}px) 50%`; // Apply fixed PNG offset
    });
  }

  // Then set up other components
  setupCanvas();
  setupModalHandlers();
  setupFloatingEffect();
  createPortfolioPositionControls();
});

// Canvas variables
let canvas, ctx;
let mouseX = 0, mouseY = 0;
let windowWidth, windowHeight;
let gridSize = 50; // Size of grid cells
let perspective = 5000; // Perspective depth
let rotation = 0; // Grid rotation in radians
let scale = 2.5; // Grid scale
let targetScale = 1; // Target scale for smooth transitions
let mouseDistance = 0; // Distance from mouse to center
let maxDistance = 0; // Maximum distance for scaling
let lineColors = []; // Array to store line colors
let colorTransitionSpeed = 0.1; // Speed of color transitions
let zRotation = (35 * Math.PI) / 180; // 35 degrees in radians
let xRotation = (-8 * Math.PI) / 180; // -8 degrees in radians
let minRotation = -Math.PI / 4; // -45 degrees
let maxRotation = Math.PI / 4; // 45 degrees
// Camera offset variables for centering the view
let cameraOffsetX = 94; // Locked X offset
let cameraOffsetY = 0; // Locked Y offset
let cameraZ = 1073; // Locked zoom level
let minZoom = 400;
let maxZoom = 2000;

// Portfolio element variables
let portfolioElement;
let floatX = 0;
let floatY = 0;
let targetX = 0;
let targetY = 0;
let floatSpeed = 0.05;
let floatRadius = 20;

// Add portfolio position control variables
let portfolioX = 327;
let portfolioY = -231;
let portfolioZ = 61;
let portfolioTilt = 37;
let portfolioRotate = 36;
let portfolioSize = 0.6;
let isManuallyControlled = true; // Lock the position by default

// Highlight trail state
const highlightTrail = []; // {x, y, colorIndex, timestamp}
const highlightFadeDuration = 1000; // ms - Each highlight fades after 1 second
const highlightColors = [
  'rgba(0,255,255,0.85)',   // Neon Cyan
  'rgba(255,0,255,0.85)',   // Neon Magenta
  'rgba(0,255,128,0.85)',   // Neon Green
  'rgba(255,255,0,0.85)',   // Neon Yellow
  'rgba(128,0,255,0.85)',   // Neon Purple
  'rgba(255,128,0,0.85)',   // Neon Orange
];
let colorCycleIndex = 0;
let lastColorCycleTime = Date.now();
const colorCycleInterval = 200; // ms

// Add these variables at the top with other canvas variables
let isDragging = false;
let currentLetter = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let letterPositions = {};

// Project data structure
const projectData = {
  title: "Creative Builder Portfolio",
  description: "A minimalist, interactive portfolio website showcasing the balance between technical execution and creative vision. Built with vanilla JavaScript and CSS, featuring a dynamic 3D grid background and smooth animations.",
  thumbnailUrl: "assets/images/portfolio-thumbnail.jpg",
  videoUrl: "assets/videos/portfolio-demo.mp4",
  tags: ["Web Design", "Development", "Interactive", "3D", "Animation"],
  technologies: ["JavaScript", "CSS3", "HTML5", "Canvas API"],
  features: [
    "Dynamic 3D grid background with mouse interaction",
    "Smooth animations and transitions",
    "Responsive design for all screen sizes",
    "Minimalist aesthetic with focus on typography"
  ]
};

// Function to update CSS variables for camera offsets
function updateCameraOffsetCSSVars() {
  document.documentElement.style.setProperty('--camera-offset-x', `${cameraOffsetX}px`);
  document.documentElement.style.setProperty('--camera-offset-y', `${cameraOffsetY}px`);
  drawGrid(); // Redraw grid with new offsets
}

// Create per-letter position controls
function createLetterPositionControls() {
  // Set locked positions for each letter
  const lockedStates = [
    { x: -141, y: -61, z: 131, tilt: 27, rotate: 37, size: 1.67 }, // J
    { x: -107, y: -40, z: 122, tilt: 29, rotate: 35, size: 1.63 }, // A
    { x: -67, y: -7, z: 120, tilt: 28, rotate: 36, size: 1.63 },   // C
    { x: -25, y: 26, z: 120, tilt: 28, rotate: 36, size: 1.63 },   // O
    { x: 18, y: 61, z: 120, tilt: 30, rotate: 35, size: 1.63 }     // B
  ];
  const letters = document.querySelectorAll('.landing-letter');
  letters.forEach((letter, i) => {
    const state = lockedStates[i] || lockedStates[0];
    updateLetterTransform(letter, state);
  });
  // Do not render the control panel
}

function updateLetterTransform(letter, state) {
  const { x, y, z, tilt, rotate, size } = state;
  letter.style.transform = `perspective(2000px) rotateX(${tilt}deg) rotateZ(${rotate}deg) scale(${size}) translate3d(${x}px, ${y}px, ${z}px)`;
}

// Setup canvas
function setupCanvas() {
  canvas = document.getElementById('background-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  ctx = canvas.getContext('2d');
  
  // Create rotation control
  createRotationControl();
  
  // Create per-letter position controls
  createLetterPositionControls();
  
  // Set up letter dragging
  setupLetterDrag();
  
  // Set canvas dimensions
  resizeCanvas();
  
  // Add resize listener
  window.addEventListener('resize', resizeCanvas);
  
  // Add mouse move listener
  document.addEventListener('mousemove', handleMouseMove);
  
  // Add mouse enter/leave listeners
  canvas.addEventListener('mouseenter', handleMouseEnter);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  
  // Draw initial grid
  drawGrid();
  
  // Start animation loop
  animate();
}

// Create rotation control
function createRotationControl() {
  const controlDiv = document.createElement('div');
  controlDiv.style.position = 'fixed';
  controlDiv.style.bottom = '20px';
  controlDiv.style.left = '20px';
  controlDiv.style.zIndex = '1000';
  controlDiv.style.background = 'rgba(255, 255, 255, 0.95)';
  controlDiv.style.padding = '15px';
  controlDiv.style.borderRadius = '8px';
  controlDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  controlDiv.style.fontFamily = 'Arial, sans-serif';
  controlDiv.style.fontSize = '14px';
  controlDiv.style.display = 'none'; // Hide the control panel
  
  // Z-axis rotation control
  const zLabel = document.createElement('label');
  zLabel.textContent = 'Grid Rotation (Z-axis): ';
  zLabel.style.display = 'block';
  zLabel.style.marginBottom = '8px';
  zLabel.style.fontWeight = 'bold';
  
  const zSlider = document.createElement('input');
  zSlider.type = 'range';
  zSlider.min = '-45';
  zSlider.max = '45';
  zSlider.value = '27'; // Set initial value to 27 degrees
  zSlider.style.width = '200px';
  zSlider.style.height = '20px';
  zSlider.style.cursor = 'pointer';
  zSlider.step = '1';
  
  const zValueDisplay = document.createElement('span');
  zValueDisplay.textContent = '27°';
  zValueDisplay.style.marginLeft = '10px';
  zValueDisplay.style.fontWeight = 'bold';
  
  // X-axis rotation control
  const xLabel = document.createElement('label');
  xLabel.textContent = 'Grid Tilt (X-axis): ';
  xLabel.style.display = 'block';
  xLabel.style.marginTop = '15px';
  xLabel.style.marginBottom = '8px';
  xLabel.style.fontWeight = 'bold';
  
  const xSlider = document.createElement('input');
  xSlider.type = 'range';
  xSlider.min = '-45';
  xSlider.max = '45';
  xSlider.value = '-8'; // Set initial value to -8 degrees
  xSlider.style.width = '200px';
  xSlider.style.height = '20px';
  xSlider.style.cursor = 'pointer';
  xSlider.step = '1';
  
  const xValueDisplay = document.createElement('span');
  xValueDisplay.textContent = '-8°';
  xValueDisplay.style.marginLeft = '10px';
  xValueDisplay.style.fontWeight = 'bold';
  
  // Camera X Offset control
  const panXSlider = document.createElement('input');
  panXSlider.type = 'range';
  panXSlider.min = '-500';
  panXSlider.max = '500';
  panXSlider.value = String(cameraOffsetX); // Use current value
  panXSlider.style.width = '200px';
  panXSlider.style.height = '20px';
  panXSlider.style.cursor = 'pointer';
  
  const panXLabel = document.createElement('label');
  panXLabel.textContent = 'Camera X Offset: ';
  panXLabel.style.display = 'block';
  panXLabel.style.marginTop = '15px';
  panXLabel.style.marginBottom = '8px';
  panXLabel.style.fontWeight = 'bold';
  
  const panXValueDisplay = document.createElement('span');
  panXValueDisplay.textContent = `${cameraOffsetX}px`;
  panXValueDisplay.style.marginLeft = '10px';
  panXValueDisplay.style.fontWeight = 'bold';
  
  // Camera Y Offset control
  const panYSlider = document.createElement('input');
  panYSlider.type = 'range';
  panYSlider.min = '-500';
  panYSlider.max = '500';
  panYSlider.value = String(cameraOffsetY); // Use current value
  panYSlider.style.width = '200px';
  panYSlider.style.height = '20px';
  panYSlider.style.cursor = 'pointer';
  
  const panYLabel = document.createElement('label');
  panYLabel.textContent = 'Camera Y Offset: ';
  panYLabel.style.display = 'block';
  panYLabel.style.marginTop = '15px';
  panYLabel.style.marginBottom = '8px';
  panYLabel.style.fontWeight = 'bold';
  
  const panYValueDisplay = document.createElement('span');
  panYValueDisplay.textContent = `${cameraOffsetY}px`;
  panYValueDisplay.style.marginLeft = '10px';
  panYValueDisplay.style.fontWeight = 'bold';
  
  // Add Zoom control
  const zoomLabel = document.createElement('label');
  zoomLabel.textContent = 'Camera Zoom: ';
  zoomLabel.style.display = 'block';
  zoomLabel.style.marginTop = '15px';
  zoomLabel.style.marginBottom = '8px';
  zoomLabel.style.fontWeight = 'bold';
  
  const zoomSlider = document.createElement('input');
  zoomSlider.type = 'range';
  zoomSlider.min = minZoom;
  zoomSlider.max = maxZoom;
  zoomSlider.value = String(cameraZ);
  zoomSlider.style.width = '200px';
  zoomSlider.style.height = '20px';
  zoomSlider.style.cursor = 'pointer';
  
  const zoomValueDisplay = document.createElement('span');
  zoomValueDisplay.textContent = `${cameraZ}px`;
  zoomValueDisplay.style.marginLeft = '10px';
  zoomValueDisplay.style.fontWeight = 'bold';

  // Event listeners
  zSlider.addEventListener('input', (e) => {
    const degrees = parseInt(e.target.value);
    zRotation = Math.max(minRotation, Math.min(maxRotation, (degrees * Math.PI) / 180));
    zValueDisplay.textContent = `${degrees}°`;
  });
  
  xSlider.addEventListener('input', (e) => {
    const degrees = parseInt(e.target.value);
    xRotation = Math.max(minRotation, Math.min(maxRotation, (degrees * Math.PI) / 180));
    xValueDisplay.textContent = `${degrees}°`;
  });
  
  // Event listeners for camera offsets
  panXSlider.addEventListener('input', (e) => {
    cameraOffsetX = parseInt(e.target.value);
    panXValueDisplay.textContent = `${cameraOffsetX}px`;
    updateCameraOffsetCSSVars();
  });
  
  panYSlider.addEventListener('input', (e) => {
    cameraOffsetY = parseInt(e.target.value);
    panYValueDisplay.textContent = `${cameraOffsetY}px`;
    updateCameraOffsetCSSVars();
  });
  
  // Add zoom event listener
  zoomSlider.addEventListener('input', (e) => {
    cameraZ = parseInt(e.target.value);
    zoomValueDisplay.textContent = `${cameraZ}px`;
  });
  
  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset Grid Angles';
  resetButton.style.marginTop = '15px';
  resetButton.style.padding = '5px 10px';
  resetButton.style.border = '1px solid #ccc';
  resetButton.style.borderRadius = '4px';
  resetButton.style.background = '#f5f5f5';
  resetButton.style.cursor = 'pointer';
  
  resetButton.addEventListener('click', () => {
    zSlider.value = '27';
    xSlider.value = '-8';
    zRotation = (27 * Math.PI) / 180;
    xRotation = (-8 * Math.PI) / 180;
    zValueDisplay.textContent = '27°';
    xValueDisplay.textContent = '-8°';
    // Don't reset camera offsets, keep them as they are
  });
  
  // Add all elements to control div
  controlDiv.appendChild(zLabel);
  controlDiv.appendChild(zSlider);
  controlDiv.appendChild(zValueDisplay);
  controlDiv.appendChild(xLabel);
  controlDiv.appendChild(xSlider);
  controlDiv.appendChild(xValueDisplay);
  controlDiv.appendChild(panXLabel);
  controlDiv.appendChild(panXSlider);
  controlDiv.appendChild(panXValueDisplay);
  controlDiv.appendChild(panYLabel);
  controlDiv.appendChild(panYSlider);
  controlDiv.appendChild(panYValueDisplay);
  controlDiv.appendChild(zoomLabel);
  controlDiv.appendChild(zoomSlider);
  controlDiv.appendChild(zoomValueDisplay);
  controlDiv.appendChild(document.createElement('br'));
  controlDiv.appendChild(resetButton);
  
  document.body.appendChild(controlDiv);
  
  console.log('Rotation controls created and added to DOM (hidden)');
  
  // Auto-center the letters once and lock the position
  setTimeout(() => {
    // Just call updateCameraOffsetCSSVars to make sure the current values are applied
    updateCameraOffsetCSSVars();
  }, 500);
}

// Add rotateZ function
function rotateZ([x, y, z], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos, z];
}

// Setup floating effect
function setupFloatingEffect() {
  if (!portfolioElement) {
    console.error('Portfolio element not found in DOM');
    return;
  }

  // Ensure position is locked and no transitions
  portfolioElement.style.transition = 'none';
  portfolioElement.style.transform = 'none';
  updatePortfolioPosition();

  // Check if motion is available and has the animate method
  if (typeof motion === 'undefined' || typeof motion.animate !== 'function') {
    console.error('Motion library not properly loaded or missing animate method');
    return;
  }
  
  // Add mouse move effect
  document.addEventListener('mousemove', (e) => {
    if (isManuallyControlled) return; // Skip if manually controlled
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position relative to center of screen
    const mouseX = (clientX - innerWidth / 2) / (innerWidth / 2);
    const mouseY = (clientY - innerHeight / 2) / (innerHeight / 2);
    
    // Apply subtle movement based on mouse position
    motion.animate(
      portfolioElement,
      {
        x: mouseX * 20,
        y: mouseY * 20,
      },
      {
        duration: 0.5,
        ease: "easeOut",
      }
    );
  });

  // Reset position when mouse leaves
  document.addEventListener('mouseleave', () => {
    if (isManuallyControlled) return; // Skip if manually controlled
    
    motion.animate(
      portfolioElement,
      {
        x: 0,
        y: 0,
      },
      {
        duration: 0.5,
        ease: "easeOut",
      }
    );
  });
}

// Resize canvas to fill window
function resizeCanvas() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  
  // Update max distance for scaling
  maxDistance = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2;
  
  // Update CSS variables if function exists
  if (typeof updateCameraOffsetCSSVars === 'function') {
    updateCameraOffsetCSSVars();
  }
  
  drawGrid();
}

// Handle mouse enter
function handleMouseEnter() {
  targetScale = 1.2;
}

// Handle mouse leave
function handleMouseLeave() {
  targetScale = 1;
  rotation = 0;
}

// Handle mouse movement
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Transform mouse coordinates to grid space
  const margin = 20;
  const cols = Math.ceil(windowWidth / gridSize) + margin * 2 + 2;
  const rows = Math.ceil(windowHeight / gridSize) + margin * 2 + 2;
  const cellX = Math.floor((mouseX - windowWidth / 2) / gridSize + cols / 2);
  const cellY = Math.floor((mouseY - windowHeight / 2) / gridSize + rows / 2);
  
  // Add highlight for current cell - ALWAYS add one
  highlightTrail.push({
    x: cellX,
    y: cellY,
    colorIndex: colorCycleIndex,
    timestamp: Date.now(),
    size: 2.0 // Much larger size for better visibility
  });
  
  // Ensure trail doesn't get too long
  while (highlightTrail.length > 20) {
    highlightTrail.shift();
  }
  
  // Force redraw
  drawGrid();
}

// Draw static grid with cell highlights and trail
function drawGrid() {
  if (!ctx) {
    console.error('Canvas context not found');
    return;
  }
  ctx.clearRect(0, 0, windowWidth, windowHeight);

  // --- 3D Perspective Grid Parameters ---
  const cellSize = gridSize;
  // Further increase grid size to ensure full coverage and intersection
  const margin = 20; // extra cells beyond visible area
  const cols = Math.ceil(windowWidth / cellSize) + margin * 2 + 2;
  const rows = Math.ceil(windowHeight / cellSize) + margin * 2 + 2;
  const theta = Math.PI / 4; // 60 degrees in radians
  const fov = Math.PI / 4; // 45 degrees
  const aspect = windowWidth / windowHeight;
  const near = 0.1;
  const far = 1000;
  const cameraY = 0;
  const cameraX = 0;
  // Center grid origin so it extends well beyond all edges
  const gridOrigin = [-(cols/2) * cellSize, -(rows/2) * cellSize, 0];

  // Perspective projection helper
  function project([x, y, z]) {
    const cx = x - cameraX;
    const cy = y - cameraY;
    const cz = z - cameraZ;
    const f = 1 / Math.tan(fov / 2);
    const px = f * (cx / aspect) / -cz;
    const py = f * (cy) / -cz;
    // Center projection in the middle of the canvas
    const centerX = windowWidth / 2 + cameraOffsetX;
    const centerY = windowHeight / 2 + cameraOffsetY;
    return [centerX + px * windowWidth / 2, centerY + py * windowHeight / 2];
  }

  function rotateX([x, y, z], angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x, y * cos - z * sin, y * sin + z * cos];
  }

  // --- Draw grid lines ---
  // Vertical lines (constant i)
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    for (let j = 0; j <= rows; j++) {
      let vx = gridOrigin[0] + i * cellSize;
      let vy = gridOrigin[1] + j * cellSize;
      let vz = 0;
      [vx, vy, vz] = rotateZ([vx, vy, vz], zRotation);
      [vx, vy, vz] = rotateX([vx, vy, vz], theta + xRotation);
      const [sx, sy] = project([vx, vy, vz]);
      if (j === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Horizontal lines (constant j)
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath();
    for (let i = 0; i <= cols; i++) {
      let vx = gridOrigin[0] + i * cellSize;
      let vy = gridOrigin[1] + j * cellSize;
      let vz = 0;
      [vx, vy, vz] = rotateZ([vx, vy, vz], zRotation);
      [vx, vy, vz] = rotateX([vx, vy, vz], theta + xRotation);
      const [sx, sy] = project([vx, vy, vz]);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Draw extra horizontal lines at the very top until the projected line is above the canvas
  let k = 1;
  while (true) {
    ctx.beginPath();
    let allAbove = true;
    for (let i = 0; i <= cols; i++) {
      let vx = gridOrigin[0] + i * cellSize;
      let vy = gridOrigin[1] + (rows + k) * cellSize;
      let vz = 0;
      [vx, vy, vz] = rotateZ([vx, vy, vz], zRotation);
      [vx, vy, vz] = rotateX([vx, vy, vz], theta + xRotation);
      const [sx, sy] = project([vx, vy, vz]);
      if (sy >= 0) allAbove = false;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (allAbove) break;
    k++;
  }

  // --- Highlight trail (projected) ---
  const now = Date.now();

  // Calculate number of valid highlights before removing expired ones
  let validHighlights = 0;
  for (let idx = 0; idx < highlightTrail.length; idx++) {
    const { timestamp } = highlightTrail[idx];
    const age = now - timestamp;
    if (age <= highlightFadeDuration) validHighlights++;
  }

  // Draw highlights as filled squares that fill the grid cell
  for (let idx = 0; idx < highlightTrail.length; idx++) {
    const {x, y, colorIndex, timestamp, size = 2.0} = highlightTrail[idx];
    const age = now - timestamp;
    if (age > highlightFadeDuration) {
      highlightTrail.splice(idx, 1);
      idx--;
      continue;
    }
    // Ease-out cubic fade for the whole duration
    const t = Math.min(age / highlightFadeDuration, 1);
    const fade = 1 - Math.pow(t, 3);

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = highlightColors[colorIndex];
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    // Project highlight cell corners
    let vx = gridOrigin[0] + x * cellSize;
    let vy = gridOrigin[1] + y * cellSize;
    let vz = 0;
    // Project all four corners of the cell
    let corners = [
      [vx, vy, vz],
      [vx + cellSize, vy, vz],
      [vx + cellSize, vy + cellSize, vz],
      [vx, vy + cellSize, vz]
    ].map(corner => {
      let [cx, cy, cz] = rotateZ(corner, zRotation);
      [cx, cy, cz] = rotateX([cx, cy, cz], theta + xRotation);
      return project([cx, cy, cz]);
    });
    // Draw filled polygon (square)
    ctx.beginPath();
    ctx.moveTo(corners[0][0], corners[0][1]);
    for (let i = 1; i < corners.length; i++) {
      ctx.lineTo(corners[i][0], corners[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Helper function to draw rounded rectangles
  function roundRect(ctx, x, y, width, height, radius) {
    if (radius > width/2) radius = width/2;
    if (radius > height/2) radius = height/2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  // --- Intersection dots (projected) ---
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      let vx = gridOrigin[0] + i * cellSize;
      let vy = gridOrigin[1] + j * cellSize;
      let vz = 0;
      [vx, vy, vz] = rotateZ([vx, vy, vz], zRotation);
      [vx, vy, vz] = rotateX([vx, vy, vz], theta + xRotation);
      const [sx, sy] = project([vx, vy, vz]);
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fill();
    }
  }
}

// Animation loop
function animate() {
  // Update color cycle index every second
  const now = Date.now();
  if (now - lastColorCycleTime > colorCycleInterval) {
    colorCycleIndex = (colorCycleIndex + 1) % highlightColors.length;
    lastColorCycleTime = now;
  }
  drawGrid();
  requestAnimationFrame(animate);
}

// Setup modal handlers
function setupModalHandlers() {
  const portfolioElement = document.querySelector('.portfolio-element');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalContent = document.querySelector('.modal-content');
  const modalClose = document.querySelector('.modal-close');
  const projectTitle = document.querySelector('.project-title');
  const projectDescription = document.querySelector('.project-description');
  const projectThumbnail = document.querySelector('.project-thumbnail');
  const projectVideo = document.querySelector('.project-video');
  const projectTags = document.querySelectorAll('.project-tags');
  const projectFeaturesList = document.querySelector('.project-features ul');
  
  // Portfolio element click handler
  if (portfolioElement) {
    portfolioElement.addEventListener('click', () => {
      if (modalOverlay) {
        // Populate with project data
        if (projectTitle) projectTitle.textContent = projectData.title;
        if (projectDescription) projectDescription.textContent = projectData.description;
        if (projectThumbnail) {
          projectThumbnail.src = projectData.thumbnailUrl;
          projectThumbnail.alt = projectData.title;
        }
        if (projectVideo) {
          projectVideo.src = projectData.videoUrl;
          projectVideo.load();
        }
        
        // Populate tags
        projectTags.forEach(tagsContainer => {
          tagsContainer.innerHTML = '';
          const tags = tagsContainer.parentElement.classList.contains('project-technologies') 
            ? projectData.technologies 
            : projectData.tags;
          
          tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
          });
        });
        
        // Populate features
        if (projectFeaturesList) {
          projectFeaturesList.innerHTML = '';
          projectData.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            projectFeaturesList.appendChild(li);
          });
        }
        
        // Show modal with animation
        modalOverlay.style.display = 'flex';
        modalOverlay.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        
        // Trigger animation
        requestAnimationFrame(() => {
          modalOverlay.style.transition = 'opacity 0.3s ease';
          modalContent.style.transition = 'transform 0.3s ease';
          modalOverlay.style.opacity = '1';
          modalContent.style.transform = 'scale(1)';
        });
      }
    });
  }
  
  // Modal close button
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      closeModal(modalOverlay, modalContent);
    });
  }
  
  // Close on background click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal(modalOverlay, modalContent);
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay) {
      closeModal(modalOverlay, modalContent);
    }
  });
}

// Helper function to close modal with animation
function closeModal(modalOverlay, modalContent) {
  if (!modalOverlay || !modalContent) return;
  
  modalOverlay.style.opacity = '0';
  modalContent.style.transform = 'scale(0.9)';
  
  setTimeout(() => {
    modalOverlay.style.display = 'none';
    modalOverlay.style.opacity = '1';
    modalContent.style.transform = 'scale(1)';
  }, 300);
}

// Add this function after the existing functions
function setupLetterDrag() {
  const letters = document.querySelectorAll('.landing-letter');
  const landingTitle = document.querySelector('.landing-title');
  
  letters.forEach((letter, index) => {
    // Store initial position relative to the landing title
    const rect = letter.getBoundingClientRect();
    const titleRect = landingTitle.getBoundingClientRect();
    letterPositions[index] = {
      x: rect.left - titleRect.left,
      y: rect.top - titleRect.top
    };
    
    // Remove cursor styles and pointer events
    letter.style.cursor = 'default';
    letter.style.pointerEvents = 'none';
  });
}

// Create portfolio position controls
function createPortfolioPositionControls() {
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'dev-controls';
  controlsContainer.style.position = 'fixed';
  controlsContainer.style.bottom = '20px';
  controlsContainer.style.right = '20px';
  controlsContainer.style.zIndex = '1000';
  controlsContainer.style.background = 'rgba(255, 255, 255, 0.9)';
  controlsContainer.style.padding = '10px';
  controlsContainer.style.borderRadius = '8px';
  controlsContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  controlsContainer.style.display = 'none'; // Hide the controls since position is locked

  const controls = [
    { name: 'X', value: portfolioX, min: -500, max: 500, step: 1 },
    { name: 'Y', value: portfolioY, min: -500, max: 500, step: 1 },
    { name: 'Z', value: portfolioZ, min: -500, max: 500, step: 1 },
    { name: 'Tilt', value: portfolioTilt, min: -90, max: 90, step: 1 },
    { name: 'Rotate', value: portfolioRotate, min: -90, max: 90, step: 1 },
    { name: 'Size', value: portfolioSize, min: 0.1, max: 5, step: 0.1 }
  ];

  controls.forEach(control => {
    const controlGroup = document.createElement('div');
    controlGroup.style.marginBottom = '8px';

    const label = document.createElement('label');
    label.textContent = `Portfolio ${control.name}: `;
    label.style.display = 'block';
    label.style.marginBottom = '4px';

    const input = document.createElement('input');
    input.type = 'range';
    input.min = control.min;
    input.max = control.max;
    input.step = control.step;
    input.value = control.value;
    input.style.width = '150px';
    input.disabled = true; // Disable the controls since position is locked

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = control.value;
    valueDisplay.style.marginLeft = '8px';

    controlGroup.appendChild(label);
    controlGroup.appendChild(input);
    controlGroup.appendChild(valueDisplay);
    controlsContainer.appendChild(controlGroup);
  });

  document.body.appendChild(controlsContainer);
}

// Update portfolio position based on control values
function updatePortfolioPosition() {
  if (!portfolioElement) return;
  
  isManuallyControlled = true; // Set manual control flag
  
  // Set transform origin to center
  portfolioElement.style.transformOrigin = 'center center';
  
  // Apply transforms in the correct order: translate -> rotate -> scale
  const transform = `
    translate3d(${portfolioX}px, ${portfolioY}px, ${portfolioZ}px)
    rotate3d(1, 0, 0, ${portfolioTilt}deg)
    rotate3d(0, 0, 1, ${portfolioRotate}deg)
    scale(${portfolioSize})
  `;
  
  portfolioElement.style.transform = transform;
  
  // Update the element's z-index based on Z position to maintain proper stacking
  portfolioElement.style.zIndex = Math.floor(4 + (portfolioZ / 10));
} 