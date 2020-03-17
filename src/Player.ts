export interface PlayerKeys {
  left: string,
  right: string,
  up: string,
  down: string,
  attack: string
}

export enum PlayerDirection {
  TOP = 0,
  TOP_RIGHT,
  RIGHT,
  DOWN_RIGHT,
  DOWN,
  DOWN_LEFT,
  LEFT,
  TOP_LEFT
}

export interface PlayerPosition {
  x: number,
  y: number
}

export const PLAYER_WIDTH = 35;
export const PLAYER_HEIGHT = 2 * PLAYER_WIDTH;
const cos45 = 0.7071067;
const player = require('./assets/character_malePerson_walk0.png');
const playerAttack = require('./assets/character_malePerson_attack0.png');
let playerImage = document.createElement('img');
playerImage.src = player;
let playerAttackImage = document.createElement('img');
playerAttackImage.src = playerAttack;

const CHARACTER_ARRAY = ['femaleAdventurer', 'femalePerson', 'maleAdventurer', 'malePerson', 'robot', 'zombie'];
const NUMBER_OF_WALKS = 8;
const NUMBER_OF_ATTACKS = 3;
const CHARACTER_IMAGES = {};
CHARACTER_ARRAY.forEach((character: string) => {
  const walks = [];
  const attacks = [];
  for(let i = 0; i < NUMBER_OF_WALKS; i++) {
    let image = document.createElement('img');
    image.src = require(`./assets/character_${character}_walk${i}.png`);
    walks.push(image);
  }
  let idleImage = document.createElement('img');
  idleImage.src = require(`./assets/character_${character}_idle.png`);

  for(let i = 0; i < NUMBER_OF_ATTACKS; i++) {
    let attackImage = document.createElement('img');
    attackImage.src = require(`./assets/character_${character}_attack${i}.png`);
    attacks.push(attackImage);
  }

  let hurtImage = document.createElement('img');
  hurtImage.src = require(`./assets/character_${character}_hurt.png`);  
  CHARACTER_IMAGES[character] = {walks: walks, idle: idleImage, attacks: attacks, hurt: hurtImage};
});

const KEYFRAME_DURATION = 80;

export class Player {
  playerKeys: PlayerKeys;
  playerPosition: PlayerPosition;
  playerDirection: PlayerDirection;
  human: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isMoving: boolean;
  playerColor: string;
  botStarted: boolean;
  previousTower: number;
  score: number;
  name: string;
  isAttacking: boolean;
  isAlive: boolean;
  character: string;
  characterImage: HTMLImageElement;
  private walkKeyFrameIndex;
  private attackKeyFrameIndex;
  private lastKeyFrameTimeStamp;

  static GetRandomPlayerDirection() {
    return Math.floor(Math.random() * 8);
  }

