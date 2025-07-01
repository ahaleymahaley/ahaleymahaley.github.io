fillTheCodeElement();

async function fillTheCodeElement() {
    const url = "https://ahaleymahaley.github.io/more/invertCase.js";
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
    document.getElementById("output").textContent = invertCase(document.getElementById("input").value);
}
