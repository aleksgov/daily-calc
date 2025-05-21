import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import StartScreen from './screens/survey/StartScreen';
import QuestionScreen from './screens/survey/QuestionScreen';
import CalculationScreen from './screens/survey/CalculationScreen';
import MainScreen from './screens/main-app/MainScreen';
import { FontLoader } from './FontLoader';
import { preloadAssets } from './assets';
import { initDatabase } from "./database";
import { CalorieProvider } from './screens/survey/components/CalorieContext';

const Stack = createStackNavigator();

export default function App() {
    const [isReady, setIsReady] = useState(false);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        initDatabase()
            .then(() => console.log('initDatabase: OK'))
            .catch(err => console.error('initDatabase Error:', err));
    }, []);

    useEffect(() => {
        async function prepare() {
            try {
                //await AsyncStorage.clear();
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
        <CalorieProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                >
                    {isFirstLaunch ? (
                        <>
                            <Stack.Screen name="Start">
                                {props => (
                                    <FontLoader>
                                        <StartScreen {...props} />
                                    </FontLoader>
                                )}
                            </Stack.Screen>

                            <Stack.Screen name="Quest">
                                {props => (
                                    <FontLoader>
                                        <QuestionScreen {...props} />
                                    </FontLoader>
                                )}
                            </Stack.Screen>

                            <Stack.Screen
                                name="Calculation"
                                component={CalculationScreen}
                            />
                            <Stack.Screen name="Main" component={MainScreen} />
                        </>
                    ) : (
                        <Stack.Screen name="Main" component={MainScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
            </CalorieProvider>
    );
}
