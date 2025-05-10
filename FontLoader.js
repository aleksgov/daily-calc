import React from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts, NotoSans_400Regular, NotoSans_500Medium, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';

export function FontLoader({ children }) {
    const [fontsLoaded] = useFonts({
        NotoSansRegular: NotoSans_400Regular,
        NotoSansMedium: NotoSans_500Medium,
        NotoSansBold: NotoSans_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return children;
}
