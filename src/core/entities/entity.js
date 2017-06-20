import Broadcaster from "~/core/broadcaster.js";

import SpriteComponent from "~/core/components/spritecomponent.js";

/* Entities automatically propagate enable/disable/update to A) their child entities and B) their own components */
export default class Entity
{  
    constructor(application) 
    {
        this.application = application;
        
        this.disposer = new Broadcaster("destroy");

        this.childUpdater = new Broadcaster("update");
        this.disposer.add(this.childUpdater);

        this.childEnabler = new Broadcaster("enable");
        this.disposer.add(this.childEnabler);

        this.childDisabler = new Broadcaster("disable");
        this.disposer.add(this.childDisabler);

        this.componentUpdater = new Broadcaster("update");
        this.disposer.add(this.componentUpdater);

        this.componentEnabler = new Broadcaster("enable");
        this.disposer.add(this.componentEnabler);

        this.componentDisabler = new Broadcaster("disable");
        this.disposer.add(this.componentDisabler);       

        this.addedToParent = new Broadcaster("onAddedToParent");
        this.addedToParent.add(this);
        this.disposer.add(this.addedToParent);

        this.removedFromParent = new Broadcaster("onRemovedFromParent");
        this.removedFromParent.add(this);
        this.disposer.add(this.removedFromParent);

        this.componentAdded = new Broadcaster("onComponentAdded");
        this.componentAdded.add(this);
        this.disposer.add(this.componentAdded);

        this.componentRemoved = new Broadcaster("onComponentRemoved");
        this.componentRemoved.add(this);
        this.disposer.add(this.componentRemoved);

        this.components = [];        

        this.parent = null;
        this.children = [] ;
    }  
    destroy()
    {
        this.removeAllComponents();
        this.removeAllChildren();

        this.disposer.dispatch();
        this.disposer.destroy();
        this.disposer = null;

        // managers
        this.componentUpdater = null;
        this.componentEnabler = null;
        this.componentDisabler = null;
        this.childUpdater = null;
        this.childEnabler = null;
        this.childDisabler = null;        
        
        // hooks
        this.addedToParent = null;
        this.removedFromParent = null;
        this.componentAdded = null;
        this.componentRemoved = null;

        this.components = null;    
        this.parent = null;
        this.children = null;
        this.application = null;    
    }

    update(delta)
    {
        this.childUpdater.dispatch(delta);
        this.componentUpdater.dispatch(delta);
    }
    enable()
    {
        this.childEnabler.dispatch();
        this.componentEnabler.dispatch();
    }
    disable()
    {
        this.childDisabler.dispatch();
        this.componentDisabler.dispatch();
    }

    setParent(parent)
    {
        let previousParent = this.parent ;
        this.parent = parent;
        if( this.parent == null ) this.removedFromParent.dispatch(this,previousParent);
        else this.addedToParent.dispatch(this,parent);
    }

    addChild(entity)
    {
        // a child entity will add a sprite component to it's parent's sprite compoennt as a child, and will also bind it's enable/disable lifecycle to the parent

        if( ! entity ) throw new Error("Child is null.");

        if( this.contains(entity) ) this.removeChild(entity);

        this.children.push(entity);
        entity.setParent(this);

        this.childUpdater.add(entity);
        this.childEnabler.add(entity);
        this.childDisabler.add(entity);

        if( this.hasComponent(SpriteComponent) && entity.hasComponent(SpriteComponent) )
        {
            this.getComponent(SpriteComponent).sprite.addChild(entity.getComponent(SpriteComponent).sprite);
        }
    }
    removeChild(entity,destroy)
    {
        if( ! entity ) throw new Error("Child is null.");

        if( this.contains(entity) ) 
        {   
            var idx = this.children.indexOf(entity);
            this.children.splice(idx,1);
            entity.setParent(null);

            this.childUpdater.remove(entity);
            this.childEnabler.remove(entity);
            this.childDisabler.remove(entity);

            if( this.hasComponent(SpriteComponent) && entity.hasComponent(SpriteComponent) )
            {
                this.getComponent(SpriteComponent).sprite.removeChild(entity.getComponent(SpriteComponent).sprite);
            }

            if( destroy ) entity.destroy();
        }
    }
    contains(entity)
    {
        return this.children.indexOf(entity) !== -1;
    }
    removeAllChildren(destroy)
    {
        while(this.children.length) this.removeChild(this.children[0],destroy);
        return this;
    }    

    onAddedToParent(entity,parentEntity)
    {
        // overrideable hook
    }
    onRemovedFromParent(entity,parentEntity)
    {
        // overrideable hook
    }
    
    addComponent(component)
    {
        this.removeComponent(component);
        
        this.components.push(component);
        
        this.componentUpdater.add(component);        
        this.componentEnabler.add(component);        
        this.componentDisabler.add(component);        

        if( typeof component.onAdded == 'function' ) component.onAdded(this);

        this.componentAdded.dispatch(this,component);
        
        return this;
    }
    removeComponent(component, destroy)
    {
        let index = this.components.indexOf(component);
        if (index !== -1) 
        {
            this.componentUpdater.remove(component);            
            this.componentEnabler.remove(component);        
            this.componentDisabler.remove(component);      

            this.components.splice(index, 1);

            if( typeof component.onRemoved == 'function' ) component.onRemoved(this);

            this.componentRemoved.dispatch(this,component);

            if( destroy ) component.destroy();            
        }       
        return this;
    }
    getComponent(type)
    {
        // CARE HERE - it'll return only the first registered component which either inherits from or else IS an object of type... 
    
        for( var i=0; i<this.components.length; i++ )
        {
            let c = this.components[i];
            if( c === type || c instanceof type ) return c ;
        }
        return null ;
    }
    hasComponent(type)
    {
        return this.getComponent(type) != null ;
    }    
    removeAllComponents(destroy)
    {
        while(this.components.length) this.removeComponent(this.components[0],destroy);        
    }    
    
    onComponentAdded(entity,component)
    {
        // overrideable hook
    }
    onComponentRemoved(entity,component)
    {
        // overrideable hook
    }

}