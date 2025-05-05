// Script initialization
console.log('Script loaded successfully');

// Canvas setup
document.addEventListener('DOMContentLoaded', () => {
  setupCanvas();
  setupModalHandlers();
  setupFloatingEffect();
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
let zRotation = (27 * Math.PI) / 180; // 27 degrees in radians
let xRotation = (-8 * Math.PI) / 180; // -8 degrees in radians
let minRotation = -Math.PI / 4; // -45 degrees
let maxRotation = Math.PI / 4; // 45 degrees

// Portfolio element variables
let portfolioElement;
let floatX = 0;
let floatY = 0;
let targetX = 0;
let targetY = 0;
let floatSpeed = 0.05;
let floatRadius = 20;

// Highlight trail state
const highlightTrail = []; // {x, y, colorIndex, timestamp}
const highlightDuration = 750; // ms
const highlightColors = [
  'rgba(0,255,255,1)',   // Vibrant Cyan
  'rgba(255,0,255,1)',  // Vibrant Magenta
  'rgba(255,255,0,1)',  // Vibrant Yellow
  'rgba(0,255,128,1)'   // Vibrant Lime
];
let colorCycleIndex = 0;
let lastColorCycleTime = Date.now();
const colorCycleInterval = 125; // ms

// Add these variables at the top with other canvas variables
let isDragging = false;
let currentLetter = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let letterPositions = {};

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
  
  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset All';
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
  });
  
  // Add all elements to control div
  controlDiv.appendChild(zLabel);
  controlDiv.appendChild(zSlider);
  controlDiv.appendChild(zValueDisplay);
  controlDiv.appendChild(xLabel);
  controlDiv.appendChild(xSlider);
  controlDiv.appendChild(xValueDisplay);
  controlDiv.appendChild(document.createElement('br'));
  controlDiv.appendChild(resetButton);
  
  document.body.appendChild(controlDiv);
  console.log('Rotation controls created and added to DOM');
}

// Add rotateZ function
function rotateZ([x, y, z], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos, z];
}

// Setup floating effect
function setupFloatingEffect() {
  portfolioElement = document.querySelector('.portfolio-element');
  if (!portfolioElement) return;
  
  // Start floating animation
  animateFloat();
}

// Animate floating effect
function animateFloat() {
  if (!portfolioElement) return;
  
  // Update target position
  targetX = Math.sin(Date.now() * 0.001) * floatRadius;
  targetY = Math.cos(Date.now() * 0.002) * floatRadius;
  
  // Smooth movement
  floatX += (targetX - floatX) * floatSpeed;
  floatY += (targetY - floatY) * floatSpeed;
  
  // Apply transform
  portfolioElement.style.transform = `translate(${floatX}px, ${floatY}px) scale(1.05)`;
  
  // Continue animation
  requestAnimationFrame(animateFloat);
}

// Resize canvas to fill window
function resizeCanvas() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  
  // Update max distance for scaling
  maxDistance = Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) / 2;
  
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

  // Determine which grid cell the mouse is in
  const cellX = Math.floor(mouseX / gridSize);
  const cellY = Math.floor(mouseY / gridSize);

  // Only add a new highlight if this cell isn't already the most recent
  const last = highlightTrail[highlightTrail.length - 1];
  if (!last || last.x !== cellX || last.y !== cellY) {
    highlightTrail.push({
      x: cellX,
      y: cellY,
      colorIndex: colorCycleIndex,
      timestamp: Date.now()
    });
  }
}

