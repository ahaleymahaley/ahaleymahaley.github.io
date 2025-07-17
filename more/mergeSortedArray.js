export const mergeSortedArray = (str) => {
    const inputStr = str.split(",");
    const m = parseInt(inputStr[0]);
    const n = parseInt(inputStr[1]);
    let nums1 = [];
    let nums2 = [];
    let i = 2;
    while (i < 2 + m) {
        nums1.push(parseInt(inputStr[i]));
        i++;
    }
    while (i < 2 + m + n) {
        nums2.push(parseInt(inputStr[i]));
        i++;
    }
    
    let temp = [];
    i = 0;
    let j = 0;
    while (true) {
        const num1 = nums1[i];
        const num2 = nums2[j];
        if (num1 < num2) {
            temp.push(num1);
            i++;
            if (i === m) {
                while (j < n) {
                    temp.push(nums2[j]);
                    j++;
                }
            }
        } else {
            temp.push(num2);
            j++;
            if (j === n) {
                while (i < m) {
                    temp.push(nums1[i]);
                    i++;
                }
            }
        }
        if (i === m && j === n) {
            break;
        }
    }
    return temp;
};
