import React from 'react';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const WeekCalendar = () => {
    const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const adjustedToday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const formatDate = (date) => {
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    return (
        <CalendarContainer>
            <DateHeader>
                <DateText>{formatDate(today)}</DateText>
                <TodayLabel>сегодня</TodayLabel>
            </DateHeader>

            <DaysContainer>
                {daysOfWeek.map((day, index) => {
                    const isPast = index < adjustedToday;
                    const isCurrent = index === adjustedToday;
                    const isFuture = index > adjustedToday;

                    return (
                        <DayColumn key={day}>
                            <DayCircle
                                past={isPast}
                                current={isCurrent}
                                future={isFuture}
                            />
                            <DayText
                                past={isPast}
                                current={isCurrent}
                                future={isFuture}
                            >
                                {day}
                            </DayText>
                        </DayColumn>
                    );
                })}
            </DaysContainer>
        </CalendarContainer>
    );
};

const CalendarContainer = styled.View`\
    margin-top: ${moderateScale(20)}px;
    padding: ${verticalScale(10)}px ${scale(15)}px;
`;

const DateHeader = styled.View`
    margin-bottom: ${verticalScale(13)}px;
`;

const DateText = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${moderateScale(26)}px;
    margin-bottom: -${moderateScale(5)}px;
    color: #000;
`;

const TodayLabel = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${moderateScale(20)}px;
    color: #000;
`;

const DaysContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const DayColumn = styled.View`
    align-items: center;
`;

const DayCircle = styled.View`
    width: ${scale(26)}px;
    height: ${scale(26)}px;
    border-radius: ${scale(16)}px;
    border-width: ${props => props.future ? scale(1) : 0}px;
    border-color: #848484;
    background-color: ${props => props.current ? '#FFA834' : props.past ? '#F3E626' : 'transparent'};
    margin-bottom: ${verticalScale(0)}px;
`;

const DayText = styled.Text`
    font-family: NotoSansMedium;
    font-size: ${moderateScale(16, 0.5)}px;
    color: ${props => props.current ? '#FFA834' : props.past ? '#F3E626' : '#848484'};
`;