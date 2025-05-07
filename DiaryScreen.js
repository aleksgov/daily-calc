import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Box } from './Box';
import {moderateScale, scale, verticalScale} from "react-native-size-matters";

export const DiaryScreen = () => (
    <View style={styles.container}>
        <Box onPress={() => console.log("Кнопка MyCalory нажата")} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
            position: "relative",
            marginVertical: verticalScale(40),
            marginHorizontal: scale(30),
            padding: scale(40),
            borderWidth: 2,
            borderColor: "#000",
            borderRadius: moderateScale(8),
    },
});