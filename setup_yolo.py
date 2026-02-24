import urllib.request
import os

def download_yolo_files():
    """Download YOLO model files for the demo"""
    
    files_to_download = {
        'yolov4.weights': 'https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights',
        'yolov4.cfg': 'https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov4.cfg',
        'coco.names': 'https://raw.githubusercontent.com/AlexeyAB/darknet/master/data/coco.names'
    }
    
    print("🔄 Downloading YOLO model files...")
    
    for filename, url in files_to_download.items():
        if not os.path.exists(filename):
            print(f"📥 Downloading {filename}...")
            try:
                urllib.request.urlretrieve(url, filename)
                print(f"✅ {filename} downloaded successfully")
            except Exception as e:
                print(f"❌ Error downloading {filename}: {e}")
        else:
            print(f"✅ {filename} already exists")
    
    print("\n🚀 Setup complete! Run 'python animal_detection_demo.py' to start the demo")

if __name__ == "__main__":
    download_yolo_files()