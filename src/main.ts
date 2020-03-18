import {Game} from './Game';
import { Player } from './Player';

function loadGame() {
  console.log("Loading game");
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d', { alpha: false });
  const myGame = new Game(canvas, ctx, 80);
  myGame.addPlayer(new Player(true, "Player 1", {left: 'a', right: 'd', up: 'w', down: 's', attack: 'q'}, canvas, ctx));
  myGame.addPlayer(new Player(true, "Player 2", {left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', attack: '/'}, canvas, ctx));
  myGame.addPlayer(new Player(true, "Player 3", {left: 'h', right: 'k', up: 'u', down: 'j', attack: 'y'}, canvas, ctx));

  
  myGame.start();
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    console.log("The document has loaded");
    loadGame();
  }
};
