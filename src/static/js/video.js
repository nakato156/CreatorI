import { ShortCuts } from "./shortcut";
import { ProgessBarr } from "./class/bar";
import { Focus, Actions } from "./class/observer";
window.onload = init;
window.onpopstate = stateUrl;
var video, controls, protect, progressBar;
var player;
//controls video
class Player extends ProgessBarr {
    constructor(video_element, progress) {
        super(progress, video_element);
        this.adelantar_5 = () => this.VideoElement.currentTime += 5;
        this.retroceder_5 = () => this.VideoElement.currentTime -= 5;
        this.full_screen = (e) => {
            if (this.VideoElement.requestFullscreen) {
                this.VideoElement.requestFullscreen();
            }
        };
        this.set_volume = (e, val_vol = -1) => {
            let vol = e.target;
            let newVol = val_vol > -1 ? val_vol : parseInt(vol.value) / 100;
            this.vol = val_vol === 0 ? this.VideoElement.volume : newVol;
            this.is_muted = newVol === 0 ? true : false;
            this.VideoElement.volume = newVol;
            sessionStorage.setItem("volume", `${newVol}`);
        };
        this.reproducir = (e) => {
            let btn_playStop = document.getElementById("playStop");
            if (!this.paused && !this.VideoElement.ended) {
                this.paused = true;
                btn_playStop.setAttribute("class", "bx bx-play");
                this.VideoElement.pause();
            }
            else {
                this.paused = false;
                btn_playStop.setAttribute("class", "bx bx-pause");
                this.VideoElement.play();
            }
        };
        this.paused = true;
        this.vol = sessionStorage.getItem("volume") ? parseFloat(sessionStorage.getItem("volume")) : 1;
        this.VideoElement.volume = this.vol;
        this.is_muted = false;
        this.progress_video();
    }
    format_timer(num) {
        let time = typeof num === "string" ? parseFloat(num) : num;
        let d = new Date(time * 1000);
        let min = (d.getMinutes() < 9) ? "0" + d.getMinutes() : d.getMinutes();
        let sec = (d.getSeconds() < 9) ? "0" + d.getSeconds() : d.getSeconds();
        return `${min}:${sec}`;
    }
    progress_video() {
        this.VideoElement.addEventListener("timeupdate", () => {
            let currentTime = this.VideoElement.currentTime;
            let duration = this.VideoElement.duration;
            document.getElementById("timer").innerHTML = `${this.format_timer(currentTime)}/${(this.format_timer(duration))}`;
            this.progressBar.style.width = `${(currentTime + .25) / duration * 100}%`;
        });
    }
}
const config = {
    attributes: true,
    childList: true,
};
async function getRecomend(DivRecommed) {
    return await fetch("/recommend")
        .then(res => res.json())
        .then(data => {
        let temp = "";
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const video = data[key];
                temp += `<div class="recommend_video">
                <img src="../preview/${video.url}">
                <p>${video.titulo}</p>
                </div>`;
            }
        }
        DivRecommed.innerHTML = temp;
    });
}
function init() {
    let targetElement = document.getElementById("PanelVideos");
    let observerFocus = new Focus();
    video = document.getElementById("video");
    let rep = document.getElementById("player");
    controls = document.getElementsByClassName("controls")[0];
    progressBar = document.getElementById("progessbar");
    rep.style.height = `${video.clientHeight + 57}px`;
    player = new Player(video, progressBar);
    let shortcuts = new ShortCuts({
        'disable_in_input': true,
    });
    shortcuts.add("space", player.reproducir);
    shortcuts.add("right", player.adelantar_5);
    shortcuts.add("left", player.retroceder_5);
    shortcuts.add("f", player.full_screen);
    getRecomend(document.getElementById("recommend"));
    let MyObserver = new Actions(targetElement, config);
    MyObserver.startObserver();
    MyObserver.resetState();
    init_listeners();
}
function hover(element, func, out) {
    element.forEach((el) => {
        el = typeof el === "string" ? document.getElementById(el) : el;
        el.addEventListener("mouseover", func);
        if (out) {
            el.addEventListener("mouseout", out);
        }
    });
}
function init_listeners() {
    let volume = document.getElementById("volumen");
    let playStop = document.getElementById("playStop");
    let icon_volume = document.getElementById("icon_vol");
    protect = document.getElementById("protected");
    volume.addEventListener("change", player.set_volume);
    icon_volume.addEventListener("click", (e) => {
        let is_muted = player.is_muted ? player.vol : 0;
        player.set_volume(e, is_muted);
    });
    playStop.addEventListener("click", player.reproducir);
    protect.addEventListener("click", player.reproducir);
    hover([icon_volume, volume], () => volume.style.display = "inline-flex");
    hover([protect, controls, video], () => controls.classList.add("up_controls"), () => controls.classList.remove("up_controls"));
}
function stateUrl() {
    let MyEvent = new CustomEvent("ChangeURL");
    window.dispatchEvent(MyEvent);
}
