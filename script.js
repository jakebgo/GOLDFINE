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
  
  drawGrid();
}

// Handle mouse movement
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update rotation based on mouse position
  rotation = (mouseX - windowWidth / 2) * 0.0001;
}

// Draw perspective grid
function drawGrid() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  
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
    const scale = perspective / (perspective + y);
    const x1 = centerX - gridWidth * scale;
    const x2 = centerX + gridWidth * scale;
    const yPos = centerY + y * scale;
    
    // Apply rotation
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const x1Rot = centerX + (x1 - centerX) * cos - (yPos - centerY) * sin;
    const x2Rot = centerX + (x2 - centerX) * cos - (yPos - centerY) * sin;
    const yRot = centerY + (x1 - centerX) * sin + (yPos - centerY) * cos;
    
    ctx.moveTo(x1Rot, yRot);
    ctx.lineTo(x2Rot, yRot);
    ctx.stroke();
  }
  
  // Draw vertical lines
  for (let x = -gridWidth; x <= gridWidth; x += gridSize) {
    ctx.beginPath();
    
    // Calculate perspective
    const scale = perspective / (perspective + x);
    const y1 = centerY - gridHeight * scale;
    const y2 = centerY + gridHeight * scale;
    const xPos = centerX + x * scale;
    
    // Apply rotation
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const xRot = centerX + (xPos - centerX) * cos - (y1 - centerY) * sin;
    const y1Rot = centerY + (xPos - centerX) * sin + (y1 - centerY) * cos;
    const y2Rot = centerY + (xPos - centerX) * sin + (y2 - centerY) * cos;
    
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