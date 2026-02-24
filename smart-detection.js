// AI-Only Animal Detection System
class SmartAnimalDetection {
  constructor() {
    this.isDetecting = false;
    this.currentLocation = null;
    this.detectionHistory = [];
    this.falsePositiveFilter = true;
  }

  // Only trigger GPS alerts when AI confirms animal presence
  async detectAnimal(imageData) {
    if (!this.isDetecting) return null;

    // Simulate AI processing
    const aiConfidence = Math.random();
    
    // High confidence threshold to avoid false positives
    if (aiConfidence > 0.85) {
      const detection = this.generateDetection(aiConfidence);
      
      // Only log GPS when AI is confident about animal
      if (this.currentLocation && detection.confidence > 0.9) {
        this.logGPSDetection(detection);
      }
      
      return detection;
    }
    
    return null; // No animal detected
  }

  generateDetection(confidence) {
    const animals = [
      {name: "Cow", danger: "HIGH", likelihood: 0.3},
      {name: "Deer", danger: "MEDIUM", likelihood: 0.25},
      {name: "Tiger", danger: "CRITICAL", likelihood: 0.1},
      {name: "Dog", danger: "LOW", likelihood: 0.2},
      {name: "Wild Boar", danger: "HIGH", likelihood: 0.15}
    ];

    const animal = animals[Math.floor(Math.random() * animals.length)];
    
    return {
      animal: animal.name,
      danger: animal.danger,
      confidence: confidence,
      timestamp: new Date(),
      verified: true // AI verified detection
    };
  }

  logGPSDetection(detection) {
    if (!this.currentLocation) return;

    const gpsLog = {
      ...detection,
      location: {
        lat: this.currentLocation.lat,
        lon: this.currentLocation.lon,
        accuracy: this.currentLocation.accuracy || 'unknown'
      },
      speed: this.currentLocation.speed || 0,
      alertSent: true
    };

    this.detectionHistory.push(gpsLog);
    
    // Send to authorities/server only for verified AI detections
    this.sendEmergencyAlert(gpsLog);
    
    console.log('AI-Verified Animal Detection with GPS:', gpsLog);
  }

  sendEmergencyAlert(detection) {
    // Only send alerts for AI-confirmed detections
    if (detection.verified && detection.confidence > 0.9) {
      console.log(`🚨 EMERGENCY ALERT: ${detection.animal} detected at ${detection.location.lat}, ${detection.location.lon}`);
      
      // In real implementation:
      // - Send SMS to authorities
      // - Update traffic management system
      // - Alert nearby vehicles
      // - Log in database
    }
  }

  updateLocation(location) {
    this.currentLocation = location;
  }

  startDetection() {
    this.isDetecting = true;
  }

  stopDetection() {
    this.isDetecting = false;
  }

  getDetectionHistory() {
    return this.detectionHistory.filter(d => d.verified);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartAnimalDetection;
}