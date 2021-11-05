class Focus{
    totalTime:number;
    winHidden:string;
    visibilityChange:string
    horaEscondida: number
    focus: number
    constructor(){
        this.totalTime = 0;
        this.horaEscondida = 0;
        this.focus = Date.now()
        this.winHidden = "";
        this.visibilityChange = ""
        this.searchEvent();
    }

    searchEvent():Array<string>{
        if (typeof document.hidden !== "undefined") { // Opera 12.10 y Firefox 18 
            this.winHidden = "hidden";
            this.visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            this.winHidden = "msHidden";
            this.visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            this.winHidden = "webkitHidden";
            this.visibilityChange = "webkitvisibilitychange";
        }
        return [this.winHidden, this.visibilityChange]
    }
    
    timeFocus():void {
        if (document[this.winHidden]) {
            this.horaEscondida = Date.now();
            this.totalTime+= Math.floor((this.horaEscondida-this.focus) / 1000)
        } else {
            this.focus = Date.now();
        }
    }

    start():void{
        document.addEventListener(this.visibilityChange, ()=>this.timeFocus(), false);
    }
}

interface opionsObs{
    attributes?: boolean,
    childList?: boolean,
    subtree?: boolean 
}
interface AllActions{
    "Url":string,
    "TextHtml": string,
    "MaxTime"?:number
}

class Actions{
    targetElement:HTMLElement;
    obsOptions: opionsObs;
    AllActions:Array<AllActions>;
    constructor(targetElement:HTMLElement, options:opionsObs){
        this.targetElement = targetElement;
        this.obsOptions = options;
        this.AllActions = [{
            "Url":window.location.href,
            "TextHtml": this.targetElement.outerHTML,
        }]
        this.startObserver()

        window.addEventListener("DOMChange",(dom:CustomEventInit)=>{
            const url = window.location.href;
            for(const i in this.AllActions){
                if(!Object.values(this.AllActions[i]).includes(url)){
                    this.AllActions.push({
                        "Url": url,
                        "TextHtml":dom.detail
                    })
                }
            }
        })
    }

    startObserver():void{
        let Observer = new MutationObserver(function <t>(mutationsList:t, observer:any):void {
            let element: string = "";
            for (const mutation of mutationsList) {
                let target = mutation.target as HTMLElement
                element = target.outerHTML;
            }
            let DomEvent = new CustomEvent("DOMChange",{detail:element})
            window.dispatchEvent(DomEvent)
        });        
        Observer.observe(this.targetElement, this.obsOptions)
    }

    resetState(){
        window.addEventListener("ChangeURL", ()=>{
            for(const obj of this.AllActions){
                if(obj.Url === window.location.href){
                    this.targetElement.innerHTML = obj.TextHtml
                    break;
                }
            }
        })
    }
}

export { Focus,Actions }