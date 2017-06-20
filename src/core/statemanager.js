import SpriteComponent from "~/core/components/spritecomponent.js";

import Broadcaster from "~/core/broadcaster.js";

export default class StateManager
{
    constructor(stage)
    {
        this.stateChanged = new Broadcaster("onStateChanged");
        this.stage = stage;
        this.statesByLabel = {} ;
        this.stateStack = [] ;            
    }

    enable()
    {
        let tState = this.getCurrentStateObj() ;
        if( tState ) tState.enable();        
    }
    disable()
    {
        let tState = this.getCurrentStateObj() ;
        if( tState ) tState.disable();            
    }

    registerState( label, state )
    {
        console.log( 'registerState with label', label ) ;

        state.smLabel = label ;
        this.statesByLabel[ label ] = state ;
    }
    unregisterState( label )
    {
        console.log( 'unregisterState with label', label ) ;
        if( this.statesByLabel.hasOwnProperty(label) )
        {
            this.statesByLabel[ label ] = null ;
            delete this.statesByLabel[ label ] ;
        }
    }
    purgeAllStates()
    {
        for( let key in this.statesByLabel )
            if( this.statesByLabel.hasOwnProperty(key) )
                this.unregisterState(key);

        this.statesByLabel = {} ;
        this.stateStack = [] ;
    }

    setState( label )
    {
        //console.log( ':: setState', label ) ;

        while( this.stateStack.length )
        {
            let tState = this.stateStack.pop() ;
            tState.disable() ;
            if( tState.hasComponent(SpriteComponent) ) this.stage.removeChild(tState.getComponent(SpriteComponent).sprite);                                   
            tState.deactivate() ;
        }

        let nextState = label ? this.statesByLabel[ label ] : null ;

        if( nextState )
        {
            this.stateStack.push( nextState ) ;
            nextState.activate() ;
            if( nextState.hasComponent(SpriteComponent) ) this.stage.addChild(nextState.getComponent(SpriteComponent).sprite);                       
            nextState.enable() ;

            this.stateChanged.dispatch();
        }
        else
        {
            throw new Error( 'No State with label (' + label + ') is registered' ) ;
        }
    }

    pushState( label )
    {
        //console.log( ':: pushState', label ) ;

        if( this.getCurrentStateLabel() == label ) return ;

        let currentState = this.getCurrentStateObj() ;

        let nextState = label ? this.statesByLabel[ label ] : null ;

        if( currentState )
        {
            //console.log( 'stateManager: disabling', currentState.label ) ;
            currentState.disable() ;
        }

        if( nextState )
        {
            this.stateStack.push( nextState ) ;
            nextState.activate() ;
            if( nextState.hasComponent(SpriteComponent) ) this.stage.addChild(nextState.getComponent(SpriteComponent).sprite);
            nextState.enable() ;

            this.stateChanged.dispatch();
        }
        else throw new Error( 'Cannot push state with label: ' + label ) ;
    }

    popState()
    {
        let currentState = this.stateStack.pop() ;

        if( ! currentState ) return ;

        let nextState = this.stateStack[ this.stateStack.length-1 ] ;

        if( currentState )
        {
            currentState.disable() ;
            if( currentState.hasComponent(SpriteComponent) ) this.stage.removeChild(currentState.getComponent(SpriteComponent).sprite);                       
            currentState.deactivate();
        }

        if( nextState )
        {
            nextState.enable() ;
        }

        this.stateChanged.dispatch();
    }

    getCurrentStateLabel()
    {
        try
        {
            return (this.stateStack[this.stateStack.length-1]).smLabel ;
        }
        catch(e)
        {
            return null ;
        }
    };

    getCurrentStateObj()
    {
        let label = this.getCurrentStateLabel() ;
        if( ! label ) return null ;
        else return this.statesByLabel[ label ] ;
    }

    getStateWithLabel(label)
    {
        return this.statesByLabel[ label ] ;
    }

}