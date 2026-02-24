// Working AI Animal Detection Demo
let canvas, ctx;
let isDetecting = false;
let animationId;
let detectionCount = 0;

// Animal types
const animals = ['Cow', 'Dog', 'Deer', 'Elephant'];

// Initialize when page loads
window.addEventListener('load', function() {
    canvas = document.getElementById('videoCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    
    ctx = canvas.getContext('2d');
    initCanvas();
    console.log('Demo initialized successfully');
});

// Initialize canvas
function initCanvas() {
    if (!ctx) return;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI Detection System Ready', canvas.width/2, canvas.height/2);
    ctx.font = '16px Arial';
    ctx.fillText('Click Start Detection to begin', canvas.width/2, canvas.height/2 + 40);
}

// Draw video frame
function drawVideoFrame() {
    if (!ctx) return;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Road
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    // Road line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height * 0.7);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Danger zone
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('DANGER ZONE', 20, canvas.height * 0.7 - 10);

    // Live indicator
    ctx.fillStyle = '#0f0';
    ctx.font = '12px Arial';
    ctx.fillText('LIVE: ' + new Date().toLocaleTimeString(), 10, 20);
}

// Draw detection box
function drawDetectionBox(x, y, width, height, animal, confidence) {
    if (!ctx) return false;
    
    const dangerZone = canvas.height * 0.7;
    const isInDanger = (y + height) > dangerZone;
    const color = isInDanger ? '#ff0000' : '#00ff00';
    
    // Box
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Label background
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 25, 150, 25);
    
    // Label text
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText(`${animal} ${confidence}%`, x + 5, y - 8);
    
    return isInDanger;
}

// Start detection
function startDetection() {
    console.log('Start detection clicked');
    
    if (isDetecting) {
        console.log('Already detecting');
        return;
    }
    
    isDetecting = true;
    updateStatus('aiStatus', 'Detecting');
    updateStatus('yoloStatus', 'Active');
    showToast('Detection Started!');
    animate();
}

// Stop detection
function stopDetection() {
    console.log('Stop detection clicked');
    
    isDetecting = false;
    updateStatus('aiStatus', 'Stopped');
    updateStatus('dangerStatus', 'Stopped');
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    showToast('Detection Stopped');
}

// Simulate detection
function simulateDetection() {
    console.log('Simulate detection clicked');
    
    if (!isDetecting) {
        showToast('Please start detection first');
        return;
    }
    
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const confidence = Math.floor(Math.random() * 30) + 70;
    const x = Math.random() * (canvas.width - 150) + 50;
    const y = Math.random() * (canvas.height - 150) + 50;
    
    drawVideoFrame();
    const inDanger = drawDetectionBox(x, y, 120, 80, animal, confidence);
    
    detectionCount++;
    updateStatus('detectionCount', detectionCount);
    updateStatus('confidence', confidence + '%');
    updateStatus('processingTime', '25ms');
    
    if (inDanger) {
        updateStatus('dangerStatus', 'ALERT!', '#ff0000');
        
        // Warning overlay
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, 60);
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ ANIMAL ON ROAD - SLOW DOWN! ⚠️', canvas.width/2, 35);
        
        console.log(`🚨 ALERT: ${animal} detected on road!`);
        showToast(`DANGER: ${animal} on road!`);
    } else {
        updateStatus('dangerStatus', 'Clear', '#00ff00');
        showToast(`Detected: ${animal}`);
    }
}

// Animation loop
function animate() {
    if (!isDetecting) return;
    
    drawVideoFrame();
    
    // Random detection
    if (Math.random() < 0.008) {
        simulateDetection();
    }
    
    animationId = requestAnimationFrame(animate);
}

// Update status helper
function updateStatus(id, text, color = null) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
        if (color) element.style.color = color;
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'toast show';
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Video upload
function uploadVideo() {
    const upload = document.getElementById('videoUpload');
    if (upload) upload.click();
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        showToast('Video uploaded successfully!');
        if (!isDetecting) startDetection();
    }
}

// Mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.padding = '1rem 0';
            }
        }
    });
    
    // Show ready message
    setTimeout(() => {
        showToast('AI System Ready!');
    }, 1000);
});