import Broadcaster from "~/core/broadcaster.js";

import SpriteComponent from "~/core/components/spritecomponent.js";

class DynamicLayoutSubscriber
{
    constructor( entity, instruction, paddingX = 0, paddingY = 0 )
    {
        this.entity = entity;
        this.instruction = instruction;
        this.paddingX = paddingX;
        this.paddingY = paddingY;
    }
    destroy()
    {
        this.entity = null;        
    }
}

export default class LayoutHelper {

    constructor( layoutParams )
    {
        this.subscribersToDynamicLayout = [] ;

        this.dynamicLayoutChanged = new Broadcaster("dynamicLayoutChanged");

        this.stageRect = { x:0, y: 0, width: 0, height: 0 };
        this.safeRect = { x:0, y: 0, width: 0, height: 0 };
        this.containerRect = { x:0, y: 0, width: 0, height: 0 };
        this.dynRect = { x:0, y: 0, width: 0, height: 0 };
                
        // pass in a layout rect equivalent to the safe zone within global stage coords
        let tx = (layoutParams.width/2) - (layoutParams.safeZone.width/2) ;
        let ty = (layoutParams.height/2) - (layoutParams.safeZone.height/2) ;
        let twidth = layoutParams.safeZone.width ;
        let theight = layoutParams.safeZone.height ;
        this.updateSafeRect( tx, ty, twidth, theight );

        tx = 0 ;
        ty = 0 ;
        twidth = layoutParams.width ;
        theight = layoutParams.height ;
        this.updateStageRect( tx, ty, twidth, theight );
    }

    scaleChanged( cW, cH, scaleF )
    {
        let isf = (1/scaleF);
        this.updateContainerRect( 0, 0, cW*isf, cH*isf );
        this.updateDynRect();
    }

    updateSafeRect(x,y,width,height)
    {
        this.safeRect.x = x;
        this.safeRect.y = y;
        this.safeRect.width = width;
        this.safeRect.height = height;        
    }

    updateStageRect(x,y,width,height)
    {
        this.stageRect.x = x;
        this.stageRect.y = y;
        this.stageRect.width = width;
        this.stageRect.height = height;        
    }
    
    updateContainerRect(x,y,width,height)
    {
        this.containerRect.x = x;
        this.containerRect.y = y;
        this.containerRect.width = width;
        this.containerRect.height = height;
    }

    updateDynRect()
    {
        // safe/stage pillar dimensions
        let pw = (this.stageRect.width-this.safeRect.width) * 0.5;
        let ph = (this.stageRect.height-this.safeRect.height) * 0.5;        

        this.dynRect.x = this.stageRect.x;
        this.dynRect.y = this.stageRect.y;        

        let dh = Math.min(this.containerRect.height - this.stageRect.height,0) ;
        let th = Math.abs(dh/2);
        th = Math.min( th, ph );       

        let dw = Math.min(this.containerRect.width - this.stageRect.width,0) ;
        let tw = Math.abs(dw/2);
        tw = Math.min( tw, pw );             

        this.dynRect.x += tw ;              
        this.dynRect.y += th ; 

        this.dynRect.width = Math.min(this.stageRect.width,this.containerRect.width);
        this.dynRect.height = Math.min(this.stageRect.height,this.containerRect.height);

        this.dynamicLayoutChanged.dispatch();
        this.updateSubscribers();
    }

    placeRelativeToRect( sprite, instruction, paddingX, paddingY, rect )
    {
        if( typeof paddingX == "undefined" ) paddingX = 0;
        if( typeof paddingY == "undefined" ) paddingY = paddingX ;

        switch( instruction )
        {
            case "TOP":
                sprite.setTransform( sprite.x + paddingX, rect.y + paddingY );
            break;
            case "RIGHT":
                sprite.setTransform( (rect.x+rect.width) - paddingX, sprite.y + paddingY );
            break;
            case "BOTTOM":
                sprite.setTransform( sprite.x + paddingX, rect.y+rect.height + paddingY );
            break;
            case "LEFT":
                sprite.setTransform( rect.x + paddingX, sprite.y + paddingY );
            break;         

            case "LEFT_TOP":
            case "TOP_LEFT":
                sprite.setTransform( rect.x + paddingX, rect.y + paddingY );                
            break;
            case "RIGHT_TOP":
            case "TOP_RIGHT":
                sprite.setTransform( (rect.x+rect.width) - paddingX, rect.y + paddingY );
            break;
            case "LEFT_BOTTOM":
            case "BOTTOM_LEFT":
                sprite.setTransform( rect.x + paddingX, (rect.y+rect.height) - paddingY );
            break;
            case "RIGHT_BOTTOM":
            case "BOTTOM_RIGHT":
                sprite.setTransform( (rect.x+rect.width) - paddingX, (rect.y+rect.height) - paddingY );
            break;    

            case "LEFT_CENTER":
            case "CENTER_LEFT":
                sprite.setTransform( rect.x + paddingX, this.safeCenterY + paddingY );
            break;

            case "RIGHT_CENTER":
            case "CENTER_RIGHT":
                sprite.setTransform( (rect.x+rect.width) - paddingX, this.safeCenterY + paddingY );
            break;
            
            case "TOP_CENTER":
            case "CENTER_TOP":
                sprite.setTransform( this.safeCenterX + paddingX, rect.y + paddingY );
            break;
            
            case "BOTTOM_CENTER":
            case "CENTER_BOTTOM":
                sprite.setTransform( this.safeCenterX + paddingX, (rect.y+rect.height) - paddingY );
            break;    

            case "CENTER":
                sprite.setTransform( this.safeCenterX + paddingX, this.safeCenterY + paddingY );
            break;            
        }        
    }

