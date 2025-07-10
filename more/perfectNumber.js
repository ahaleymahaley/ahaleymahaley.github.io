export const perfectNumber = (str) => {
    let result = 0;
    const number = parseInt(str);
    let num = number;
    let div = 2;
    let map = new Map([[1, 1]]);
    while (num != 1) {
        if (num % div === 0) {
            num /= div;
            const mapCopy = new Map(map.entries());
            mapCopy.forEach((element) => {
                const mult = element * div;
                if (mult < number) map.set(mult, mult);
            });
        } else {
            div++;
        }
    }
    map.forEach((element) => {
        result += element;
    });
    return result === number;
};
