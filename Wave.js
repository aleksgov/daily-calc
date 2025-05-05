import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const WAVE_HEIGHT = verticalScale(550);

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Wave() {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const forward = Animated.timing(animatedValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
        });

        const backward = Animated.timing(animatedValue, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
        });

        Animated.loop(
            Animated.sequence([forward, backward])
        ).start();
    }, []);
    animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    });

    const animatedPath = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
            generateWave(0),
            generateWave(20)
        ]
    });

    function generateWave(offset) {
        return `
        M0 ${WAVE_HEIGHT / 2}
        Q ${width / 4} ${WAVE_HEIGHT / 2 - verticalScale(25) + offset} ${width / 2} ${WAVE_HEIGHT / 2}
        T ${width} ${WAVE_HEIGHT / 2}
        L ${width} ${WAVE_HEIGHT}
        L 0 ${WAVE_HEIGHT}
        Z
    `;
    }

    return (
        <Svg width={width} height={WAVE_HEIGHT}>
            <AnimatedPath d={animatedPath} fill="#3da0ee" />
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
    );
}
