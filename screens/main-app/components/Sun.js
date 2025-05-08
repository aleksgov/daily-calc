import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, TouchableWithoutFeedback, Easing } from 'react-native';
import Svg, { Circle, Text as SvgText, TSpan } from 'react-native-svg';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { images } from '../../../assets';

const SUN_SIZE = scale(130);
const SUN_WRAPPER_SIZE = SUN_SIZE * moderateScale(3.5);

export default function Sun({ onStart, labelBlocks }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(verticalScale(210))).current;
    const raysScaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Запуск анимаций вращения и пульсации
    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 100000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            })
        ).start();

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

        Animated.parallel([
            Animated.timing(raysScaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <>
            <Animated.View
                style={[
                    styles.sunWrapper,
                    styles.raysWrapper,
                    {
                        transform: [
                            { translateY: translateY },
                            { scale: pulseAnim },
                            { scale: Animated.multiply(pulseAnim, raysScaleAnim) },
                            { rotate: rotateInterpolate },
                        ],
                    },
                ]}
                pointerEvents="none"
            >
                <Image
                    source={images.RAYS_IMAGE}
                    style={styles.raysImage}
                    resizeMode="contain"
                    fadeDuration={0}
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
                <TouchableWithoutFeedback onPress={() => {
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.2,
                            duration: 150,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }),
                    ]).start(onStart);
                }}>
                    <Svg width={SUN_SIZE} height={SUN_SIZE}>
                        <Circle
                            cx={SUN_SIZE / 2}
                            cy={SUN_SIZE / 2}
                            r={SUN_SIZE / 2 - 2}
                            fill="#f3e626"
                            stroke="#ffffff"
                            strokeWidth={4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <SvgText
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {labelBlocks.map((block, index) => (
                                <TSpan
                                    key={index}
                                    x="50%"
                                    dy={block.dy}
                                    {...block.style}
                                >
                                    {block.text}
                                </TSpan>
                            ))}
                        </SvgText>
                    </Svg>
                </TouchableWithoutFeedback>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    sunWrapper: {
        width: SUN_WRAPPER_SIZE,
        height: SUN_WRAPPER_SIZE,
        justifyContent: 'center',
        position: 'absolute',
        top: verticalScale(-180),
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
});