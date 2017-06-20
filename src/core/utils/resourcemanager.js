import Broadcaster from "~/core/broadcaster.js";

export default class ResourceManager
{
    constructor(baseUrl)
    {
        this.disposer = new Broadcaster('destroy');

        this._isLoaded = false;

        this.loader = new PIXI.loaders.Loader(baseUrl);        
        this.disposer.add(this.loader);
        
        this.loader.on('progress', this.handleProgress, this );
        this.loader.on('error', this.handleError, this);
        this.loader.on('load', this.handleLoad, this );

        this.onProgress = new Broadcaster('onResourceManagerProgress');
        this.disposer.add(this.onProgress);

        this.onError = new Broadcaster('onResourceManagerError');
        this.disposer.add(this.onError);

        this.onLoad = new Broadcaster('onResourceManagerLoad');
        this.disposer.add(this.onLoad);

        this.onComplete = new Broadcaster('onResourceManagerComplete');
        this.disposer.add(this.onComplete);
    }
    destroy()
    {
        this.disposer.dispatch();        
        this.disposer.destroy();
        this.disposer = null;    

        this.onProgress = null ;
        this.onError = null ;
        this.onLoad = null ;
        this.onComplete = null ;    
    }

    subscribe(obj)
    {
        this.onProgress.add(obj);
        this.onError.add(obj);
        this.onLoad.add(obj);
        this.onComplete.add(obj);
    }
    unsubscribe(obj)
    {
        this.onProgress.remove(obj);
        this.onError.remove(obj);
        this.onLoad.remove(obj);
        this.onComplete.remove(obj);
    }

    handleProgress(obj)
    {
        this.loadProgress = obj.progress;
        this.onProgress.dispatch(this.loadProgress);
    }
    handleError(obj)
    {
        this.onError.dispatch(obj);
    }
    handleLoad(obj)
    {
        this.onLoad.dispatch(obj);
    }
    handleComplete(obj)
    {
        this.onComplete.dispatch();
        this._isLoaded = true;
    }

    add( id, src )
    {
        this._isLoaded = false;
        this.loader.add(id,src);
    }
    load()
    {
        this.loader.load( (obj) => this.handleComplete(obj) );
    }
    get(id)
    {
        return this.loader.resources[id];
    }

    get isLoaded()
    {
        return this._isLoaded ;
    }
}