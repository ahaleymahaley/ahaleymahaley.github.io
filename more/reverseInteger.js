export const reverseInteger = (str) => {
    let result = "";
    const number = parseInt(str);
    let index = str.length - 1;
    let end = 0;
    if (number !== Math.abs(number)) {
        result += "-";
        end++;
    }
    while (index >= end) {
        result += str[index];
        index--;
    }
    return result;
};
