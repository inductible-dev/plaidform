import "node_modules/pixi.js/lib/index";

import SpriteComponent from "~/core/components/spritecomponent.js";

export default class AnimatedSpriteComponent extends SpriteComponent
{  
    constructor( textureArray ) 
    {
        super();
        this._sprite = new PIXI.extras.AnimatedSprite(textureArray);
    }  

    onAdded(entity)
    {
        //
    }
    onRemoved(entity)
    {
        //
    }

    get animatedSprite()
    {
        return this._sprite;
    }
        
}