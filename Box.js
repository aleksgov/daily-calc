// Box.js
import React from "react";
import styled from "styled-components/native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";

const Button = styled.TouchableOpacity`
    position: absolute;
    top: 0;
    right: 0;

    height: ${verticalScale(30)}px;
    width: ${scale(110)}px;
    background-color: #ffa834;
    border-radius: ${moderateScale(50)}px;
    justify-content: center;
    align-items: center;
    elevation: 4;
`;

const Label = styled.Text`
    color: #fff;
    font-family: "Montserrat-SemiBold";
    font-size: ${moderateScale(14)}px;
    font-weight: 600;
    letter-spacing: 0.67px;
    text-align: center;
`;

export const Box = ({ onPress }) => (
    <Button activeOpacity={0.8} onPress={onPress}>
        <Label>MyCalory</Label>
    </Button>
);
