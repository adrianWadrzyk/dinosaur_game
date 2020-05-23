const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var time = 0;
var tmp_table = {};

class Hero {
  positionX = 20;
  positionY = 290;
  size = 10;
  jumping = false;
  yVelocity = 0;

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.positionX, this.positionY);
    ctx.lineTo(this.positionX + this.size, this.positionY);
    ctx.lineTo(this.positionX + this.size, this.positionY + this.size);
    ctx.lineTo(this.positionX, this.positionY + this.size);
    ctx.closePath();
    ctx.stroke();
  }
}

class Board {
  positionY = 300;
  width = canvas.width;

  draw() {
    ctx.beginPath();
    ctx.moveTo(0, this.positionY);
    ctx.lineTo(this.width, this.positionY);
    ctx.stroke();
  }
}

class Enemy {
  
  constructor(speed) { 
    this.speed = speed;
  }  

  positionX = canvas.width;
  positionY = 270;
  width = 10;
  height = 30;


  move() {
    this.positionX -= 1 * this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.positionX, this.positionY);
    ctx.lineTo(this.positionX + this.width, this.positionY);
    ctx.lineTo(this.positionX + this.width, this.positionY + this.height);
    ctx.lineTo(this.positionX, this.positionY + this.height);
    ctx.closePath();
    ctx.stroke();
  }
}

controller = {
  left: false,
  right: false,
  up: false,
  keyListener: function (event) {
    let key_state = event.type == "keydown" ? true : false;
    switch (event.keyCode) {
      case 37:
        controller.left = key_state;
        break;
      case 38:
        controller.up = key_state;
        break;
      case 39:
        controller.right = key_state;
        break;
    }
  },
};

function gameInit() {
  tmp_table.board = new Board();
  tmp_table.enemy = [];
  tmp_table.enemy[0] = new Enemy(2);
  tmp_table.hero = new Hero();
}

gameInit();

document.addEventListener("keydown", controller.keyListener);
document.addEventListener("keyup", controller.keyListener);

function draw() {
  if(tmp_table.enemy.length == 1)
   if(Math.random(1) < 0.005){ 
      tmp_table.enemy.push(new Enemy(tmp_table.enemy[0].speed)); 
    } 

  tmp_table.board.draw();
  tmp_table.enemy.forEach((enemy) => {
    enemy.draw();
    enemy.move();
    console.log(enemy.speed);
  });
  tmp_table.hero.draw();
}

function checkEnemyPosition() {
   let length = tmp_table.enemy.length;
   tmp_table.enemy.forEach((enemy) => {
    if (enemy.positionX + enemy.width < 0) 
    {
      if(length > 1){
          let index = tmp_table.enemy.indexOf(enemy);
          tmp_table.enemy.splice(index,1);
        } 
      enemy.positionX = canvas.width + enemy.width;
    }
  });
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  x2 = Math.round(x2);
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

function collisions(requestID) {
  const hero = {
    x: tmp_table.hero.positionX,
    y: tmp_table.hero.positionY,
    height: tmp_table.hero.size,
    width: tmp_table.hero.size,
  };

  tmp_table.enemy.forEach((enemy) => {
    {
      if ( rectIntersect (
          hero.x,
          hero.y,
          hero.width,
          hero.height,
          enemy.positionX,
          enemy.positionY,
          enemy.width,
          enemy.height
        )
      ) {
        cancelAnimationFrame(requestID);
        gameOver();
      }
    }
  });
}

function gameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "25px Arial black ";
  ctx.textAlign = "center"
  ctx.fillText("Przegrałeś!",250,200);  
}

const gameOn = function () {
  time++;
  let point = time / 10;

  if (point % 50 == 0) {
    tmp_table.enemy.forEach((enemy) => {
      enemy.speed += 0.1;
    });
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (controller.up && tmp_table.hero.jumping == false) {
    tmp_table.hero.yVelocity -= 25 * 0.5;
    tmp_table.hero.jumping = true;
  }

  tmp_table.hero.yVelocity += 0.8;
  tmp_table.hero.positionY += tmp_table.hero.yVelocity;

  if (tmp_table.hero.positionY > 290) {
    tmp_table.hero.jumping = false;
    tmp_table.hero.positionY = 290;
    tmp_table.hero.yVelocity = 0;
  }

  ctx.font = "15px Arial black ";
  ctx.fillText("Liczba punktów: " + Math.floor(point, 1), 30, 50);

  let requestID = requestAnimationFrame(gameOn);
  draw();
  collisions(requestID);
  checkEnemyPosition();
};

requestAnimationFrame(gameOn);
