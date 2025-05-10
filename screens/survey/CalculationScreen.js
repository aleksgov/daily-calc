import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, moderateScale } from 'react-native-size-matters';
import { Circle } from 'react-native-progress';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useFonts, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import Sun from './components/Sun';

const PROGRESS_CIRCLE_SIZE = scale(130);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const messages = [
    "Анализируем полученные ответы",
    "Подбираем блюда",
    "Определяем количество КБЖУ"
];

export default function CalculationScreen({ navigation }) {
    const [progress, setProgress] = useState(0);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [stage, setStage] = useState('progress');

    const [fontsLoaded] = useFonts({
        NotoSansMedium: NotoSans_500Medium,
        NotoSansBold: NotoSans_700Bold,
    });

    useEffect(() => {
        if (progress >= 1) {
            setStage('transition');
            setTimeout(() => {
                setStage('sun');
            }, 500);
            return;
        }
        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + 0.005;
                return next > 1 ? 1 : next;
            });
        }, 5);
        return () => clearInterval(timer);
    }, [progress]);

    useEffect(() => {
        if (progress < 0.33) {
            setCurrentMessageIndex(0);
        } else if (progress < 0.66) {
            setCurrentMessageIndex(1);
        } else {
            setCurrentMessageIndex(2);
        }
    }, [progress]);

    if (stage === 'sun') {
        if (!fontsLoaded) {
            return (
                <View style={[styles.container, { backgroundColor: '#fff' }]}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.SunWrapper}>
                    <Sun
                        onStart={() => {
                            AsyncStorage.setItem('@first_launch', 'false');
                            navigation.replace('Main');
                        }}
                        offsetY={moderateScale(50)}
                        labelBlocks={[
                            {
                                text: 'Посмотреть',
                                style: {
                                    fontFamily: 'NotoSansBold',
                                    fontSize: moderateScale(18),
                                    fill: '#ffffff',
                                    dy: moderateScale(-5),
                                }
                            },
                            {
                                text: 'план',
                                style: {
                                    fontFamily: 'NotoSansBold',
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Расчет питания...</Text>

            <View style={styles.ProgressWrapper}>
                <Animated.View>
                    <Circle
                        progress={progress}
                        size={PROGRESS_CIRCLE_SIZE}
                        thickness={8}
                        color="#F3E626"
                        unfilledColor="#F5F5F5"
                        borderWidth={0}
                        showsText={true}
                        textStyle={styles.progressText}
                    />
                </Animated.View>
            </View>

            {stage === 'progress' && (
                <Animated.Text
                    style={styles.message}
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                    key={currentMessageIndex}
                >
                    {messages[currentMessageIndex]}
                </Animated.Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: '600',
        color: '#000',
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.3,
        alignSelf: 'center',
    },
    ProgressWrapper: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 2 - PROGRESS_CIRCLE_SIZE / 2,
        left: SCREEN_WIDTH / 2 - PROGRESS_CIRCLE_SIZE / 2,
        zIndex: 2,
    },
    SunWrapper: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: SCREEN_HEIGHT / 8,
        left: SCREEN_WIDTH / 2,
        zIndex: 3,
    },
    progressText: {
        fontSize: moderateScale(30),
        fontWeight: 'bold',
        color: '#000',
    },
    message: {
        fontSize: moderateScale(18),
        color: '#666',
        textAlign: 'center',
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.35,
        alignSelf: 'center',
        maxWidth: scale(250),
    },
    captionContainer: {
        position: 'absolute',
        alignItems: 'flex-start',
        bottom: SCREEN_HEIGHT * 0.2,
        left: SCREEN_WIDTH / 10,
        zIndex: 4,
    },
    captionLine1: {
        fontFamily: 'NotoSansMedium',
        fontSize: moderateScale(30),
        color: '#000',
    },
    captionLine2: {
        fontFamily: 'NotoSansMedium',
        fontSize: moderateScale(38),
        color: '#000',
        marginTop: moderateScale(-15),
    },
});