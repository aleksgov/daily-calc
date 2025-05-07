import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Easing } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Sun from './Sun';
import Wave from "./Wave";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const WAVE_HEIGHT = verticalScale(550);

export default function StartScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    useRef(new Animated.Value(verticalScale(210))).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 100000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleStart = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start(() => {
            console.log("Кнопка нажата");
            AsyncStorage.setItem('@first_launch', 'true');
            navigation.navigate('Quest');
        });
    }, [scaleAnim, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerBackground}>
                    <Text style={styles.headerText}>MyCalory</Text>
                </View>
            </View>

            <Sun
                onStart={handleStart}
                labelBlocks={[
                    {
                        text: 'Начать',
                        style: {
                            fontFamily: 'NotoSans_700Bold',
                            fontWeight: 'bold',
                            fontSize: moderateScale(24),
                            fill: '#ffffff',
                            dy: moderateScale(0),
                        },
                    },
                ]}
            />

            <View style={styles.waveContainer}>
                <Wave />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContainer: {
        width: scale(160),
        height: verticalScale(40),
        position: 'absolute',
        top: verticalScale(60),
        borderRadius: moderateScale(75),
        zIndex: 2,
    },
    headerBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFA834',
        borderRadius: moderateScale(75),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(10),
        elevation: 5,
    },
    headerText: {
        color: 'white',
        fontSize: width > 400 ? moderateScale(18) : moderateScale(14),
        fontFamily: 'Montserrat',
        fontWeight: '700',
        letterSpacing: moderateScale(1.2),
    },
    waveContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        zIndex: 2,
    },
});