class Volume{
    VideoElement:HTMLVideoElement;
    VolumeControl: HTMLElement;
    vol:number;
    is_muted:boolean

    constructor(Video:HTMLVideoElement, ConrolVolume:HTMLElement){
        this.VideoElement = Video;
        this.VolumeControl = ConrolVolume;
        this.vol = this.VideoElement.volume
        this.is_muted = this.vol ===0 ? true : false
    }

    set_volume = (e:Event, val_vol:number=-1)=>{
        let element = e.target as HTMLInputElement;
        let newVol = val_vol>-1? val_vol:parseInt(element.value)/100

        this.vol= val_vol===0 ? this.VideoElement.volume: newVol

        this.VideoElement.volume = newVol;
    }

    mute = ()=>{
        this.VideoElement.volume = this.VideoElement.volume===0 ? this.vol: 0;
    }
}