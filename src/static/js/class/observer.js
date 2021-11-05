class Focus {
    constructor() {
        this.totalTime = 0;
        this.horaEscondida = 0;
        this.focus = Date.now();
        this.winHidden = "";
        this.visibilityChange = "";
        this.searchEvent();
    }
    searchEvent() {
        if (typeof document.hidden !== "undefined") { // Opera 12.10 y Firefox 18 
            this.winHidden = "hidden";
            this.visibilityChange = "visibilitychange";
        }
        else if (typeof document.msHidden !== "undefined") {
            this.winHidden = "msHidden";
            this.visibilityChange = "msvisibilitychange";
        }
        else if (typeof document.webkitHidden !== "undefined") {
            this.winHidden = "webkitHidden";
            this.visibilityChange = "webkitvisibilitychange";
        }
        return [this.winHidden, this.visibilityChange];
    }
    timeFocus() {
        if (document[this.winHidden]) {
            this.horaEscondida = Date.now();
            this.totalTime += Math.floor((this.horaEscondida - this.focus) / 1000);
        }
        else {
            this.focus = Date.now();
        }
    }
    start() {
        document.addEventListener(this.visibilityChange, () => this.timeFocus(), false);
    }
}
class Actions {
    constructor(targetElement, options) {
        this.targetElement = targetElement;
        this.obsOptions = options;
        this.AllActions = [{
                "Url": window.location.href,
                "TextHtml": this.targetElement.outerHTML,
            }];
        this.startObserver();
        window.addEventListener("DOMChange", (dom) => {
            const url = window.location.href;
            for (const i in this.AllActions) {
                if (!Object.values(this.AllActions[i]).includes(url)) {
                    this.AllActions.push({
                        "Url": url,
                        "TextHtml": dom.detail
                    });
                }
            }
        });
    }
    startObserver() {
        let Observer = new MutationObserver(function (mutationsList, observer) {
            let element = "";
            for (const mutation of mutationsList) {
                let target = mutation.target;
                element = target.outerHTML;
            }
            let DomEvent = new CustomEvent("DOMChange", { detail: element });
            window.dispatchEvent(DomEvent);
        });
        Observer.observe(this.targetElement, this.obsOptions);
    }
    resetState() {
        window.addEventListener("ChangeURL", () => {
            for (const obj of this.AllActions) {
                if (obj.Url === window.location.href) {
                    this.targetElement.innerHTML = obj.TextHtml;
                    break;
                }
            }
        });
    }
}
export { Focus, Actions };
