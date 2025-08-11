let jsonExercises = getJson("more");
let jsonPredictions = getJson("prediction");
let functions = new Map();
let cellsToColor = new Set();
let Ocells = new Set();
let Xcells = new Set();
let currentGame = "tic-tac-toe";
let isGameStarted = false;
let cells;
let machineCells;
let userCells;
let enemyShipsCount;
let userShipsCount;
let enemyShips = new Array();
let userShips = new Array();
let alreadyChecked = new Map();
let shipToShootNext = new Array();
const winningSets = [
    ["00", "01", "02"],
    ["10", "11", "12"],
    ["20", "21", "22"],
    ["00", "10", "20"],
    ["01", "11", "21"],
    ["02", "12", "22"],
    ["00", "11", "22"],
    ["02", "11", "20"],
];
const dotSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
    data-guides="{&quot;vertical&quot;:[],&quot;horizontal&quot;:[]}"><defs />
    <ellipse fill="#000000" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" title="Ellipse 1" cx="50" cy="50" rx="10" ry="10" /></svg>`;
const oSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
    data-guides="{&quot;vertical&quot;:[],&quot;horizontal&quot;:[]}"><defs />
    <ellipse fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" title="Ellipse 1" cx="50" cy="50" rx="45" ry="45" /></svg>`;
const xSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
    data-guides="{&quot;vertical&quot;:[],&quot;horizontal&quot;:[]}"><defs />
    <line fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" title="Line 1" x1="10" y1="10" x2="90" y2="90" />
    <line fill="transparent" fill-opacity="1" stroke="#000000" stroke-opacity="1"
    stroke-width="5" title="Line 2" x1="90" y1="10" x2="10" y2="90" /></svg>`;
const gameLog = document.getElementById("gameLog");
const tictactoeBeginLog = `Click any cell to start and place 'o' or <button type="button" onclick="machineTurn()">let the machine play first</button>`;
const battleshipBeginLog = `Click any cell on the enemy's board to start or <button type="button" onclick="machineBattleshipTurn()">let the machine play first</button>`;
const userTurnLog = "Your turn";
const machineTurnLog = "Machine's turn";
const winLogMessage = "You win :)";
const loseLogMessage = "You lose :(";
const drawLogMessage = "A draw!";
const shipsCount = 20;

getStarted();

function getRandom(n) {
    return Math.floor(Math.random() * n);
}

async function getStarted() {
    window.addEventListener("DOMContentLoaded", switchTabByHash);
    window.addEventListener("hashchange", switchTabByHash);
    await drawGameField("battleship");
    await drawGameField("tic-tac-toe");
    cells = document.querySelectorAll("#tic-tac-toe .cell");
    machineCells = document.querySelectorAll(".machine-board .cell");
    userCells = document.querySelectorAll(".user-board .cell");
    jsonExercises = await getJson("more");
    jsonPredictions = await getJson("prediction");
    fillSelectOptions();
    resetGameField();
}
function fillBattleshipMap() {
    enemyShips = new Array();
    userShips = new Array();
    for (let i = 0; i < 10; i++) {
        let row = new Array();
        for (let j = 0; j < 10; j++) {
            row.push(0);
        }
        enemyShips.push(row);
        userShips.push(row.slice());
    }
    randomShipsOnField(enemyShips);
    randomShipsOnField(userShips);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (userShips[i][j] === 1) {
                const cell = document.getElementById("cell" + 0 + i + j);
                cell.style = `height: 3vh; background-color: var(--alt-bg-color);outline: 2px solid var(--text-color);`;
            }
        }
    }
}

function getShip(destArr, x, y) {
    if (x > 9 || y > 9 || x < 0 || y < 0) {
        return -1;
    } else {
        return destArr[x][y];
    }
}

function randomShips(destArr, destLength, destCount) {
    while (destCount > 0) {
        const x = getRandom(10);
        const y = getRandom(10);
        const orientation = getRandom(2);
        let isPlaceble = true;
        for (let l = 0; l < destLength; l++) {
            if (getShip(destArr, x + l * orientation, y + l * (1 - orientation)) !== 0) {
                isPlaceble = false;
                break;
            } else {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (getShip(destArr, x + l * orientation + i, y + l * (1 - orientation) + j) === 1) {
                            isPlaceble = false;
                            break;
                        }
                    }
                }
            }
        }
        if (isPlaceble) {
            for (let l = 0; l < destLength; l++) {
                destArr[x + l * orientation][y + l * (1 - orientation)] = 1;
            }
            destCount--;
        }
    }
}

