const tableData = [
    {type: "source", sourceName: "Hexlet", sourceUrl: "https://ru.hexlet.io/challenges"},
    {
        type: "task",
        taskName: "invert case",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_invert_case_exercise",
        solutionName: "invertCase.js",
        solutionUrl: "more/invertCase.html",
    },
    {
        type: "task",
        taskName: "FizzBuzz",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_fizzbuzz_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Perfect number",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_perfect_numbers_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Happy Ticket",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_happy_ticket_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Happy Number",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_happy_numbers_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Reverse integer",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_reverse_integer_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Reexport",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_reexport_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
    {
        type: "task",
        taskName: "Fibonacci sequence",
        taskUrl: "https://ru.hexlet.io/challenges/js_basics_fib_exercise",
        solutionName: "TODO",
        solutionUrl: "",
    },
];

const tbody = document.querySelector("#dataTable tbody");

tableData.forEach((row) => {
    const tr = document.createElement("tr");
    switch (row.type) {
        case "source":
            tr.innerHTML = `
        <th colspan="2"><a href="${row.sourceUrl}" target="_blank">${row.sourceName}</a></th>`;
            break;

        case "task":
            tr.innerHTML = `
        <td><a href="${row.taskUrl}" target="_blank">${row.taskName}</a></td>
        <td><a href="${row.solutionUrl}" target="_blank">${row.solutionName}</a></td>`;
            break;
    }
    tbody.appendChild(tr);
});
