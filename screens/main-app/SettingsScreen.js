import React from 'react';
import { View, Text } from 'react-native';
import { useCalorie } from '../survey/components/CalorieContext'; // путь укажи свой

export const SettingsScreen = () => {
    const { calorieGoal } = useCalorie();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Параметры</Text>
            <Text>Цель по калориям: {calorieGoal ?? 'не установлено'}</Text>
        </View>
    );
};
