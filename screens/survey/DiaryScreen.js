import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box } from './components/Box';
import {moderateScale, scale, verticalScale} from "react-native-size-matters";

export const DiaryScreen = () => (
    <View style={styles.container}>
        <Box/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
            position: "relative",
            marginTop: scale(50),
            marginBottom: verticalScale(15),
            marginHorizontal: scale(30),
            padding: scale(40),
            borderWidth: 2,
            borderColor: "#000",
            borderRadius: moderateScale(8),
    },
});