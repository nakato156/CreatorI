class Volume {
    constructor(Video, ConrolVolume) {
        this.set_volume = (e, val_vol = -1) => {
            let element = e.target;
            let newVol = val_vol > -1 ? val_vol : parseInt(element.value) / 100;
            this.vol = val_vol === 0 ? this.VideoElement.volume : newVol;
            this.VideoElement.volume = newVol;
        };
        this.mute = () => {
            this.VideoElement.volume = this.VideoElement.volume === 0 ? this.vol : 0;
        };
        this.VideoElement = Video;
        this.VolumeControl = ConrolVolume;
        this.vol = this.VideoElement.volume;
        this.is_muted = this.vol === 0 ? true : false;
    }
}
