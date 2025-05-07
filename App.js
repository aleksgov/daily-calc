import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './StartScreen';
import QuestionScreen from './QuestionScreen';
import CalculationScreen from './CalculationScreen';
import { preloadAssets } from './assets';
import * as SplashScreen from 'expo-splash-screen';
import {View} from "react-native";

const Stack = createStackNavigator();

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await preloadAssets();
            } catch (e) {
                console.warn(e);
            } finally {
                setIsReady(true);
                setTimeout(async () => {
                    await SplashScreen.hideAsync();
                }, 500);
            }
        }
        prepare();
    }, []);

    if (!isReady) {
        return <View />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Quest" component={QuestionScreen} />
                <Stack.Screen name="Calculation" component={CalculationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}