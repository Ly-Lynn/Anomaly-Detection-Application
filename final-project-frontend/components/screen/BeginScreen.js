import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
const mvtec = [
  "bottle", "cable", "capsule", "carpet", "grid", "hazelnut", 
  "leather", "metal_nut", "pill", "screw", "tile", "toothbrush", 
  "transistor", "wood", "zipper",
];
const data = mvtec.map((model) => ({
  label: model,
  value: model,
}));

const BeginScreen = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'red' }]}>
          {'Data module selected'}
        </Text>
      );
    }
    return null;
  };

  const confirmSelection = async () => {
    if (!value) {
      Alert.alert("Error", "Please select a data module.");
      return ;
    }
    try {
      const response = await fetch('https://your-backend-api.com/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedModule: value,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Data sent successfully!");
        console.log(data);
      } else {
        Alert.alert("Error", "Failed to send data.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending data.");
      console.error(error);
    }
    
  }

  return (
    <ImageBackground 
      source={require('../../assets/bg4.jpg')} 
      style={styles.container}
      resizeMode='cover'
    >
      <View style={styles.content}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select data module' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <MaterialIcons
              style={styles.icon}
              color={isFocus ? 'red' : 'black'}
              name="dataset"
              size={20}
            />
          )}
        />
        <View style={styles.buttonContainer}>
          <Button color='white' title='Confirm' onPress={confirmSelection} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default BeginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1.5,
    borderRadius: 0,
    paddingHorizontal: 8,
    width: '100%',
    marginBottom: 20, 
  },
  buttonContainer: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1.5,
    width: '30%',
    borderRadius: 5,
    backgroundColor: 'green',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    // marginBottom: 5,
    top: 10,
    zIndex: 1,
    left: 10,
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});