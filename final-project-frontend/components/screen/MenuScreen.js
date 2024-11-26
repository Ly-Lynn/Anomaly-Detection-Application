import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Go to Camera Inference" onPress={() => navigation.navigate('CameraInference')} />
      <Button title="Go to Analysis" onPress={() => navigation.navigate('AnalysisScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
