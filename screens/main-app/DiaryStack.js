import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {DiaryScreen} from './DiaryScreen';
import {MealDetailScreen} from './MealDetailScreen';

const Stack = createStackNavigator();

export default function DiaryStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DiaryList" component={DiaryScreen}/>
            <Stack.Screen name="MealDetail" component={MealDetailScreen}/>
        </Stack.Navigator>
    );
}
