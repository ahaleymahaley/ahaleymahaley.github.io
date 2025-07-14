export const happyNumber = (str) => {
    let result = false;
    let number = parseInt(str);
    const sumOfSquareDigits = (number) => {
        let sum = 0;
        const numStr = number.toString();
        for (let i = 0; i < numStr.length; i++) {
            sum += Math.pow(parseInt(numStr[i]), 2);
        }
        return sum;
    };
    for (let i = 0; i < 10; i++) {
        const sum = sumOfSquareDigits(number);
        if (sum === 1) {
            result = true;
            break;
        }
        number = sum;
    }
    return result;
};
