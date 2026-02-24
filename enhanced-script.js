// Performance monitoring
const performance = {
    detectionTime: 0,
    fps: 0,
    lastFrameTime: 0
};

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

// Enhanced Navbar Scroll Effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Canvas Demo with Enhanced Features
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
let isDetecting = false;
let animationId;
let detectionCount = 0;
let uploadedVideo = null;
let videoElement = null;

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

// Enhanced video feed simulation
function drawVideoFrame() {
    const startTime = performance.now();
    
    // Create gradient background to simulate video
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road with perspective
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.3, canvas.height * 0.6);
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.6);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw road lines with animation
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    const time = Date.now() * 0.01;
    for (let i = 0; i < 5; i++) {
        const y = canvas.height * 0.7 + i * 30 + (time % 60);
        ctx.setLineDash([20, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.45, y);
        ctx.lineTo(canvas.width * 0.55, y);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // Add enhanced overlay info
    ctx.fillStyle = '#0f0';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    const timestamp = new Date().toLocaleTimeString();
    ctx.fillText(`LIVE: ${timestamp}`, 10, 30);
    ctx.fillText(`FPS: ${Math.round(performance.fps)}`, 10, 50);
    ctx.fillText(`Detection Time: ${performance.detectionTime}ms`, 10, 70);
    
    // Calculate FPS
    const currentTime = performance.now();
    if (performance.lastFrameTime) {
        performance.fps = 1000 / (currentTime - performance.lastFrameTime);
    }
    performance.lastFrameTime = currentTime;
    
    performance.detectionTime = currentTime - startTime;
}

// Enhanced detection box with confidence visualization
function drawDetectionBox(x, y, width, height, label, confidence) {
    const color = confidence > 80 ? '#0f0' : confidence > 60 ? '#ff0' : '#f80';
    
    // Box with confidence-based color
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Confidence bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 35, (width * confidence / 100), 8);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y - 35, width, 8);
    
    // Label background
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 25, label.length * 8 + 60, 25);
    
    // Label text
    ctx.fillStyle = '#000';
    ctx.font = '14px Poppins';
    ctx.fillText(`${label} ${confidence}%`, x + 5, y - 8);
    
    // Alert animation for high confidence
    if (confidence > 85) {
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 5;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x - 5, y - 5, width + 10, height + 10);
        ctx.setLineDash([]);
    }
}

// Start detection with enhanced features
function startDetection() {
    if (isDetecting) return;
    isDetecting = true;
    document.getElementById('aiStatus').textContent = 'Detecting';
    showToast('Detection started! AI model active', 'success');
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

// Enhanced animal detection simulation
function simulateDetection() {
    if (!isDetecting) {
        showToast('Please start detection first', 'error');
        return;
    }
    
    const animals = [
        { name: 'Cow', threat: 'High' },
        { name: 'Dog', threat: 'Medium' },
        { name: 'Deer', threat: 'High' },
        { name: 'Elephant', threat: 'Critical' },
        { name: 'Wild Boar', threat: 'High' },
        { name: 'Monkey', threat: 'Low' }
    ];
    
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const confidence = Math.floor(Math.random() * 30) + 70;
    
    detectionCount++;
    document.getElementById('detectionCount').textContent = detectionCount;
    document.getElementById('confidence').textContent = confidence + '%';
    
    // Draw detection with multiple animals possibility
    drawVideoFrame();
    const numAnimals = Math.random() < 0.3 ? 2 : 1;
    
    for (let i = 0; i < numAnimals; i++) {
        const x = Math.random() * (canvas.width - 200) + 50;
        const y = Math.random() * (canvas.height - 200) + 50;
        const currentAnimal = animals[Math.floor(Math.random() * animals.length)];
        drawDetectionBox(x, y, 150, 100, currentAnimal.name, confidence - i * 10);
    }
    
    showToast(`⚠️ ${animal.threat} Threat: ${animal.name} detected (${confidence}%)`, 
              animal.threat === 'Critical' ? 'error' : 'success');
    
    // Trigger alert sound simulation
    if (confidence > 80) {
        triggerAlertSound();
    }
}

// Video upload functionality
function uploadVideo() {
    document.getElementById('videoUpload').click();
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoElement = document.createElement('video');
        videoElement.src = url;
        videoElement.muted = true;
        videoElement.loop = true;
        
        videoElement.onloadeddata = () => {
            showToast('Video uploaded successfully! Starting analysis...', 'success');
            uploadedVideo = videoElement;
            if (!isDetecting) {
                startDetection();
            }
        };
    }
}

// Alert sound simulation
function triggerAlertSound() {
    // Create audio context for alert sound
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// Enhanced animation loop
function animate() {
    if (!isDetecting) return;
    
    if (uploadedVideo && uploadedVideo.readyState >= 2) {
        // Draw uploaded video
        ctx.drawImage(uploadedVideo, 0, 0, canvas.width, canvas.height);
        if (!uploadedVideo.paused) {
            uploadedVideo.play();
        }
    } else {
        drawVideoFrame();
    }
    
    // Enhanced random detection with realistic patterns
    const detectionProbability = uploadedVideo ? 0.05 : 0.02;
    if (Math.random() < detectionProbability) {
        simulateDetection();
    }
    
    animationId = requestAnimationFrame(animate);
}

// Enhanced toast notification with icons
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `${icons[type] || icons.info} ${message}`;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Enhanced Intersection Observer with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// Observe elements with enhanced animations
document.querySelectorAll('.feature-card, .problem-card, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Enhanced parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.3;
    hero.style.transform = `translateY(${rate}px)`;
    
    // Parallax for other sections
    document.querySelectorAll('.solution-image').forEach(img => {
        const rect = img.getBoundingClientRect();
        const speed = 0.1;
        const yPos = -(rect.top * speed);
        img.style.transform = `translateY(${yPos}px)`;
    });
});

// Add loading states
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading
    setTimeout(() => {
        document.body.classList.add('loaded');
        showToast('AI Detection System initialized successfully!', 'success');
    }, 1000);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                if (isDetecting) {
                    stopDetection();
                } else {
                    startDetection();
                }
                break;
            case 'd':
                e.preventDefault();
                simulateDetection();
                break;
        }
    }
});

// Add mouse tracking for interactive elements
document.querySelectorAll('.feature-card, .problem-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});