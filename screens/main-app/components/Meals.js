import React from 'react';
import { GenericList } from './GenericList';
import {verticalScale} from "react-native-size-matters";

const meals = [
    { name: 'Завтрак', id: 1 },
    { name: 'Обед', id: 2 },
    { name: 'Ужин', id: 3 },
    { name: 'Перекус', id: 4 },
];

export const Meals = ({ navigation }) => (
    <GenericList
        title="Приёмы пищи"
        items={meals}
        onAddItem={(item) => navigation.navigate('MealDetail', { mealName: item.name })}
        containerStyle={{ height: verticalScale(200) }}
        scrollEnabled={meals.length > 4}
    />
);