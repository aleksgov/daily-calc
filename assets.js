import {Asset} from "expo-asset";

export const images = {
    // Из Sun.js
    RAYS_IMAGE: require('@assets/images/survey/StartScreen/sun-rays.png'),
};

// Функция для предзагрузки
export async function preloadAssets() {
    const cachePromises = Object.values(images).map(img => Asset.fromModule(img).downloadAsync());
    await Promise.all(cachePromises);
}