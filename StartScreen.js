import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Dimensions, Animated, Text, Easing, Image } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import RAYS_IMAGE from './assets/images/StartScreen/sun-rays.png'

const { width } = Dimensions.get('window');
const SUN_SIZE = scale(130);
const SUN_WRAPPER_SIZE = SUN_SIZE * moderateScale(3.5);
const WAVE_HEIGHT = verticalScale(550);

export default function StartScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(verticalScale(210))).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Анимация вращения лучей
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

    // Анимация пульсации
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

    const wavePath = useMemo(() => `
    M0 ${WAVE_HEIGHT / 2}
    Q ${width / 4} ${WAVE_HEIGHT / 2 - verticalScale(25)} ${width / 2} ${WAVE_HEIGHT / 2}
    T ${width} ${WAVE_HEIGHT / 2}
    L ${width} ${WAVE_HEIGHT}
    L 0 ${WAVE_HEIGHT}
    Z
  `, []);

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
            navigation.navigate('Quest');
        });
    }, [scaleAnim, navigation]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerBackground}>
                    <Text style={styles.headerText}>MyCalory</Text>
                </View>
            </View>

            <Animated.View
                style={[
                    styles.sunWrapper,
                    styles.raysWrapper,
                    {
                        transform: [
                            { translateY: translateY },
                            { scale: pulseAnim },
                            { rotate: rotateInterpolate },
                        ],
                    },
                ]}
                pointerEvents="none"
            >
                <Image
                    source={RAYS_IMAGE}
                    style={styles.raysImage}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.sunWrapper,
                    styles.circleWrapper,
                    {
                        transform: [
                            { translateY: translateY },
                            { scale: scaleAnim },
                        ],
                    },
                ]}
            >
                <TouchableWithoutFeedback
                    onPress={handleStart}
                    accessibilityLabel="Начать"
                    testID="start-button"
                >
                    <Svg width={SUN_SIZE} height={SUN_SIZE}>
                        <Circle
                            cx={SUN_SIZE / 2}
                            cy={SUN_SIZE / 2}
                            r={SUN_SIZE / 2}
                            fill="#f3e626"
                        />
                        <SvgText
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontSize={moderateScale(24)}
                            fontWeight="bold"
                            fill="#ffffff"
                        >
                            Начать
                        </SvgText>
                    </Svg>
                </TouchableWithoutFeedback>
            </Animated.View>

            <View style={styles.waveContainer}>
                <Svg width={width} height={WAVE_HEIGHT}>
                    <Path d={wavePath} fill="#3da0ee" />
                    <SvgText
                        x={moderateScale(30)}
                        y={WAVE_HEIGHT / 2 + 90}
                        textAnchor="start"
                        fontSize={moderateScale(26)}
                        fontWeight="600"
                        fill="#ffffff"
                        pointerEvents="none"
                    >
                        открой для себя
                    </SvgText>
                    <SvgText
                        x={moderateScale(30)}
                        y={WAVE_HEIGHT / 2 + 125}
                        textAnchor="start"
                        fontSize={moderateScale(38)}
                        fontWeight="bold"
                        fill="#ffffff"
                    >
                        вкус здоровья!
                    </SvgText>
                </Svg>
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
        fontSize: width > 400 ? moderateScale(24) : moderateScale(20),
        fontFamily: 'Montserrat',
        fontWeight: '700',
        letterSpacing: moderateScale(1),
    },
    sunWrapper: {
        width: SUN_WRAPPER_SIZE,
        height: SUN_WRAPPER_SIZE,
        justifyContent: 'center',
        position: 'absolute',
        top: verticalScale(-200),
        alignItems: 'center',
        zIndex: 1,
    },
    raysImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    raysWrapper: {
        zIndex: 1,
    },
    circleWrapper: {
        zIndex: 3,
    },
    waveContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        zIndex: 2,
    },
});