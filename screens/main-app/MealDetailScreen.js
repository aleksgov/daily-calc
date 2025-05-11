import React from 'react';
import styled from 'styled-components/native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

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

const SearchBar = styled.TextInput`
    height: ${verticalScale(40)}px;
    border: 1px solid #ccc;
    border-radius: ${scale(8)}px;
    padding: 0 ${scale(10)}px;
    margin-bottom: ${verticalScale(18)}px;
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

export function MealDetailScreen({ route }) {
    const { mealName } = route.params;

    return (
        <Container>
            <Header>{mealName}</Header>
            <SearchBar placeholder="Поиск..." />

            <ButtonRow>
                <TabButton>
                    <TabText>Продукты</TabText>
                </TabButton>

                <TabButton>
                    <TabText>Рецепты</TabText>
                </TabButton>
            </ButtonRow>

            <AddProductButton onPress={() => console.log('Добавить продукт')}>
                <AddProductText>Добавить продукт</AddProductText>
            </AddProductButton>
        </Container>
    );
}
