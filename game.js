console.log("dzialam");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var pong = {};



// rysuj sciezke


class Hero {
    constructor(positionX, positionY, size) {
        this.positionX = positionX,
            this.positionY = positionY,
            this.size = size,
            this.rysuj = function () {
                ctx.beginPath();
                ctx.moveTo(positionX, positionY);
                ctx.lineTo(positionX + size, positionY);
                ctx.lineTo(positionX + size, positionY + size);
                ctx.lineTo(positionX, positionY + size);
                ctx.closePath();
                ctx.stroke();
            },
            this.jump = function () { 
                positionY = positionY -10;  
            };
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


function gameInit () { 
    pong.sciezka = new Plansza(300, canvas.width)
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
    pong.gracze[0].rysuj();
}


const draw = function() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rysuj();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);