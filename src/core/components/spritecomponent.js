import "node_modules/pixi.js/lib/index";

import Component from "~/core/components/component.js";

export default class SpriteComponent extends Component
{  
    constructor(...args) 
    {
        super();
        this._sprite = new PIXI.Sprite(...args);
    }    
    destroy()
    {
        this._sprite.destroy();
        this._sprite = null;

        super.destroy();
    }

    onAdded(entity)
    {
        //
    }
    onRemoved(entity)
    {
        //
    }

    get sprite()
    {
        return this._sprite;
    }
        
}