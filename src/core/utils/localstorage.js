export default class LocalStorage
{
    constructor( localStorageKey )
    {
        this.localStorageKey = localStorageKey;
        this.cookieData = this.defrostStorageObject();

        console.log("retrieved cookieData:",this.cookieData);
    }

    setItemWithKey( key, value )
    {
        this.cookieData[key] = value ; 
        this.synchronizeStorageObject();
    }    
    getItemWithKey( key )
    {
        return this.cookieData[key];        
    }    

    purge()
    {
        this.cookieData = this.getDefaultCookieTemplate();
        this.synchronizeStorageObject();
    }   

    getDefaultCookieTemplate()
    {
        return {} ;        
    }  
    
    defrostStorageObject()
    {
        let tData = null;

        try {
            tData = JSON.parse(window.localStorage.getItem( this.localStorageKey ));
        }
        catch(e) {}

        if(!tData) tData = this.getDefaultCookieTemplate();

        return tData;
    }
    synchronizeStorageObject()
    {
        console.log("writing cookieData:",this.localStorageKey,this.cookieData);

        window.localStorage.setItem( this.localStorageKey, JSON.stringify(this.cookieData) );
    }
}