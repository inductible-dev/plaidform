import "node_modules/pixi.js/lib/index";

import Broadcaster from "~/core/broadcaster.js";

import SpriteComponent from "~/core/components/spritecomponent.js";

export default class SpriteButtonComponent extends SpriteComponent
{  
    constructor( handle, texUp, texDown, texOver ) 
    {
        super(texUp);  

        this.handle = handle ;

        this.texUp = texUp;      
        this.texDown = texDown;      
        this.texOver = texOver;           
        
        this.broadcaster = new Broadcaster( handle );

        this.pointerIsDown = false;
        this.pointerIsOver = false;

        this.enable();        
    }    
    destroy()
    {        
        this.broadcaster.destroy();
        this.broadcaster = null ;

        this.texUp = null;      
        this.texDown = null;      
        this.texOver = null;

        super.destroy();
    }

    addDelegate(delegate)
    {
        this.removeDelegate(delegate);
        this.broadcaster.add(delegate);
    }
    removeDelegate(delegate)
    {
        this.broadcaster.remove(delegate);
    }

    addListeners()
    {
        var spr = this.sprite ;        
        spr.on('pointerdown', this.onPointerDown, this);
        spr.on('pointerup', this.onPointerUp, this);
        spr.on('pointerupoutside', this.onPointerUpOutside, this);
        spr.on('pointerover', this.onPointerOver, this);
        spr.on('pointerout', this.onPointerOut, this);
    }
    removeListeners()
    {
        var spr = this.sprite ;
        spr.off('pointerdown', this.onPointerDown, this);
        spr.off('pointerup', this.onPointerUp, this);
        spr.off('pointerupoutside', this.onPointerUpOutside, this);
        spr.off('pointerover', this.onPointerOver, this);
        spr.off('pointerout', this.onPointerOut, this);
    }

    enable()
    {
        this.sprite.interactive = true ;
    }
    disable()
    {
        this.sprite.interactive = false ;

        this.pointerIsOver = false ;
        this.pointerIsDown = false ;
        this.updateTexture();
    }

    updateTexture()
    {
        if( this.pointerIsDown ) this.sprite.texture = this.texDown;
        else if( this.pointerIsOver ) this.sprite.texture = this.texOver;
        else this.sprite.texture = this.texUp;        
    }

    onAdded(entity)
    {
        super.onAdded(entity);
        this.addListeners();
    }
    onRemoved(entity)
    {
        super.onRemoved(entity);
        this.removeListeners();
    }

    onPointerDown(event)
    {
        this.pointerIsDown = true ;
        this.updateTexture();
        this.broadcaster.dispatch("down");
    }
    onPointerUp(event)
    {
        this.pointerIsDown = false;
        this.updateTexture();
        this.broadcaster.dispatch("up");
    }
    onPointerOver(event)
    {
        this.pointerIsOver = true;
        this.updateTexture();
        this.broadcaster.dispatch("over");
    }
    onPointerOut(event)
    {
        this.pointerIsOver = false ;
        this.updateTexture();
        this.broadcaster.dispatch("out");
    }
    onPointerUpOutside(event)
    {
        this.pointerIsDown = this.pointerIsOver = false;
        this.updateTexture();
        this.broadcaster.dispatch("upoutside");        
    }
    
        
}