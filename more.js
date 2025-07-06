let jsonData;

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
            switch (row.type) {
                case "source":
                    selectElement = document.getElementById("sources");
                    break;

                case "task":
                    selectElement = document.getElementById("tasks");
                    const solution = solutionUrl(row.key);
                    const script = document.createElement("script");
                    script.src = solution;
                    script.type = "module";
                    document.body.appendChild(script);
                    break;
            }
            addOptionToSelect(selectElement, row.key, row.name);
        });
        updateSolution();
    } catch (error) {
        console.error(error.message);
    }
}

const solutionUrl = (solutionName) => {
    return "./more/" + solutionName + ".js"
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
            const solution = solutionUrl(row.key);
            const output = document.getElementById("output");
            output.innerHTML = "";
            fillTheCodeElement(solution);
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

async function fillTheCodeElement(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const codeElement = document.getElementById("source-code");
        const data = await response.text();
        codeElement.textContent = data;
        Prism.highlightElement(codeElement);
    } catch (error) {
        console.error(error.message);
    }
}

async function calculate() {
    const input = document.getElementById("input").value;
    const output = document.getElementById("output");
    const functionName = document.getElementById("tasks").value;
    const solution = solutionUrl(functionName);
    import(solution)
    .then((x) => x[functionName](input))
    .then((result) => (output.textContent = result));
}
