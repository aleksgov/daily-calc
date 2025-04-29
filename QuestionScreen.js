import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, PanResponder } from 'react-native';
import Slider from '@react-native-community/slider';
import { ProgressBar } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

// Стрелки
import BlueArrow from './assets/images/QuestionScreen/arrow/blue-arrow.png';
import GreenArrow from './assets/images/QuestionScreen/arrow/green-arrow.png';
import RedArrow from './assets/images/QuestionScreen/arrow/red-arrow.png';
import BackArrow from './assets/images/QuestionScreen/arrow/back-arrow.png';

// Иконки для гендера
import ManIcon from './assets/images/QuestionScreen/gender/man-icon.png';
import WomanIcon from './assets/images/QuestionScreen/gender/woman-icon.png';

// Иконки для активности
import SeatIcon from './assets/images/QuestionScreen/activity/sitting-icon.png';
import WalkIcon from './assets/images/QuestionScreen/activity/walking-icon.png';
import RunIcon from './assets/images/QuestionScreen/activity/running-icon.png';
import SportIcon from './assets/images/QuestionScreen/activity/weightlifting-icon.png';

// Иконки для возраста
import ChildIcon from './assets/images/QuestionScreen/age/child.png';
import YouthIcon from './assets/images/QuestionScreen/age/youth.png';
import AdultIcon from './assets/images/QuestionScreen/age/adult.png';
import MiddleIcon from './assets/images/QuestionScreen/age/middle.png';
import SeniorIcon from './assets/images/QuestionScreen/age/senior.png';

const { width } = Dimensions.get('window');

const steps = [
    { question: 'Какая ваша основная цель?', options: [
            { text: 'Снижение веса', icon: BlueArrow },
            { text: 'Набор мышечной массы', icon: RedArrow },
            { text: 'Поддержание текущего веса', icon: GreenArrow },
        ]
    },
    { question: 'За какой срок вы хотите достичь своей цели?', options: [
            { text: 'До 1 месяца' },
            { text: '1-3 месяца' },
            { text: '3-6 месяцев' },
            { text: 'Без конкретных сроков (в комфортном темпе)' },
        ]
    },
    { question: 'Ваш пол', options: [
            { text: 'Мужской', icon: ManIcon },
            { text: 'Женский', icon: WomanIcon },
        ]
    },
    { question: 'Ваш возраст' },
    { question: 'Ваш рост' },
    { question: 'Уровень физической активности:', options: [
            { text: 'Минимальный (сидячий образ жизни)', icon: SeatIcon },
            { text: 'Низкий (1–2 тренировки в неделю или много ходьбы)', icon: WalkIcon, iconSize: 38 },
            { text: 'Средний (3–5 тренировок в неделю)', icon: RunIcon },
            { text: 'Высокий (интенсивные тренировки, физическая работа или спорт)', icon: SportIcon, iconSize: 48 },
        ]
    },
];

// Секции для слайдера роста
const sections = [30, 80, 130, 180, 230];
const MIN_HEIGHT = 30;
const MAX_HEIGHT = 230;

