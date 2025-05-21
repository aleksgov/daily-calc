import React, { createContext, useState, useContext } from 'react';

const CalorieContext = createContext();

export const CalorieProvider = ({ children }) => {
    const [calorieGoal, setCalorieGoal] = useState(null);
    return (
        <CalorieContext.Provider value={{ calorieGoal, setCalorieGoal }}>
            {children}
        </CalorieContext.Provider>
    );
};

export const useCalorie = () => useContext(CalorieContext);
