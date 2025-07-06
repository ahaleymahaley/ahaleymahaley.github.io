export const helloWorld = (str) => {
    let result = "Hello, ";
    if (str !== "") {
        result += `${str}!`;
    } else {
        result += "World!";
    }
    return result;
}
