import Broadcaster from "~/core/broadcaster.js";

export default class ScaleManager
{
    constructor( configuration )
    {
        this.updateInterval = -1; 

        this.configuration = configuration ;
        
        this.broadcaster = new Broadcaster("scaleChanged");

        this.start();
    }

    updateSize( forced )
    {
        forced = typeof forced == 'undefined' ? false : forced ;

        let container = document.getElementById(this.configuration.stageContainerId);
        let stage = document.getElementById(this.configuration.stageId);

        let safeZone = this.configuration.safeZone;
        let safeRatioV = safeZone.width/safeZone.height;
        let ratioV = container.offsetWidth/container.offsetHeight;

        let scaleF = 1;
        if( ratioV > safeRatioV ) scaleF = container.offsetHeight/safeZone.height;
        else scaleF = container.offsetWidth/safeZone.width;

        let tW = Math.round(this.configuration.width * scaleF) + 'px';
        let tH = Math.round(this.configuration.height * scaleF) + 'px';

        if( stage.style.width != tW || stage.style.height != tH || forced )
        {
            stage.style.width = tW ;
            stage.style.height = tH ;

            stage.style.marginLeft = (container.offsetWidth/2)-(stage.offsetWidth/2) + 'px';
            stage.style.marginTop = (container.offsetHeight/2)-(stage.offsetHeight/2) + 'px';

            this.broadcaster.dispatch( container.offsetWidth, container.offsetHeight, scaleF );
        }
    }

    start()
    {
        this.updateInterval = setInterval( ()=>{ this.updateSize() }, this.configuration.resizeInterval ) ;
        this.updateSize();
    }

    stop()
    {
        clearInterval( this.updateInterval ) ;        
    }

}