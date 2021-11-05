class ProgessBarr {
    constructor(div_progress_bar, video_element) {
        this.DivprogressBar = div_progress_bar;
        this.VideoElement = video_element;
        this.progressBar = this.DivprogressBar.children[0];
        this.listener_change_bar();
    }
    listener_change_bar() {
        this.DivprogressBar.addEventListener("mousedown", (e) => {
            this.set_width(e.pageX);
            //this.DivprogressBar.onmousemove = (e)=>this.set_width(e.pageX)
        });
    }
    set_width(clickX) {
        let percent = Math.max(0, Math.min(1, (clickX - this.findPosX(this.DivprogressBar)) / this.DivprogressBar.offsetWidth));
        let width = percent * (this.DivprogressBar.offsetWidth);
        this.progressBar.style.width = `${width}px`;
        let duration = this.VideoElement.duration;
        let percent_width = (width * 100) / this.DivprogressBar.clientWidth;
        this.VideoElement.currentTime = (percent_width * duration) / 100;
    }
    findPosX(progressHolder) {
        var curleft = progressHolder.offsetLeft;
        while (progressHolder = progressHolder.offsetParent) {
            curleft += progressHolder.offsetLeft;
        }
        return curleft;
    }
}
export { ProgessBarr };
