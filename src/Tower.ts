import { PlayerPosition } from "./Player";

const TowerSprite = require('./assets/crateMetal.png');
const towerImage = document.createElement('img');
towerImage.src = TowerSprite;

export const TOWER_WIDTH = 50;
export const TOWER_HEIGHT = 50;

export class Tower {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  position: PlayerPosition;
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, position: PlayerPosition) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.position = position;
  }

  draw() {
    this.ctx.drawImage(towerImage, this.position.x, this.position.y, TOWER_WIDTH, TOWER_HEIGHT);
  }
}