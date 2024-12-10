import React, { useState } from 'react';
import { StyleSheet, Modal, Text, View, ImageBackground, ActivityIndicator, Button, Alert, Icon  } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HOST_NAME, API_ENDPOINTS } from '../env';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectModel, selectDataModule } from '../redux/modelSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";
const dataModules = [
  "bottle", "cable", "capsule", "carpet", "grid", "hazelnut", 
  "leather", "metal_nut", "pill", "screw", "tile", "toothbrush", 
  "transistor", "wood", "zipper",
];

const models = [
  "patchcore",
  "autoencoder",
  "gan"
];
const inferenceChoices = [
  'image',
  'camera',
];


const BeginScreen = () => {
  const [dataModuleValue, setDataModuleValue] = useState(null);
  const [modelValue, setModelValue] = useState(null);
  const [isDataModuleFocus, setIsDataModuleFocus] = useState(false);
  const [isModelFocus, setIsModelFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [choiceValue,] = useState(false);
  const [choice, setChoice] = useState(null);
  const [choiceFocus, setChoiceFocus] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedModel = useSelector(state => state.model.selectedModel);
  const selectedDataModule = useSelector(state => state.model.selectedDataModule);

  const dataModuleDropdownData = dataModules.map(module => ({
    label: module,
    value: module,
  }));

  const getModelDropdownData = () => models.map(model => ({
    label: model,
    value: model,
  }));
  const getInferenceDropdownData = () => inferenceChoices.map(choice => ({
    label: choice,
    value: choice,
  }));

  const renderLabel = (type) => {
    const isFocus = type === 'data' ? isDataModuleFocus : isModelFocus;
    const value = type === 'data' ? dataModuleValue : modelValue;
    const style = type === 'data' ? styles.label : styles.labelModel;
    if (value || isFocus) {
      return (
        <Text style={[style, isFocus && { color: 'red' }]}>
          {type === 'data' ? 'Selected Data Module' : 'Selected Model'}
        </Text>
      );
    }
    return null;
  };

  const confirmSelection = async () => {
    if (!dataModuleValue) {
      Alert.alert("Error", "Please select a data module.");
      return;
    }

    if (!modelValue) {
      Alert.alert("Error", "Please select a model.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${HOST_NAME}${API_ENDPOINTS.POST_INFO}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataModule: dataModuleValue,
          model: modelValue,
          choice: choice,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Data sent successfully!");
        // navigation.navigate('MenuScreen');
        dispatch(selectDataModule(dataModuleValue));
        dispatch(selectModel(modelValue));
      } else {
        Alert.alert("Error", data.message || "Failed to send data.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "An error occurred while sending data.");
      console.error(error);
    }
  };
  // console.log(inferenceWithCamera);

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType="fade" visible={isLoading} onRequestClose={() => {}}>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      </Modal>

      <ImageBackground style={styles.backgroundImage} resizeMode='cover'>
        <View style={styles.content}>
          {renderLabel('data')}
          <Dropdown
            style={[styles.dropdown, isDataModuleFocus && { borderColor: 'black' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataModuleDropdownData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isDataModuleFocus ? 'Select data module' : '...'}
            searchPlaceholder="Search..."
            value={dataModuleValue}
            onFocus={() => setIsDataModuleFocus(true)}
            onBlur={() => setIsDataModuleFocus(false)}
            onChange={item => {
              setDataModuleValue(item.value);
              setModelValue(null); 
              setIsDataModuleFocus(false);
            }}
            renderLeftIcon={() => (
              <MaterialIcons style={styles.icon} color={isDataModuleFocus ? 'red' : 'black'} name="dataset" size={20} />
            )}
          />

          {renderLabel('model')}
          <Dropdown
            style={[styles.dropdown, isModelFocus && { borderColor: 'black' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={getModelDropdownData()}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isModelFocus ? 'Select model' : '...'}
            searchPlaceholder="Search..."
            value={modelValue}
            onFocus={() => setIsModelFocus(true)}
            onBlur={() => setIsModelFocus(false)}
            onChange={item => {
              setModelValue(item.value);
              setIsModelFocus(false);
            }}
            disable={!dataModuleValue}
            renderLeftIcon={() => (
              <MaterialIcons style={styles.icon} color={isModelFocus ? 'red' : 'black'} name="model-training" size={20} />
            )}
          />
      
          <Dropdown
            style={[styles.dropdown, choiceFocus && { borderColor: 'black' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={getInferenceDropdownData()}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            searchPlaceholder="Search..."
            value={choice}
            onFocus={() => setChoiceFocus(true)}
            onBlur={() => setChoiceFocus(false)}
            onChange={item => {
              setChoice(item.value);
              setChoiceFocus(false);
            }}
            renderLeftIcon={() => (
              <MaterialIcons style={styles.icon} color={choiceFocus ? 'red' : 'black'} name="check" size={20} />
            )}
          />
          
          <View style={styles.buttonContainer}>
            <Button style={{color:'white'}} title='Confirm' onPress={confirmSelection} disabled={!dataModuleValue || !modelValue} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default BeginScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
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
  buttonCirlce: {
    width: 25,
    height: 25,
    borderRadius: 180,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonCirlceNotSelected: { 
    width: 25,
    height: 25,
    borderRadius: 180,
    backgroundColor: 'blue',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    width: '40%',
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 5,
    backgroundColor: 'green',
    padding: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    fontSize: 14,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    top: -10,
    zIndex: 1,
    left: 10,
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
  labelModel: {
    position: 'absolute',
    fontSize: 14,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    top: 60,
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
});