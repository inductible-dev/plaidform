import "node_modules/pixi.js/lib/index";

import ScaleManager from "~/core/scalemanager.js";
import Broadcaster from "~/core/broadcaster.js";
import StateManager from "~/core/statemanager.js";
import AppFocusManager from "~/core/appfocusmanager.js";

import LayoutHelper from "~/core/utils/layout.js";

export default class Application 
{  
  constructor( configuration ) 
  {
    this.configuration = configuration ;

    this.renderer = null ;
    this.stage = null ;
    this.ticker = null ;
    this.interactionManager = null;
    this.mainLoop = null ;
    this.stateManager = null ;
    this.appFocusManager = null ;
    this.layoutHelper = null ;

    this.initStage();
    this.initInteractionManager();
    this.initAppFocusManager();
    this.initStateManager();
    this.initMainLoop();    
  } 

  initStage()
  {
    if( this.renderer ) throw new Error( "Already initialised." ) ;

    var stageConfig = this.configuration.stage ;

    var rootElement = stageConfig.rootElementId ? document.getElementById(stageConfig.rootElementId) : document.body ;

    // init a root DOM container
    this.stageContainer = document.createElement('div') ;
    this.stageContainer.id = stageConfig.stageContainerId ;     
    rootElement.appendChild( this.stageContainer );        

    // init the pixi context
    let StageConstructor = PIXI.autoDetectRenderer;
    switch(stageConfig.rendererType)
    {
      case "CANVAS":
        StageConstructor = PIXI.CanvasRenderer ;
      break;
      case "WEBGL":
        StageConstructor = PIXI.WebGLRenderer ;
      break;
      case "AUTO":
      default:
        StageConstructor = PIXI.autoDetectRenderer ;
      break;
    }
    this.renderer = new StageConstructor( stageConfig.width, stageConfig.height, this.configuration.getRendererParams() );
    this.renderer.view.id = stageConfig.stageId ;
    this.stageContainer.appendChild(this.renderer.view);

    // init the root display object container
    this.stage = new PIXI.Container();
    
    // init the scalemanager
    this.scaleManager = new ScaleManager( this.configuration.stage );

    // init the layout helper
    this.layoutHelper = new LayoutHelper( this.configuration.getLayoutParams() );
    this.scaleManager.broadcaster.add(this.layoutHelper);
    this.scaleManager.updateSize(true);
  }

  initInteractionManager()
  {
    this.interactionManager = this.renderer.plugins.interaction;    
  }
  
  initAppFocusManager()
  {
    this.appFocusManager = new AppFocusManager();
    this.appFocusManager.add( this );
  }

  initStateManager()
  {
    this.stateManager = new StateManager(this.stage);    
  }

  initMainLoop()
  {
    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.stop();
    this.ticker.add(this.update,this);
    this.ticker.start();
    this.mainLoop = new Broadcaster("update");
  }

  pause()
  {
    this.ticker.stop();
    this.stateManager.disable();
  }
  resume()
  {
    this.ticker.start();
    this.stateManager.enable();
  }

  update(delta) 
  {
    this.mainLoop.dispatch(delta);
    this.renderer.render(this.stage);    
  }

  onAppFocusChanged(focus)
  {
    if( ! focus ) this.pause();
    else this.resume();    
  }
}
