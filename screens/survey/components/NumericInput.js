import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomSlider from './CustomSlider';
import {moderateScale, verticalScale} from 'react-native-size-matters';

const NumericInput = ({
                          type,
                          value,
                          tempValue,
                          config,
                          onValueChange,
                          onSlidingComplete,
                          onInputPress
                      }) => {
    return (
        <View>
            <TouchableOpacity onPress={onInputPress}>
                <Text style={styles.sliderValue}>
                    {type === 'height' ?
                        `${tempValue} ${config.unit}` :
                        `${tempValue.toFixed(1)} ${config.unit}`
                    }
                </Text>
            </TouchableOpacity>

            <CustomSlider
                min={config.min}
                max={config.max}
                step={config.step}
                value={value}
                sections={config.sections}
                onValueChange={onValueChange}
                onSlidingComplete={onSlidingComplete}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sliderValue: {
        fontSize: moderateScale(20),
        textAlign: 'center',
        marginBottom: verticalScale(-5),
        fontWeight: '600',
    },
});

export default NumericInput;