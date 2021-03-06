//phaser projects are usually comprised of separate scenes that the game instance loads based on the games current status
import { StartScreen } from "./scenes/start-screen.js"
import {GameScene} from "./scenes/game-scene.js"
import {GameOverScreen} from './scenes/game-over.js'

//configuration object that we pass into our Game instance! This handles the settings for our game
const config = {
  title: "Flappy Duck",
  //makes sure our game will scale dynamically to fit it's container which by default is the body element
  scale: {
    mode: Phaser.Scale.FIT,
    //width and height of our game view
    //apparent size of game is 192 X 256 but we scale all of our assets up 
    width: 960,
    height: 1280,
},
  scene: [StartScreen, GameScene, GameOverScreen],
  //phaser's default physics engine
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  //optimize rendering for pixel art
  pixelArt: true,
  autoCenter: true
}

//Game class extends from Phasers own Game class
export class FlappyDuck extends Phaser.Game {
  constructor(config) {
    super(config)
  }
}

//initialize our Game instance on page load
window.onload = () => {
  new FlappyDuck(config)
}
