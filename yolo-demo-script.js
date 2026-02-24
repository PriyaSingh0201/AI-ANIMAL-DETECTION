// YOLO Detection Simulation - Mimics Real Python Implementation
class YOLODetectionSystem {
    constructor() {
        this.animals = [
            { name: 'Cow', threat: 'High', commonInIndia: true },
            { name: 'Dog', threat: 'Medium', commonInIndia: true },
            { name: 'Deer', threat: 'High', commonInIndia: true },
            { name: 'Elephant', threat: 'Critical', commonInIndia: true },
            { name: 'Horse', threat: 'Medium', commonInIndia: false },
            { name: 'Sheep', threat: 'Low', commonInIndia: true }
        ];
        
        this.yoloModel = {
            loaded: false,
            layers: 106,
            classes: 80,
            inputSize: [416, 416],
            confidence_threshold: 0.5,
            nms_threshold: 0.4
        };
        
        this.detectionHistory = [];
        this.processingStats = {
            avgProcessingTime: 33, // ms
            fps: 30,
            totalDetections: 0
        };
        
        this.initializeYOLO();
    }
    
    initializeYOLO() {
        // Simulate YOLO model loading
        setTimeout(() => {
            this.yoloModel.loaded = true;
            document.getElementById('yoloStatus').textContent = 'Ready';
            showToast('🧠 YOLO Model Loaded Successfully!', 'success');
        }, 2000);
    }
    
    // Simulate YOLO detection process
    processFrame(frame) {
        const startTime = performance.now();
        
        // Step 1: Preprocess image (resize to 416x416)
        const preprocessed = this.preprocessImage(frame);
        
        // Step 2: Forward pass through YOLO network
        const rawDetections = this.forwardPass(preprocessed);
        
        // Step 3: Post-process detections
        const filteredDetections = this.postProcess(rawDetections);
        
        // Step 4: Apply Non-Maximum Suppression
        const finalDetections = this.applyNMS(filteredDetections);
        
        const processingTime = performance.now() - startTime;
        document.getElementById('processingTime').textContent = Math.round(processingTime) + 'ms';
        
        return finalDetections;
    }
    
    preprocessImage(frame) {
        // Simulate image preprocessing
        return {
            resized: [416, 416],
            normalized: true,
            blob: 'tensor_data'
        };
    }
    
    forwardPass(preprocessed) {
        // Simulate YOLO forward pass through 106 layers
        const detections = [];
        
        // Randomly generate detections based on probability
        if (Math.random() < 0.15) { // 15% chance of detection per frame
            const numDetections = Math.random() < 0.7 ? 1 : 2;
            
            for (let i = 0; i < numDetections; i++) {
                const animal = this.animals[Math.floor(Math.random() * this.animals.length)];
                
                detections.push({
                    class_id: animal.name,
                    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
                    bbox: {
                        x: Math.random() * 600 + 100,
                        y: Math.random() * 300 + 100,
                        width: Math.random() * 100 + 80,
                        height: Math.random() * 80 + 60
                    },
                    threat_level: animal.threat
                });
            }
        }
        
        return detections;
    }
    
    postProcess(rawDetections) {
        // Filter detections by confidence threshold
        return rawDetections.filter(det => det.confidence >= this.yoloModel.confidence_threshold);
    }
    
    applyNMS(detections) {
        // Simulate Non-Maximum Suppression
        // In real implementation, this removes overlapping boxes
        return detections; // Simplified for demo
    }
    
    checkDangerZone(detections, canvasHeight) {
        const dangerZoneY = canvasHeight * 0.7;
        let animalsInDanger = [];
        
        detections.forEach(detection => {
            const animalBottom = detection.bbox.y + detection.bbox.height;
            if (animalBottom > dangerZoneY) {
                animalsInDanger.push(detection);
            }
        });
        
        return animalsInDanger;
    }
}

// Enhanced Canvas Demo with YOLO Simulation
const yoloSystem = new YOLODetectionSystem();
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
let isDetecting = false;
let animationId;
let detectionCount = 0;
let frameCount = 0;

// Initialize canvas
function initCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '24px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('AI Detection System Ready', canvas.width/2, canvas.height/2);
    ctx.font = '16px Poppins';
    ctx.fillText('YOLO Model Loading...', canvas.width/2, canvas.height/2 + 40);
}

initCanvas();

