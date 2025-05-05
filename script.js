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
let perspective = 500; // Perspective depth
let rotation = 0; // Grid rotation in radians
let scale = 1; // Grid scale
let targetScale = 1; // Target scale for smooth transitions
let mouseDistance = 0; // Distance from mouse to center
let maxDistance = 0; // Maximum distance for scaling
let lineColors = []; // Array to store line colors
let colorTransitionSpeed = 0.1; // Speed of color transitions

// Portfolio element variables
let portfolioElement;
let floatX = 0;
let floatY = 0;
let targetX = 0;
let targetY = 0;
let floatSpeed = 0.05;
let floatRadius = 20;

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
  
  // Update floating effect based on mouse position
  if (portfolioElement) {
    const elementRect = portfolioElement.getBoundingClientRect();
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    
    const mouseDx = mouseX - elementCenterX;
    const mouseDy = mouseY - elementCenterY;
    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    
    if (mouseDist < 200) {
      floatRadius = 30;
      floatSpeed = 0.1;
    } else {
      floatRadius = 20;
      floatSpeed = 0.05;
    }
  }
}

// Draw perspective grid
function drawGrid() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, windowWidth, windowHeight);
  
  // Smooth scale transition
  scale += (targetScale - scale) * 0.1;
  
  // Calculate grid dimensions
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const gridWidth = Math.ceil(windowWidth / gridSize) * gridSize;
  const gridHeight = Math.ceil(windowHeight / gridSize) * gridSize;
  
  // Initialize line colors array if needed
  if (lineColors.length === 0) {
    const totalLines = (gridWidth * 2 / gridSize + 1) + (gridHeight * 2 / gridSize + 1);
    lineColors = Array(totalLines).fill('rgba(240, 240, 240, 0.2)');
  }
  
  let lineIndex = 0;
  
  // Draw horizontal lines
  for (let y = -gridHeight; y <= gridHeight; y += gridSize) {
    // Calculate line position
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
    
    // Calculate distance from mouse to line
    const lineLength = Math.sqrt((x2Rot - x1Rot) ** 2 + (yRot - yRot) ** 2);
    const mouseToLineDistance = Math.abs((mouseY - yRot) * (x2Rot - x1Rot) - (mouseX - x1Rot) * (yRot - yRot)) / lineLength;
    
    // Update line color based on mouse proximity
    const targetColor = mouseToLineDistance < 50 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(240, 240, 240, 0.2)';
    const currentColor = lineColors[lineIndex];
    
    // Smooth color transition
    const r1 = parseInt(currentColor.slice(5, 8));
    const g1 = parseInt(currentColor.slice(9, 12));
    const b1 = parseInt(currentColor.slice(13, 16));
    const a1 = parseFloat(currentColor.slice(17, 20));
    
    const r2 = parseInt(targetColor.slice(5, 8));
    const g2 = parseInt(targetColor.slice(9, 12));
    const b2 = parseInt(targetColor.slice(13, 16));
    const a2 = parseFloat(targetColor.slice(17, 20));
    
    const newR = r1 + (r2 - r1) * colorTransitionSpeed;
    const newG = g1 + (g2 - g1) * colorTransitionSpeed;
    const newB = b1 + (b2 - b1) * colorTransitionSpeed;
    const newA = a1 + (a2 - a1) * colorTransitionSpeed;
    
    lineColors[lineIndex] = `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
    
    // Draw line with current color
    ctx.beginPath();
    ctx.strokeStyle = lineColors[lineIndex];
    ctx.lineWidth = 1;
    ctx.moveTo(x1Rot, yRot);
    ctx.lineTo(x2Rot, yRot);
    ctx.stroke();
    
    lineIndex++;
  }
  
  // Draw vertical lines
  for (let x = -gridWidth; x <= gridWidth; x += gridSize) {
    // Calculate line position
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
    
    // Calculate distance from mouse to line
    const lineLength = Math.sqrt((xRot - xRot) ** 2 + (y2Rot - y1Rot) ** 2);
    const mouseToLineDistance = Math.abs((mouseY - y1Rot) * (xRot - xRot) - (mouseX - xRot) * (y2Rot - y1Rot)) / lineLength;
    
    // Update line color based on mouse proximity
    const targetColor = mouseToLineDistance < 50 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(240, 240, 240, 0.2)';
    const currentColor = lineColors[lineIndex];
    
    // Smooth color transition
    const r1 = parseInt(currentColor.slice(5, 8));
    const g1 = parseInt(currentColor.slice(9, 12));
    const b1 = parseInt(currentColor.slice(13, 16));
    const a1 = parseFloat(currentColor.slice(17, 20));
    
    const r2 = parseInt(targetColor.slice(5, 8));
    const g2 = parseInt(targetColor.slice(9, 12));
    const b2 = parseInt(targetColor.slice(13, 16));
    const a2 = parseFloat(targetColor.slice(17, 20));
    
    const newR = r1 + (r2 - r1) * colorTransitionSpeed;
    const newG = g1 + (g2 - g1) * colorTransitionSpeed;
    const newB = b1 + (b2 - b1) * colorTransitionSpeed;
    const newA = a1 + (a2 - a1) * colorTransitionSpeed;
    
    lineColors[lineIndex] = `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
    
    // Draw line with current color
    ctx.beginPath();
    ctx.strokeStyle = lineColors[lineIndex];
    ctx.lineWidth = 1;
    ctx.moveTo(xRot, y1Rot);
    ctx.lineTo(xRot, y2Rot);
    ctx.stroke();
    
    lineIndex++;
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