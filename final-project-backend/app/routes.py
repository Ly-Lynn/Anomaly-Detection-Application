from flask_socketio import emit
import base64
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from flask import Blueprint, request, jsonify
from streamlit_app.app import app
import os

main = Blueprint('main', __name__)

def process_frame(image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    heatmap = cv2.applyColorMap(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), cv2.COLORMAP_JET)
    _, heatmap_buffer = cv2.imencode('.jpg', heatmap)
    heatmap_base64 = base64.b64encode(heatmap_buffer).decode('utf-8')
    return heatmap_base64

from streamlit_app.app import socketio

@socketio.on('message')
def handle_message(data):
    print("Received frame from client")
    heatmap = process_frame(data)
    emit('heatmap', heatmap)

@app.route('/post_info', methods=['POST'])
def get_info():
    try:
        data = request.get_json()
        data_module = data.get('dataModule')
        model = data.get('model')

        print(f"Data Module: {data_module}, Model: {model}")

        return jsonify({"message": "Data received successfully", "status": "success"}), 200

    except Exception as e:
        # Handle any errors
        return jsonify({"message": f"An error occurred: {str(e)}", "status": "error"}), 500
