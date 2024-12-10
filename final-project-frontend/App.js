import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './components/redux/store';
import BeginScreen from './components/screen/BeginScreen';
import MenuScreen from './components/screen/MenuScreen';
import CameraInference from './components/screen/CameraScreen';
import AnalysisScreen from './components/screen/AnalysisScreen';
import ImageInferenceScreen from './components/screen/ImageInference';
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Selection Screen - Merry Christmas">
          <Stack.Screen name="Selection Screen - Merry Christmas" component={BeginScreen} />
          {/* <Stack.Screen name="Menu Screen" component={MenuScreen} /> */}
          <Stack.Screen name="Camera Inference" component={CameraInference} />
          <Stack.Screen name="Image Inference" component={ImageInferenceScreen} />
          <Stack.Screen name="Analysis Screen" component={AnalysisScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
