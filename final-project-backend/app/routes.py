from flask_socketio import emit
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from flask import Blueprint

main = Blueprint('main', __name__)

def process_frame(image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # Tạo heatmap (giả lập)
    heatmap = cv2.applyColorMap(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), cv2.COLORMAP_JET)
    _, heatmap_buffer = cv2.imencode('.jpg', heatmap)
    heatmap_base64 = base64.b64encode(heatmap_buffer).decode('utf-8')
    return heatmap_base64

# Đảm bảo socketio được nhập từ file app.py
from app import socketio

@socketio.on('message')
def handle_message(data):
    print("Received frame from client")
    heatmap = process_frame(data)  # Xử lý frame và tạo heatmap
    emit('heatmap', heatmap)  # Gửi heatmap về cho client
