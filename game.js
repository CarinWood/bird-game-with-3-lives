let score = 0
let stars = ''
let grapes = ''
let bombs = ''
let gameover = false
let player
let clearCourse = ''
let dieSound
let collectSound
let clouds = ''
let cloud4 = ''
let cherries
let burningbombs
let bomb1
let bomb2
let bomb3
let strike = 0;
let heartOne;
let heartTwo;
let heartThree;
let emptyHeartOne;
let emptyHeartTwo;
let emptyHeartThree;



class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  preload() {
      this.load.image('sky', './assets/sky.png')
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.text(260, 150, 'The Bird Game', {fontSize: '35px', color: '#fff'})
    this.add.text(321, 210, 'by Carin Wood', {fontSize: '20px', color: '#fff'})
    this.add.text(205, 310, '(Click to start the game)', {fontSize: '25px', color: '#fff'})
    

    this.input.on('pointerdown', () => {
				this.scene.stop();
        this.scene.start("PlayScene");
			})
  }

  
}


class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene')
    }



    preload () {
        this.load.image('sky', '/assets/sky.png');
        this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('star', './assets/star.png')
        this.load.audio('clear', './assets/levelClear.mp3')
        this.load.audio('die', './assets/dying.mp3')
        this.load.audio('collect', './assets/coinSound.mp3')
        this.load.image('heart', './assets/heart.png');
        this.load.image('emptyHeart', './assets/emptHeart.png');
      }
      
    create () {
        this.add.image(400, 300, 'sky');

        //sounds
        clearCourse = this.sound.add('clear')
        dieSound = this.sound.add('die')
        collectSound = this.sound.add('collect')
     

        //player
        player = this.physics.add.sprite(400, 300, 'bird').setScale(0.09);
        player.setCollideWorldBounds(true);
        
        this.anims.create({
          key: 'flying',
          frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
          frameRate: 10,
          repeat: -1,
        })

        player.anims.play('flying')

      
        //Create hearts
        if(strike == 0) {
          heartOne = this.add.image(240, 30, 'heart').setScale(0.04);
          heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
          heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
        } else if (strike == 1) {
          heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
          heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
          heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
        } else if (strike == 2) {
          heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
          heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
          heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
        } else if (strike == 3) {
          heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
          heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
          heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
        }

      
      

        this.text = this.add.text(20, 20, 'score: 0', {fontSize: '22px', color: '#fff'})

        //enemies
        bombs = this.physics.add.group({ gravityY: 0 });
      
        createBomb()

        stars = this.physics.add.staticGroup();
     
        for (let i = 0; i < 5; i++) {
            stars.create(Phaser.Math.Between(10, 790), Phaser.Math.Between(10, 590), 'star')
        }

        //Colliders and overlaps
        this.physics.add.overlap(player, stars, collectStars, null, this)
        this.physics.add.collider(player, bombs, hitBomb, null, this)
  
     


        //cursors
        this.cursors = this.input.keyboard.createCursorKeys();

      }

    
    
    update() {
    

        if(gameover === true) {
            return
        }
   
        if(this.cursors.left.isDown) {
            player.setVelocityX(-500)
            player.flipX = true;
        } else if (this.cursors.right.isDown) {
            player.setVelocityX(500)
            player.flipX = false;
        } else {
            player.setVelocityX(0);
        }

        if(this.cursors.up.isDown) {
          player.setVelocityY(-500)
        } else if (this.cursors.down.isDown) {
          player.setVelocityY(500);
        } else {
          player.setVelocityY(0);
        }
    }

    
      
}



function collectStars(player, stars) {
    collectSound.play()
    stars.disableBody(true, true)
    score += 10
    this.text.setText('score: ' + score)


    if(score === 50) {
      generateStars()
      createBomb()
    } else if (score === 100) {
      generateStars()
      createBomb()
    } 
  
 
    if (score === 150) {
      clearCourse.play()
      this.add.text(300, 200, 'Course Clear!', {fontSize: '27px'})
      this.physics.pause()
      player.anims.stop('flying')
      gameover = true

      setTimeout(() => {
          this.add.text(285, 250, 'Click to continue', {fontSize: '24px'})
          this.input.on('pointerdown', () => {
          this.scene.stop();
          gameover = false
          player.anims.play('flying')
          this.scene.start("LevelTwo");
          
			})
      }, 3000)
    
    }
  
  
}

function generateStars() {
 
  for (let i = 0; i < 5; i++) {
    stars.create(Phaser.Math.Between(60, 760), Phaser.Math.Between(70, 560), 'star')
}
}

