export class GameOverScreen extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOverScreen",
    });
  }
  //params is our object we passed from the last scene
  init(params) {
    this.score = params.score
  }
  create() {
    //we change the origin of the object (where the center point is) to center this text
    this.add.text(480, 100, "GAME OVER", {fontSize: "10em"}).setOrigin(0.5)
    this.add.text(480, 250, `Your Score: ${this.score}`, {fontSize: "10em"}).setOrigin(0.5)
    this.add.text(480, 500, "-click to play again-", {fontSize: "6em"}).setOrigin(0.5)
    
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene')
    })
  }
}
