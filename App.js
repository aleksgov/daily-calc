import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import StartScreen from './StartScreen';
import QuestionScreen from './QuestionScreen';
import CalculationScreen from './CalculationScreen';
import MainScreen from './MainScreen';
import { preloadAssets } from './assets';

const Stack = createStackNavigator();

export default function App() {
    const [isReady, setIsReady] = useState(false);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        async function prepare() {
            try {
                await AsyncStorage.clear();
                await SplashScreen.preventAutoHideAsync();
                await preloadAssets();

                // Проверяем первый запуск
                const firstLaunch = await AsyncStorage.getItem('@first_launch');
                setIsFirstLaunch(firstLaunch === null);
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

    if (!isReady || isFirstLaunch === null) {
        return <View />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animationEnabled: false
                }}
            >
                {isFirstLaunch ? (
                    <>
                        <Stack.Screen name="Start" component={StartScreen} />
                        <Stack.Screen name="Quest" component={QuestionScreen} />
                        <Stack.Screen name="Calculation" component={CalculationScreen} />
                        <Stack.Screen name="Main" component={MainScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Main" component={MainScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}