function hitBomb() {
  strike++;
  dieSound.play()
  this.physics.pause()
  player.anims.stop('flying')
  gameover = true

  if(strike === 1) {
    heartOne.destroy();
    heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);

    setTimeout(() => {
      this.scene.restart()
      this.physics.resume()
      gameover = false
      player.anims.play('flying')
      score = 0;
  }, 3000)

  } 
  else if(strike === 2) {
    heartTwo.destroy();
    heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
    setTimeout(() => {
   
      this.scene.restart()
      this.physics.resume()
      gameover = false
      score = 0;
      player.anims.play('flying')
  }, 3000)

  }
  else if(strike == 3) {
    heartThree.destroy();
    heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
    this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})

    setTimeout(() => {
      this.scene.stop()
      this.scene.start('StartScene')
      score = 0
      strike = 0
      this.physics.resume()
      gameover = false
      player.anims.play('flying')
  }, 3000)

  }

}



function createBomb() {
    let bomb = bombs.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 770), 'bomb');
    bomb.body.setVelocity(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-350, 350));
    bomb.setCollideWorldBounds(true)
    bomb.setBounce(1);
    bomb.body.allowGravity = false
}

class LevelTwo extends Phaser.Scene {
  constructor() {
      super('LevelTwo')
  }

  preload() {
      this.load.image('sky', './assets/sky.png')
      this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
      this.load.image('grape', './assets/grapes.png')
      this.load.audio('clear', './assets/levelClear.mp3')
      this.load.audio('die', './assets/dying.mp3')
      this.load.audio('collect', './assets/coinSound.mp3')
      this.load.image('cloud_1', './assets/Cloud_1.png')
      this.load.image('cloud_2', './assets/Cloud_2.png')
      this.load.image('cloud_3', './assets/Cloud_3.png')
  }



  create() {
      this.add.image(400, 300, 'sky')
      this.text = this.add.text(20, 20, 'score: ' + score, {fontSize: '22px', color: '#fff'})

      //sounds
      collectSound = this.sound.add('collect')
      dieSound = this.sound.add('die')
      clearCourse = this.sound.add('clear')

      if(strike == 0) {
        heartOne = this.add.image(240, 30, 'heart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 1) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 2) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 3) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
      }
     

      //player
      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
        frameRate: 10,
        repeat: -1,
      })

      player = this.physics.add.sprite(400, 300, 'bird').setScale(0.09);
      player.setCollideWorldBounds(true);

      player.anims.play('fly')

      //Grapes
      grapes = this.physics.add.staticGroup()
      generateGrapes()

      //Clouds
      clouds = this.physics.add.group()
      this.cloud = clouds.create(-20, Phaser.Math.Between(30, 580), 'cloud_1').setScale(0.4);
      this.cloud.body.allowGravity = false
      this.cloud2 = clouds.create(-10, Phaser.Math.Between(30, 580), 'cloud_2').setScale(0.4);
      this.cloud2.body.allowGravity = false
      this.cloud3 = clouds.create(config.width + 78, Phaser.Math.Between(30, 580), 'cloud_3').setScale(0.4);
      this.cloud3.body.allowGravity = false
      // generateClouds()
     
      
      //colliders
      this.physics.add.overlap(grapes, player, collectGrape, null, this)
      this.physics.add.collider(clouds, player, hitCloud, null, this)
     
      
      //cursors
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    moveCloud(cloud, speed) {
    cloud.x += speed; 
    if(cloud.x > config.width + 55) {
        this.resetCloudPos(cloud)
    }  
  }

    moveCloudReverse(cloud, speed) {
      cloud.x -= speed;
      if(cloud.x < config.width - 860) {
        this.resetReverseCloudPos(cloud)
      }
    }

    resetCloudPos(cloud) {
    cloud.x = 0;
    let randomY = Phaser.Math.Between(0, config.height)
    cloud.y = randomY
  }

    resetReverseCloudPos(cloud) {
      cloud.x = config.width + 77
      let randomY = Phaser.Math.Between(0, config.height -20)
      cloud.y = randomY
    }

  

