import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import { useNavigation } from '@react-navigation/native';
import Sun from "./Sun";
import {moderateScale} from "react-native-size-matters";

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
            <View style={{ marginBottom: moderateScale(600), justifyContent: 'center', alignItems: 'center', }}>
                <Sun
                    onStart={handleStart}
                    offsetY={moderateScale(50)}
                    labelBlocks={[
                        { text: 'Посмотреть',
                            style: {
                                fontFamily: 'NotoSans_700Bold',
                                fontSize: moderateScale(18),
                                fill: '#ffffff',
                                dy: moderateScale(-5),
                            }
                        },
                        { text: 'план',
                            style: {
                                fontFamily: 'NotoSans_700Bold',
                                fontSize: moderateScale(18),
                                fill: '#ffffff',
                                dy: moderateScale(20),
                            }
                        },
                    ]}
                />
            </View>
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