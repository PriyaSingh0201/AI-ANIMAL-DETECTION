import cv2
import numpy as np
import time
import random

class SimpleAnimalDetectionDemo:
    def __init__(self):
        # Simulated animal classes for demo
        self.animals = ['cow', 'dog', 'deer', 'elephant', 'horse', 'sheep']
        self.detection_boxes = []
        self.frame_count = 0
        
        print("🚀 AI Animal Detection Demo Initialized!")
        print("📹 Press 'q' to quit, 's' to simulate detection")

    def simulate_detection(self, frame):
        """Simulate animal detection for demo purposes"""
        height, width = frame.shape[:2]
        detections = []
        
        # Randomly generate detections every 60 frames
        if self.frame_count % 60 == 0 and random.random() > 0.7:
            num_animals = random.randint(1, 2)
            
            for _ in range(num_animals):
                animal = random.choice(self.animals)
                confidence = random.uniform(0.6, 0.95)
                
                # Random position
                x = random.randint(50, width - 200)
                y = random.randint(100, height - 150)
                w = random.randint(80, 150)
                h = random.randint(60, 120)
                
                detections.append({
                    'animal': animal,
                    'confidence': confidence,
                    'box': [x, y, w, h]
                })
        
        return detections

    def draw_detections(self, frame, detections):
        height, width = frame.shape[:2]
        danger_zone_y = int(height * 0.7)  # Bottom 30% is danger zone
        
        # Draw danger zone
        cv2.rectangle(frame, (0, danger_zone_y), (width, height), (0, 0, 255), 2)
        cv2.putText(frame, "DANGER ZONE", (10, danger_zone_y - 10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        animals_in_danger = False
        
        for detection in detections:
            x, y, w, h = detection['box']
            animal = detection['animal']
            confidence = detection['confidence']
            
            # Check if animal is in danger zone
            animal_bottom = y + h
            if animal_bottom > danger_zone_y:
                animals_in_danger = True
                color = (0, 0, 255)  # Red for danger
                thickness = 3
            else:
                color = (0, 255, 0)  # Green for safe
                thickness = 2
            
            # Draw bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, thickness)
            
            # Draw label with confidence
            text = f"{animal}: {confidence:.2f}"
            cv2.putText(frame, text, (x, y - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Display warning if animals in danger zone
        if animals_in_danger:
            cv2.putText(frame, "⚠️ ANIMAL ON ROAD - SLOW DOWN! ⚠️", 
                       (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
            print("🚨 ALERT: Animal detected in danger zone!")
        
        return frame, animals_in_danger

    def run_demo(self, source=0):
        # Initialize video capture
        cap = cv2.VideoCapture(source)
        
        if not cap.isOpened():
            print("❌ Error: Could not open camera")
            return
        
        print("📷 Camera started - Demo running...")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Resize frame
            frame = cv2.resize(frame, (800, 600))
            self.frame_count += 1
            
            # Simulate animal detection
            detections = self.simulate_detection(frame)
            
            # Draw detections and warnings
            frame, danger_alert = self.draw_detections(frame, detections)
            
            # Add system info overlay
            cv2.putText(frame, "AI Animal Detection System - DEMO MODE", 
                       (10, frame.shape[0] - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, f"Detections: {len(detections)} | YOLO Simulation Active", 
                       (10, frame.shape[0] - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            
            # Display frame
            cv2.imshow('AI Animal Detection & Accident Prevention - DEMO', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                # Force detection simulation
                self.frame_count = 0
        
        cap.release()
        cv2.destroyAllWindows()
        print("🔚 Demo stopped")

def main():
    print("🐾 AI Animal Detection Demo (Simulation Mode)")
    print("=" * 50)
    print("📝 This demo simulates YOLO detection for presentation")
    print("🎯 Animals will appear randomly to demonstrate the system")
    print()
    
    demo = SimpleAnimalDetectionDemo()
    demo.run_demo()

if __name__ == "__main__":
    main()