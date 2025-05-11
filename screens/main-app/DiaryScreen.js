import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Box } from './components/Box';
import { Meals } from "./components/Meals";

export const DiaryScreen = ({ navigation }) => (
    <View style={styles.container}>
        <Box/>
        <Meals navigation={navigation}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        marginTop: scale(50),
        marginBottom: verticalScale(15),
        marginHorizontal: scale(30),
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: moderateScale(8),
    },
});