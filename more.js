let jsonExercises = getJson("more");
let jsonPredictions = getJson("prediction");
let functions = new Map();
let cellsToColor = new Set();
let Ocells = new Set();
let Xcells = new Set();
const winningSets = [
    ["11", "12", "13"],
    ["21", "22", "23"],
    ["31", "32", "33"],
    ["11", "21", "31"],
    ["12", "22", "32"],
    ["13", "23", "33"],
    ["11", "22", "33"],
    ["13", "22", "31"],
];
const oSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
    data-guides="{&quot;vertical&quot;:[],&quot;horizontal&quot;:[]}"><defs />
    <ellipse fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" id="tSvg1415255d9d1" title="Ellipse 1" cx="50" cy="50" rx="45" ry="45" /></svg>`;
const xSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
    data-guides="{&quot;vertical&quot;:[],&quot;horizontal&quot;:[]}"><defs />
    <line fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" id="tSvgb541081796" title="Line 1" x1="10" y1="10" x2="90" y2="90" />
    <line fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" id="tSvg98e8920406" title="Line 2" x1="90" y1="10" x2="10" y2="90" /></svg>`;
const gameLog = document.getElementById("gameLog");
const beginLog =
    "Click any cell to start and place 'o' or <button type='button' onclick='machineTurn()'>let the machine play first</button>";
const userTurnLog = "Your turn";
const machineTurnLog = "Machine's turn";
const winLogMessage = "You win :)";
const loseLogMessage = "You lose :(";
const drawLogMessage = "A draw!";
const cells = document.querySelectorAll("#tic-tac-toe-board .cell");

getStarted();

async function getStarted() {
    window.addEventListener("DOMContentLoaded", switchTabByHash);
    window.addEventListener("hashchange", switchTabByHash);
    jsonExercises = await getJson("more");
    jsonPredictions = await getJson("prediction");
    fillSelectOptions();
    resetGameField();
    cells.forEach((cell) => {
        cell.addEventListener("click", onCellClick);
    });
}
function switchTabByHash() {
    const hash = window.location.hash.substring(1);
    // document.querySelectorAll('input[name="tabs"]').forEach((tab) => {
    //     tab.checked = false;
    // });

    if (hash) {
        const targetTab = document.getElementById(`tab-${hash}`);
        if (targetTab) {
            targetTab.checked = true;
        }
    }
}
async function resetGameField() {
    fillTheSet();
    Ocells.clear();
    Xcells.clear();
    document.getElementById("gameLog").innerHTML = beginLog;
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.style = "";
        cell.addEventListener("click", onCellClick);
    });
}

function onCellClick(event) {
    const cell = event.target;
    colorCell(cell.id.slice(4), "o");

    if (isWin()) {
        return;
    }

    machineTurn();
}

function machineTurn() {
    gameLog.innerHTML = machineTurnLog;
    cells.forEach((cell) => {
        cell.removeEventListener("click", onCellClick);
    });
    setTimeout(() => {
        gameLog.innerHTML += ".";
        setTimeout(() => {
            gameLog.innerHTML += ".";
            setTimeout(() => {
                gameLog.innerHTML += ".";
                setTimeout(() => {
                    const randomUncoloredCell = Math.floor(Math.random() * cellsToColor.size);
                    let count = 0;
                    for (const element of cellsToColor) {
                        if (count === randomUncoloredCell) {
                            colorCell(element, "x");
                            break;
                        }
                        count++;
                    }
                    if (isWin()) {
                        return;
                    }
                    cells.forEach((cell) => {
                        cell.addEventListener("click", onCellClick);
                    });
                    gameLog.innerHTML = userTurnLog;
                }, 200);
            }, 200);
        }, 200);
    }, 200);
}

function isWin() {
    for (const set of winningSets) {
        let isOSubset = true;
        let isXSubset = true;

        set.forEach((cellid) => {
            if (!Ocells.has(cellid)) isOSubset = false;
            if (!Xcells.has(cellid)) isXSubset = false;
        });
        if (isOSubset || isXSubset) {
            colorWinnigSet(set);

            gameLog.innerHTML = isOSubset ? winLogMessage : loseLogMessage;
            const cells = document.querySelectorAll("#tic-tac-toe-board .cell");
            cells.forEach((cell) => {
                cell.removeEventListener("click", onCellClick);
            });
            return true;
        }
    }
    if (cellsToColor.size === 0) {
        gameLog.innerHTML = drawLogMessage;
        return true;
    }
}

function colorCell(cellid, symbol) {
    cellsToColor.delete(cellid);

    const destSet = symbol === "o" ? Ocells : Xcells;
    destSet.add(cellid);

    const cell = document.getElementById("cell" + cellid);
    cell.innerHTML = symbol === "o" ? oSymbol : xSymbol;
}

function colorWinnigSet(set) {
    set.forEach((element) => {
        const cell = document.getElementById("cell" + element);
        cell.style = `background-color: var(--alt-bg-color);`;
    });
}

document.addEventListener("submit", (event) => {
    event.preventDefault();
    const chatForm = event.target;
    const input = chatForm.elements.message;
    const userMessage = input.value;
    addMessage("You:", "my-chat-message", userMessage);
    const predictionId = Math.floor(Math.random() * 7).toString();

    jsonPredictions.forEach((prediction) => {
        if (predictionId === prediction.id) {
            addMessage("The Oracle:", "user-chat-message", prediction.text);
        }
    });

    input.value = "";
    input.scrollIntoView();
    input.focus();
});

async function fillTheSet() {
    cellsToColor.clear();
    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            cellsToColor.add("" + i + j);
        }
    }
}

async function getJson(filename) {
    const url = `./${filename}.json`;

    const cashedFileSize = localStorage.getItem(`${filename}Size`);

    try {
        const response = await fetch(url, {method: "HEAD"});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const jsonLength = response.headers.get("content-length");
        if (cashedFileSize === jsonLength) {
            const cashedFile = localStorage.getItem(filename);
            return JSON.parse(cashedFile);
        } else {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                jsonData = await response.json();

                localStorage.setItem(filename, JSON.stringify(jsonData));
                localStorage.setItem(`${filename}Size`, jsonLength.toString());

                return jsonData;
            } catch (error) {
                console.error(error.message);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function fillSelectOptions() {
    let selectElement;

    jsonExercises.forEach((row) => {
        selectElement = row.type === "source" ? document.getElementById("sources") : document.getElementById("tasks");
        addOptionToSelect(selectElement, row.key, row.name);
    });

    updateSolution();
}

async function addOptionToSelect(selectElement, optionValue, optionText) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.text = optionText;
    selectElement.appendChild(option);
}

async function updateSolution() {
    const taskKey = document.getElementById("tasks").value;
    jsonExercises.forEach((row) => {
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
            output.style = "display: none;";

            fillTheCodeElement(row.key);
            return;
        }
    });
}

async function updateOptions() {
    const sources = document.getElementById("sources").value;
    const tasks = document.getElementById("tasks");
    tasks.options.length = 0;
    jsonExercises.forEach((row) => {
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
    output.style = "display: inline;";
    const functionName = document.getElementById("tasks").value;
    output.textContent = functions.get(functionName)(input);
}

async function addMessage(username, className, text) {
    const messages = document.getElementById("chat-messages-container");

    const messageElement = document.createElement("div");
    messageElement.className = "chat-message ";
    messageElement.className += className;

    const usernameElement = document.createElement("div");
    usernameElement.textContent = username;
    usernameElement.className = "message-username";

    const textElement = document.createElement("div");
    textElement.className = "message-text";
    textElement.textContent = text;

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);

    messages.appendChild(messageElement);
}
