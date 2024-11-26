import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, StyleSheet, Text, View, Image, Alert } from 'react-native';
import { io } from 'socket.io-client';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_SIZE } from '../../config';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addInferenceResult, resetHistory } from '../redux/historySlice';

export default function CameraScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const inferenceHistory = useSelector((state) => state.history.inferenceHistory);

  const [permission] = useCameraPermissions();
  const [heatmapUri, setHeatmapUri] = useState(null);
  const [frameUri, setFrameUri] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const socket = useRef(null);
  const cameraRef = useRef(null);
  const captureInterval = useRef(null); 

  const initializeSocket = useCallback(() => {
    socket.current = io('http://192.168.2.4:5000', { 
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.current.on('connect', () => {
      dispatch(resetHistory());
      console.log('SocketIO connection opened');
    });

    socket.current.on('connect_error', (error) => {
      console.log('SocketIO connection error:', error);
      Alert.alert('Connection Error', 'Unable to connect to server');
    });

    socket.current.on('message', async (data) => {
      try {
        console.log('Received heatmap data length:', data.length);
        
        if (data && data.startsWith('data:image/jpeg;base64,')) {
          setHeatmapUri(data);
          dispatch(addInferenceResult({ frameUri, heatmapUri: data }));
          console.log('Heatmap URI set successfully');
        } else {
          console.log('Invalid heatmap data received');
        }
      } catch (error) {
        console.error('Error processing heatmap:', error);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const cleanupSocket = initializeSocket();

    const setupCamera = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera access is required');
        }
      } catch (error) {
        console.error('Camera permission error:', error);
      }
    };

    setupCamera();

    return () => {
      cleanupSocket();
      if (captureInterval.current) {
        clearInterval(captureInterval.current);
      }
    };
  }, [initializeSocket]);

  const captureFrame = async () => {
    if (!cameraRef.current || !socket.current?.connected) {
      Alert.alert('Error', 'Camera or socket not ready');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        quality: 1, 
      });

      setOriginalSize([photo.width, photo.height]);

      const preprocessedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: IMAGE_SIZE, height: IMAGE_SIZE } }], 
        { 
          base64: true,
        }
      );

      setFrameUri(photo.uri);

      socket.current.emit('message', `data:image/jpeg;base64,${preprocessedImage.base64}`);
      
      console.log('Sending preprocessed image...');
      console.log('Image size:', preprocessedImage.base64.length);
      
    } catch (error) {
      console.error('Error capturing frame:', error);
      Alert.alert('Capture Error', error.message);
    }
  };

  if (!permission?.granted) {
    return <Text>No access to camera</Text>;
  }

  const startCaptureInterval = (interval) => {
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
    captureInterval.current = setInterval(captureFrame, interval);
  };

  const stopCaptureInterval = () => {
    Alert.alert('Stop', 'Stop Camera');
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
    }
  };

  return (
    <View style={styles.container}>
      {heatmapUri && (
        <Image 
          source={{ uri: heatmapUri }} 
          style={styles.overlay} 
          resizeMode="cover"
        />
      )}

      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        type='back'
      >
      </CameraView>

      {frameUri && (
        <Image 
          source={{ uri: frameUri }} 
          style={styles.preview} 
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Start Capture" onPress={() => startCaptureInterval(800)} />
        <Button title="Stop Capture" onPress={stopCaptureInterval} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 30,  
    left: '50%',
    transform: [{ translateX: '-50%' }],
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    width: 224,
    height: 224,
    top: 50,
    left: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  preview: {
    position: 'absolute',
    width: 224,
    height: 224,
    top: 50,
    left: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});