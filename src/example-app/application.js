import CoreApplication from "~/core/application.js";

import TitleState from "~/example-app/states/titlestate.js";

export default class Application extends CoreApplication
{
    constructor(...args)
    {
        super(...args);

        this.initStates();            
        
        this.stateManager.setState('title');
    }

    initStates()
    {
        let titleState = new TitleState( this );
        this.stateManager.registerState('title',titleState);        
    }
    
}