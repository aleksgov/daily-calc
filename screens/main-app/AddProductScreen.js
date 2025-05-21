import React, { useState } from 'react';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { addProduct as dbAddProduct } from '../../database';

const Container = styled.KeyboardAvoidingView.attrs({
    behavior: 'padding'
})`
    flex: 1;
    background: #fff;
    padding: ${verticalScale(16)}px ${scale(20)}px;
`;

const Header = styled.Text`
    font-size: ${scale(24)}px;
    font-family: NotoSansMedium;
    margin-bottom: ${verticalScale(24)}px;
    margin-top: ${verticalScale(36)}px;
    text-align: center;
`;

const FieldLabel = styled.Text`
    font-size: ${scale(16)}px;
    font-family: NotoSansMedium;
    margin-bottom: ${verticalScale(4)}px;
`;

const Input = styled.TextInput`
    height: ${verticalScale(40)}px;
    border-width: ${scale(1)}px;
    border-color: #ccc;
    border-radius: ${scale(6)}px;
    padding-horizontal: ${scale(10)}px;
    margin-bottom: ${verticalScale(16)}px;
    font-size: ${scale(16)}px;
`;

const AddButton = styled.TouchableOpacity`
    height: ${verticalScale(48)}px;
    background-color: #3da0ee;
    border-radius: ${scale(8)}px;
    align-items: center;
    justify-content: center;
    margin-top: ${verticalScale(16)}px;
`;

const AddButtonText = styled.Text`
    font-size: ${scale(18)}px;
    color: #fff;
    font-family: NotoSansMedium;
`;

export function AddProductScreen({ navigation, route }) {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [proteins, setProteins] = useState('');
    const [fats, setFats] = useState('');
    const [carbs, setCarbs] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Введите название продукта');
            return;
        }
        const cal = parseFloat(calories);
        const prot = parseFloat(proteins);
        const fat = parseFloat(fats);
        const carb = parseFloat(carbs);

        if (
            isNaN(cal) ||
            isNaN(prot) ||
            isNaN(fat) ||
            isNaN(carb) ||
            cal < 0 ||
            prot < 0 ||
            fat < 0 ||
            carb < 0
        ) {
            setError('Калории, белки, жиры и углеводы должны быть неотрицательными числами');
            return;
        }

        const newProduct = {
            name: name.trim(),
            calories: cal,
            proteins: prot,
            fats: fat,
            carbohydrates: carb,
            product_type_id: 1
        };

        try {
            await dbAddProduct(newProduct);
            navigation.goBack();
        } catch (e) {
            console.error('Ошибка добавления продукта:', e);
            if (e.message.includes('UNIQUE')) {
                setError('Продукт с таким названием уже существует');
            } else {
                setError('Не удалось добавить продукт');
            }
        }
    };

    return (
        <Container>
            <Header>Добавление продукта</Header>

            {error ? (
                <FieldLabel style={{ color: 'red', marginBottom: verticalScale(12) }}>
                    {error}
                </FieldLabel>
            ) : null}

            <FieldLabel>Название</FieldLabel>
            <Input
                placeholder="Например: Банан"
                value={name}
                onChangeText={setName}
            />

            <FieldLabel>Калории (ккал)</FieldLabel>
            <Input
                placeholder="Например: 89"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
            />

            <FieldLabel>Белки (г)</FieldLabel>
            <Input
                placeholder="Например: 1.1"
                keyboardType="numeric"
                value={proteins}
                onChangeText={setProteins}
            />

            <FieldLabel>Жиры (г)</FieldLabel>
            <Input
                placeholder="Например: 0.3"
                keyboardType="numeric"
                value={fats}
                onChangeText={setFats}
            />

            <FieldLabel>Углеводы (г)</FieldLabel>
            <Input
                placeholder="Например: 23.0"
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
            />

            <AddButton onPress={handleSubmit}>
                <AddButtonText>Добавить</AddButtonText>
            </AddButton>
        </Container>
    );
}
