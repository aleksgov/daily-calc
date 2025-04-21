import React, { useCallback, useMemo, useRef } from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Dimensions, Alert, Animated, Text, Easing} from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const SUN_SIZE = scale(130);
const WAVE_HEIGHT = verticalScale(550);

export default function App() {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(verticalScale(220))).current;

    const wavePath = useMemo(() => {
        return `
            M0 ${WAVE_HEIGHT / 2}
            Q ${width / 4} ${WAVE_HEIGHT / 2 - verticalScale(25)} ${width / 2} ${WAVE_HEIGHT / 2}
            T ${width} ${WAVE_HEIGHT / 2}
            L ${width} ${WAVE_HEIGHT}
            L 0 ${WAVE_HEIGHT}
            Z
        `;
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
            Alert.alert('Начали!');
        });
    }, [scaleAnim]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerBackground}>
                    <Text style={styles.headerText}>MyCalory</Text>
                </View>
            </View>

            <TouchableWithoutFeedback onPress={handleStart} accessibilityLabel="Начать" testID="start-button">
                <Animated.View
                    pointerEvents="box-none"
                    style={[
                        styles.sunWrapper,
                        {
                            transform: [
                                { translateY: translateY },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}>
                    <Svg width={SUN_SIZE} height={SUN_SIZE}>
                        <Circle
                            cx={SUN_SIZE / 2}
                            cy={SUN_SIZE / 2}
                            r={SUN_SIZE / 2}
                            fill="#f3e626"
                            accessibilityRole="image"
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
                </Animated.View>
            </TouchableWithoutFeedback>

            <View style={styles.waveContainer}>
                <Svg width={width} height={WAVE_HEIGHT}>
                    <Path d={wavePath} fill="#3da0ee" />
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
        fontSize: moderateScale(20),
        fontFamily: 'Montserrat',
        fontWeight: '700',
        letterSpacing: moderateScale(1),
    },
    sunWrapper: {
        width: SUN_SIZE,
        height: SUN_SIZE,
        zIndex: 1,
    },
    waveContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        zIndex: 0,
    },
});