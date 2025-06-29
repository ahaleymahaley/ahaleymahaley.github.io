const invertCase = (str) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i].toUpperCase()) {
            result += str[i].toLowerCase();
        } else {
            result += str[i].toUpperCase();
        }
    }
    return result;
};

async function calculate() {
    document.getElementById("output").textContent = invertCase(document.getElementById("input").value)    
}