function randomShipsOnField(destArr) {
    for (let i = 1; i < 5; i++) {
        randomShips(destArr, i, 5 - i);
    }
}

function isShipIsDrawn(destArr, x, y) {
    alreadyChecked.set("" + x + y, true);
    let isDrawn = true;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const xi = x + i;
            const yj = y + j;
            if (getShip(destArr, xi, yj) === 1) {
                isDrawn = false;
            }
            if (getShip(destArr, xi, yj) === 3 && !alreadyChecked.has("" + xi + yj)) {
                isDrawn = isDrawn && isShipIsDrawn(destArr, xi, yj);
            }
        }
    }
    return isDrawn;
}

function colorSurroundings(destArr, n, x, y) {
    destArr[x][y] = 4;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            const xi = x + i;
            const yj = y + j;
            const symbol = getShip(destArr, xi, yj);
            if (symbol === 0) {
                const cellToColor = document.getElementById("cell" + n + xi + yj);
                cellToColor.innerHTML = symbol === 0 ? xSymbol : dotSymbol;
                destArr[xi][yj] = 2;
            }
            if (symbol === 3) {
                colorSurroundings(destArr, n, xi, yj);
            }
        }
    }
}

function onBattleshipCellClick(event) {
    const cell = event.target;
    if (cell.id.slice(0, 4) === "cell") {
        const i = parseInt(cell.id.slice(5, 6));
        const j = parseInt(cell.id.slice(6, 7));

        const symbol = enemyShips[i][j];

        isGameStarted = true;

        const cellToColor = document.getElementById("cell" + 1 + i + j);
        if (symbol === 1) {
            cellToColor.innerHTML = dotSymbol;
            cell.style = `height: 3vh; background-color: var(--hover-text-color);outline: 2px solid var(--text-color);`;
            enemyShips[i][j] = 3;
            enemyShipsCount--;
            alreadyChecked.clear();
            if (isShipIsDrawn(enemyShips, i, j)) {
                colorSurroundings(enemyShips, 1, i, j);
            }
        } else {
            cellToColor.innerHTML = xSymbol;
            enemyShips[i][j] = 2;
        }
        if (isBattleshipWin()) {
            return;
        }
        if (symbol === 0) {
            machineBattleshipTurn();
        }
    }
}

async function machineBattleshipTurn() {
    machineCells.forEach((cell) => {
        cell.removeEventListener("click", onBattleshipCellClick);
    });

    await fillMachineTurnLog();

    let i;
    let j;
    if (shipToShootNext.length === 0) {
        let uncoloredCellFounded = false;
        while (!uncoloredCellFounded) {
            i = getRandom(10);
            j = getRandom(10);
            if (userShips[i][j] === 0 || userShips[i][j] === 1) {
                uncoloredCellFounded = true;
            }
        }
    } else {
        const coor = shipToShootNext.pop();
        i = coor[0];
        j = coor[1];
    }
    const symbol = userShips[i][j];
    const cell = document.getElementById("cell" + 0 + i + j);
    if (symbol === 1) {
        cell.innerHTML = dotSymbol;
        cell.style = `height: 3vh; background-color: var(--hover-text-color);outline: 2px solid var(--text-color);`;
        userShips[i][j] = 3;
        userShipsCount--;
        alreadyChecked.clear();
        if (isShipIsDrawn(userShips, i, j)) {
            colorSurroundings(userShips, 0, i, j);
            shipToShootNext.length = 0;
        } else {
            let iToShootNext = -1;
            let jToShootNext = -1;
            for (let z = 0; z < 2; z++) {
                for (let w = -1; w < 2; w += 2) {
                    iToShootNext = i + w * z;
                    jToShootNext = j + w * (1 - z);
                    const symbolToShoot = getShip(userShips, iToShootNext, jToShootNext);
                    if (symbolToShoot === 1) {
                        shipToShootNext.push([iToShootNext, jToShootNext]);
                    }
                }
            }
        }
    } else {
        userShips[i][j] = 2;
        cell.innerHTML = xSymbol;
    }
    if (isBattleshipWin()) {
        return;
    }
    if (symbol === 1) {
        machineBattleshipTurn();
        return;
    }
    machineCells.forEach((cell) => {
        cell.addEventListener("click", onBattleshipCellClick);
    });
    gameLog.innerHTML = userTurnLog;
}

