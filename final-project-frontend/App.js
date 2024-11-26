import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './components/redux/store';
import BeginScreen from './components/screen/BeginScreen';
import MenuScreen from './components/screen/MenuScreen';
import CameraInference from './components/screen/CameraScreen';
import AnalysisScreen from './components/screen/AnalysisScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="BeginScreen">
          <Stack.Screen name="BeginScreen" component={BeginScreen} />
          <Stack.Screen name="MenuScreen" component={MenuScreen} />
          <Stack.Screen name="CameraInference" component={CameraInference} />
          <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
