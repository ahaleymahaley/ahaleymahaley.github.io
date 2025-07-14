export const happyTicket = (str) => {
    let right = 0;
    let left = 0;
    const halfLen = str.length / 2;
    for (let i = 0; i < halfLen; i++) {
        left += parseInt(str[i]);
        right += parseInt(str[i + halfLen]);
    }
    return left === right;
};
