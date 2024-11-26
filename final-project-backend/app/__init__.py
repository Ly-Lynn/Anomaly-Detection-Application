from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from app.routes import main

# Khởi tạo socketio tại đây
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Cung cấp CORS cho frontend

    # Khởi tạo SocketIO với ứng dụng Flask
    socketio.init_app(app, cors_allowed_origins="*")

    # Đăng ký blueprint của các route
    app.register_blueprint(main)
    
    return app, socketio