  constructor(human: boolean, name: string, playerKeys: PlayerKeys | null, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.human = human;
    this.playerKeys = playerKeys;
    this.playerDirection = Player.GetRandomPlayerDirection();
    this.canvas = canvas;
    this.ctx = ctx;
    this.botStarted = false;
    this.isMoving = false;
    this.playerColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    this.previousTower = null;
    this.score = 0;
    this.name = name;
    this.isAttacking = false;
    this.isAlive = true;
    
    this.character = CHARACTER_ARRAY[Math.floor(Math.random() * CHARACTER_ARRAY.length)];
    this.walkKeyFrameIndex = 0;
    this.attackKeyFrameIndex = 0;
    this.lastKeyFrameTimeStamp = Date.now();
    

    this.playerPosition = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height
    }
  }

  updateBot() {
    const edgePercentage = 0.2;
    this.isMoving = Math.random() > 0.1 ? true : false;
    if(this.isMoving == false) {
      return;
    }
    if(this.playerPosition.x < edgePercentage * this.canvas.width) {
      // console.log("at the LEFT edge");
      let randomDirection = Math.random();
      if(randomDirection < 0.333) {
        this.playerDirection = PlayerDirection.TOP_RIGHT;
      } else if(randomDirection < 0.666) {
        this.playerDirection = PlayerDirection.DOWN_RIGHT;
      } else {
        this.playerDirection = PlayerDirection.RIGHT;
      }
    } else if(this.playerPosition.y < edgePercentage * this.canvas.height) {
      // console.log("at the TOP edge");
      let randomDirection = Math.random();
      if(randomDirection < 0.333) {
        this.playerDirection = PlayerDirection.DOWN_RIGHT;
      } else if(randomDirection < 0.666) {
        this.playerDirection = PlayerDirection.DOWN_LEFT;
      } else {
        this.playerDirection = PlayerDirection.DOWN;
      }
    } else if(this.playerPosition.y > (1 - edgePercentage) * this.canvas.height) {
      // console.log("at the BOTTOM edge");
      let randomDirection = Math.random();
      if(randomDirection < 0.333) {
        this.playerDirection = PlayerDirection.TOP_LEFT;
      } else if(randomDirection < 0.666) {
        this.playerDirection = PlayerDirection.TOP_RIGHT;
      } else {
        this.playerDirection = PlayerDirection.TOP;
      }
    } else if(this.playerPosition.x > (1 - edgePercentage) * this.canvas.width) {
      // console.log("at the RIGHT edge");
      let randomDirection = Math.random();
      if(randomDirection < 0.333) {
        this.playerDirection = PlayerDirection.TOP_LEFT;
      } else if(randomDirection < 0.666) {
        this.playerDirection = PlayerDirection.DOWN_LEFT;
      } else {
        this.playerDirection = PlayerDirection.LEFT;
      }
    } else {
      this.playerDirection = Player.GetRandomPlayerDirection();
    }
  }

  updateDirection(currentKeys: string[]) {
    this.isMoving = true; // TODO: Fix
    if(currentKeys.indexOf(this.playerKeys.up) >= 0) {
      if(currentKeys.indexOf(this.playerKeys.left) >= 0) {
        this.playerDirection = PlayerDirection.TOP_LEFT;
      } else if(currentKeys.indexOf(this.playerKeys.right) >= 0) {
        this.playerDirection = PlayerDirection.TOP_RIGHT;
      } else {
        this.playerDirection = PlayerDirection.TOP;
      }
    } else if(currentKeys.indexOf(this.playerKeys.down) >= 0) {
      if(currentKeys.indexOf(this.playerKeys.left) >= 0) {
        this.playerDirection = PlayerDirection.DOWN_LEFT;
      } else if(currentKeys.indexOf(this.playerKeys.right) >= 0) {
        this.playerDirection = PlayerDirection.DOWN_RIGHT;
      } else {
        this.playerDirection = PlayerDirection.DOWN;
      }
    } else if(currentKeys.indexOf(this.playerKeys.left) >= 0) {
      this.playerDirection = PlayerDirection.LEFT;
    } else if(currentKeys.indexOf(this.playerKeys.right) >= 0) {
      this.playerDirection = PlayerDirection.RIGHT;
    } else {
      this.isMoving = false;
    }
  }

  updatePosition(timeDifference: number) {
    let speed = 100;
    if(this.isMoving) {
      if(this.playerDirection == PlayerDirection.TOP) {
        this.playerPosition.y = this.playerPosition.y - (speed * (timeDifference/1000));
      } else if(this.playerDirection == PlayerDirection.DOWN) {
        this.playerPosition.y = this.playerPosition.y + (speed * (timeDifference/1000));
      } else if(this.playerDirection == PlayerDirection.LEFT) {
        this.playerPosition.x = this.playerPosition.x - (speed * (timeDifference/1000));
      } else if(this.playerDirection == PlayerDirection.RIGHT) {
        this.playerPosition.x = this.playerPosition.x + (speed * (timeDifference/1000));
      } else if(this.playerDirection == PlayerDirection.TOP_LEFT) {
        this.playerPosition.x = this.playerPosition.x - (speed * (timeDifference/1000) * cos45);
        this.playerPosition.y = this.playerPosition.y - (speed * (timeDifference/1000) * cos45);
      } else if(this.playerDirection == PlayerDirection.TOP_RIGHT) {
        this.playerPosition.x = this.playerPosition.x + (speed * (timeDifference/1000) * cos45);
        this.playerPosition.y = this.playerPosition.y - (speed * (timeDifference/1000) * cos45);
      } else if(this.playerDirection == PlayerDirection.DOWN_LEFT) {
        this.playerPosition.x = this.playerPosition.x - (speed * (timeDifference/1000) * cos45);
        this.playerPosition.y = this.playerPosition.y + (speed * (timeDifference/1000) * cos45);
      } else if(this.playerDirection == PlayerDirection.DOWN_RIGHT) {
        this.playerPosition.x = this.playerPosition.x + (speed * (timeDifference/1000) * cos45);
        this.playerPosition.y = this.playerPosition.y + (speed * (timeDifference/1000) * cos45);
      }
      if(this.playerPosition.x < 0) {
        this.playerPosition.x = 0;
      }
      if(this.playerPosition.x > this.canvas.width - PLAYER_WIDTH) {
        this.playerPosition.x = this.canvas.width - PLAYER_WIDTH;
      }
      if(this.playerPosition.y > this.canvas.height - PLAYER_HEIGHT) {
        this.playerPosition.y = this.canvas.height - PLAYER_HEIGHT;
      }
      if(this.playerPosition.y < 0) {
        this.playerPosition.y = 0;
      }
    }
  }

  addPoints(points: number) {
    this.score = this.score + points;
  }


  getCurrentPlayerImage() {
    let now = Date.now();

    if(!this.isAlive) {
      return CHARACTER_IMAGES[this.character].hurt;
    }

    if(this.isAttacking) {
      if(now - this.lastKeyFrameTimeStamp > 300) {
        this.attackKeyFrameIndex++;
        this.lastKeyFrameTimeStamp = now;
      }
      if(this.attackKeyFrameIndex > NUMBER_OF_ATTACKS - 1) {
        this.attackKeyFrameIndex = 0;
      }
      return CHARACTER_IMAGES[this.character].attacks[this.attackKeyFrameIndex];
    }
    if(this.isMoving) {
      if(now - this.lastKeyFrameTimeStamp > KEYFRAME_DURATION) {
        this.walkKeyFrameIndex++;
        this.lastKeyFrameTimeStamp = now;
      }
      if(this.walkKeyFrameIndex > NUMBER_OF_WALKS - 1) {
        this.walkKeyFrameIndex = 0;
      }
      return CHARACTER_IMAGES[this.character].walks[this.walkKeyFrameIndex];
    }
    this.walkKeyFrameIndex = 0;
    this.attackKeyFrameIndex = 0;
    return CHARACTER_IMAGES[this.character].idle;
  }

  draw() {
    if(this.playerDirection == PlayerDirection.LEFT || this.playerDirection == PlayerDirection.DOWN_LEFT || this.playerDirection == PlayerDirection.TOP_LEFT) {
      this.ctx.save();
      this.ctx.scale(-1,1);
      this.ctx.drawImage(this.getCurrentPlayerImage(), -1 * this.playerPosition.x, this.playerPosition.y, -1 * PLAYER_WIDTH, PLAYER_HEIGHT);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(this.getCurrentPlayerImage(), this.playerPosition.x, this.playerPosition.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    }
    
  }

  kill() {
    this.isAlive = false;
    if(this.human == false) {
      setTimeout(() => {
        this.isAlive = true
      }, 3000);
    }
  }

  checkAttack(currentKeys: string[], attacked?: () => void) {
    // console.log(this.isAttacking);
    if(this.isAttacking == false) {
      if(currentKeys.indexOf(this.playerKeys.attack) >= 0) {
        this.isAttacking = true;
        if(attacked) {
          attacked();
        }

        setTimeout(() => {
          this.isAttacking = false;
        }, 500);
  
      }
    }
  }

  update(timeDifference: number, currentKeys: string[], attacked?: () => void) {
    if(this.isAlive == true) {
      if(this.human) {
        this.updateDirection(currentKeys);
        this.updatePosition(timeDifference);
        this.checkAttack(currentKeys, attacked);
        
      } else {
        if(this.botStarted == false) {
          this.botStarted = true;
          this.updateBot();
          setTimeout(() => {
            this.botStarted = false;
          }, (Math.random() * 5000) + 100);
        }
        
        this.updatePosition(timeDifference);
        
      }
    }
    
    this.draw();
  }

}