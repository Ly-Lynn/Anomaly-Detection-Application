import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { selectInferenceHistory } from '../redux/historySlice';

export default function AnalysisScreen() {
    const history = useSelector(selectInferenceHistory);

    return (
        <View style={styles.container}>
            <Text>Inference History</Text>
            <FlatList
                data={history}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image source={{ uri: item.frameUri }} style={styles.image} />
                        <Image source={{ uri: item.heatmapUri }} style={styles.image} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
        image: {
                width: 150,
                height: 150,
                marginBottom: 10,
                resizeMode: 'contain',
        },
        container: {
                flex: 1,
                padding: 20,
        },
        item: {
                marginBottom: 15,
                borderBottomWidth: 1,
                paddingBottom: 10,
                alignItems: 'center',
        },
});
