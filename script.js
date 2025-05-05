// Script initialization
console.log('Script loaded successfully');

// Canvas setup
document.addEventListener('DOMContentLoaded', () => {
  setupCanvas();
  setupModalHandlers();
});

// Canvas variables
let canvas, ctx;
let mouseX = 0, mouseY = 0;
let windowWidth, windowHeight;
let gridSize = 50; // Size of grid cells
let perspective = 500; // Perspective depth
let rotation = 0; // Grid rotation in radians
let scale = 1; // Grid scale
let targetScale = 1; // Target scale for smooth transitions
let mouseDistance = 0; // Distance from mouse to center
let maxDistance = 0; // Maximum distance for scaling

// Setup canvas
function setupCanvas() {
  canvas = document.getElementById('background-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  ctx = canvas.getContext('2d');
  
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
  
  // Calculate distance from center
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  mouseDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Update rotation based on mouse position
  rotation = (mouseX - centerX) * 0.0001;
  
  // Update scale based on distance
  targetScale = 1 + (mouseDistance / maxDistance) * 0.2;
}

// Draw perspective grid
function drawGrid() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  
  // Smooth scale transition
  scale += (targetScale - scale) * 0.1;
  
  // Set grid style
  ctx.strokeStyle = 'rgba(240, 240, 240, 0.2)';
  ctx.lineWidth = 1;
  
  // Calculate grid dimensions
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const gridWidth = Math.ceil(windowWidth / gridSize) * gridSize;
  const gridHeight = Math.ceil(windowHeight / gridSize) * gridSize;
  
  // Draw horizontal lines
  for (let y = -gridHeight; y <= gridHeight; y += gridSize) {
    ctx.beginPath();
    
    // Calculate perspective
    const perspectiveScale = perspective / (perspective + y);
    const x1 = centerX - gridWidth * perspectiveScale;
    const x2 = centerX + gridWidth * perspectiveScale;
    const yPos = centerY + y * perspectiveScale;
    
    // Apply rotation and scale
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const x1Rot = centerX + (x1 - centerX) * cos * scale - (yPos - centerY) * sin * scale;
    const x2Rot = centerX + (x2 - centerX) * cos * scale - (yPos - centerY) * sin * scale;
    const yRot = centerY + (x1 - centerX) * sin * scale + (yPos - centerY) * cos * scale;
    
    ctx.moveTo(x1Rot, yRot);
    ctx.lineTo(x2Rot, yRot);
    ctx.stroke();
  }
  
  // Draw vertical lines
  for (let x = -gridWidth; x <= gridWidth; x += gridSize) {
    ctx.beginPath();
    
    // Calculate perspective
    const perspectiveScale = perspective / (perspective + x);
    const y1 = centerY - gridHeight * perspectiveScale;
    const y2 = centerY + gridHeight * perspectiveScale;
    const xPos = centerX + x * perspectiveScale;
    
    // Apply rotation and scale
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const xRot = centerX + (xPos - centerX) * cos * scale - (y1 - centerY) * sin * scale;
    const y1Rot = centerY + (xPos - centerX) * sin * scale + (y1 - centerY) * cos * scale;
    const y2Rot = centerY + (xPos - centerX) * sin * scale + (y2 - centerY) * cos * scale;
    
    ctx.moveTo(xRot, y1Rot);
    ctx.lineTo(xRot, y2Rot);
    ctx.stroke();
  }
}

// Animation loop
function animate() {
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