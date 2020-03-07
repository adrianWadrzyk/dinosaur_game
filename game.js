console.log("dzialam");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var pong = {};

class Hero {
    constructor(positionX, positionY, size) {
            this.positionX = positionX,
            this.positionY = positionY,
            this.size = size,
            this.jumping = false, 
            this.yVelocity = 0,
            this.xVelocity =0 
       }

       draw () {
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
    constructor (positionY, width) { 
        this.positionY = positionY, 
        this.width = width,
        this.draw = function () {
            ctx.beginPath();
            ctx.moveTo(0, positionY);
            ctx.lineTo(width, positionY);
            ctx.stroke();
        } 
    }
}

class Enemy { 
    constructor (positionX, positionY, height, width) { 
        this.positionX = positionX,
        this.positionY = positionY, 
        this.width = width,
        this.height = height
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.positionX, this.positionY);
        ctx.lineTo(this.positionX + this.width, this.positionY);
        ctx.lineTo(this.positionX + this.width, this.positionY + this.height);
        ctx.lineTo(this.positionX, this.positionY + this.height);
        ctx.closePath();
        ctx.stroke();
    };

    move(speed) { 
        this.positionX -=1*speed;
    }
}


    controller = { 
        left : false, 
        right: false, 
        up: false,
        keyListener: function(event) { 
        let key_state = (event.type == "keydown")?true:false;
            switch(event.keyCode) { 
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
        }
    }

    function gameInit () { 
        pong.board = new Board(300, canvas.width)
        pong.enemy = [];
        pong.enemy[0] = new Enemy(200, 270, 30, 10)
        pong.enemy[1] = new Enemy(400, 270, 30, 10)
        pong.hero = new Hero(20,290,10);
    }

    gameInit();

    document.addEventListener("keydown", controller.keyListener);
    document.addEventListener("keyup", controller.keyListener);


function draw() { 
    pong.board.draw();
    pong.enemy.forEach(enemy => {
        enemy.draw();
        enemy.move(1);
    });
    pong.hero.draw();
}

function checkEnemyPosition() { 
    pong.enemy.forEach(enemy => { 
        if(enemy.positionX+enemy.width < 0)
            {
                enemy.positionX = 250;
            }
        })
}

function collisions() { 
    const playerPositionX = Math.floor(pong.hero.positionX+pong.hero.size);
    const playerPositionY = pong.hero.positionY;
    
    pong.enemy.forEach(enemy => {
        let enemyPostionWidth = enemy.positionX + enemy.width;
        if (enemy.positionX <= playerPositionX && playerPositionX <= enemyPostionWidth && playerPositionY >= enemy.positionY ) 
        {
           console.log("kolizja");
        } 
    });


}

const gameOn = function() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(controller.up && pong.hero.jumping == false)  { 
        pong.hero.yVelocity -= 20;
        pong.hero.jumping = true;
        console.log(pong.hero.positionX)
    } 

    if(controller.left) { 
        pong.hero.xVelocity -= 0.5; 
    }

    
    if(controller.right) { 
        pong.hero.xVelocity += 0.5; 
    }
    

    pong.hero.yVelocity +=1.5;
    pong.hero.positionX += pong.hero.xVelocity;
    pong.hero.positionY += pong.hero.yVelocity;
    pong.hero.yVelocity *=0.9;
    pong.hero.xVelocity *=0.9;
    

    if(pong.hero.positionY > 290) { 
        pong.hero.jumping = false;
        pong.hero.positionY = 290;
        pong.hero.yVelocity = 0;
    }

    if( pong.hero.positionX <= 0)
            pong.hero.positionX = 0
     else if(pong.hero.positionX  >= canvas.width)
            pong.hero.positionX = canvas.width;

    draw();
    collisions();
    checkEnemyPosition();
    requestAnimationFrame(gameOn);
}

requestAnimationFrame(gameOn);