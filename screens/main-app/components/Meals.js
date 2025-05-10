import React from 'react';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Wrapper = styled.View`
    width: 100%;
    margin-top: ${moderateScale(90)}px;
`;

const Title = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${scale(18)}px;
    color: #000;
    margin-bottom: ${verticalScale(5)}px;
    margin-left: ${verticalScale(8)}px;
`;

const Container = styled.View.attrs({
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    })`
    align-self: stretch;
    height: ${verticalScale(200)}px;
    background: #fff;
    border-radius: ${scale(16)}px;
    overflow: hidden;
`;

const Section = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    border-bottom-width: 0.5px;
    border-color: #8b8b8b;
    padding: 0 ${scale(16)}px;
`;

const PlusButton = styled.TouchableOpacity`
    width: ${scale(26)}px;
    height: ${scale(26)}px;
    border-radius: ${scale(14)}px;
    background: #3da0ee;
    align-items: center;
    justify-content: center;
    margin-right: ${scale(5)}px;
`;

const PlusText = styled.Text`
    font-family: NotoSansMedium;
    color: #fff;
    font-size: ${scale(24)}px;
    line-height: ${scale(29)}px;
    text-align: center;
`;

const MealName = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${scale(16)}px;
    margin-left: ${scale(5)}px;
`;

const meals = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];

export const Meals = () => (
    <Wrapper>
        <Title>Приёмы пищи</Title>
        <Container>
            {meals.map((name, index) => (
                <Section
                    key={name}
                    style={index === meals.length - 1 ? { borderBottomWidth: 0 } : {}}
                >
                    <MealName>{name}</MealName>
                    <PlusButton onPress={() => console.log(`Добавить ${name}`)}>
                        <PlusText>+</PlusText>
                    </PlusButton>
                </Section>
            ))}
        </Container>
    </Wrapper>
);
