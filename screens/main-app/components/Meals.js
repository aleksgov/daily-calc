import React from 'react';
import { GenericList } from './GenericList';

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
    />
);