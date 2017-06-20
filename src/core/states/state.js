import Entity from "~/core/entities/entity.js";

import Broadcaster from "~/core/broadcaster.js";

import Preloader from "~/core/entities/preloader.js";

import ResourceManager from "~/core/utils/resourcemanager.js";

import SpriteComponent from "~/core/components/spritecomponent.js";

export default class State extends Entity
{
    constructor(application)
    {
        super(application) ;

        this.label = null ;
        this.paused = true ;

        this.resourceManager = new ResourceManager( this.application.configuration.basePath );
        this.resourceManager.subscribe(this);
        this.disposer.add(this.resourceManager);

        this.preloader = new Preloader(this.application,this.resourceManager);
        this.disposer.add(this.preloader);

        this.container = new SpriteComponent();
        this.addComponent(this.container);
        this.disposer.add(this.container);        
    }
    destroy()
    {
        super.destroy();

        this.container = null;
        this.resourceManager = null; 
        this.preloader = null;
    }

    onResourceManagerError(obj)
    {
        console.log("load error",obj);
    }
    onResourceManagerComplete()
    {
        console.log("load complete");

        this.unsummonPreloader();

        if( this.paused ) return ;
        else
        {
            this.buildView();
        
            // toggle any new components into enabled state
            this.disable();
            this.enable();                        
        }
    }

    summonPreloader()
    {
        this.preloader.reset();
        this.addChild(this.preloader);
    }
    unsummonPreloader()
    {
        this.removeChild(this.preloader);
    }

    update(delta)
    {
        if( this.paused ) return ;
        
        super.update(delta);        
    }

    activate()
    {
        this.application.mainLoop.add( this );

        console.log("activate state");

        if( ! this.resourceManager.isLoaded ) // present the preloader until it is...
        {
            this.summonPreloader();
            this.resourceManager.load();

            console.log("preloading state...");            
        }
        else this.buildView();        
    }
    deactivate()
    {
        console.log("deactivate state");

        this.application.mainLoop.remove( this );

        this.destroyView();
    }

    buildView()
    {
        console.log("buildView");            
        // override and put state specific stuff here
    }
    destroyView()
    {
        console.log("destroyView");            

        // override and put state specific stuff here

        this.removeAllChildren(true); 
    }

    enable()
    {
        console.log("enable state");

        if( ! this.paused ) return ;
        this.paused = false ;

        super.enable();
    }

    disable()
    {
        console.log("disable state");

        if( this.paused ) return ;
        this.paused = true ;

        super.disable();
    }    
    
}