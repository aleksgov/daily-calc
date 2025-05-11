import React, { useState } from 'react';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {GenericList} from "./components/GenericList";

import SearchIcon from '@assets/images/main-app/diary-screen/meal-detail-screen/search.svg';

const Container = styled.View`
    flex: 1;
    background: #fff;
    padding: ${verticalScale(16)}px ${scale(30)}px;
`;

const Header = styled.Text`
    font-size: ${scale(20)}px;
    font-family: NotoSansMedium;
    margin-bottom: ${verticalScale(12)}px;
    margin-top: ${moderateScale(40)}px;
    margin-left: ${moderateScale(4)}px;
`;

const SearchBarContainer = styled.View`
    flex-direction: row;
    align-items: center;
    height: ${verticalScale(40)}px;
    border: 1px solid #ccc;
    border-radius: ${scale(8)}px;
    margin-bottom: ${verticalScale(18)}px;
    padding-left: ${scale(18)}px;
`;

const StyledSearchIcon = styled(SearchIcon)`
    margin-right: ${scale(5)}px;
`;

const SearchInput = styled.TextInput`
    flex: 1;
    height: 100%;
    padding: 0 ${scale(10)}px;
    font-size: ${scale(16)}px;
`;

const ButtonRow = styled.View`
    flex-direction: row;
    column-gap: ${scale(20)}px;
    margin-bottom: ${verticalScale(18)}px;
`;

const TabButton = styled.TouchableOpacity`
    flex: 1;
    height: ${verticalScale(40)}px;
    margin: 0;
    border-radius: ${scale(10)}px;
    border: 1px solid #8C8C8C;
    align-items: center;
    justify-content: center;
`;

const TabText = styled.Text`
    font-size: ${scale(16)}px;
    color: #8C8C8C;
    font-family: NotoSansMedium;
`;

const AddProductButton = styled.TouchableOpacity`
    height: ${verticalScale(40)}px;
    border-radius: ${scale(8)}px;
    background: #3DA0EE;
    align-items: center;
    justify-content: center;
`;

const AddProductText = styled.Text`
    font-size: ${scale(16)}px;
    color: #fff;
    font-family: NotoSansMedium;
`;

const ListWrapper = styled.View`
    flex: 1;
    margin-top: -${verticalScale(60)}px;
`;

const CALORIES = {
    Банан: 89,
    Яблоко: 65,
    Сосиска: 204,
    Йогурт: 120,
};

export function MealDetailScreen({ route }) {
    const { mealName } = route.params;
    const [products, setProducts] = useState(['Банан', 'Яблоко', 'Сосиска', 'Йогурт']); // Начальный список продуктов
    const [searchQuery, setSearchQuery] = useState('');

    const addProduct = () => {
        const newProduct = prompt('Введите название продукта:');
        if (newProduct) {
            setProducts([...products, newProduct]);
        }
    };

    const filtered = products.filter(p =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const items = filtered.map(name => ({
        name,
        calories: CALORIES[name] ?? 0
    }));

    return (
        <Container>
            <Header>{mealName}</Header>

            <SearchBarContainer>
                <StyledSearchIcon
                    width={scale(20)}
                    height={scale(20)}
                />
                <SearchInput
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </SearchBarContainer>

            <ButtonRow>
                <TabButton>
                    <TabText>Продукты</TabText>
                </TabButton>

                <TabButton>
                    <TabText>Рецепты</TabText>
                </TabButton>
            </ButtonRow>

            <AddProductButton onPress={addProduct}>
                <AddProductText>Добавить продукт</AddProductText>
            </AddProductButton>

            <ListWrapper>
                <GenericList
                    items={items}
                    onAddItem={item => console.log('Добавлено:', item.name)}
                />
            </ListWrapper>
        </Container>
    );
}
