let canvas = document.querySelector("#gameCanvas");
let animationId;
let ctx = canvas.getContext("2d")
let mouseX = 0;
let mouseY = 0;
let enemigos = [];
let balas = [];
let score = 1000;
let musicaFondo = new Audio("assets/musica.mp3")


document.addEventListener("click", () => {
  musicaFondo.play()
})

//Este es el que pinta el lienzo.
let render = function(){
  let fondo = new Image();
  fondo.src = "assets/fondo.png";
  fondo.onload = () => {
    ctx.drawImage(fondo,0,0,546,700)
  };

  let nave = new Image();
  nave.src = "assets/nave.png";
  nave.onload = () => {
    ctx.drawImage(nave,mouseX,mouseY,50,50)
  };

  for (let e = 0; e < enemigos.length; e++) {
    let enemy = new Image();
    enemy.src = "assets/enemigos.png";
    ctx.drawImage(enemy,enemigos[e].x,enemigos[e].y += 2,50,50)

    if(enemigos[e].y >= 650) {
      score -= 100;
      enemigos.splice(e,1)
    }
    
  }

  for (let n = 0; n < balas.length; n++) {
    let bala = new Image();
    bala.src = "assets/bullet.png";
    ctx.drawImage(bala,balas[n].x,balas[n].y -= 12,50,50)

    if(balas[n].y <= 20) {
      balas.splice(n,1)
    }

    let indice = enemigos.findIndex((objeto) => {
      return balas[n] != undefined && (objeto.x + 25) >= balas[n].x && (objeto.x - 25) <= balas[n].x
                                  && (objeto.y +25) >= balas[n].y && (objeto.y - 25) <= balas[n].y;

    })

    if(indice >= 0){
      enemigos.splice(indice, 1);
      balas.splice(n, 1);
      score += 100;

      let enemigoEliminado = new Audio("assets/colision.mp3")
      enemigoEliminado.play()
    }
  }


  if(score <= 0) {
    ctx.font = "bold 24px verdana, sans-serif";
    ctx.fillStyle="white";
    var welcomeMessage ="GAME OVER";
    ctx.fillText(welcomeMessage, 200, 50);


  } else {
    ctx.font = "bold 24px verdana, sans-serif";
    ctx.fillStyle="white";
    var welcomeMessage ="Score!: " + score;
    ctx.fillText(welcomeMessage, 200, 50);
  }
}


//Este es el que refresca con los FPS.
let gameLoop = function(){
  render();
  animationId = requestAnimationFrame(() => gameLoop());
}

let tareaProgramada = function() {
  setInterval(() => {
    enemigos.push({x:Math.floor(Math.random() *(546-50) + 25), y:0})
  }, 1000);
}

let disparo = function() {

  let efectoDisparo = new Audio("assets/disparo.mp3")
  efectoDisparo.play()

  balas.push({x:mouseX, y:mouseY})
}


let detectMouse = function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

gameLoop()
tareaProgramada()