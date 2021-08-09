import getSmoothedAngleFromVelocity from "../utils/getSmoothedAngleFromVelocity.js"
import getRandomNumber from "../utils/getRandomNumber.js"

//"magic numbers" that we will be using that won't be changing
const PLAYER_SPEED = 800
const PLAYER_GRAVITY = 3000
const PIPE_SPEED = 5

export class GameScene extends Phaser.Scene {
  constructor() {
      super({
        key: "GameScene"
      });
    }
  //init() method is the first method called when we load our scene. We can initialize values needed in the scene here and optionally accept values sent from a previous scene
  init() {
      // our duck gameObject
      this.player
      //groups are a collection of gameObjects, in our case each pair of pipes our duck flaps through
      this.pipeGroup
      this.ground
      //keeping track of if the user has initiated the game (it will help us determine what actions to take when the player clicks)
      this.playingGame = false
      //keeping track of if the player has hit a pipe (it will help us determine what actions they can take)
      this.alive = true
      this.score = 0
      this.scoreText
    }
  preload() {
      this.load.image("background", "assets/space-background.jpg")
      //spritesheets are a large image that contain all the necessary frames for an animation 
      this.load.spritesheet(
        //reference to this spritesheet
        "dani-duck",
        "assets/dani-duck-spritesheet.png",
        //telling phaser the size of each frame in our image
        {
          frameWidth: 130,
          frameHeight: 130
        }
      )
      this.load.spritesheet(
        "ground",
        "assets/ground-spritesheet.png",
        {
          frameWidth: 960,
          frameHeight: 120
        }
      )
      this.load.image("pipe", "assets/pipe.png")
    }
    
  create() {
    const background = this.add.image(480, 640, "background")
    //scale of our game object based off of original size (0.1 -> 10% 1.0 -> 100%)
    background.setScale(0.4)
    background.alpha = 0.3
    //sprites are static or animated image gameObjects that can have input and physics associated with them
    this.ground = this.add.sprite(
      480,
      1220,
      "ground"
    )
    //add a sprite with physics
    this.player = this.physics.add.sprite(
      480,
      640,
      "dani-duck"
    )
    //creating an image from the spritesheets we loaded
    this.anims.create({
      key: "move-ground",
      //grabbing the individual frames from our spritesheet and assigning them an order
      frames: this.anims.generateFrameNumbers("ground", {
        frames: [0, 1, 2, 3, 4]
      }),
      frameRate: 60,
      //-1 will repeat indefinitely 
      repeat: -1
    })
    this.anims.create({
      key: "flap",
      frames: this.anims.generateFrameNumbers("dani-duck", {
        frames: [0, 1]
      }),
      frameRate: 5,
      repeat: -1
    })
    //depth manages the current layer a game object is on. Higher numbers will be rendered above 
    this.player.setDepth(2)
    this.ground.setDepth(1)
    //a container is a gameObject that is comprised of multiple gameObjects. The container is the parent and all children are displayed in reference to the container
    const pipeContainerA = this.createPipeContainer(0, 1520)
    const pipeContainerB = this.createPipeContainer(0, 2080)
    // a group is simply a way to list and associate gameObjects. Like a glorified array
    this.pipeGroup = this.add.group()
    this.pipeGroup.add(pipeContainerA)
    this.pipeGroup.add(pipeContainerB)

    this.scoreText = this.add.text(480, 100, this.score, {fontSize: "8em", fontFamily: "'Play', sans-serif"})
    //event listener for a mouse click
    this.input.on("pointerdown", (pointer) => {
      //if the player hasn't started the game(by clicking the mouse) we want to enable gravity and start the game
      if(!this.playingGame) {
        this.playingGame = true
        this.player.setGravityY(PLAYER_GRAVITY)
      }
      //if the player clicks the mouse and hasn't lost, we want them to 'flap'
      if(this.alive) {
        //the .body property holds onto the physics attributes of our player such as their current velocity
        //setting the players velocity to 0 before accelerating them makes the 'flap' feel instant and more responsive to the players input
        this.player.body.velocity.y = 0
        this.player.body.velocity.y -= PLAYER_SPEED         
      }
    })
  }
  // the update aims to run 60 times a second, and is where we handle interactions between gameObjects
  update() {
    // if we have started the game and haven't lost we want to perform several actions
    if(this.playingGame && this.alive) {
      //move each pipe
      this.pipeGroup.getChildren().forEach((pipeContainer) => {
        pipeContainer.x -= PIPE_SPEED
        
        //if the pipe has gone offscreen, we want to reset it to the right and randomize it's hight, and change it's passed state to false
        if(pipeContainer.x < 0 - pipeContainer.list[0].width/2) {
          pipeContainer.x = 960 + pipeContainer.list[0].width/2
          pipeContainer.y = 640 + getRandomNumber(325)
          pipeContainer.passed = false
        }
      })
    }
    //play our animations
    this.ground.play("move-ground", true)
    this.player.play("flap", true)

    //set the players angle based off of their vertical velocity
    this.player.setAngle(getSmoothedAngleFromVelocity(this.player))

    //the player loses if they go off screen
    if(this.player.y < 0 || this.player.y > 1280) {
      //the second parameter in our start method handles passing information to the scene we are starting
      this.scene.start("GameOverScreen", {score: this.score})
    }

    this.scoreText.text = this.score

  }
  //we can take advantage of class based structure and define our own methods within the scene
  createPipeContainer(xPos) {
    const pipe1 = this.physics.add.sprite(
      0,
      875,
      "pipe"
    )
    const pipe2 = this.physics.add.sprite(
      0,
      -875,
      "pipe"
    )
    pipe1.flipY = true
    //create our container and add the two pipes
    const pipeContainer = this.add.container(xPos, 640)
    pipeContainer.add([pipe1, pipe2])
    //containers don't have physics enabled by default
    this.physics.world.enable(pipeContainer)
    //here we are creating a check for if our player and this pipe container overlap
    this.physics.add.overlap(pipeContainer, this.player, (pipeContainer, player) => {
      //since the overlap will run for every frame our player and pipe container are overlapping, we take advantage of our passed state to ensure that the score is only incremented once if we haven't already overlapped this pipe (this is reset once the pipe goes offscreen)
      if(!pipeContainer.passed) {
        pipeContainer.passed = true
        this.score += 1
      }
    })

    //we also need an overlap check for each individual pipe, encase our duck runs into it
    pipeContainer.list.forEach((pipe) => {
      this.physics.add.overlap(pipe, this.player, () => {
        if(this.alive) {
          //this stops our ground animation
          this.ground.active = false
          this.alive = false
          //abrupt stop in player velocity makes it feel as if they've actually hit an object
          this.player.body.velocity.y = 0
        }
      })
    })
    return pipeContainer
  }
};