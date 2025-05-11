import React from 'react';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Container = styled.View`
    align-self: stretch;
    height: ${verticalScale(200)}px;
    background: #fff;
    border-radius: ${scale(16)}px;
    border-width: ${scale(0.25)}px;
    border-color: #8b8b8b;
    overflow: hidden;
`;

const Section = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    border-bottom-width: ${({ isLast }) => (isLast ? 0 : 0.5)}px;
    border-color: #8b8b8b;
    padding: 0 ${scale(16)}px;
`;

const ItemText = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${scale(16)}px;
    margin-left: ${scale(5)}px;
    flex-shrink: 1;
    max-width: 65%;
`;

const RightBlock = styled.View`
    flex-direction: row;
    align-items: center;
`;

const CalorieText = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${scale(14)}px;
    color: #666;
    margin-right: ${scale(13)}px;
    line-height: ${scale(18)}px;
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
    line-height: ${scale(27.5)}px;
`;

export const GenericList = ({
                                title,
                                items,
                                onAddItem,
                                containerStyle,
                                renderAdditionalContent
                            }) => (
    <Wrapper>
        {title && <Title>{title}</Title>}
        <Container style={containerStyle}>
            {items.map((item, index) => (
                <Section key={item.id || item.name} isLast={index === items.length - 1}>
                    <ItemText
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.name}
                    </ItemText>
                    <RightBlock>
                        {typeof item.calories === 'number' && (
                            <CalorieText>{item.calories} ккал</CalorieText>
                        )}
                        <PlusButton onPress={() => onAddItem(item)}>
                            <PlusText>+</PlusText>
                        </PlusButton>
                    </RightBlock>
                    {renderAdditionalContent && renderAdditionalContent(item)}
                </Section>
            ))}
        </Container>
    </Wrapper>
);

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