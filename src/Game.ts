import { Player, PLAYER_WIDTH, PLAYER_HEIGHT } from './Player';
import { Tower, TOWER_WIDTH, TOWER_HEIGHT } from './Tower';
import { woosh } from './woosh';
const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private previousTime: number;
  private currentlyPressedKeys: string[];
  private players: Player[];
  private towers: Tower[];
  timeLeft: number;
  gameDuration: number;
  numberOfBots: number;
  isActive: boolean;
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, numberOfBots: number) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.previousTime = null;
    this.currentlyPressedKeys = [];
    this.players = [];
    this.towers = [];
    this.numberOfBots = numberOfBots;
    this.gameDuration = 2 * 60 * 1000;
    this.timeLeft = this.gameDuration;
    this.isActive = true;

    // Middle
    this.addTower(new Tower(this.canvas, this.ctx, {x: this.canvas.width/2, y: this.canvas.height/2}));
    // Top Left
    this.addTower(new Tower(this.canvas, this.ctx, {x: this.canvas.width/6, y: this.canvas.height/6}));
    // Top Right
    this.addTower(new Tower(this.canvas, this.ctx, {x: this.canvas.width*(1 - 1/6), y: this.canvas.height/6}));
    // Bottom Left
    this.addTower(new Tower(this.canvas, this.ctx, {x: this.canvas.width*(1/6), y: this.canvas.height*(1-1/6)}));
    // Bottom Right
    this.addTower(new Tower(this.canvas, this.ctx, {x: this.canvas.width*(1 - 1/6), y: this.canvas.height*(1-1/6)}));


    for(let i = 0; i < this.numberOfBots; i++) {
      this.addPlayer(new Player(false, "BOT", null, this.canvas, this.ctx));
    }

    window.onkeydown = (event: KeyboardEvent) => {
      // console.log(event.key);
      if(this.currentlyPressedKeys.indexOf(event.key) < 0) {
        this.currentlyPressedKeys.push(event.key);
      }
      if(event.key == 'Enter') {
        this.beep();
      }
    }

    window.onkeyup = (event: KeyboardEvent) => {
      this.currentlyPressedKeys.splice(this.currentlyPressedKeys.indexOf(event.key), 1);
    }
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  addTower(tower: Tower) {
    this.towers.push(tower);
  }

  start() {
    window.requestAnimationFrame(this.drawCurrentGameState.bind(this));
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCurrentGameState(time: number) {
    if(!this.previousTime) {
      this.previousTime = 0;
    }
    let difference = time - this.previousTime;
    if(difference < 1000/30) {
      // console.log("Skipping");
      window.requestAnimationFrame(this.drawCurrentGameState.bind(this));
      return;
    }
    this.previousTime = time;
    if(!this.isActive) {
      return;
    }
    this.clearCanvas();
    this.towers.forEach((tower: Tower) => {
      tower.draw();
    });
    this.players.forEach((player: Player, index: number) => {
      player.update(difference, this.currentlyPressedKeys, () => {
        woosh.play();
        this.checkAttack(player);
      });
      if(player.human) {
        this.checkOverlap(player);
      }
    });
    this.timeLeft = this.gameDuration  - time;
    if(this.timeLeft < 0) {
      this.timeLeft = 0;
      if(this.isActive) {
        let winningPlayer;
        let humans = this.players.filter((player: Player) => {return player.human});
        humans.sort((a, b) => {
          return b.score - a.score;
        });
        if(humans[0].score != 0 && humans[0].score > humans[1].score) {
          winningPlayer = humans[0];
        }
        this.printWinner(winningPlayer)
        
      }
      this.isActive = false;
    }
    this.printScores();

    window.requestAnimationFrame(this.drawCurrentGameState.bind(this));
  }

  printScores() {
    let spacer = 200;
    let index = 0;
    this.ctx.font = "20px Arial";
    this.players.forEach((player: Player) => {
      if(player.human) {
        this.ctx.fillStyle = player.isAlive ? 'green' : 'black';
        this.ctx.fillText(player.name + ": " + player.score , (spacer * index) + 25, this.canvas.height - 10);
        index++;
      }
    });
    this.ctx.fillStyle = 'blue';
    let displayScore = (Math.round(this.timeLeft / 100)/10).toString();
  
    if(!displayScore.includes('.')) {
      displayScore = displayScore + '.0';
    }
    this.ctx.fillText(displayScore.toString() , 10, 30);
  }

  printWinner(player: Player|null) {
    this.ctx.font = "36px Arial";
    this.ctx.fillText(player ? (player.name + " is the winner!") : 'It is a tie', this.canvas.width/3, this.canvas.height/2);
  }

  checkAttack(player: Player) {
    this.players.filter((tempPlayer) => {
      return player.name != tempPlayer.name;
    }).forEach((otherPlayer: Player) => {
      if(player.playerPosition.x >= otherPlayer.playerPosition.x - PLAYER_WIDTH 
        && player.playerPosition.x <= otherPlayer.playerPosition.x + PLAYER_WIDTH
        && player.playerPosition.y >= otherPlayer.playerPosition.y - PLAYER_HEIGHT
        && player.playerPosition.y <= otherPlayer.playerPosition.y + PLAYER_HEIGHT
      ) {
        otherPlayer.kill();
        let alivePlayers = 0;
        this.players.forEach((checkPlayer: Player) => {
          if(checkPlayer.human && checkPlayer.isAlive) {
            alivePlayers++;
          }
        });
        if(alivePlayers == 1) {
          console.log(player.name + " is the winner!");
          this.isActive = false;
          this.printWinner(player);
        }
      }
    });
  }

  checkOverlap(player: Player) {
    this.towers.forEach((tower: Tower, index: number) => {
      if(player.previousTower == index) {
        return;
      }
      if(player.playerPosition.x >= tower.position.x - PLAYER_WIDTH 
        && player.playerPosition.x <= tower.position.x + TOWER_WIDTH
        && player.playerPosition.y >= tower.position.y - PLAYER_HEIGHT
        && player.playerPosition.y <= tower.position.y + TOWER_HEIGHT
      ) {
        player.previousTower = index;
        player.addPoints(1);
        setTimeout(() => {
          this.beep();
        }, 100);
      }
    })
    
  }

  beep() {
    snd.play();
  }
}