// Draw static grid with cell highlights and trail
function drawGrid() {
  if (!ctx) return;
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
  const cameraZ = 800; // Camera distance from grid
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
    // Shift projection center: right by 0.33*width, up by 0.25*height
    const centerX = windowWidth * 0.83;
    const centerY = windowHeight * 0.25;
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
  for (let idx = highlightTrail.length - 1; idx >= 0; idx--) {
    const {x, y, colorIndex, timestamp} = highlightTrail[idx];
    const age = now - timestamp;
    if (age > highlightDuration) {
      highlightTrail.splice(idx, 1);
      continue;
    }
    const fade = 1 - age / highlightDuration;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.fillStyle = highlightColors[colorIndex];
    // Project highlight cell center
    let vx = gridOrigin[0] + x * cellSize + cellSize/2;
    let vy = gridOrigin[1] + y * cellSize + cellSize/2;
    let vz = 0;
    [vx, vy, vz] = rotateZ([vx, vy, vz], zRotation);
    [vx, vy, vz] = rotateX([vx, vy, vz], theta + xRotation);
    const [sx, sy] = project([vx, vy, vz]);
    // Approximate cell size in screen space (not perfect, but close)
    let [sx2, sy2] = project([vx + cellSize, vy + cellSize, vz]);
    const w = Math.abs(sx2 - sx);
    const h = Math.abs(sy2 - sy);
    ctx.fillRect(sx - w/2, sy - h/2, w, h);
    ctx.restore();
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
  const modalClose = document.querySelector('.modal-close');
  const projectTitle = document.querySelector('.project-title');
  const projectDescription = document.querySelector('.project-description');
  
  // Portfolio element click handler
  if (portfolioElement) {
    portfolioElement.addEventListener('click', () => {
      if (modalOverlay) {
        // Populate with placeholder data
        if (projectTitle) projectTitle.textContent = 'Featured Project Title';
        if (projectDescription) projectDescription.textContent = 'This is a description of the featured project. It will be replaced with actual content in Task 12.';
        
        // Show modal
        modalOverlay.style.display = 'flex';
      }
    });
  }
  
  // Modal close button
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }
  
  // Close on background click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });
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
    
    // Add event listeners
    letter.addEventListener('mousedown', (e) => {
      isDragging = true;
      currentLetter = letter;
      const rect = letter.getBoundingClientRect();
      const titleRect = landingTitle.getBoundingClientRect();
      // Calculate offset from the center of the letter
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      letter.style.cursor = 'grabbing';
      letter.style.zIndex = '1000';
      
      // Switch to absolute positioning during drag
      letter.style.position = 'absolute';
      letter.style.transform = 'scale(1.4)';
      letter.style.left = `${rect.left}px`;
      letter.style.top = `${rect.top}px`;
    });
    
    letter.addEventListener('mouseup', () => {
      if (!isDragging) return;
      
      isDragging = false;
      currentLetter = null;
      letter.style.cursor = 'grab';
      letter.style.zIndex = '10';
      
      // Get final position
      const rect = letter.getBoundingClientRect();
      const titleRect = landingTitle.getBoundingClientRect();
      const x = rect.left - titleRect.left;
      const y = rect.top - titleRect.top;
      
      // Store new position
      letterPositions[index] = { x, y };
      
      // Switch back to transform-based positioning
      letter.style.position = 'relative';
      letter.style.left = 'auto';
      letter.style.top = 'auto';
      letter.style.transform = `perspective(2000px) rotateX(60deg) rotateZ(19deg) scale(1.2) translate(${x}px, ${y}px)`;
    });
    
    letter.addEventListener('mouseleave', () => {
      if (!isDragging) return;
      
      isDragging = false;
      currentLetter = null;
      letter.style.cursor = 'grab';
      letter.style.zIndex = '10';
      
      // Get final position
      const rect = letter.getBoundingClientRect();
      const titleRect = landingTitle.getBoundingClientRect();
      const x = rect.left - titleRect.left;
      const y = rect.top - titleRect.top;
      
      // Store new position
      letterPositions[index] = { x, y };
      
      // Switch back to transform-based positioning
      letter.style.position = 'relative';
      letter.style.left = 'auto';
      letter.style.top = 'auto';
      letter.style.transform = `perspective(2000px) rotateX(60deg) rotateZ(19deg) scale(1.2) translate(${x}px, ${y}px)`;
    });
    
    // Set initial cursor style
    letter.style.cursor = 'grab';
  });
  
  // Add mousemove listener to document
  document.addEventListener('mousemove', (e) => {
    if (isDragging && currentLetter) {
      // Calculate new position
      const x = e.clientX - dragOffsetX;
      const y = e.clientY - dragOffsetY;
      
      // Update position
      currentLetter.style.left = `${x}px`;
      currentLetter.style.top = `${y}px`;
    }
  });
} 