import Entity from "~/core/entities/entity.js";

import ResourceManager from "~/core/utils/resourcemanager.js";


export default class Preloader extends Entity
{
    constructor(application,resourceManager)
    {
        super(application);

        this.resourceManager = resourceManager;        
        this.resourceManager.subscribe(this);
    }    
    destroy()
    {
        this.resourceManager.unsubscribe(this);
        this.resourceManager = null;
        
        super.destroy();
    }

    reset()
    {
        // etc
    }

    onResourceManagerProgress(val)
    {
        console.log("load progress",val);
    }
    
}