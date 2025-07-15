export const fibonacci = (str) => {
    let result;
    const number = typeof str === "string" ? parseInt(str) : str;
    switch (true) {
        case number === 0:
            result = 0;
            break;
        case number === 1:
            result = 1;
            break;
        case number > 1:
            result = fibonacci(number - 1) + fibonacci(number - 2);
            break;
    }
    return result;
};
