//creating a class for our start screen, extends from Phasers scene class
export class StartScreen extends Phaser.Scene {
  constructor() {
    //we reference a scene by this key whenever we want to load it
      super({
        key: "StartScreen"
      });
    }
  // the preload() method handles loading our assets into memory
  preload() {
    this.load.image("flappy-duck", "assets/flappyduck.png")
    }
  //create() method is where we handle instantiation of game objects  
  create() {
    //this in context refers to the current scene
    //.add has several methods that let us create various types of game objects
    const title = this.add.image(480, 280, "flappy-duck")
    const subtext = this.add.text(480, 620, "-click to start-", {
      fontSize: '5em', fontFamily: "'Play', sans-serif"
    }).setOrigin(0.5)
    this.input.on('pointerdown', (pointer) => {
      this.scene.start('GameScene')
    })
  }
  };