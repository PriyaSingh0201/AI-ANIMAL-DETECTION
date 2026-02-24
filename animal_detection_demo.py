import cv2
import numpy as np
import time

class AnimalDetectionSystem:
    def __init__(self):
        # Load YOLO model
        self.net = cv2.dnn.readNet('yolov4.weights', 'yolov4.cfg')
        
        # Load class names
        with open('coco.names', 'r') as f:
            self.classes = [line.strip() for line in f.readlines()]
        
        # Target animals for detection
        self.target_animals = ['cow', 'dog', 'cat', 'horse', 'sheep', 'elephant', 'bear', 'zebra']
        
        # Get output layer names
        self.output_layers = [self.net.getLayerNames()[i[0] - 1] for i in self.net.getUnconnectedOutLayers()]
        
        # Colors for bounding boxes
        self.colors = np.random.uniform(0, 255, size=(len(self.classes), 3))
        
        print("🚀 AI Animal Detection System Initialized!")
        print("📹 Press 'q' to quit, 's' to save screenshot")

    def detect_animals(self, frame):
        height, width = frame.shape[:2]
        
        # Create blob from frame
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        self.net.setInput(blob)
        
        # Run detection
        outputs = self.net.forward(self.output_layers)
        
        # Process detections
        boxes, confidences, class_ids = [], [], []
        
        for output in outputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                
                # Filter for target animals with confidence > 0.5
                if confidence > 0.5 and self.classes[class_id] in self.target_animals:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        
        return boxes, confidences, class_ids

    def draw_detections(self, frame, boxes, confidences, class_ids):
        height, width = frame.shape[:2]
        danger_zone_y = int(height * 0.7)  # Bottom 30% is danger zone
        
        # Draw danger zone
        cv2.rectangle(frame, (0, danger_zone_y), (width, height), (0, 0, 255), 2)
        cv2.putText(frame, "DANGER ZONE", (10, danger_zone_y - 10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        # Apply Non-Maximum Suppression
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
        
        animals_in_danger = False
        
        if len(indexes) > 0:
            for i in indexes.flatten():
                x, y, w, h = boxes[i]
                label = self.classes[class_ids[i]]
                confidence = confidences[i]
                
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
                text = f"{label}: {confidence:.2f}"
                cv2.putText(frame, text, (x, y - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Display warning if animals in danger zone
        if animals_in_danger:
            cv2.putText(frame, "⚠️ ANIMAL ON ROAD - SLOW DOWN! ⚠️", 
                       (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
            print("🚨 ALERT: Animal detected in danger zone!")
        
        return frame, animals_in_danger

    def run_detection(self, source=0):
        # Initialize video capture
        if isinstance(source, str):
            cap = cv2.VideoCapture(source)
            print(f"📁 Loading video: {source}")
        else:
            cap = cv2.VideoCapture(source)
            print("📷 Using webcam")
        
        if not cap.isOpened():
            print("❌ Error: Could not open video source")
            return
        
        fps_counter = 0
        start_time = time.time()
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("📹 End of video or camera disconnected")
                break
            
            # Resize frame for better performance
            frame = cv2.resize(frame, (800, 600))
            
            # Detect animals
            boxes, confidences, class_ids = self.detect_animals(frame)
            
            # Draw detections and warnings
            frame, danger_alert = self.draw_detections(frame, boxes, confidences, class_ids)
            
            # Calculate and display FPS
            fps_counter += 1
            if fps_counter % 30 == 0:
                end_time = time.time()
                fps = 30 / (end_time - start_time)
                start_time = end_time
            
            # Add system info overlay
            cv2.putText(frame, f"AI Animal Detection System", (10, frame.shape[0] - 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, f"Detections: {len(boxes)} | YOLO Active", (10, frame.shape[0] - 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            
            # Display frame
            cv2.imshow('AI Animal Detection & Accident Prevention', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                cv2.imwrite(f'detection_screenshot_{int(time.time())}.jpg', frame)
                print("📸 Screenshot saved!")
        
        cap.release()
        cv2.destroyAllWindows()
        print("🔚 Detection system stopped")

def main():
    print("🐾 AI-Based Animal Detection & Accident Prevention System")
    print("=" * 60)
    
    # Initialize detection system
    detector = AnimalDetectionSystem()
    
    # Choose input source
    print("\n📋 Select input source:")
    print("1. Webcam (default)")
    print("2. Video file")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == '2':
        video_path = input("Enter video file path: ").strip()
        detector.run_detection(video_path)
    else:
        detector.run_detection(0)  # Webcam

if __name__ == "__main__":
    main()