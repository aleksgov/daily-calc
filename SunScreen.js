import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import { useNavigation } from '@react-navigation/native';
import Sun from "./Sun";

export default function SunScreen() {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        NotoSans_500Medium,
        NotoSans_700Bold,
    });

    const handleStart = () => {
        navigation.navigate('Start');
    };

    if (!fontsLoaded) {
        return (
            <View style={[styles.container, { backgroundColor: '#fff' }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Sun
                label="Посмотреть план"
                onStart={handleStart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});