import Entity from "~/core/entities/entity.js";
import SpriteComponent from "~/core/components/spritecomponent.js";

export default class Wabbit extends Entity
{  
    constructor(texture) 
    {
        super();

        this.spriteComponent = new SpriteComponent(texture);
        this.spriteComponent.sprite.anchor.set(0.5);        
        this.addComponent(this.spriteComponent);
    }  

    update(delta)
    {
        this.spriteComponent.sprite.rotation += ((2*Math.PI)/360) * delta ;
    }

    set x(val)
    {
        this.spriteComponent.sprite.x = val;
    }
    set y(val)
    {
        this.spriteComponent.sprite.y = val;
    }
    get x()
    {
        return this.spriteComponent.sprite.x;
    }
    get y()
    {
        return this.spriteComponent.sprite.y;
    }

}