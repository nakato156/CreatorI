window.onload = init;

function init() {
    String.prototype.trunc =
        function (n:number) {
            return (this.trim().length > n ? this.trim().substr(0, n - 1) + '&hellip;' : this.trim());
        };
    let sectionVideos = document.getElementsByClassName("title_video");
    for (let i = 0; i < sectionVideos.length; i++) {
        sectionVideos[i].children[0].innerHTML = sectionVideos[i].children[0].textContent!.trunc(47);
    }
    const perfil = document.getElementById("main_perfil")!;
    perfil.addEventListener("click", function () {
        let elements = perfil.parentElement!.parentElement!.children;
        let menu = elements[1] as HTMLElement;
        menu.style.display =  menu.style.display == "none" ? "block" : "none"
        console.log(menu.style.display);
    });
}

function visit(url:string){
    window.location.href = `/video/${url}`
}