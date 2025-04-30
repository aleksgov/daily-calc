import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './StartScreen';
import QuestionScreen from './QuestionScreen';
import CalculationScreen from './CalculationScreen';
import SunScreen from './SunScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Quest" component={QuestionScreen} />
                <Stack.Screen name="Calculation" component={CalculationScreen} />
                <Stack.Screen name="Sun" component={SunScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
