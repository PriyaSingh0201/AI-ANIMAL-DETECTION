
from flask import Flask, render_template, Response
import cv2
from ultralytics import YOLO
import datetime
import csv
import os

app = Flask(__name__)

model = YOLO("yolov8n.pt")
camera = cv2.VideoCapture(0)

animal_list = ["dog","cat","cow","sheep","horse","elephant","bear","zebra","giraffe"]

LOG_FILE = "detection_log.csv"

if not os.path.exists(LOG_FILE):
    with open(LOG_FILE,"w",newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Time","Animal"])

def log_detection(animal):
    with open(LOG_FILE,"a",newline='') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.datetime.now(), animal])

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break

        results = model(frame, stream=True)

        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]

                if label in animal_list:
                    x1,y1,x2,y2 = map(int, box.xyxy[0])

                    cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)
                    cv2.putText(frame,f"Animal: {label}",(x1,y1-10),
                                cv2.FONT_HERSHEY_SIMPLEX,0.8,(0,255,0),2)

                    cv2.putText(frame,"WARNING! ANIMAL DETECTED",(20,40),
                                cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,255),3)

                    log_detection(label)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/video')
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)
