import {Asset} from "expo-asset";

export const images = {
    // Из Sun.js
    RAYS_IMAGE: require('./assets/images/StartScreen/sun-rays.png'),

    // Из QuestionScreen.js
    // Стрелки
    BlueArrow: require('./assets/images/QuestionScreen/arrow/blue-arrow.png'),
    GreenArrow: require('./assets/images/QuestionScreen/arrow/green-arrow.png'),
    RedArrow: require('./assets/images/QuestionScreen/arrow/red-arrow.png'),
    BackArrow: require('./assets/images/QuestionScreen/arrow/back-arrow.png'),
    
    // Время
    OneMonthIcon: require('./assets/images/QuestionScreen/time/one_month.png'),
    OneToThreeMonthsIcon: require('./assets/images/QuestionScreen/time/one_to_three_months.png'),
    ThreeToSixMonthsIcon: require('./assets/images/QuestionScreen/time/three_to_six_months.png'),
    NoDeadlineIcon: require('./assets/images/QuestionScreen/time/no_deadline.png'),

    // Иконки для гендера
    ManIcon: require('./assets/images/QuestionScreen/gender/man-icon.png'),
    WomanIcon: require('./assets/images/QuestionScreen/gender/woman-icon.png'),

    // Иконки для активности
    SeatIcon: require('./assets/images/QuestionScreen/activity/sitting-icon.png'),
    WalkIcon: require('./assets/images/QuestionScreen/activity/walking-icon.png'),
    RunIcon: require('./assets/images/QuestionScreen/activity/running-icon.png'),
    SportIcon: require('./assets/images/QuestionScreen/activity/weightlifting-icon.png'),

    // Иконки для возраста
    // (мужские)
    ChildMIcon: require('./assets/images/QuestionScreen/age/man/child-man.png'),
    YouthMIcon: require('./assets/images/QuestionScreen/age/man/youth-man.png'),
    AdultMIcon: require('./assets/images/QuestionScreen/age/man/adult-man.png'),
    MiddleMIcon: require('./assets/images/QuestionScreen/age/man/middle-man.png'),
    SeniorMIcon: require('./assets/images/QuestionScreen/age/man/senior-man.png'),

    // (женские)
    ChildWIcon: require('./assets/images/QuestionScreen/age/woman/child-woman.png'),
    YouthWIcon: require('./assets/images/QuestionScreen/age/woman/youth-woman.png'),
    AdultWIcon: require('./assets/images/QuestionScreen/age/woman/adult-woman.png'),
    MiddleWIcon: require('./assets/images/QuestionScreen/age/woman/middle-woman.png'),
    SeniorWIcon: require('./assets/images/QuestionScreen/age/woman/senior-woman.png'),
};

// Функция для предзагрузки
export async function preloadAssets() {
    const cachePromises = Object.values(images).map(img => Asset.fromModule(img).downloadAsync());
    await Promise.all(cachePromises);
}