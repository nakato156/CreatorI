const search = document.getElementById("Formsearch") as HTMLFormElement;
const query = document.getElementById("querySearch") as HTMLInputElement;

search.addEventListener("submit", async (e:Event)=>{
    e.preventDefault();
    const req:Response = await fetch(`/results/search?query=${query.value.trim()}&method=in`)
    let res:object = await req.json();
    let data:object|any = await res;
    history.pushState(null, "", `/results/search?query=${query.value.trim().split(" ").join("+")}`);
    let temp = ""
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const element = data[key];
            temp+=`
            <div class="result-search">
                <img src="../preview/${element[3]}">
                <div>
                    <p>${element[2]}</p>
                    <img src="../perfil/${element[1]}">
                    <p>${element[0]}</p>
                </div>
            </div>
            `
        }
    }

    let section = document.getElementById("PanelVideos") as HTMLElement;
    section.classList.add("PanelResults")
    section.innerHTML = temp;
})