export default function QuestionScreen() {
    const navigation = useNavigation();
    const [step, setStep] = useState(0);
    const totalSteps = steps.length;
    const [height, setHeight] = useState(130);

    // Настройки для выбора возраста
    const ageStepIndex = 3;
    const ageOptions = [
        { label: 'До 18 лет', icon: ChildIcon },
        { label: '18-25 лет', icon: YouthIcon },
        { label: '26-35 лет', icon: AdultIcon },
        { label: '36-50 лет', icon: MiddleIcon },
        { label: 'Старше 50 лет', icon: SeniorIcon },
    ];
    const [ageIndex, setAgeIndex] = useState(0);

    // Обработчики свайпов для выбора возраста
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -20) handleNextAge();
                else if (gesture.dx > 20) handlePrevAge();
            },
        })
    ).current;

    const handleNextAge = () => {
        setAgeIndex((prev) => (prev + 1) % ageOptions.length);
    };
    const handlePrevAge = () => {
        setAgeIndex((prev) => (prev - 1 + ageOptions.length) % ageOptions.length);
    };
    const confirmAge = () => handleAnswer(ageOptions[ageIndex].label);

    const handleAnswer = (answer) => {
        console.log('Вы выбрали:', answer);
        if (step < totalSteps - 1) setStep(step + 1);
        else {
            console.log('Анкета завершена!');
            if (navigation) navigation.navigate('Calculation');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (step === 0) navigation.goBack();
                    else setStep(step - 1);
                }}>
                    <Image source={BackArrow} style={styles.backArrow} />
                </TouchableOpacity>

                <ProgressBar
                    progress={(step + 1) / totalSteps}
                    color="#3DA0EE"
                    style={styles.progress}
                />
            </View>

            <Text style={styles.question}>{steps[step].question}</Text>

            {step === ageStepIndex ? (
                <View style={styles.ageContainer} {...panResponder.panHandlers}>
                    <Image source={ageOptions[ageIndex].icon} style={styles.ageImage} />
                    <View style={styles.ageLabelContainer}>
                        <TouchableOpacity onPress={handlePrevAge} style={styles.arrowTouchable}>
                            <Text style={styles.ageArrow}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.ageLabel}>{ageOptions[ageIndex].label}</Text>
                        <TouchableOpacity onPress={handleNextAge} style={styles.arrowTouchable}>
                            <Text style={styles.ageArrow}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={confirmAge}>
                        <Text style={styles.confirmButtonText}>Подтвердить</Text>
                    </TouchableOpacity>
                </View>
            ) : steps[step].options ? (
                steps[step].options.map((option, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.button}
                        onPress={() => handleAnswer(option.text)}
                    >
                        <View style={styles.buttonContent}>
                            {option.icon && (
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={option.icon}
                                        style={[
                                            styles.icon,
                                            {
                                                width: option.iconSize ? scale(option.iconSize) : styles.icon.width,
                                                height: option.iconSize ? scale(option.iconSize) : styles.icon.height,
                                            },
                                        ]}
                                    />
                                </View>
                            )}
                            <Text style={styles.buttonText}>{option.text}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                // Слайдер для роста
                <View>
                    <Text style={styles.sliderValue}>{height} см</Text>
                    <View style={styles.sliderWrapper}>
                        <Slider
                            style={styles.slider}
                            minimumValue={MIN_HEIGHT}
                            maximumValue={MAX_HEIGHT}
                            step={1}
                            value={height}
                            onValueChange={setHeight}
                            minimumTrackTintColor="#3DA0EE"
                            maximumTrackTintColor="#C1C1C1"
                            thumbTintColor="#3DA0EE"
                        />
                        <View style={styles.ticksContainer}>
                            {sections.map((val, i) => {
                                const leftPercent = ((val - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 96 + 2;
                                const isEdge = i === 0 || i === sections.length - 1;  // крайние точки
                                return (
                                    <React.Fragment key={i}>
                                        <View
                                            style={[
                                                styles.tick,
                                                isEdge && styles.edgeTick,
                                                { left: `${leftPercent}%` }
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.tickLabel,
                                                { left: `${leftPercent}%` }
                                            ]}
                                        >{val}</Text>
                                    </React.Fragment>
                                );
                            })}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.growButton}
                        onPress={() => handleAnswer(`${height} см`)}
                    >
                        <Text style={styles.growButtonText}>Подтвердить</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: verticalScale(80),
        paddingHorizontal: scale(20),
        backgroundColor: '#fff',
    },
    progress: {
        width: scale(240),
        height: verticalScale(6),
        borderRadius: scale(5),
        marginBottom: verticalScale(30),
        marginLeft: scale(15),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(8),
        marginBottom: scale(-50),
    },
    backArrow: {
        width: scale(24),
        height: scale(24),
        marginRight: scale(10),
        resizeMode: 'contain',
        marginBottom: verticalScale(30),
    },
    question: {
        fontSize: moderateScale(28),
        fontWeight: '600',
        marginTop: verticalScale(60),
        marginBottom: verticalScale(35),
        marginLeft: scale(8),
        textAlign: 'left',
    },
    button: {
        width: '95%',
        backgroundColor: '#ffffff',
        paddingVertical: verticalScale(16),
        borderRadius: scale(15),
        marginBottom: verticalScale(27),
        marginLeft: scale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    growButton: {
        width: '95%',
        backgroundColor: '#ffffff',
        paddingVertical: verticalScale(16),
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: scale(20),
        borderRadius: scale(15),
        marginBottom: verticalScale(27),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    growButtonText: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10),
    },
    buttonText: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
        textAlign: 'left',
        flexShrink: 1,
        flex: 1,
    },
    iconContainer: {
        width: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(13),
        marginRight: scale(17),
    },
    icon: {
        width: scale(32),
        height: scale(32),
        marginRight: scale(17),
        marginLeft: scale(10),
        resizeMode: 'contain',
    },
    ageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(160),
    },
    ageImage: {
        width: width * 0.5,
        height: width * 0.5,
        resizeMode: 'contain',
        marginBottom: verticalScale(20),
    },
    ageLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(25),
    },
    arrowTouchable: {
        paddingHorizontal: scale(20),
    },
    ageArrow: {
        fontSize: moderateScale(24),
        fontWeight: '600',
    },
    ageLabel: {
        fontSize: moderateScale(20),
        fontWeight: '500',
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#ffffff',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(40),
        borderRadius: scale(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    slider: {
        width: '85%',
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    sliderValue: {
        fontSize: moderateScale(20),
        textAlign: 'center',
        marginBottom: verticalScale(-5),
        fontWeight: '600',
    },
    sliderWrapper: {
        width: '100%',
        height: verticalScale(60),
        justifyContent: 'center',
    },
    ticksContainer: {
        position: 'absolute',
        top: 0,
        left: scale(8),
        right: scale(12),
        bottom: 0,
    },
    tick: {
        position: 'absolute',
        width: scale(2.3),
        height: verticalScale(12),
        backgroundColor: '#3DA0EE',
        top: verticalScale(24),
        borderRadius: scale(5),
    },
    edgeTick: {
        width: scale(2.5),
        height: verticalScale(16),
        top: verticalScale(21.5),
        backgroundColor: '#3DA0EE',
    },
    tickLabel: {
        position: 'absolute',
        textAlign: 'center',
        top: verticalScale(40),
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: '#000000',
        transform: [{ translateX: -scale(8) }],
    },
});