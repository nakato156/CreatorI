const search = document.getElementById("Formsearch");
const query = document.getElementById("querySearch");
search.addEventListener("submit", async (e) => {
    e.preventDefault();
    const req = await fetch(`/results/search?query=${query.value.trim()}&method=in`);
    let res = await req.json();
    let data = await res;
    history.pushState(null, "", `/results/search?query=${query.value.trim().split(" ").join("+")}`);
    let temp = "";
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const element = data[key];
            temp += `
            <div class="result-search">
                <img src="../preview/${element[3]}">
                <div>
                    <p>${element[2]}</p>
                    <img src="../perfil/${element[1]}">
                    <p>${element[0]}</p>
                </div>
            </div>
            `;
        }
    }
    let section = document.getElementById("PanelVideos");
    section.classList.add("PanelResults");
    section.innerHTML = temp;
});
