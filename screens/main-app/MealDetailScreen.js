import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { GenericList } from './components/GenericList';
import SearchIcon from '@assets/images/main-app/diary-screen/meal-detail-screen/search.svg';

import { getProducts, getRecipes, addProduct as dbAddProduct, addRecipe as dbAddRecipe } from '../../database';

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
    border: 1px solid ${props => (props.isActive ? '#FFA834' : '#8C8C8C')};
    background-color: ${props => (props.isActive ? '#FFA834' : 'transparent')};
    align-items: center;
    justify-content: center;
`;

const TabText = styled.Text`
    font-size: ${scale(16)}px;
    color: ${props => (props.isActive ? '#FFFFFF' : '#8C8C8C')};
    font-family: NotoSansMedium;
`;

const AddProductButton = styled.TouchableOpacity`
    height: ${verticalScale(40)}px;
    border-radius: ${scale(8)}px;
    background: #3da0ee;
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
    height: ${verticalScale(200)}px;
    margin-top: -${verticalScale(60)}px;
`;

export function MealDetailScreen({ route }) {
    const { mealName } = route.params;
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Загрузка данных при монтировании и при смене вкладки
    useEffect(() => {
        if (activeTab === 'products') {
            loadProducts();
        } else {
            loadRecipes();
        }
    }, [activeTab]);

    // Получаем все продукты
    const loadProducts = async () => {
        try {
            const rows = await getProducts();
            const formatted = rows.map(item => ({
                id: item.id,
                name: item.name,
                calories: item.calories
            }));
            setProducts(formatted);
        } catch (err) {
            console.error('Ошибка загрузки продуктов:', err);
        }
    };

    // Получаем все рецепты
    const loadRecipes = async () => {
        try {
            const rows = await getRecipes();
            const formatted = rows.map(item => ({
                id: item.id,
                name: item.name,
                calories: item.calories
            }));
            setRecipes(formatted);
        } catch (err) {
            console.error('Ошибка загрузки рецептов:', err);
        }
    };

    // При добавлении нового продукта или рецепта в БД
    const onAdd = async () => {
        const newName = prompt(
            `Введите название ${activeTab === 'products' ? 'продукта' : 'рецепта'}:`
        );
        if (!newName) return;

        const calories = Number(prompt('Сколько ккал?')) || 0;

        if (activeTab === 'products') {
            const exampleProduct = {
                name: newName,
                calories,
                fats: 0,
                proteins: 0,
                carbohydrates: 0,
                product_type_id: 1
            };
            try {
                await dbAddProduct(exampleProduct);
                await loadProducts();
            } catch (error) {
                console.error('Не удалось добавить продукт:', error);
            }
        } else {
            const exampleRecipe = {
                name: newName,
                calories,
                fats: 0,
                proteins: 0,
                carbohydrates: 0,
                diet_type_id: 1
            };
            try {
                await dbAddRecipe(exampleRecipe);
                await loadRecipes();
            } catch (error) {
                console.error('Не удалось добавить рецепт:', error);
            }
        }
    };

    // Фильтрация списка по поисковой строке
    const filteredItems = (activeTab === 'products' ? products : recipes).filter(
        item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const items = filteredItems.map(item => ({
        id: item.id,
        name: item.name,
        calories: item.calories
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
                <TabButton
                    onPress={() => setActiveTab('products')}
                    isActive={activeTab === 'products'}
                >
                    <TabText isActive={activeTab === 'products'}>Продукты</TabText>
                </TabButton>

                <TabButton
                    onPress={() => setActiveTab('recipes')}
                    isActive={activeTab === 'recipes'}
                >
                    <TabText isActive={activeTab === 'recipes'}>Рецепты</TabText>
                </TabButton>
            </ButtonRow>

            <AddProductButton onPress={onAdd}>
                <AddProductText>
                    {activeTab === 'products' ? 'Добавить продукт' : 'Добавить рецепт'}
                </AddProductText>
            </AddProductButton>

            <ListWrapper>
                <GenericList
                    items={items}
                    onAddItem={item => console.log('Добавлено в приём пищи:', item.name)}
                    containerStyle={{ height: verticalScale(200) }}
                    scrollEnabled={items.length > 4}
                />
            </ListWrapper>
        </Container>
    );
}