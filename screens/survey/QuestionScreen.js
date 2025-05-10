import React, { useState, useRef, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, Keyboard, PanResponder, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import NumericInput from './components/NumericInput';
import ConfirmButton from './components/ConfirmButton';

// Стрелки
import BlueArrow from '@assets/images/survey/QuestionScreen/arrow/blue-arrow.svg';
import GreenArrow from '@assets/images/survey/QuestionScreen/arrow/green-arrow.svg';
import RedArrow from '@assets/images/survey/QuestionScreen/arrow/red-arrow.svg';
import BackArrow from '@assets/images/survey/QuestionScreen/arrow/back-arrow.svg';

// Время
import OneMonthIcon from '@assets/images/survey/QuestionScreen/time/one-month.svg';
import OneToThreeMonthsIcon from '@assets/images/survey/QuestionScreen/time/one-to-three-months.svg';
import ThreeToSixMonthsIcon from '@assets/images/survey/QuestionScreen/time/three-to-six-months.svg';
import NoDeadlineIcon from '@assets/images/survey/QuestionScreen/time/no-deadline.svg';

// Иконки для гендера
import ManIcon from '@assets/images/survey/QuestionScreen/gender/man-icon.svg';
import WomanIcon from '@assets/images/survey/QuestionScreen/gender/woman-icon.svg';

// Иконки для активности
import SeatIcon from '@assets/images/survey/QuestionScreen/activity/sitting-icon.svg';
import WalkIcon from '@assets/images/survey/QuestionScreen/activity/walking-icon.svg';
import RunIcon from '@assets/images/survey/QuestionScreen/activity/running-icon.svg';
import SportIcon from '@assets/images/survey/QuestionScreen/activity/weightlifting-icon.svg';

// Иконки для возраста (мужские)
import ChildMIcon from '@assets/images/survey/QuestionScreen/age/man/child-man.svg';
import YouthMIcon from '@assets/images/survey/QuestionScreen/age/man/youth-man.svg';
import AdultMIcon from '@assets/images/survey/QuestionScreen/age/man/adult-man.svg';
import MiddleMIcon from '@assets/images/survey/QuestionScreen/age/man/middle-man.svg';
import SeniorMIcon from '@assets/images/survey/QuestionScreen/age/man/senior-man.svg';

// Иконки для возраста (женские)
import ChildWIcon from '@assets/images/survey/QuestionScreen/age/woman/child-woman.svg';
import YouthWIcon from '@assets/images/survey/QuestionScreen/age/woman/youth-woman.svg';
import AdultWIcon from '@assets/images/survey/QuestionScreen/age/woman/adult-woman.svg';
import MiddleWIcon from '@assets/images/survey/QuestionScreen/age/woman/middle-woman.svg';
import SeniorWIcon from '@assets/images/survey/QuestionScreen/age/woman/senior-woman.svg';


const { width } = Dimensions.get('window');

const steps = [
    {
        question: 'Какая ваша основная цель?',
        options: [
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

const numericInputConfig = {
    height: {
        min: 30,
        max: 230,
        step: 1,
        unit: 'см',
        sections: [30, 80, 130, 180, 230],
        validate: (value) => Number.isInteger(value),
        format: (value) => `${value} см`
    },
    currentWeight: {
        min: 20,
        max: 220,
        step: 0.1,
        unit: 'кг',
        sections: [20, 70, 120, 170, 220],
        validate: (value) => /^\d+(\.\d)?$/.test(value),
        format: (value) => `${value.toFixed(1)} кг`
    },
    desiredWeight: {
        min: 20,
        max: 220,
        step: 0.1,
        unit: 'кг',
        sections: [20, 70, 120, 170, 220],
        validate: (value) => /^\d+(\.\d)?$/.test(value),
        format: (value) => `${value.toFixed(1)} кг`
    }
};

const ageStepIndex = 3;
const heightStepIndex = 4;
const currentWeightStepIndex = 5;

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

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -20) handleNextAge();
                else if (gesture.dx > 20) handlePrevAge();
            },
        })
    ).current;

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
            const selectedGender = selectedAnswers[2] || 'Мужской';
            const options = getAgeOptions(selectedGender);
            const prevLabel = selectedAnswers[step];
            const prevIndex = options.findIndex(o => o.label === prevLabel);

            if (prevIndex >= 0) {
                setAgeIndex(prevIndex);
            } else {
                setAgeIndex(0);
            }
        }
    }, [step, selectedAnswers]);

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

    const handleSliderChange = (type) => (val) => {
        const setters = {
            height: setTempHeight,
            currentWeight: setTempCurrentWeight,
            desiredWeight: setTempDesiredWeight
        };
        setters[type](val);
    };

    const handleSliderComplete = (type) => (val) => {
        const setters = {
            height: setHeight,
            currentWeight: setCurrentWeight,
            desiredWeight: setDesiredWeight
        };
        setters[type](val);
    };

    const openInput = (type) => {
        setInputValue('');
        setInputMode(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const validateInput = (value, type) => {
        const numValue = parseFloat(value.replace(',', '.'));
        const config = numericInputConfig[type];

        if (isNaN(numValue)) {
            Alert.alert('Ошибка', 'Пожалуйста, введите число');
            return false;
        }

        if (numValue < config.min || numValue > config.max) {
            Alert.alert('Ошибка', `Значение должно быть между ${config.min} и ${config.max} ${config.unit}`);
            return false;
        }

        if (!config.validate(numValue)) {
            Alert.alert('Ошибка', type === 'height' ? 'Должно быть целое число' : 'Не более одного знака после запятой');
            return false;
        }

        return true;
    };

    const handleInputConfirm = () => {
        const type = step === heightStepIndex ? 'height' :
            step === currentWeightStepIndex ? 'currentWeight' :
                'desiredWeight';

        if (!validateInput(inputValue, type)) return;

        const value = parseFloat(inputValue.replace(',', '.'));
        const config = numericInputConfig[type];

        if (type === 'height') {
            const validatedValue = Math.round(value);
            setHeight(validatedValue);
            setTempHeight(validatedValue);
            handleAnswer(config.format(validatedValue));
        } else {
            const validatedValue = parseFloat(value.toFixed(1));
            const setter = type === 'currentWeight' ? setCurrentWeight : setDesiredWeight;
            const tempSetter = type === 'currentWeight' ? setTempCurrentWeight : setTempDesiredWeight;
            setter(validatedValue);
            tempSetter(validatedValue);
            handleAnswer(config.format(validatedValue));
        }

        setInputMode(false);
        Keyboard.dismiss();
    };

    const renderInputField = () => (
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
                        autoFocus
                        placeholder={step === heightStepIndex ? "Введите рост (см)" : "Введите вес (кг)"}
                        placeholderTextColor="#999"
                    />
                    <View style={styles.inputButtonsRow}>
                        <TouchableOpacity style={styles.okButton} onPress={handleInputConfirm}>
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

    const renderNumericInput = (type) => (
        <NumericInput
            type={type}
            value={type === 'height' ? height : type === 'currentWeight' ? currentWeight : desiredWeight}
            tempValue={type === 'height' ? tempHeight : type === 'currentWeight' ? tempCurrentWeight : tempDesiredWeight}
            config={numericInputConfig[type]}
            onValueChange={handleSliderChange(type)}
            onSlidingComplete={handleSliderComplete(type)}
            onInputPress={() => openInput(type)}
        />
    );

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
                    <ConfirmButton
                        selected={selectedAnswers[step] === ageOptions[ageIndex].label}
                        onPress={confirmAge}
                    />
                </View>
            ) : steps[step].options ? (
                steps[step].options.map((option, idx) => {
                    const isSelected = selectedAnswers[step] === option.text;
                    const Icon = option.icon;

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
                                {option.icon && (
                                    <View style={styles.iconContainer}>
                                        <Icon
                                            width={option.iconSize ? scale(option.iconSize) : moderateScale(32)}
                                            height={option.iconSize ? scale(option.iconSize) : moderateScale(32)}
                                            fill={isSelected ? "#fff" : "#000"}
                                        />
                                    </View>
                                )}
                                <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>
                                    {option.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : step === heightStepIndex ? (
                <>
                    {renderNumericInput('height')}
                    <ConfirmButton
                        selected={selectedAnswers[step] === numericInputConfig.height.format(height)}
                        onPress={() => handleAnswer(numericInputConfig.height.format(height))}
                    />
                </>
            ) : step === currentWeightStepIndex ? (
                <>
                    {renderNumericInput('currentWeight')}
                    <ConfirmButton
                        selected={selectedAnswers[step] === numericInputConfig.currentWeight.format(currentWeight)}
                        onPress={() => handleAnswer(numericInputConfig.currentWeight.format(currentWeight))}
                    />
                </>
            ) : (
                <>
                    {renderNumericInput('desiredWeight')}
                    <ConfirmButton
                        selected={selectedAnswers[step] === numericInputConfig.desiredWeight.format(desiredWeight)}
                        onPress={() => handleAnswer(numericInputConfig.desiredWeight.format(desiredWeight))}
                    />
                </>
            )}

            {inputMode && renderInputField()}
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
        marginRight: scale(10),
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
        fontFamily: 'NotoSansMedium',
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