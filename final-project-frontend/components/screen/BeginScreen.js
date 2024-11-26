import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function BeginScreen({ navigation }) {
  const handleSelectModel = () => {
    // Logic để chọn model, có thể lưu trong Redux hoặc state
    navigation.navigate('MenuScreen');
  };

  return (
    <View style={styles.container}>
      <Button title="Select Model" onPress={handleSelectModel} />
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