  update() {

    this.moveCloud(this.cloud, 2)
    this.moveCloud(this.cloud2, 3)
    this.moveCloudReverse(this.cloud3, 3)


    if(gameover) {
      return
    }

  if(this.cursors.left.isDown) {
      player.setVelocityX(-500)
      player.flipX = true;
  } else if (this.cursors.right.isDown) {
      player.setVelocityX(500)
      player.flipX = false;
  } else {
      player.setVelocityX(0);
  }

  if(this.cursors.up.isDown) {
    player.setVelocityY(-500)
  } else if (this.cursors.down.isDown) {
    player.setVelocityY(500);
  } else {
    player.setVelocityY(0);
  }
   
}

  
  
}
function collectGrape(player, grapes) {
  score += 10
  this.text.setText('score: ' + score)
  grapes.disableBody(true, true)
  collectSound.play()

  if(score === 200) {
    generateGrapes()


  } else if (score === 250) {
    generateGrapes()
  
  } 

  if (score === 300) {
    clearCourse.play()
    this.add.text(300, 200, 'Course Clear!', {fontSize: '27px'})
    player.anims.stop('fly')
    this.physics.pause()
    gameover = true
    this.cloud.disableBody(true, true)
    this.cloud2.disableBody(true, true)
    this.cloud3.disableBody(true, true)
   


    
    setTimeout(() => {
      this.add.text(285, 250, 'Click to continue', {fontSize: '24px'})
      this.input.on('pointerdown', () => {
      this.scene.stop();
      gameover = false
      player.anims.play('flying')
      this.scene.start("LevelThree");
      
  })
  }, 3000)
  

  }

}
function generateGrapes() {
  for (let i = 0; i < 5; i++) {
    grapes.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 570), 'grape').setScale(1.9)
}
}




function hitCloud() {
  strike++;
  dieSound.play()
  this.physics.pause()
  this.cloud.destroy()
  this.cloud2.destroy()
  this.cloud3.destroy()
  player.anims.stop('fly')
  gameover = true

  if(strike == 1) {
    score = 150;
    heartOne.destroy();
    heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);

    setTimeout(() => {
      this.scene.restart()
      this.physics.resume()
      gameover = false
      player.anims.play('flying')

  }, 3000)

  } else if(strike == 2) {
    score = 150;
    heartTwo.destroy();
    heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
    setTimeout(() => {
   
      this.scene.restart()
      this.physics.resume()
      gameover = false
      player.anims.play('flying')
  }, 3000)

  }
  else if(strike == 3) {
    heartThree.destroy();
    heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
    this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})

    setTimeout(() => {
      this.scene.stop()
      this.scene.start('StartScene')
      score = 0
      strike = 0
      this.physics.resume()
      gameover = false
      player.anims.play('flying')
  }, 3000)

  }

  }

  

  class LevelThree extends Phaser.Scene {
    constructor() {
      super('LevelThree')
    }

    preload() {
      this.load.image('sky', '/assets/sky.png');
      this.load.image('cherry', './assets/cherry.png')
      this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
      this.load.audio('coinSound', './assets/coinSound.mp3')
      this.load.audio('hitsound', './assets/dying.mp3')
      this.load.audio('clearCourse', './assets/levelClear.mp3')
      this.load.atlas('bom', './assets/bombheet.png', './assets/bombsheet.json')
      this.load.atlas('explode', './assets/explodesheet.png', './assets/explodesheet.json')
      
    }

    create() {
      gameover = false
      this.add.image(400, 300, 'sky');
      this.text = this.add.text(20, 20, 'score: ' + score, {fontSize: '22px', color: '#fff'})

      if(strike == 0) {
        heartOne = this.add.image(240, 30, 'heart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 1) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'heart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 2) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'heart').setScale(0.04);
      } else if (strike == 3) {
        heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
        heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
        heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
      }

      //Sounds
      collectSound = this.sound.add('coinSound')
      dieSound = this.sound.add('hitsound')
      clearCourse = this.sound.add('clearCourse')

      player = this.physics.add.sprite(400, 300, 'bird').setScale(0.09);
      player.setCollideWorldBounds(true);
     
      
      this.anims.create({
         key: 'flying',
         frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
         frameRate: 10,
         repeat: -1,
      })

      player.anims.play('flying')
      player.body.allowGravity = false


       //Cherries
       cherries = this.physics.add.staticGroup()
       generateCherries()
  
       //Enemy 

       burningbombs = this.physics.add.group()
    
       this.anims.create(
        {
           key: 'burning',
           frames: this.anims.generateFrameNames('bom', {prefix: 'bomb', end: 3, zeroPad: 3}),
           frameRate: 8,
           repeat: -1
       })
       this.anims.create(
         {
           key: 'exp',
           frames: this.anims.generateFrameNames('explode', {prefix: 'explode', end: 6, zeroPad: 3}),
           frameRate: 10,
           repeat: 0 
       })

   

      
          const bombLoop = this.time.addEvent({
            delay: 600,   
            callback: bombGen,
            loop: true
         })

    
  

      //Colliders

    
      this.physics.add.overlap(player, cherries, collectCherry, null, this)
      this.physics.add.overlap(player, burningbombs, hitbyBomb, null, this)
    


       //cursors
       this.cursors = this.input.keyboard.createCursorKeys();

    }

   
  

    update() {
    
       if(gameover === true) {
           return
       }
 
       if(this.cursors.left.isDown) {
           player.setVelocityX(-500)
           player.flipX = true;
       } else if (this.cursors.right.isDown) {
           player.setVelocityX(500)
           player.flipX = false;
       } else {
           player.setVelocityX(0);
       }

       if(this.cursors.up.isDown) {
         player.setVelocityY(-500)
       } else if (this.cursors.down.isDown) {
         player.setVelocityY(500);
       } else {
         player.setVelocityY(0);
       }
  }

   

}