// Enhanced video simulation with YOLO process
function drawVideoFrame() {
    frameCount++;
    
    // Create realistic road scene
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.6, '#16213e');
    gradient.addColorStop(1, '#0f1419');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road with perspective
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.65);
    ctx.lineTo(canvas.width * 0.75, canvas.height * 0.65);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Animated road markings
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    const time = Date.now() * 0.01;
    for (let i = 0; i < 6; i++) {
        const y = canvas.height * 0.75 + i * 25 + (time % 50);
        if (y < canvas.height) {
            ctx.setLineDash([30, 15]);
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.47, y);
            ctx.lineTo(canvas.width * 0.53, y);
            ctx.stroke();
        }
    }
    ctx.setLineDash([]);

    // Draw danger zone
    const dangerZoneY = canvas.height * 0.7;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(0, dangerZoneY, canvas.width, canvas.height - dangerZoneY);
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = '14px Poppins';
    ctx.fillText('DANGER ZONE', 80, dangerZoneY - 10);

    // Add system overlay
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    const timestamp = new Date().toLocaleTimeString();
    ctx.fillText(`LIVE FEED: ${timestamp}`, 10, 25);
    ctx.fillText(`Frame: ${frameCount}`, 10, 45);
    ctx.fillText(`YOLO v4 - 106 Layers`, 10, 65);
    
    // Process frame through YOLO if model is loaded
    if (yoloSystem.yoloModel.loaded) {
        const detections = yoloSystem.processFrame(canvas);
        drawDetections(detections);
        
        // Check danger zone
        const dangerAnimals = yoloSystem.checkDangerZone(detections, canvas.height);
        updateDangerStatus(dangerAnimals);
    }
}

function drawDetections(detections) {
    detections.forEach(detection => {
        const { bbox, class_id, confidence, threat_level } = detection;
        
        // Color based on threat level
        let color;
        switch(threat_level) {
            case 'Critical': color = '#ff0000'; break;
            case 'High': color = '#ff6600'; break;
            case 'Medium': color = '#ffff00'; break;
            case 'Low': color = '#00ff00'; break;
            default: color = '#00ff00';
        }
        
        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
        
        // Draw confidence bar
        const barWidth = bbox.width;
        const barHeight = 8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(bbox.x, bbox.y - 35, barWidth, barHeight);
        ctx.fillStyle = color;
        ctx.fillRect(bbox.x, bbox.y - 35, barWidth * confidence, barHeight);
        
        // Draw label
        ctx.fillStyle = color;
        ctx.fillRect(bbox.x, bbox.y - 25, class_id.length * 8 + 60, 20);
        ctx.fillStyle = '#000';
        ctx.font = '14px Poppins';
        ctx.fillText(`${class_id} ${(confidence * 100).toFixed(1)}%`, bbox.x + 5, bbox.y - 10);
        
        // Update detection count
        detectionCount++;
        document.getElementById('detectionCount').textContent = detections.length;
        document.getElementById('confidence').textContent = `${(confidence * 100).toFixed(1)}%`;
    });
}

function updateDangerStatus(dangerAnimals) {
    const dangerStatus = document.getElementById('dangerStatus');
    
    if (dangerAnimals.length > 0) {
        dangerStatus.textContent = `⚠️ ${dangerAnimals.length} Animal(s)`;
        dangerStatus.style.color = '#ff0000';
        
        // Show warning overlay
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, 80);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ ANIMAL ON ROAD - SLOW DOWN! ⚠️', canvas.width/2, 35);
        ctx.fillText(`${dangerAnimals[0].threat_level} Threat Detected`, canvas.width/2, 60);
        
        // Console alert (simulating Python print)
        console.log(`🚨 ALERT: ${dangerAnimals[0].class_id} detected in danger zone! Confidence: ${(dangerAnimals[0].confidence * 100).toFixed(1)}%`);
        
        // Audio alert
        triggerAlertSound();
        
        showToast(`🚨 ${dangerAnimals[0].threat_level} Threat: ${dangerAnimals[0].class_id} on road!`, 'error');
    } else {
        dangerStatus.textContent = 'Clear';
        dangerStatus.style.color = '#00ff00';
    }
}

// Start detection with YOLO initialization
function startDetection() {
    if (isDetecting) return;
    
    if (!yoloSystem.yoloModel.loaded) {
        showToast('⏳ YOLO Model still loading...', 'warning');
        return;
    }
    
    isDetecting = true;
    document.getElementById('aiStatus').textContent = 'Detecting';
    showToast('🚀 YOLO Detection Started!', 'success');
    animate();
}

function stopDetection() {
    isDetecting = false;
    document.getElementById('aiStatus').textContent = 'Active';
    document.getElementById('dangerStatus').textContent = 'Stopped';
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    showToast('⏹️ Detection Stopped', 'error');
}

function simulateDetection() {
    if (!isDetecting) {
        showToast('❌ Please start detection first', 'error');
        return;
    }
    
    // Force a detection by temporarily increasing probability
    const originalRandom = Math.random;
    Math.random = () => 0.1; // Force detection
    
    setTimeout(() => {
        Math.random = originalRandom;
    }, 100);
    
    showToast('🎯 Animal Detection Simulated!', 'success');
}

function animate() {
    if (!isDetecting) return;
    
    drawVideoFrame();
    animationId = requestAnimationFrame(animate);
}

// Audio alert system
function triggerAlertSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create alert pattern
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Enhanced toast notifications
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

// Mobile menu and navigation (keeping existing functionality)
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu) {
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
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks) navLinks.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                if (isDetecting) stopDetection();
                else startDetection();
                break;
            case 'd':
                e.preventDefault();
                simulateDetection();
                break;
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
        showToast('🧠 AI Detection System Initialized!', 'success');
    }, 1000);
});

// Video upload functionality
function uploadVideo() {
    document.getElementById('videoUpload').click();
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        showToast('📹 Video uploaded! Analysis starting...', 'success');
        if (!isDetecting) startDetection();
    }
}