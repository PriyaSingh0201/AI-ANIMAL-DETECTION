// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll and Active Nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks.classList.remove('active');
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

// Canvas Demo
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
let isDetecting = false;
let animationId;
let detectionCount = 0;

// Initialize canvas with placeholder
function initCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('AI Detection System Ready', canvas.width/2, canvas.height/2);
    ctx.font = '16px Poppins';
    ctx.fillText('Click "Start Detection" to begin', canvas.width/2, canvas.height/2 + 40);
}

initCanvas();

// Simulate video feed
function drawVideoFrame() {
    // Create gradient background to simulate video
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    
    // Draw road lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height * 0.6);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add timestamp
    ctx.fillStyle = '#0f0';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    const timestamp = new Date().toLocaleTimeString();
    ctx.fillText(`LIVE: ${timestamp}`, 10, 30);
}

// Draw detection box
function drawDetectionBox(x, y, width, height, label, confidence) {
    // Box
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Label background
    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y - 25, label.length * 8 + 40, 25);
    
    // Label text
    ctx.fillStyle = '#000';
    ctx.font = '14px Poppins';
    ctx.fillText(`${label} ${confidence}%`, x + 5, y - 8);
}

// Start detection
function startDetection() {
    if (isDetecting) return;
    isDetecting = true;
    document.getElementById('aiStatus').textContent = 'Detecting';
    showToast('Detection started!', 'success');
    animate();
}

// Stop detection
function stopDetection() {
    isDetecting = false;
    document.getElementById('aiStatus').textContent = 'Active';
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    showToast('Detection stopped', 'error');
}

// Simulate animal detection
function simulateDetection() {
    if (!isDetecting) {
        showToast('Please start detection first', 'error');
        return;
    }
    
    const animals = ['Cow', 'Dog', 'Deer', 'Elephant'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const confidence = Math.floor(Math.random() * 30) + 70;
    
    detectionCount++;
    document.getElementById('detectionCount').textContent = detectionCount;
    document.getElementById('confidence').textContent = confidence + '%';
    
    // Draw detection
    drawVideoFrame();
    const x = Math.random() * (canvas.width - 200) + 50;
    const y = Math.random() * (canvas.height - 200) + 50;
    drawDetectionBox(x, y, 150, 100, animal, confidence);
    
    showToast(`Detected: ${animal} (${confidence}% confidence)`, 'success');
}

// Animation loop
function animate() {
    if (!isDetecting) return;
    
    drawVideoFrame();
    
    // Random detection simulation
    if (Math.random() < 0.02) {
        simulateDetection();
    }
    
    animationId = requestAnimationFrame(animate);
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.feature-card, .problem-card, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
});