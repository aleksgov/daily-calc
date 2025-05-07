import React from 'react';
import { View, StyleSheet } from 'react-native';
import {scale, moderateScale, verticalScale} from 'react-native-size-matters';
import {Box} from "./Box";

export default function MainScreen() {
    return (
        <View style={styles.container}>
            <Box />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: verticalScale(50),
        marginHorizontal: scale(30),
        padding: scale(40),
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: moderateScale(8),
        borderStyle: 'solid',
    },
});
