import State from "~/core/states/state.js";

import Entity from "~/core/entities/entity.js";

import SpriteComponent from "~/core/components/spritecomponent.js";
import SpriteButtonComponent from "~/core/components/spritebuttoncomponent.js";

import Wabbit from "~/example-app/entities/wabbit.js";

export default class TitleState extends State
{
    constructor(...args)
    {
        super(...args);        

        // load init
        this.resourceManager.add( 'atlas', 'assets/images/atlas.json' );        
        //
    }

    buildView()
    {
        super.buildView();

        let spriteSheet = this.resourceManager.get('atlas');
        
        let bgEnt = new Entity();
        let spriteComponent = new SpriteComponent( spriteSheet.textures['background'] );        
        spriteComponent.sprite.anchor.set(0.5);        
        bgEnt.addComponent(spriteComponent);
        this.application.layoutHelper.placeRelativeToSafeZone( bgEnt, "CENTER" );
        this.addChild(bgEnt);

        let playButtonEnt = new Entity();
        let bTex_up = spriteSheet.textures['button_up'];
        let bTex_down = spriteSheet.textures['button_down'];
        let bTex_over = spriteSheet.textures['button_over'];
        let spriteButtonComponent = new SpriteButtonComponent( "onPlayButton", bTex_up, bTex_down, bTex_over );        
        spriteButtonComponent.addDelegate(this);
        spriteButtonComponent.sprite.anchor.set(0.5);        
        playButtonEnt.addComponent(spriteButtonComponent);
        this.application.layoutHelper.registerDynamicLayoutSubscriber( playButtonEnt, "BOTTOM_RIGHT", 70, 50 );
        this.addChild(playButtonEnt);        
        
        let wabbit = new Wabbit(spriteSheet.textures['bunny']);
        this.application.layoutHelper.placeRelativeToSafeZone( wabbit, "CENTER" );
        this.addChild(wabbit);
    }
    destroyView()
    {
        this.removeAllChildren(true);

        super.destroyView();
    }

    onPlayButton(msg)
    {
        switch( msg )
        {
            case "up":
                alert("yeah");
            break;
        }        
    }
}