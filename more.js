fillTheTable();

async function fillTheTable() {
    const url = "https://ahaleymahaley.github.io/more.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const tableData = await response.json();
        const tbody = document.querySelector("#dataTable tbody");

        tableData.forEach((row) => {
            const tr = document.createElement("tr");
            switch (row.type) {
                case "source":
                    tr.innerHTML = `<th colspan="2"><a href="${row.sourceUrl}" target="_blank">${row.sourceName}</a></th>`;
                    break;

                case "task":
                    tr.innerHTML = 
                    `<td><a href="${row.taskUrl}" target="_blank">${row.taskName}</a></td>
                    <td><a href="${row.solutionUrl}" target="_blank">${row.solutionName}</a></td>`;
                    break;
            }
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error.message);
    }
}
