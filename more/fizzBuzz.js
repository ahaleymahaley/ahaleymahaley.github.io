export const fizzBuzz = (str) => {
    let result = "";
    const range = str.split(",");
    const begin = parseInt(range[0]);
    const end = parseInt(range[1]);

    for (let number = begin; number <= end; number++) {
        if (number !== begin) {
            result += ", ";
        }
        switch (true) {
            case number % 15 === 0:
                result += "FizzBuzz";
                break;
            case number % 5 === 0:
                result += "Buzz";
                break;
            case number % 3 === 0:
                result += "Fizz";
                break;
            default:
                result += number;
                break;
        }
    }
    return result;
};
