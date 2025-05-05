import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import { useNavigation } from '@react-navigation/native';
import Sun from './Sun';
import { moderateScale } from 'react-native-size-matters';

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
            <View style={{ marginBottom: moderateScale(470), justifyContent: 'center', alignItems: 'center', }}>
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

            <View style={styles.captionContainer}>
                <Text style={styles.captionLine1}>вперёд к</Text>
                <Text style={styles.captionLine2}>лучшей жизни!</Text>
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
    captionContainer: {
        alignItems: 'left',
        marginBottom: moderateScale(70),
        marginLeft: moderateScale(-30),
        zIndex: 1,
    },
    captionLine1: {
        fontFamily: 'NotoSans_500Medium',
        fontSize: moderateScale(30),
        color: '#000000',
    },
    captionLine2: {
        fontFamily: 'NotoSans_500Medium',
        fontSize: moderateScale(38),
        color: '#000000',
        marginTop: moderateScale(-15),
    },
});