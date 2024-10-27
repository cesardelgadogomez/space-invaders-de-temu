let canvas = document.querySelector("#gameCanvas");
let animationId;
let ctx = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let enemigos = [];
let balas = [];
let score = 1000;
let musicaFondo = new Audio("assets/musica.mp3");
let gameOver = false;
let velocidadEnemigos = 2;  // Velocidad inicial de los enemigos
let intervaloGeneracion = 1000;  // Intervalo inicial de generación de enemigos en milisegundos
let intervaloId;  // Variable para almacenar el ID del intervalo

document.addEventListener("click", () => {
  if (!gameOver && musicaFondo.paused) {
    musicaFondo.play();
  }
});

// Este es el que pinta el lienzo.
let render = function(){
  if (gameOver) {
    // Si el juego está terminado, mostramos el mensaje de Game Over.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 24px verdana, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", 200, 50);
    return;  // Salimos de la función render para que no dibuje nada más.
  }

  let fondo = new Image();
  fondo.src = "assets/fondo.png";
  fondo.onload = () => {
    ctx.drawImage(fondo, 0, 0, 546, 700);
  };

  let nave = new Image();
  nave.src = "assets/nave.png";
  nave.onload = () => {
    ctx.drawImage(nave, mouseX, mouseY, 50, 50);
  };

  for (let e = 0; e < enemigos.length; e++) {
    let enemy = new Image();
    enemy.src = "assets/enemigos.png";
    ctx.drawImage(enemy, enemigos[e].x, enemigos[e].y += velocidadEnemigos, 50, 50);

    if (enemigos[e].y >= 650) {
      score -= 100;
      enemigos.splice(e, 1);
    }
  }

  for (let n = 0; n < balas.length; n++) {
    let bala = new Image();
    bala.src = "assets/bullet.png";
    ctx.drawImage(bala, balas[n].x, balas[n].y -= 12, 50, 50);

    if (balas[n].y <= 20) {
      balas.splice(n, 1);
    }

    let indice = enemigos.findIndex((objeto) => {
      return balas[n] != undefined && (objeto.x + 25) >= balas[n].x && (objeto.x - 25) <= balas[n].x
                                  && (objeto.y + 25) >= balas[n].y && (objeto.y - 25) <= balas[n].y;
    });

    if (indice >= 0) {
      enemigos.splice(indice, 1);
      balas.splice(n, 1);
      score += 100;

      // Aumentamos la velocidad y el intervalo de generación si el puntaje es múltiplo de 2000.
      if (score % 2000 === 0) {
        velocidadEnemigos += 1;  // Incrementa la velocidad.
        if (intervaloGeneracion > 200) {  // No permitir que el intervalo de generación sea demasiado bajo.
          intervaloGeneracion -= 200;  // Disminuye el intervalo de generación.
          clearInterval(intervaloId);  // Limpia el intervalo anterior.
          intervaloId = setInterval(generarEnemigos, intervaloGeneracion);  // Establece el nuevo intervalo.
        }
      }

      let enemigoEliminado = new Audio("assets/colision.mp3");
      enemigoEliminado.play();
    }
  }

  // Mostramos el puntaje.
  ctx.font = "bold 24px verdana, sans-serif";
  ctx.fillStyle = "white";
  var welcomeMessage = "Score!: " + score;
  ctx.fillText(welcomeMessage, 200, 50);

  // Verificamos si el puntaje es cero o menor y marcamos el fin del juego.
  if (score <= 0) {
    gameOver = true;
    musicaFondo.pause();  // Detenemos la música.
    musicaFondo.currentTime = 0;  // Reiniciamos el tiempo de la música.
    cancelAnimationFrame(animationId);  // Detenemos el bucle de animación.
    clearInterval(intervaloId);  // Limpiamos el intervalo de generación de enemigos.
  }
}

// Función para generar enemigos.
let generarEnemigos = function() {
  if (!gameOver) {
    enemigos.push({x: Math.floor(Math.random() * (546 - 50) + 25), y: 0});
  }
}

// Este es el que refresca con los FPS.
let gameLoop = function(){
  render();
  if (!gameOver) {  // Solo continuamos si el juego no está terminado.
    animationId = requestAnimationFrame(() => gameLoop());
  }
}

// Inicializamos la generación de enemigos.
let tareaProgramada = function() {
  intervaloId = setInterval(generarEnemigos, intervaloGeneracion);
}

let disparo = function() {
  if (!gameOver) {  // Solo permitimos disparar si el juego no está terminado.
    let efectoDisparo = new Audio("assets/disparo.mp3");
    efectoDisparo.play();
    balas.push({x: mouseX, y: mouseY});
  }
}

let detectMouse = function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

gameLoop();
tareaProgramada();
