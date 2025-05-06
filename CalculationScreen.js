import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Circle } from 'react-native-progress';
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useFonts, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import Sun from './Sun';

const PROGRESS_CIRCLE_SIZE = scale(130);

const messages = [
    "Анализируем полученные ответы",
    "Подбираем блюда",
    "Определяем количество КБЖУ"
];

export default function CalculationScreen({ navigation }) {
    const [progress, setProgress] = useState(0);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [stage, setStage] = useState('progress');

    const scaleValue = useSharedValue(1);
    const opacityValue = useSharedValue(1);

    const [fontsLoaded] = useFonts({
        NotoSans_500Medium,
        NotoSans_700Bold,
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

    useEffect(() => {
        if (stage === 'sun') {
            scaleValue.value = withTiming(1.5, { duration: 5000 });
            opacityValue.value = withTiming(0, { duration: 1000 });
        }
    }, [stage]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }],
        opacity: opacityValue.value,
    }));

    if (stage === 'sun') {
        if (!fontsLoaded) {
            return (
                <View style={[styles.container, { backgroundColor: '#fff' }]}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.sunContainer}>
                    <Sun
                        onStart={() => navigation.replace('Start')}
                        offsetY={moderateScale(50)}
                        labelBlocks={[
                            {
                                text: 'Посмотреть',
                                style: {
                                    fontFamily: 'NotoSans_700Bold',
                                    fontSize: moderateScale(18),
                                    fill: '#ffffff',
                                    dy: moderateScale(-5),
                                }
                            },
                            {
                                text: 'план',
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Расчет питания...</Text>

            <View style={styles.progressWrapper}>
                <Animated.View style={animatedStyle}>
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
                {stage === 'transition' && (
                    <View style={styles.messagePlaceholder} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: scale(20),
    },
    title: {
        fontSize: moderateScale(28),
        fontWeight: '600',
        marginBottom: verticalScale(50),
        color: '#000',
    },
    progressWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        height: PROGRESS_CIRCLE_SIZE + verticalScale(40),
        marginBottom: verticalScale(100),
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
        marginTop: verticalScale(40),
        maxWidth: scale(250),
        alignSelf: 'center',
    },
    messagePlaceholder: {
        height: verticalScale(40),
        marginTop: verticalScale(20),
    },
    sunContainer: {
        marginBottom: moderateScale(470),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        zIndex: 1,
    },
    captionContainer: {
        alignItems: 'flex-start',
        marginBottom: moderateScale(70),
        marginLeft: moderateScale(-30),
        zIndex: 3,
    },
    captionLine1: {
        fontFamily: 'NotoSans_500Medium',
        fontSize: moderateScale(30),
        color: '#000',
    },
    captionLine2: {
        fontFamily: 'NotoSans_500Medium',
        fontSize: moderateScale(38),
        color: '#000',
        marginTop: moderateScale(-15),
    },
});
