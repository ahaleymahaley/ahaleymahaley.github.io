let jsonData;
const functions = new Map();

fillSelectOptions();

async function fillSelectOptions() {
    const url = "./more.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        jsonData = await response.json();
        let selectElement;

        jsonData.forEach((row) => {
            selectElement =
                row.type === "source" ? document.getElementById("sources") : document.getElementById("tasks");
            addOptionToSelect(selectElement, row.key, row.name);
        });
        updateSolution();
    } catch (error) {
        console.error(error.message);
    }
}

async function addOptionToSelect(selectElement, optionValue, optionText) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.text = optionText;
    selectElement.appendChild(option);
}

async function updateSolution() {
    const taskKey = document.getElementById("tasks").value;
    jsonData.forEach((row) => {
        if (row.key === taskKey) {
            const name = document.getElementById("name");
            name.innerHTML = row.name;
            const source = document.getElementById("source");
            source.innerHTML = `<a  href="${row.sourceurl}" target="_blank">${row.sourceurl}</a>`;
            const description = document.getElementById("description");
            description.innerHTML = row.description;
            const input = document.getElementById("input");
            input.value = row.defaultInput;
            const output = document.getElementById("output");
            output.innerHTML = "";
            fillTheCodeElement(row.key);
            return;
        }
    });
}

async function updateOptions() {
    const sources = document.getElementById("sources").value;
    const tasks = document.getElementById("tasks");
    tasks.options.length = 0;
    jsonData.forEach((row) => {
        if (row.type === "task" && (row.source === sources || sources === "all")) {
            addOptionToSelect(tasks, row.key, row.name);
        }
    });
    updateSolution();
}

async function fillTheCodeElement(functionName) {
    if (!functions.has(functionName)) {
        const module = await import("./more/" + functionName + ".js");
        functions.set(functionName, module[functionName]);
    }
    const codeElement = document.getElementById("source-code");
    codeElement.textContent = `export const ${functionName} = ${functions.get(functionName)}`;
    Prism.highlightElement(codeElement);
}

async function calculate() {
    const input = document.getElementById("input").value;
    const output = document.getElementById("output");
    const functionName = document.getElementById("tasks").value;
    output.textContent = functions.get(functionName)(input);
}
