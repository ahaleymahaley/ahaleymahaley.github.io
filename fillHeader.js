document.getElementById("header").innerHTML = `
    <nav>
        <a class="nav-link" href="./index.html" target="_top">Home</a>
        <a class="nav-link" href="./about.html" target="_top">About</a>
        <div class="dropdown nav-link">
            <button id="dropbtn" type="button" onclick="toggleDropdown()" class="dropbtn nav-link">More</button>
            <div id="moreDropdown" class="dropdown-content">
                <a class="dropdown-link" href="./more.html#exercises">Exercises</a>
                <a class="dropdown-link" href="./more.html#chat">Chat with The Oracle</a>
                <a class="dropdown-link" href="./more.html#games">Games</a>
            </div>
        </div>
    </nav>`;

function toggleDropdown() {
    document.getElementById("moreDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};
