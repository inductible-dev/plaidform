import Broadcaster from "~/core/broadcaster.js";

export default class AppFocusManager
{
    constructor()
    {
        this.broadcaster = new Broadcaster("onAppFocusChanged");
        this.boundOnBlur = (evt)=>{ this.onBlur(evt) };
        this.boundOnFocus = (evt)=>{ this.onFocus(evt) };
        this.start() ;
    }

    add(item)
    {
        this.broadcaster.add(item);
    }
    remove(item)
    {
        this.broadcaster.remove(item);
    }

    onBlur(evt)
    {
        this.broadcaster.dispatch(false);
    }

    onFocus(evt)
    {
        this.broadcaster.dispatch(true);
    }

    start()
    {
        window.addEventListener( 'blur', this.boundOnBlur );
        window.addEventListener( 'focus', this.boundOnFocus );
    }    
    stop()
    {
        window.removeEventListener( 'blur', this.boundOnBlur );
        window.removeEventListener( 'focus', this.boundOnFocus );
    }
}