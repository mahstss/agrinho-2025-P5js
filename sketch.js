let personagem;
let campo, cidade;
let tempoRestante;
let recursosCampo = 0;
let recursosCidade = 0;
let missao = "Coletar alimentos no campo";
let pontuacao = 0;
let poluicao = 0;
let tempoLimite = 60; // 1 minuto
let cronometro;

function setup() {
  createCanvas(800, 600);
  personagem = new Personagem(100, 500);
  campo = new Area("campo", 100, 400, 250, 150);
  cidade = new Area("cidade", 500, 150, 250, 150);
  cronometro = millis();
}

function draw() {
  background(135, 206, 235); // Cor de fundo (céu)

  let tempoDecorrido = Math.floor((millis() - cronometro) / 1000);
  tempoRestante = tempoLimite - tempoDecorrido;

  // Mostrar o fundo, o céu, etc.
  drawBackground();

  // Mostrar as áreas (campo e cidade)
  campo.display();
  cidade.display();

  // Mostrar recursos e pontuação
  mostrarRecursos();

  // Mostrar tempo restante
  mostrarTempo();

  // Atualizar a tarefa ativa
  mostrarTarefa();

  // Exibir o personagem
  personagem.display();
  personagem.move();

  // Lógica de interação com as áreas
  verificarInteracao();

  // Verifica se o tempo acabou
  if (tempoRestante <= 0) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Tempo Acabou! Sua pontuação: " + pontuacao, width / 2, height / 2);
    noLoop(); // Pausa o jogo
  }
}

function mostrarTempo() {
  fill(255);
  textSize(24);
  textAlign(RIGHT, TOP);
  text("Tempo Restante: " + tempoRestante + "s", width - 20, 20);
}

function mostrarPoluicao() {
  let corPoluicao = color(0, 255 - poluicao * 2, 0); // A cor muda conforme o nível de poluição
  fill(corPoluicao);
  textSize(24);
  text("Poluição: " + poluicao + "%", 20, 100);
}

function mostrarTarefa() {
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Missão: " + missao, 20, 120);  // Distância maior para não sobrepor o texto de recursos
}

function mostrarRecursos() {
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Recursos no Campo: " + recursosCampo, 20, 40);
  text("Recursos na Cidade: " + recursosCidade, 20, 60);
  text("Pontuação: " + pontuacao, 20, 80);
}

function verificarInteracao() {
  if (dist(personagem.x, personagem.y, campo.x + campo.largura / 2, campo.y + campo.altura / 2) < 50) {
    // No campo: coletando recursos
    if (missao === "Coletar alimentos no campo" && recursosCampo < 10) {
      recursosCampo++;
      missao = "Levar alimentos para a cidade";
      pontuacao += 10;
      poluicao += 1; // A coleta no campo gera um pouco de poluição
    }
  }

  if (dist(personagem.x, personagem.y, cidade.x + cidade.largura / 2, cidade.y + cidade.altura / 2) < 50) {
    // Na cidade: entregando recursos
    if (missao === "Levar alimentos para a cidade" && recursosCampo > 0) {
      recursosCampo--;
      recursosCidade++;
      missao = "Coletar alimentos no campo";
      pontuacao += 20;
      poluicao += 2; // O transporte para a cidade gera poluição
    }
  }
}

class Personagem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidade = 3;
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, 30, 30); // Corpo do personagem
    fill(255);
    ellipse(this.x, this.y - 20, 20, 20); // Cabeça
    fill(0);
    ellipse(this.x, this.y - 25, 5, 5); // Olho do personagem
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidade;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.velocidade;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.velocidade;
    }
  }
}

class Area {
  constructor(tipo, x, y, largura, altura) {
    this.tipo = tipo;
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
  }

  display() {
    if (this.tipo === "campo") {
      fill(34, 139, 34); // Cor do campo (verde)
      rect(this.x, this.y, this.largura, this.altura, 10); // Cantos arredondados para suavizar
      fill(139, 69, 19); // Cor da terra (marrom)
      rect(this.x + 80, this.y + 20, 40, 40); // Representação de uma árvore
    } else if (this.tipo === "cidade") {
      fill(200, 200, 255); // Cor da cidade (azul claro)
      rect(this.x, this.y, this.largura, this.altura, 10); // Cantos arredondados para suavizar
      fill(100);
      rect(this.x + 50, this.y + 50, 20, 60); // Representação de um prédio
      fill(0);
      rect(this.x + 60, this.y + 100, 20, 10); // Representação de uma janela do prédio
    }
  }
}

function drawBackground() {
  // Fundo do céu
  fill(135, 206, 235); 
  noStroke();
  rect(0, 0, width, height);

  // Grama do campo
  fill(34, 139, 34);
  noStroke();
  rect(0, height - 100, width, 100); // Grama

  // Sol
  fill(255, 204, 0);
  ellipse(100, 100, 100, 100);
}

function keyPressed() {
  if (key === ' ') {
    // Reseta o jogo quando pressionado espaço
    tempoRestante = tempoLimite;
    recursosCampo = 0;
    recursosCidade = 0;
    poluicao = 0;
    pontuacao = 0;
    missao = "Coletar alimentos no campo";
    cronometro = millis();
    loop();
  }
}
