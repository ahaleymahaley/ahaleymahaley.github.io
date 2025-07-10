export const perfectNumber = (str) => {
    let result = 0;
    const number = parseInt(str);
    let num = number;
    let div = 2;
    let map = new Map([[1, 1]]);
    while (num != 1) {
        if (num % div === 0) {
            num /= div;
            const tempMap = new Map();
            map.forEach((element) => {
                const mult = element * div;
                if (mult < number) tempMap.set(mult, mult);
            });
            tempMap.forEach((value, key) => map.set(key, value));
        } else {
            div++;
        }
    }
    map.forEach((element) => {
        result += element;
    });
    return result === number;
};
