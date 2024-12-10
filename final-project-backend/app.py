import eventlet
eventlet.monkey_patch()

from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
from flask_socketio import emit
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from flask import Blueprint


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")


def process_frame(image):
    # Xử lý anomaly detection
    # Resize nếu cần    
    
    # Chuyển sang grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Áp dụng gaussian blur
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Tạo heatmap
    heatmap = cv2.applyColorMap(blur, cv2.COLORMAP_JET)
    
    return heatmap

@socketio.on('connect')
def test_connect(data):
    print("Client connected with data: ", data)
    print("Client connected")

@socketio.on('message')
def handle_message(data):
    try:
        if ',' in data:
            header, data = data.split(',')
        
        image_data = base64.b64decode(data)
        
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        heatmap = process_frame(image)
        
        _, buffer = cv2.imencode('.jpg', heatmap)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        
        emit('message', f'data:image/jpeg;base64,{heatmap_base64}', broadcast=True)
    
    except Exception as e:
        print(f"Error processing image: {e}")

@app.route('/post_info', methods=['POST'])
def get_info():
    try:
        data = request.get_json()
        data_module = data.get('dataModule')
        model = data.get('model')
        choice = data.get('choice')
        print(f"Data Module: {data_module}, Model: {model}, Choice: {choice}")

        return jsonify({"message": "Data received successfully", "status": "success"}), 200

    except Exception as e:
        # Handle any errors
        return jsonify({"message": f"An error occurred: {str(e)}", "status": "error"}), 500

if __name__ == '__main__':
    socketio.run(app,host= '0.0.0.0', port=5000, debug=True)