export function calculateTDEE(weight, height, age, gender, pal) {
    let bmr;
    if (gender === 'Мужской') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const tdee = bmr * pal;
    return Math.round(tdee);
}