    get safeTop()
    {
        return this.safeRect.y ;
    }
    get safeBottom()
    {
        return this.safeRect.y + this.safeRect.height ;
    }
    get safeLeft()
    {
        return this.safeRect.x ;
    }
    get safeRight()
    {
        return this.safeRect.x + this.safeRect.width ;
    }

    get safeCenterX()
    {
        return this.safeRect.x + (this.safeRect.width*0.5) ;
    }
    get safeCenterY()
    {
        return this.safeRect.y + (this.safeRect.height*0.5) ;
    }
    get safeCenter()
    {
        return { x: this.safeCenterX, y: this.safeCenterY };
    }
    
    get safeTopLeft()
    {
        return { x: this.safeLeft, y: this.safeTop };
    }
    get safeTopRight()
    {
        return { x: this.safeRight, y: this.safeTop };
    }
    get safeBottomLeft()
    {
        return { x: this.safeLeft, y: this.safeBottom };
    }
    get safeBottomRight()
    {
        return{ x: this.safeRight, y: this.safeBottom };
    }

    get safeCenterLeft()
    {
        return { x: this.safeLeft, y: this.safeCenterY };
    }
    get safeCenterRight()
    {
        return { x: this.safeRight, y: this.safeCenterY };
    }
    get safeCenterTop()
    {
        return { x: this.safeCenterX, y: this.safeTop };
    }
    get safeCenterBottom()
    {
        return { x: this.safeCenterX, y: this.safeBottom };
    }    

    get dynTop()
    {
        return this.dynRect.y ;
    }
    get dynBottom()
    {
        return this.dynRect.y + this.dynRect.height ;
    }
    get dynLeft()
    {
        return this.dynRect.x ;
    }
    get dynRight()
    {
        return this.dynRect.x + this.dynRect.width ;
    }

    get dynCenterX()
    {
        return this.dynRect.x + (this.dynRect.width*0.5) ;
    }
    get dynCenterY()
    {
        return this.dynRect.y + (this.dynRect.height*0.5) ;
    }
    get dynCenter()
    {
        return { x: this.dynCenterX, y: this.dynCenterY };
    }
    
    get dynTopLeft()
    {
        return { x: this.dynLeft, y: this.dynTop };
    }
    get dynTopRight()
    {
        return { x: this.dynRight, y: this.dynTop };
    }
    get dynBottomLeft()
    {
        return { x: this.dynLeft, y: this.dynBottom };
    }
    get dynBottomRight()
    {
        return{ x: this.dynRight, y: this.dynBottom };
    }

    get dynCenterLeft()
    {
        return { x: this.dynLeft, y: this.dynCenterY };
    }
    get dynCenterRight()
    {
        return { x: this.dynRight, y: this.dynCenterY };
    }
    get dynCenterTop()
    {
        return { x: this.dynCenterX, y: this.dynTop };
    }
    get dynCenterBottom()
    {
        return { x: this.dynCenterX, y: this.dynBottom };
    }   

    placeRelativeToSafeZone( entity, instruction, paddingX, paddingY )
    {
        let sprite = entity.getComponent(SpriteComponent).sprite;
        if( ! sprite ) throw new Error("Entity has no sprite to manage layout!");
        this.placeRelativeToRect( sprite, instruction, paddingX, paddingY, this.safeRect );
    }

    placeRelativeToDynZone( entity, instruction, paddingX, paddingY )
    {
        let sprite = entity.getComponent(SpriteComponent).sprite;
        if( ! sprite ) throw new Error("Entity has no sprite to manage layout!");
        this.placeRelativeToRect( sprite, instruction, paddingX, paddingY, this.dynRect );            
    } 

    registerDynamicLayoutSubscriber( entity, instruction, paddingX, paddingY )
    {
        this.deregisterDynamicLayoutSubscriber( entity );
        
        let struct = new DynamicLayoutSubscriber( entity, instruction, paddingX, paddingY );
        this.subscribersToDynamicLayout.push( struct );
        
        entity.removedFromParent.add(this);

        this.updateSubscribers();
    }
    deregisterDynamicLayoutSubscriber( entity )
    {
        for( var i=0; i<this.subscribersToDynamicLayout.length; i++ )
        {
            let struct = this.subscribersToDynamicLayout[i];
            if( struct.entity == entity )
            {
                struct.destroy();
                this.subscribersToDynamicLayout.splice(i,1);

                return ;
            }
        }
    }

    onRemovedFromParent(entity,parentEntity)
    {
        this.deregisterDynamicLayoutSubscriber(entity);
    }

    updateSubscribers()
    {
        for( var i=0; i<this.subscribersToDynamicLayout.length; i++ )
        {
            let struct = this.subscribersToDynamicLayout[i];
            this.placeRelativeToDynZone( struct.entity, struct.instruction, struct.paddingX, struct.paddingY ) ;
        }
    }

}