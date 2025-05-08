import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard, PanResponder, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { ProgressBar } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

// Импорты иконок остаются без изменений
import BlueArrow from '@assets/images/survey/QuestionScreen/arrow/blue-arrow.svg';
import GreenArrow from '@assets/images/survey/QuestionScreen/arrow/green-arrow.svg';
import RedArrow from '@assets/images/survey/QuestionScreen/arrow/red-arrow.svg';
import BackArrow from '@assets/images/survey/QuestionScreen/arrow/back-arrow.svg';

import OneMonthIcon from '@assets/images/survey/QuestionScreen/time/one-month.svg';
import OneToThreeMonthsIcon from '@assets/images/survey/QuestionScreen/time/one-to-three-months.svg';
import ThreeToSixMonthsIcon from '@assets/images/survey/QuestionScreen/time/three-to-six-months.svg';
import NoDeadlineIcon from '@assets/images/survey/QuestionScreen/time/no-deadline.svg';

import ManIcon from '@assets/images/survey/QuestionScreen/gender/man-icon.svg';
import WomanIcon from '@assets/images/survey/QuestionScreen/gender/woman-icon.svg';

import SeatIcon from '@assets/images/survey/QuestionScreen/activity/sitting-icon.svg';
import WalkIcon from '@assets/images/survey/QuestionScreen/activity/walking-icon.svg';
import RunIcon from '@assets/images/survey/QuestionScreen/activity/running-icon.svg';
import SportIcon from '@assets/images/survey/QuestionScreen/activity/weightlifting-icon.svg';

import ChildMIcon from '@assets/images/survey/QuestionScreen/age/man/child-man.svg';
import YouthMIcon from '@assets/images/survey/QuestionScreen/age/man/youth-man.svg';
import AdultMIcon from '@assets/images/survey/QuestionScreen/age/man/adult-man.svg';
import MiddleMIcon from '@assets/images/survey/QuestionScreen/age/man/middle-man.svg';
import SeniorMIcon from '@assets/images/survey/QuestionScreen/age/man/senior-man.svg';

import ChildWIcon from '@assets/images/survey/QuestionScreen/age/woman/child-woman.svg';
import YouthWIcon from '@assets/images/survey/QuestionScreen/age/woman/youth-woman.svg';
import AdultWIcon from '@assets/images/survey/QuestionScreen/age/woman/adult-woman.svg';
import MiddleWIcon from '@assets/images/survey/QuestionScreen/age/woman/middle-woman.svg';
import SeniorWIcon from '@assets/images/survey/QuestionScreen/age/woman/senior-woman.svg';

const { width } = Dimensions.get('window');

const steps = [
    { question: 'Какая ваша основная цель?', options: [
            { text: 'Снижение веса', icon: BlueArrow },
            { text: 'Набор мышечной массы', icon: RedArrow },
            { text: 'Поддержание текущего веса', icon: GreenArrow },
        ]
    },
    { question: 'За какой срок вы хотите достичь своей цели?', options: [
            { text: 'До 1 месяца', icon: OneMonthIcon },
            { text: '1-3 месяца', icon: OneToThreeMonthsIcon },
            { text: '3-6 месяцев', icon: ThreeToSixMonthsIcon },
            { text: 'Без конкретных сроков (в комфортном темпе)', icon: NoDeadlineIcon },
        ]
    },
    { question: 'Ваш пол', options: [
            { text: 'Мужской', icon: ManIcon },
            { text: 'Женский', icon: WomanIcon },
        ]
    },
    { question: 'Ваш возраст' },
    { question: 'Ваш рост' },
    { question: 'Ваш текущий вес' },
    { question: 'Ваш желаемый вес' },
    { question: 'Уровень физической активности:', options: [
            { text: 'Минимальный (сидячий образ жизни)', icon: SeatIcon },
            { text: 'Низкий (1–2 тренировки в неделю или много ходьбы)', icon: WalkIcon, iconSize: 38 },
            { text: 'Средний (3–5 тренировок в неделю)', icon: RunIcon },
            { text: 'Высокий (интенсивные тренировки, физическая работа или спорт)', icon: SportIcon, iconSize: 48 },
        ]
    },
];

