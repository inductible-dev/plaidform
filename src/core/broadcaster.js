export default class Broadcaster 
{  
    constructor(name) 
    {
        this.items = [];
        this._name = name;
    }
    destroy()
    {
        this.removeAll();
        this.items = null;
        this._name = null;
    }  

    contains(item)
    {
        return this.items.indexOf(item) !== -1;
    }

    removeAll()
    {
        while( this.items.length ) this.items.pop();        
        return this;
    }    

    dispatch(a0, a1, a2, a3, a4, a5, a6, a7)
    {
        if (arguments.length > 8) throw 'max arguments reached';
                
        let items = this.items;
        let name = this._name;

        for (var i = 0, len = items.length; i < len; i++) items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);    
        return this;
    }

    add(item)
    {
        if (item[this._name])
        {
            this.remove(item);
            this.items.push(item);
        }
        return this;
    }

    remove(item)
    {
        let index = this.items.indexOf(item);
        if (index !== -1) this.items.splice(index, 1);        
        return this;
    }

    get empty()
    {
        return this.items.length === 0;
    }

    get name()
    {
        return this._name;
    } 
}