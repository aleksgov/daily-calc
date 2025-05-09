import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function ConfirmButton({ onPress, selected }) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                selected && styles.buttonSelected
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.text,
                selected && styles.textSelected
            ]}>
                Подтвердить
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(40),
        borderRadius: scale(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        alignSelf: 'center',
        marginTop: scale(20)
    },
    buttonSelected: {
        backgroundColor: '#3DA0EE',
        shadowColor: '#3DA0EE',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    text: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
        textAlign: 'center'
    },
    textSelected: {
        color: '#fff'
    }
});