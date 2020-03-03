console.log("dzialam");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var pong = {};

class Hero {
    constructor(positionX, positionY, size) {
            this.positionX = positionX,
            this.positionY = positionY,
            this.size = size
       }

       rysuj () {
        ctx.beginPath();
        ctx.moveTo(this.positionX, this.positionY);
        ctx.lineTo(this.positionX + this.size, this.positionY);
        ctx.lineTo(this.positionX + this.size, this.positionY + this.size);
        ctx.lineTo(this.positionX, this.positionY + this.size);
        ctx.closePath();
        ctx.stroke();
    }

        jump() { 
            this.positionY -=10;  
        }
}

class Plansza { 
    constructor (positionY, width) { 
        this.positionY = positionY, 
        this.width = width,
        this.rysuj = function () {
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

    rysuj() {
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


function gameInit () { 
    pong.sciezka = new Plansza(300, canvas.width)
    pong.enemy = [];
    pong.enemy[0] = new Enemy(200, 270, 30, 10)
    pong.enemy[1] = new Enemy(400, 270, 30, 10)
    pong.gracze = [];
    pong.gracze[0] = new Hero(20,290,10);
}

gameInit();

document.addEventListener("keydown", function(e) { 
    console.log(e.keyCode);
    if(e.keyCode == 38) { 
        pong.gracze[0].jump();
    }
})

function rysuj() { 
    pong.sciezka.rysuj();
    pong.enemy.forEach(enemy => {
        enemy.rysuj();
        enemy.move(1);
    });
    pong.gracze[0].rysuj();
    collision();
}

function collision() { 
    const playerPositionX = pong.gracze[0].positionX+pong.gracze[0].size;
    const playerPositionY = pong.gracze[0].positionY+pong.gracze[0].size;
    
    pong.enemy.forEach(enemy => {
        if (enemy.positionX == playerPositionX && playerPositionX >= enemy.positionY)
            console.log("kolizja");
    });
}

const gameOn = function() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rysuj();
    requestAnimationFrame(gameOn);
}

requestAnimationFrame(gameOn);