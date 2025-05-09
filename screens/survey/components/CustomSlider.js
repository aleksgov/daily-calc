import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CustomSlider = ({
                          min,
                          max,
                          step,
                          value,
                          sections,
                          unit,
                          onValueChange,
                          onSlidingComplete,
                      }) => {
    return (
        <View style={styles.container}>
            <View style={styles.sliderWrapper}>
                <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    value={value}
                    step={step}
                    onValueChange={onValueChange}
                    onSlidingComplete={onSlidingComplete}
                    minimumTrackTintColor="#3DA0EE"
                    maximumTrackTintColor="#C1C1C1"
                    thumbTintColor="#3DA0EE"
                />
                <View style={styles.ticksContainer}>
                    {sections.map((val, i) => {
                        const leftPercent = ((val - min) / (max - min)) * 96 + 2;
                        const isEdge = i === 0 || i === sections.length - 1;

                        return (
                            <React.Fragment key={i}>
                                <View
                                    style={[
                                        styles.tick,
                                        isEdge && styles.edgeTick,
                                        { left: `${leftPercent}%` }
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.tickLabel,
                                        { left: `${leftPercent}%` }
                                    ]}
                                >
                                    {val}
                                </Text>
                            </React.Fragment>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: verticalScale(10),
    },
    sliderWrapper: {
        width: '100%',
        height: verticalScale(60),
        justifyContent: 'center',
    },
    slider: {
        width: '85%',
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        marginHorizontal: 'auto',
    },
    ticksContainer: {
        position: 'absolute',
        top: 0,
        left: scale(8),
        right: scale(12),
        bottom: 0,
    },
    tick: {
        position: 'absolute',
        width: scale(2.3),
        height: verticalScale(12),
        backgroundColor: '#3DA0EE',
        top: verticalScale(24),
        borderRadius: scale(5),
    },
    edgeTick: {
        width: scale(2.5),
        height: verticalScale(16),
        top: verticalScale(21.5),
    },
    tickLabel: {
        position: 'absolute',
        textAlign: 'center',
        top: verticalScale(40),
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#000000',
        transform: [{ translateX: -scale(8) }],
    },
});

export default CustomSlider;