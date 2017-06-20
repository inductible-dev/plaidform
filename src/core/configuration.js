export default class Configuration 
{  
  constructor() 
  {
    this.basePath = "";
    
    this.stage = {
        width: 1320, 
        height: 780,
        backgroundColor: 0x1099bb,
        safeZone: { width: 1024, height: 660 },        
        fixedUpdateFPS: 60,
        rootElementId: null, // null -> body
        stageContainerId: "stageContainer",
        stageId: "stage",
        rendererType: "AUTO", // "CANVAS", "WEBGL" or "AUTO"
        resizeInterval: 1000 * (0.05) // how long is the game container layout update interval (n seconds)
    };
  }  

  getRendererParams() 
  {
    return { 
        width: this.stage.width,
        height: this.stage.height,
        transparent: false,
        antialias: false,
        preserveDrawingBuffer: false,
        resolution: 1,
        forceCanvas: false,
        backgroundColor: this.stage.backgroundColor
    }
  }

  getLayoutParams() 
  {
    return { 
        width: this.stage.width,
        height: this.stage.height,
        safeZone: this.stage.safeZone        
    }
  }
  
}
