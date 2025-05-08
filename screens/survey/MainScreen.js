import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ReferenceScreen } from './ReferenceScreen';
import { DiaryScreen } from './DiaryScreen';
import { SettingsScreen } from './SettingsScreen';
import {scale, verticalScale} from "react-native-size-matters";

import ReferenceIcon from '../../assets/icons/reference.svg';
import ReferenceIconActive from '../../assets/icons/reference-active.svg';
import DiaryIcon from '../../assets/icons/diary.svg';
import DiaryIconActive from '../../assets/icons/diary-active.svg';
import SettingsIcon from '../../assets/icons/settings.svg';
import SettingsIconActive from '../../assets/icons/settings-active.svg';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (icon, iconActive, focused) =>
    focused ? React.createElement(iconActive, { width: scale(24), height: verticalScale(24) }) : React.createElement(icon, { width: 24, height: 24 });

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
                    tabBarIcon: ({ focused }) => getTabBarIcon(ReferenceIcon, ReferenceIconActive, focused),
                }}
            />
            <Tab.Screen
                name="Diary"
                component={DiaryScreen}
                options={{
                    title: 'Дневник',
                    tabBarIcon: ({ focused }) => getTabBarIcon(DiaryIcon, DiaryIconActive, focused),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Параметры',
                    tabBarIcon: ({ focused }) => getTabBarIcon(SettingsIcon, SettingsIconActive, focused),
                }}
            />
        </Tab.Navigator>
    );
}