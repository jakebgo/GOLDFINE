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