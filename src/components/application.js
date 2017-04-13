import "node_modules/pixi.js/lib/index";

export default class Application 
{  
  constructor() 
  {
    this.app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
    document.body.appendChild(this.app.view);

    this.sprite = PIXI.Sprite.fromImage('assets/images/bunny.png')
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.app.renderer.width / 2;
    this.sprite.y = this.app.renderer.height / 2;
    this.app.stage.addChild(this.sprite);

    this.app.ticker.add(this.update,this);
  }

  update(delta) 
  {
    this.sprite.rotation += 0.01 * delta;
  }
}