const sections = [30, 80, 130, 180, 230];
const weightSections = [20, 70, 120, 170, 220];
const MIN_HEIGHT = 30;
const MAX_HEIGHT = 230;
const MIN_WEIGHT = 20;
const MAX_WEIGHT = 220;

export default function QuestionScreen() {
    const navigation = useNavigation();
    const [step, setStep] = useState(0);
    const totalSteps = steps.length;
    const [height, setHeight] = useState(130);
    const [tempHeight, setTempHeight] = useState(130);
    const [currentWeight, setCurrentWeight] = useState(70);
    const [tempCurrentWeight, setTempCurrentWeight] = useState(70);
    const [desiredWeight, setDesiredWeight] = useState(70);
    const [tempDesiredWeight, setTempDesiredWeight] = useState(70);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [ageIndex, setAgeIndex] = useState(0);
    const [inputMode, setInputMode] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const ageStepIndex = 3;
    const heightStepIndex = 4;
    const currentWeightStepIndex = 5;
    const desiredWeightStepIndex = 6;

    const getAgeOptions = (gender) => {
        if (gender === 'Женский') {
            return [
                { label: 'До 18 лет', icon: ChildWIcon },
                { label: '18-25 лет', icon: YouthWIcon },
                { label: '26-35 лет', icon: AdultWIcon },
                { label: '36-50 лет', icon: MiddleWIcon },
                { label: 'Старше 50 лет', icon: SeniorWIcon },
            ];
        } else {
            return [
                { label: 'До 18 лет', icon: ChildMIcon },
                { label: '18-25 лет', icon: YouthMIcon },
                { label: '26-35 лет', icon: AdultMIcon },
                { label: '36-50 лет', icon: MiddleMIcon },
                { label: 'Старше 50 лет', icon: SeniorMIcon },
            ];
        }
    };

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

    const confirmAge = () => {
        handleAnswer(ageOptions[ageIndex].label);
    };

    useEffect(() => {
        if (step === ageStepIndex) {
            setAgeIndex(0);
        }
    }, [step]);

    const handleAnswer = (answer) => {
        console.log('Вы выбрали:', answer);
        setSelectedAnswers(prev => ({
            ...prev,
            [step]: answer
        }));

        // Закрываем клавиатуру и режим ввода
        Keyboard.dismiss();
        setInputMode(false);

        if (step < totalSteps - 1) {
            setStep(step + 1);
        } else {
            console.log('Анкета завершена!');
            if (navigation) navigation.navigate('Calculation');
        }
    };

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setInputMode(false);
        });

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        Keyboard.dismiss();
        setInputMode(false);
    }, [step]);

    const getInputType = () => {
        const type = step === heightStepIndex ? 'height' :
                    step === currentWeightStepIndex ? 'currentWeight' :
                    step === desiredWeightStepIndex ? 'desiredWeight' : null;
        return type;
    };

    const openInput = () => {
        const type = getInputType();

        if (type === 'height') {
            setInputValue(height.toString());
        } else if (type === 'currentWeight') {
            setInputValue(currentWeight.toString());
        } else if (type === 'desiredWeight') {
            setInputValue(desiredWeight.toString());
        }
        setInputMode(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const validateInput = (value, type) => {
        const numValue = parseFloat(value.replace(',', '.'));

        if (isNaN(numValue)) {
            Alert.alert('Ошибка', 'Пожалуйста, введите число');
            return false;
        }

        if (type === 'height') {
            if (numValue < MIN_HEIGHT || numValue > MAX_HEIGHT) {
                Alert.alert('Ошибка', `Рост должен быть между ${MIN_HEIGHT} и ${MAX_HEIGHT} см`);
                return false;
            }
            if (!Number.isInteger(numValue)) {
                Alert.alert('Ошибка', 'Рост должен быть целым числом');
                return false;
            }
        } else {
            if (numValue < MIN_WEIGHT || numValue > MAX_WEIGHT) {
                Alert.alert('Ошибка', `Вес должен быть между ${MIN_WEIGHT} и ${MAX_WEIGHT} кг`);
                return false;
            }

            const decimalPart = value.split(/[,.]/)[1];
            if (decimalPart && decimalPart.length > 1) {
                Alert.alert('Ошибка', 'Вес должен иметь не более одного знака после запятой');
                return false;
            }
        }

        return true;
    };

    const handleInputConfirm = () => {
        const type = getInputType();

        if (!validateInput(inputValue, type)) {
            return;
        }

        const value = parseFloat(inputValue.replace(',', '.'));
        let validatedValue = value;

        if (type === 'height') {
            validatedValue = Math.round(value);
            setHeight(validatedValue);
            setTempHeight(validatedValue);
            handleAnswer(`${validatedValue} см`);
        } else {
            validatedValue = parseFloat(value.toFixed(1));
            if (type === 'currentWeight') {
                setCurrentWeight(validatedValue);
                setTempCurrentWeight(validatedValue);
            } else {
                setDesiredWeight(validatedValue);
                setTempDesiredWeight(validatedValue);
            }
            handleAnswer(`${validatedValue.toFixed(1)} кг`);
        }

        setInputMode(false);
        Keyboard.dismiss();
    };

    const renderInputField = () => {
        if (!inputMode) return null;

        return (
            <TouchableOpacity
                style={styles.inputOverlay}
                activeOpacity={1}
                onPress={() => {
                    setInputMode(false);
                    Keyboard.dismiss();
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                            keyboardType="numeric"
                            autoFocus={true}
                            placeholder={step === heightStepIndex ? "Введите рост (см)" : "Введите вес (кг)"}
                            placeholderTextColor="#999"
                        />
                        <View style={styles.inputButtonsRow}>
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={handleInputConfirm}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setInputMode(false);
                                    Keyboard.dismiss();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        );
    };

    const renderSlider = () => {
        const type = getInputType();

        let value, tempValue, min, max, stepSize, unit, sectionsArray;

        if (type === 'height') {
            value = height;
            tempValue = tempHeight;
            min = MIN_HEIGHT;
            max = MAX_HEIGHT;
            stepSize = 1;
            unit = 'см';
            sectionsArray = sections;
        } else if (type === 'currentWeight' || type === 'desiredWeight') {
            value = type === 'currentWeight' ? currentWeight : desiredWeight;
            tempValue = type === 'currentWeight' ? tempCurrentWeight : tempDesiredWeight;
            min = MIN_WEIGHT;
            max = MAX_WEIGHT;
            stepSize = 0.1;
            unit = 'кг';
            sectionsArray = weightSections;
        }

        return (
            <View>
                <TouchableOpacity onPress={openInput}>
                    <Text style={styles.sliderValue}>
                        {type === 'height' ?
                            `${tempValue} ${unit}` :
                            `${tempValue.toFixed(1)} ${unit}`}
                    </Text>
                </TouchableOpacity>

                <View style={styles.sliderWrapper}>
                    <Slider
                        style={styles.slider}
                        minimumValue={min}
                        maximumValue={max}
                        value={value}
                        step={stepSize}
                        onValueChange={(val) => {
                            if (type === 'height') setTempHeight(val);
                            else if (type === 'currentWeight') setTempCurrentWeight(val);
                            else if (type === 'desiredWeight') setTempDesiredWeight(val);
                        }}
                        onSlidingComplete={(val) => {
                            if (type === 'height') setHeight(val);
                            else if (type === 'currentWeight') setCurrentWeight(val);
                            else if (type === 'desiredWeight') setDesiredWeight(val);
                        }}
                        minimumTrackTintColor="#3DA0EE"
                        maximumTrackTintColor="#C1C1C1"
                        thumbTintColor="#3DA0EE"
                    />
                    <View style={styles.ticksContainer}>
                        {sectionsArray.map((val, i) => {
                            const leftPercent = ((val - min) / (max - min)) * 96 + 2;
                            const isEdge = i === 0 || i === sectionsArray.length - 1;
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
                    style={[
                        styles.growButton,
                        selectedAnswers[step] === (
                            type === 'height' ?
                                `${value} ${unit}` :
                                `${value.toFixed(1)} ${unit}`
                        ) && styles.selectedGrowButton
                    ]}
                    onPress={() => {
                        if (type === 'height') handleAnswer(`${value} ${unit}`);
                        else handleAnswer(`${value.toFixed(1)} ${unit}`);
                    }}
                >
                    <Text style={[
                        styles.growButtonText,
                        selectedAnswers[step] === (
                            type === 'height' ?
                                `${value} ${unit}` :
                                `${value.toFixed(1)} ${unit}`
                        ) && styles.selectedGrowButtonText
                    ]}>
                        Подтвердить
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const selectedGender = selectedAnswers[2] || 'Мужской';
    const ageOptions = getAgeOptions(selectedGender);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    step > 0 ? setStep(step - 1) : navigation.goBack();
                }}>
                    <BackArrow
                        width={scale(24)}
                        height={scale(24)}
                        style={styles.backArrow}
                    />
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
                    {(() => {
                        const AgeIcon = ageOptions[ageIndex].icon;
                        return (
                            <AgeIcon
                                width={width * 0.5}
                                height={width * 0.5}
                                style={styles.ageImage}
                            />
                        );
                    })()}

                    <View style={styles.ageLabelContainer}>
                        <TouchableOpacity onPress={handlePrevAge} style={styles.arrowTouchable}>
                            <Text style={styles.ageArrow}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.ageLabel}>{ageOptions[ageIndex].label}</Text>
                        <TouchableOpacity onPress={handleNextAge} style={styles.arrowTouchable}>
                            <Text style={styles.ageArrow}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            selectedAnswers[step] === ageOptions[ageIndex].label && styles.selectedConfirmButton
                        ]}
                        onPress={confirmAge}>
                        <Text style={[
                            styles.confirmButtonText,
                            selectedAnswers[step] === ageOptions[ageIndex].label && styles.selectedConfirmButtonText
                        ]}>
                            Подтвердить
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : steps[step].options ? (
                steps[step].options.map((option, idx) => {
                    const isSelected = selectedAnswers[step] === option.text;
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.button,
                                isSelected && styles.selectedButton
                            ]}
                            onPress={() => handleAnswer(option.text)}
                        >
                            <View style={styles.buttonContent}>
                                {option.icon && (() => {
                                    const Icon = option.icon;
                                    return (
                                        <View style={styles.iconContainer}>
                                            <Icon
                                                width={option.iconSize ? scale(option.iconSize) : moderateScale(32)}
                                                height={option.iconSize ? scale(option.iconSize) : moderateScale(32)}
                                                fill={isSelected ? "#fff" : "#000"}
                                            />
                                        </View>
                                    );
                                })()}
                                <Text style={[
                                    styles.buttonText,
                                    isSelected && styles.selectedButtonText
                                ]}>
                                    {option.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                renderSlider()
            )}

            {renderInputField()}
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
    progress: {
        width: scale(240),
        height: verticalScale(6),
        borderRadius: scale(5),
        marginBottom: verticalScale(30),
        marginLeft: scale(15),
    },
    question: {
        fontSize: moderateScale(28, 0.3),
        fontWeight: '600',
        marginTop: moderateScale(50),
        marginBottom: moderateScale(30),
        marginLeft: scale(8),
        textAlign: 'left',
    },
    button: {
        width: '95%',
        backgroundColor: '#ffffff',
        paddingVertical: verticalScale(16),
        borderRadius: scale(15),
        marginBottom: moderateScale(27, 0.1),
        marginLeft: scale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedButton: {
        backgroundColor: '#3DA0EE',
        shadowColor: '#3DA0EE',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: scale(10),
    },
    buttonText: {
        color: '#000',
        fontSize: moderateScale(18, 0.1),
        fontWeight: '600',
        textAlign: 'left',
        flexShrink: 1,
        flex: 1,
    },
    selectedButtonText: {
        color: '#ffffff',
    },
    iconContainer: {
        width: scale(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(13),
        marginRight: scale(17),
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
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedConfirmButton: {
        backgroundColor: '#3DA0EE',
        shadowColor: '#3DA0EE',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    selectedConfirmButtonText: {
        color: '#ffffff',
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
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedGrowButton: {
        backgroundColor: '#3DA0EE',
        shadowColor: '#3DA0EE',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    growButtonText: {
        color: '#000',
        fontSize: moderateScale(18),
        fontWeight: '600',
        textAlign: 'center',
    },
    selectedGrowButtonText: {
        color: '#ffffff',
    },
    inputOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    keyboardAvoidingView: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#3DA0EE',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: moderateScale(18),
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    inputButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    okButton: {
        flex: 1,
        backgroundColor: '#3DA0EE',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 5,
    },
    okButtonText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginLeft: 5,
    },
    cancelButtonText: {
        color: '#3DA0EE',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});