function isBattleshipWin() {
    if (userShipsCount === 0 || enemyShipsCount === 0) {
        gameLog.innerHTML = enemyShipsCount === 0 ? winLogMessage : loseLogMessage;
        machineCells.forEach((cell) => {
            cell.removeEventListener("click", onBattleshipCellClick);
        });
        return true;
    } else {
        return false;
    }
}

function switchTabByHash() {
    const hash = window.location.hash.substring(1);

    if (hash) {
        const targetTab = document.getElementById(`tab-${hash}`);
        if (targetTab) {
            targetTab.checked = true;
        }
    }
}

async function drawGameField(game) {
    const gameBoard = document.getElementById(game);
    const fieldNumber = game === "tic-tac-toe" ? 1 : 2;
    const fieldSize = game === "tic-tac-toe" ? 3 : 10;
    const cellSize = game === "tic-tac-toe" ? "10vh" : "3vh";
    const pref = game === "tic-tac-toe" ? false : true;
    for (let n = 0; n < fieldNumber; n++) {
        const board = document.createElement("div");
        board.className = "board";
        if (pref) {
            board.className += n === 0 ? " user-board" : " machine-board";
            const boardName = document.createElement("div");
            boardName.className = "board-name";
            boardName.innerHTML = n === 0 ? "Your board" : "Enemy board";
            gameBoard.appendChild(boardName);
        }
        for (let i = 0; i < fieldSize; i++) {
            const row = document.createElement("div");
            row.className = "row";
            row.style.setProperty("height", cellSize);
            for (let j = 0; j < fieldSize; j++) {
                const cell = document.createElement("span");
                cell.className = "cell";
                cell.id = "cell" + (pref ? n : "") + i + j;
                cell.style.setProperty("height", cellSize);
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
        gameBoard.appendChild(board);
    }
}

function changeGame() {
    if (isGameStarted) {
        let confirmation = confirm("Game progress will be lost. Continue?");
        if (!confirmation) {
            document.getElementById("gamesSelect").value = currentGame;
            return;
        }
    }
    currentGame = document.getElementById("gamesSelect").value;
    const gameBoards = document.getElementsByClassName("game-field");
    Array.from(gameBoards).forEach((element) => {
        element.style = element.id === currentGame ? "display: block;" : "display: none;";
    });
    resetGameField();
}

function resetGameField() {
    isGameStarted = false;
    Ocells.clear();
    Xcells.clear();
    enemyShipsCount = shipsCount;
    userShipsCount = shipsCount;

    const selectedGame = document.getElementById("gamesSelect").value;
    document.getElementById("gameLog").innerHTML =
        selectedGame === "tic-tac-toe" ? tictactoeBeginLog : battleshipBeginLog;
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.style = "";
        cell.addEventListener("click", onCellClick);
    });
    machineCells.forEach((cell) => {
        cell.innerHTML = "";
        cell.addEventListener("click", onBattleshipCellClick);
        cell.style = "height: 3vh;";
    });
    userCells.forEach((cell) => {
        cell.innerHTML = "";
        cell.style = "height: 3vh;";
    });

    fillBattleshipMap();
    fillTheSet();
}

function onCellClick(event) {
    const cell = event.target;
    cellId = cell.id.slice(4);
    if (cellsToColor.has(cellId)) {
        isGameStarted = true;
        colorCell(cellId, "o");

        if (isWin()) {
            return;
        }

        machineTurn();
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fillMachineTurnLog() {
    gameLog.innerHTML = machineTurnLog;
    for (let i = 0; i < 3; i++) {
        await sleep(150);
        gameLog.innerHTML += ".";
    }
    await sleep(100);
}

async function machineTurn() {
    cells.forEach((cell) => {
        cell.removeEventListener("click", onCellClick);
    });

    await fillMachineTurnLog();

    const randomUncoloredCell = getRandom(cellsToColor.size);
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
    const predictionId = getRandom(7).toString();

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
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
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
