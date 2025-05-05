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
}

// Draw perspective grid
function drawGrid() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  
  // Draw grid lines
  // This is a placeholder - will be implemented fully in Task 7
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  
  // Draw horizontal lines (placeholder)
  for (let i = 0; i < 10; i++) {
    const y = windowHeight * (i / 10);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(windowWidth, y);
    ctx.stroke();
  }
  
  // Draw vertical lines (placeholder)
  for (let i = 0; i < 10; i++) {
    const x = windowWidth * (i / 10);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, windowHeight);
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
  const portfolioContainer = document.querySelector('.portfolio-container');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  
  // These are placeholders - will be implemented fully in Task 12
  if (portfolioContainer) {
    portfolioContainer.addEventListener('click', () => {
      // Show modal (will be implemented in Task 12)
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      // Hide modal (will be implemented in Task 12)
      if (modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }
} 