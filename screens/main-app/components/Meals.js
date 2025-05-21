// screens/main-app/Meals.js

import React, { useState, useEffect } from 'react';
import { GenericList } from './GenericList';
import { verticalScale } from 'react-native-size-matters';
import { getMealTypes } from '../../../database';

export const Meals = ({ navigation }) => {
    const [mealTypes, setMealTypes] = useState([]); // [{ id, name }, …]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMealTypes = async () => {
            try {
                const rows = await getMealTypes();
                setMealTypes(rows);
            } catch (err) {
                console.error('Ошибка загрузки meal_types:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMealTypes();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <GenericList
            title="Приёмы пищи"
            items={mealTypes}
            onAddItem={item => navigation.navigate('MealDetail', { mealName: item.name })}
            containerStyle={{ height: verticalScale(200) }}
            scrollEnabled={mealTypes.length > 4}
        />
    );
};