function generateCherries() {
    for (let i = 0; i < 5; i++) {
          cherries.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 570), 'cherry').setScale(1.5)

  }

}

 function collectCherry(player, cherry) {
   collectSound.play()
   cherry.disableBody(true, true)
   score += 10
   this.text.setText('score: ' + score)

  if(score === 350) {
    generateCherries()
    const bombLoop = this.time.addEvent({
             delay: 900,   
             callback: bombGen,
             loop: true
          })

   } else if (score === 400) {
     generateCherries()
   }
 

   if(score === 450) {
     clearCourse.play()
     this.add.text(310, 200, 'Game Clear!', {fontSize: '27px'})
     this.physics.pause()
     player.anims.stop('flying')
     gameover = true
    
     setTimeout(() => {
         this.scene.stop();
         this.scene.start("EndScene");
     }, 3000)

   }

  }


  function bombGen() {
     let bom = burningbombs.create(Phaser.Math.Between(5, config.width -5), -5, 'bom')
     bom.anims.play('burning')
     sec = [1000, 1500, 2000, 2200]
    
    setTimeout(() => {
         bom.anims.play('exp')
         setTimeout(() => {
           bom.destroy()
         }, 500)
        
       }, sec[Math.floor(Math.random() * 4)])

    
  }



 

  function hitbyBomb(player, bomb) {
    strike++;
    dieSound.play()
    this.physics.pause()
    bomb.destroy()
    player.anims.stop('flying')
    gameover = true
  
    if(strike == 1) {
      score = 300;
      heartOne.destroy();
      heartOne = this.add.image(240, 30, 'emptyHeart').setScale(0.04);
  
      setTimeout(() => {
        this.scene.restart()
        this.physics.resume()
        gameover = false
        player.anims.play('flying')
  
    }, 3000)
  
    } else if(strike == 2) {
      score = 300;
      heartTwo.destroy();
      heartTwo = this.add.image(210, 30, 'emptyHeart').setScale(0.04);
      setTimeout(() => {
     
        this.scene.restart()
        this.physics.resume()
        gameover = false
        player.anims.play('flying')
    }, 3000)
  
    }
    else if(strike == 3) {
      heartThree.destroy();
      heartThree = this.add.image(180, 30, 'emptyHeart').setScale(0.04);
      this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})
  
      setTimeout(() => {
        this.scene.stop()
        this.scene.start('StartScene')
        score = 0
        strike = 0
        this.physics.resume()
        gameover = false
        player.anims.play('flying')
    }, 3000)
 
  }
  }
  


 class EndScene extends Phaser.Scene {
    constructor() {
      super('EndScene')
    }

    preload() {
      this.load.image('sky', './assets/sky.png')
      this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
    }

    create() {
      this.add.image(0, 0, 'sky').setOrigin(0,0)
      this.add.text(220, 200, 'Thank you for playing!', {fontSize: '27px'})
      
  

      this.anims.create({
        key: 'flax',
        frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
        frameRate: 10,
        repeat: -1,
      })

      player = this.add.sprite(-8, 100, 'bird', 'flying001').setScale(0.09)
      player.anims.play('flax')

      this.bird = this.add.sprite(840, 440, 'bird', 'flying001').setScale(0.09)
      this.bird.anims.play('flax')
      

    }

    update() {
    player.x += 3

    setTimeout(() => {
        this.bird.flipX = true
        this.bird.x -= 3
 
    }, 5000) 
    }
 }
    



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x:0, y:200 },
      }
    },
    scene: [StartScene, PlayScene, LevelTwo, LevelThree, EndScene],
  };
  
  const game = new Phaser.Game(config);

  