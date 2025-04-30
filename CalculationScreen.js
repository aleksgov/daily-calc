import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Circle } from 'react-native-progress';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const messages = [
    "Анализируем полученные ответы",
    "Подбираем блюда",
    "Определяем количество КБЖУ"
];

export default function CalculationScreen({ navigation }) {
    const [progress, setProgress] = useState(0);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (progress >= 1) {
            setTimeout(() => {
                navigation.replace('Start');
            }, 1000);
            return;
        }

        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 0.005;
                return newProgress > 1 ? 1 : newProgress;
            });
        }, 5);

        return () => clearInterval(timer);
    }, [progress, navigation]);

    useEffect(() => {
        // Смена сообщений в зависимости от прогресса
        if (progress < 0.33) {
            setCurrentMessageIndex(0);
        } else if (progress < 0.66) {
            setCurrentMessageIndex(1);
        } else {
            setCurrentMessageIndex(2);
        }
    }, [progress]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Расчет питания...</Text>

            <View style={styles.circleContainer}>
                <Circle
                    progress={progress}
                    size={width * 0.5}
                    thickness={8}
                    color="#F3E626"
                    unfilledColor="#F5F5F5"
                    borderWidth={0}
                    showsText={true}
                    textStyle={styles.progressText}
                />
            </View>

            <Animated.Text
                style={styles.message}
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
                key={currentMessageIndex}
            >
                {messages[currentMessageIndex]}
            </Animated.Text>
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
    circleContainer: {
        marginBottom: verticalScale(40),
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
        marginTop: verticalScale(20),
    },
});
