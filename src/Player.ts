export interface PlayerKeys {
  left: string,
  right: string,
  up: string,
  down: string,
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

const PLAYER_WIDTH = 25;
const PLAYER_HEIGHT = 50;
const cos45 = 0.7071067;


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

  static GetRandomPlayerDirection() {
    return Math.floor(Math.random() * 8);
  }

  constructor(human: boolean, playerKeys: PlayerKeys | null, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.human = human;
    this.playerKeys = playerKeys;
    this.playerDirection = Player.GetRandomPlayerDirection();
    this.canvas = canvas;
    this.ctx = ctx;
    this.botStarted = false;
    this.isMoving = false;
    this.playerColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

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

  drawSword() {
    let swordLength = 12;
    let angleSwordLength = 12 * cos45;
    let swordWidth = 3;
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.lineWidth = swordWidth;
    if(this.playerDirection == PlayerDirection.TOP) {
      this.ctx.moveTo(this.playerPosition.x + (PLAYER_WIDTH/2), this.playerPosition.y);
      this.ctx.lineTo(this.playerPosition.x + (PLAYER_WIDTH/2), this.playerPosition.y - swordLength);
    } else if(this.playerDirection == PlayerDirection.DOWN) {
      this.ctx.moveTo(this.playerPosition.x + (PLAYER_WIDTH/2), this.playerPosition.y + PLAYER_HEIGHT);
      this.ctx.lineTo(this.playerPosition.x + (PLAYER_WIDTH/2), this.playerPosition.y + PLAYER_HEIGHT + swordLength);
    } else if(this.playerDirection == PlayerDirection.LEFT) {
      this.ctx.moveTo(this.playerPosition.x, this.playerPosition.y + PLAYER_HEIGHT/2);
      this.ctx.lineTo(this.playerPosition.x - swordLength, this.playerPosition.y + PLAYER_HEIGHT/2);
    } else if(this.playerDirection == PlayerDirection.RIGHT) {
      this.ctx.moveTo(this.playerPosition.x + PLAYER_WIDTH, this.playerPosition.y + PLAYER_HEIGHT/2);
      this.ctx.lineTo(this.playerPosition.x + PLAYER_WIDTH +  swordLength, this.playerPosition.y + PLAYER_HEIGHT/2);
    } else if(this.playerDirection == PlayerDirection.TOP_LEFT) {
      this.ctx.moveTo(this.playerPosition.x, this.playerPosition.y);
      this.ctx.lineTo(this.playerPosition.x - angleSwordLength, this.playerPosition.y - angleSwordLength);
    } else if(this.playerDirection == PlayerDirection.TOP_RIGHT) {
      this.ctx.moveTo(this.playerPosition.x + PLAYER_WIDTH, this.playerPosition.y);
      this.ctx.lineTo(this.playerPosition.x + PLAYER_WIDTH + angleSwordLength, this.playerPosition.y - angleSwordLength);
    } else if(this.playerDirection == PlayerDirection.DOWN_LEFT) {
      this.ctx.moveTo(this.playerPosition.x, this.playerPosition.y + PLAYER_HEIGHT);
      this.ctx.lineTo(this.playerPosition.x - angleSwordLength, this.playerPosition.y + PLAYER_HEIGHT + angleSwordLength);
    } else if(this.playerDirection == PlayerDirection.DOWN_RIGHT) {
      this.ctx.moveTo(this.playerPosition.x + PLAYER_WIDTH, this.playerPosition.y + PLAYER_HEIGHT);
      this.ctx.lineTo(this.playerPosition.x + PLAYER_WIDTH + angleSwordLength, this.playerPosition.y + PLAYER_HEIGHT + angleSwordLength);
    }
    this.ctx.stroke();
    
    // TOP:
    // this.ctx.fillRect(this.playerPosition.x + (PLAYER_WIDTH/2), this.playerPosition.y - swordLength, swordWidth, swordLength );
  }

  draw() {
    this.ctx.fillStyle = this.playerColor;
    this.ctx.fillRect(this.playerPosition.x, this.playerPosition.y, 25, 50);
    this.drawSword();
  }

  update(timeDifference: number, currentKeys: string[]) {
    if(this.human) {
      this.updateDirection(currentKeys);
      this.updatePosition(timeDifference);
      
    } else {
      // console.log("I AM BOT", this.botStarted);
      // this.botStarted = true;
      if(this.botStarted == false) {
        this.botStarted = true;
        this.updateBot();
        setTimeout(() => {
          // console.log("Setting", this.isMoving, this.playerDirection);
          this.botStarted = false;
        }, (Math.random() * 5000) + 100);
      }
      
      this.updatePosition(timeDifference);
      
    }
    this.draw();
  }

}