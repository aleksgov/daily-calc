import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ReferenceScreen } from './ReferenceScreen';
import { DiaryScreen } from './DiaryScreen';
import { SettingsScreen } from './SettingsScreen';

import ReferenceIcon from './assets/icons/reference.svg';
import ReferenceIconActive from './assets/icons/reference-active.svg';
import DiaryIcon from './assets/icons/diary.svg';
import DiaryIconActive from './assets/icons/diary-active.svg';
import SettingsIcon from './assets/icons/settings.svg';
import SettingsIconActive from './assets/icons/settings-active.svg';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator
            id="MainTabs"
            initialRouteName="Diary"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2f95dc',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Reference"
                component={ReferenceScreen}
                options={{
                    title: 'Справочник',
                    tabBarIcon: ({ focused }) => (
                        focused ? <ReferenceIconActive width={24} height={24} /> : <ReferenceIcon width={24} height={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Diary"
                component={DiaryScreen}
                options={{
                    title: 'Дневник',
                    tabBarIcon: ({ focused }) => (
                        focused ? <DiaryIconActive width={24} height={24} /> : <DiaryIcon width={24} height={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Параметры',
                    tabBarIcon: ({ focused }) => (
                        focused ? <SettingsIconActive width={24} height={24} /> : <SettingsIcon width={24} height={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
