/*La variable sprites contiene información de los sprites en formato JSON
sx y sy indica en que pixel de la imagen comienza el sprite y w y h son los píxeles que ocupa el sprite de ancho y
de alto respectivamente, frames indica cuantos frames tiene el sprite.
*/

var sprites = {
 bartender: { sx: 511, sy: 0, w: 57, h: 66, frames: 1 },
 client: { sx: 511, sy: 66, w: 34, h: 32, frames: 1 },
 beer_full: { sx: 511, sy: 99, w: 23, h: 32, frames: 1 },
 beer_empty: { sx: 511, sy: 131, w: 23, h: 32, frames: 1 },
 background: { sx: 0, sy: 480, w: 511, h: 480, frames: 1 },
 foreground: { sx: 0, sy: 0, w: 511, h: 480, frames: 1 },
 three_lives: { sx: 429, sy: 171, w: 131, h: 35, frames: 1 },
 two_lives: { sx: 472, sy: 207, w: 85, h: 34, frames: 1 },
 one_lives: { sx: 515, sy: 242, w: 44, h: 34, frames: 1 },
 whitout_lives: { sx: 516, sy: 285, w: 0, h: 0, frames: 1 }
};
/*Enemies es una variable que guarda en que pixeles se tiene que pintar los clientes en las distintas barras */
var enemies = {
  client_0:   { x: 125,   y: 80},
  client_1:   { x: 95,   y: 176},
  client_2:   { x: 62,   y: 272},
  client_3:   { x: 30,   y: 368}
};
/*Son las variables de los distintos tipos que tienen los objetos*/
var OBJECT_BARTENDER = 1,
    OBJECT_BEER_FULL = 2,
    OBJECT_CLIENT = 4,
    OBJECT_BEER_EMPTY = 8,
    OBJECT_DEADZONE = 16,
    NUM_VELOCIDADES = 3,
    VELOCIDAD_BEER_FULL = -100;
/*startGame es una función que se llama para iniciar el juego.
En ella se crean todos los GameBoard menos el de Player y se añaden al GameManager.
Todas los GameBoard menos la pantalla de Start no se activan, pues al comenzar el juego la única pantalla que se debe ver es la de Start.
Se colocan todas las pantallas en distitas capas.*/
var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();
  //El false indica que el board no esta activado
  var boardLayerBackground = new GameBoard(false);
  boardLayerBackground.add(new Background());

  Game.setBoard(3,boardLayerBackground);

  var boardLayerWin = new GameBoard(false);
  boardLayerWin.add(new TitleScreen("You win!",
                                  "Press serve to play again",
                                  playGame));
  Game.setBoard(0,boardLayerWin);

  var boardLayerLose = new GameBoard(false);
  boardLayerLose.add(new TitleScreen("You lose!",
                                  "Press serve to play again",
                                  playGame));
  Game.setBoard(1,boardLayerLose);

  var boardLayerStart = new GameBoard(true);
  boardLayerStart.add(new TitleScreen("TAPPER-SD",
                                  "Please play (press space bar)",
                                  playGame));
  Game.setBoard(2,boardLayerStart);
  //Se añaden todos los GameBoard al GameManager
  GameManager.addBoard(0,boardLayerWin);
  GameManager.addBoard(1,boardLayerLose);
  GameManager.addBoard(2,boardLayerStart);
  GameManager.addBoard(3,boardLayerBackground);
};

/*
playGame es una función la cual se llama cuando comenzamos a jugar una partida.
Creamos el GameBoard de Player con todos sus elementos, activada y lo añadimos al GameManager.
Desactivamos todas las pantallas de mensaje(boardLayerStart, boardLayerWin,boardLayerLose) y activamos tanto la de fondo(boardLayerBackground)
como la del Player.
*/

var playGame = function() {
	//Reinicializamos de nuevo todas la variables de control del juego de GameManager
  GameManager.reset();
  var boardLayerPlayer = new GameBoard(true);
  boardLayerPlayer.add(new Player());
  boardLayerPlayer.add(new DeadZone(124,64,OBJECT_BEER_FULL));
  boardLayerPlayer.add(new DeadZone(95,162,OBJECT_BEER_FULL));
  boardLayerPlayer.add(new DeadZone(62,256,OBJECT_BEER_FULL));
  boardLayerPlayer.add(new DeadZone(30,353,OBJECT_BEER_FULL));
  boardLayerPlayer.add(new DeadZone(325,64,OBJECT_CLIENT));
  boardLayerPlayer.add(new DeadZone(360,177,OBJECT_CLIENT));
  boardLayerPlayer.add(new DeadZone(393,274,OBJECT_CLIENT));
  boardLayerPlayer.add(new DeadZone(424,369,OBJECT_CLIENT));
  boardLayerPlayer.add(new DeadZone(348,64,OBJECT_BEER_EMPTY));
  boardLayerPlayer.add(new DeadZone(383,177,OBJECT_BEER_EMPTY));
  boardLayerPlayer.add(new DeadZone(416,274,OBJECT_BEER_EMPTY));
  boardLayerPlayer.add(new DeadZone(447,369,OBJECT_BEER_EMPTY));
                                //bar|clients|speeds|type|frec|delay
  boardLayerPlayer.add(new Spawner(0, 2, [15,25,60], 'client', 3000, 6000));
  boardLayerPlayer.add(new Spawner(1, 3, [15,25,60], 'client', 10000, 10000));
  boardLayerPlayer.add(new Spawner(2, 3, [15,25,60], 'client', 7000, 6000));
  boardLayerPlayer.add(new Spawner(3, 4, [25,45,70], 'client', 8000, 3000));
  boardLayerPlayer.add(new Lives());


  GameManager.addBoard(4,boardLayerPlayer);
  Game.setBoard(4,boardLayerPlayer);


	GameManager.setActivate(0,false);
  GameManager.setActivate(1,false);
  GameManager.setActivate(2,false);
	GameManager.setActivate(3,true);
	GameManager.setActivate(4,true);
};
/*winGame es una funcion que se llama cuando hemos acabado la partida y hemos ganado
Desactiva las capas 3 y 4 en las cuales se situan las pantallas de fondo y de jugador respectivamente (boardLayerBackground y boardLayerPlayer)
y activa la capa 0 en la cual esta situada la pantalla de victoria (boardLayerWin)*/
var winGame = function() {
  GameManager.setActivate(3,false);
  GameManager.setActivate(4,false);
  GameManager.setActivate(0,true);
};
/*loseGame es una funcion que se llama cuando hemos acabado la partida y hemos perdido
Desactiva las capas 3 y 4 en las cuales se situan las pantallas de fondo y de jugador respectivamente (boardLayerBackground y boardLayerPlayer)
y activa la capa 1 en la cual esta situada la pantalla de derrota (boardLayerLose)*/
var loseGame = function() {
  GameManager.setActivate(3,false);
  GameManager.setActivate(4,false);
  GameManager.setActivate(1,true);
};
/*Background es un objeto que hereda de Sprite y que representa el fondo.
Se pasa 'background' al setup para que pinte el sprite correspondiente.
Su función step esta vacía pues tiene que hacer nada por cada paso, mas si no se pone da error. */
var Background = function() {

  this.setup('background', {});
  this.x =0;
  this.y=0;

  this.step= function(){};
};

Background.prototype = new Sprite();

/*Player es un objeto que hereda de Sprite y que representa al jugador, es decir, al camarero.
Se pasa al setup 'bartender' para que pinte el sprite correspondiente y tres propiedades en el segundo parametro con formato
JSON, el primero corresponde con la barra en la que se situa al camarero nada más comenzar el juego, la segunda representa
el tiempo que debe de pasar antes de que se pueda volver a mover al camarero después de que este se haya movido y la tercera
representa el tiempo que tiene que pasar para que se pueda servir una cerveza después de que se haya servido una.
Su función step escucha las tres teclas que se pueden usar en el juego para en el momento en que se pulsa una realizar la
acción correspondiente. */
var Player = function() {
  this.setup('bartender', { currPos: 1, reloadTime: 0.10, serveTime: 0.25 });

  this.x = 357;
  this.y = 185;
  this.reload = this.reloadTime;
  this.serve = this.serveTime;

  this.step = function(dt) {
    var positions = [{x:325, y:90},{x:357, y:185},{x:389, y:281},{x:421, y:377}];
    this.reload-=dt;
    if (Game.keys['down'] && this.reload < 0) {
      this.currPos = (this.currPos + 1)%4;
      var nextPos = positions[this.currPos];
      this.x = nextPos.x;
      this.y = nextPos.y;
      this.reload = this.reloadTime;
    } else if (Game.keys['up'] && this.reload < 0) {
      if (this.currPos == 0)
        this.currPos = 3;
      else
        this.currPos = this.currPos - 1;

      var nextPos = positions[this.currPos];
      this.x = nextPos.x;
      this.y = nextPos.y;
      this.reload = this.reloadTime;
    }
    this.serve-=dt;
    if (Game.keys['serve'] && this.serve < 0) {
      this.board.add(new Beer(this.x,this.y,VELOCIDAD_BEER_FULL));
      this.serve = this.serveTime;
    }
  }
};
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_BARTENDER;

/*Beer es un objeto que hereda de Sprite y que representa la cerveza llena.
Se pasa 'beer_full' al setup para que pinte el sprite correspondiente y en el segundo parametro se le pasa una propiedad en
formato JSON en la que se define la velocidad a la que se va a mover la cerveza.
Su función step se encarga de mover la cerveza por cada dt tiempo y esta pendiente de cuando colisiona con un cliente. Cuando
colisiona con un cliente se lo comunica al cliente y se borra de la pantalla.  */
var Beer = function(x,y,velocidad) {
  this.setup('beer_full', {vx: velocidad});
  this.x = x-this.w;
  this.y = y;
};
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER_FULL;

Beer.prototype.step = function(dt)  {
  this.x += this.vx * dt;
  var collisionClient = this.board.collide(this,OBJECT_CLIENT);
  if(collisionClient) {
  	collisionClient.hit();
    this.board.remove(this);
  }
};

/*Client es un objeto que hereda de Sprite y que representa cada cliente que entra al bar.
A su función setup se le pasa el tipo de sprite de cliente que queremos que se pinte y la velocidad a la que se va a mover (que puede variar).
Esta se pasa como un JSON que se establecerá como una propiedad en engine.js.
Su función step se encarga únicamente de desplazar al cliente hacia el final de la barra en sentido creciente en X.
La función hit es a la que se llama en la clase Beer cuando se impacta con una cerveza, para hacerlo desaparecer y seguidamente generar
una cerveza vacía en sentido contrario.  */
var Client = function(x,y,tipo,velocidad) {
  this.setup(tipo, {vx: velocidad});
  this.x = x;
  this.y = y;
};
Client.prototype = new Sprite();
Client.prototype.type = OBJECT_CLIENT;

Client.prototype.step = function(dt)  {
  this.x += this.vx * dt;
};

Client.prototype.hit = function() {
  this.board.remove(this);
  GameManager.addServerClient();

  this.board.add(new Glass(this.x,this.y));
  GameManager.addGlassesOnBar();
};

var Glass = function(x,y) {
  this.setup('beer_empty', {vx: 40});
  this.x = x+this.w;
  this.y = y+10;
};
Glass.prototype = new Sprite();
Glass.prototype.type = OBJECT_BEER_EMPTY;

Glass.prototype.step = function(dt)  {
  this.x += this.vx * dt;
  var collision = this.board.collide(this,OBJECT_BARTENDER);
  if(collision) {
    this.board.remove(this);
    GameManager.subGlassesOnBar();
  }
};

var DeadZone = function(x,y,type) {
  this.x=x;
  this.y=y;
  this.w=2;
  this.h=70;
  this.type = type;
};
DeadZone.prototype = new Sprite();
DeadZone.prototype.type = OBJECT_DEADZONE;

DeadZone.prototype.step = function(dt)  {
  var collision = this.board.collide(this,this.type);
  if(collision) {
    GameManager.subLives();
    this.board.remove(collision);
  }
};
DeadZone.prototype.draw = function(ctx) {
  //ctx.strokeRect(this.x, this.y, this.w, this.h);
};

var Spawner = function(bar, numClient, vxClient, tipo, frec, delay){
	this.w=0;
  this.h=0;
	this.bar = bar;
	this.numClient = numClient;
  this.vxClient = vxClient;
	this.tipo = tipo;
	this.frec = frec;
	this.delay = delay;
	this.t = 0;
	this.currNumClient = 0;
	this.firstDelayClient = false;
  GameManager.addTotalClient(this.numClient);
	switch (this.bar) {
    case 0:
        this.x = enemies.client_0.x;
        this.y = enemies.client_0.y;
        break;
    case 1:
        this.x = enemies.client_1.x;
        this.y = enemies.client_1.y;
        break;
    case 2:
        this.x = enemies.client_2.x;
        this.y = enemies.client_2.y;
        break;
    case 3:
        this.x = enemies.client_3.x;
        this.y = enemies.client_3.y;
        break;
	}

  this.randomNumber = function(max) {
    return Math.floor(Math.random() * ((max-1) - 0)) + 0;
  }

};
Spawner.prototype = new Sprite();
Spawner.prototype.step = function(dt)  {
	if(this.numClient > this.currNumClient){
	  if (this.t == 0){
	  	this.board.add(new Client(this.x,this.y,this.tipo,this.vxClient[this.randomNumber(NUM_VELOCIDADES)]));
	  	this.currNumClient++;
	  }
	  this.t += dt * 1000;
	  if(this.t >= this.delay && !this.firstDelayClient){
	  	this.board.add(new Client(this.x,this.y,this.tipo,this.vxClient[this.randomNumber(NUM_VELOCIDADES)]));
	  	this.firstDelayClient = true;
	  	this.currNumClient++;
	  }
	  if(this.firstDelayClient && (this.t-(this.delay+(this.frec*(this.currNumClient-2)))) > this.frec){
	  	this.board.add(new Client(this.x,this.y,this.tipo,this.vxClient[this.randomNumber(NUM_VELOCIDADES)]));
	  	this.currNumClient++;
	  }
	}
};

Spawner.prototype.draw = function(ctx) {
};

var Lives = function(){
  this.setup('three_lives',{});
  this.currentLives = GameManager.getLives();
  this.x= 350;
  this.y= 40;


};

Lives.prototype = new Sprite();
Lives.prototype.step = function(dt)  {
  if(this.currentLives != GameManager.getLives()){
    this.currentLives = GameManager.getLives();
    if(this.currentLives==2)
      this.setup('two_lives',{});
    if(this.currentLives==1)
      this.setup('one_lives',{});
    if(this.currentLives==0)
      this.setup('whitout_lives',{});
  }
};

var GameManager = new function(){
  this.servedClient = 0;
  this.totalClient = 0;
  this.allClientServed = false;
  this.glassesOnBar = 0;
  this.board = [];
  this.currentLives = 3;

  this.getLives = function(){
    return this.currentLives;
  };
  this.subLives =function(){
    this.currentLives--;
    if(this.currentLives < 0){
      loseGame();
    }
  };
  this.addTotalClient = function(numClient){
    this.totalClient += numClient;
  };
  this.addServerClient = function(){
    if(++this.servedClient == this.totalClient)
      this.allClientServed = true;
  };
  this.addGlassesOnBar = function(){
    this.glassesOnBar++;
  };
  this.subGlassesOnBar = function(){
    if(--this.glassesOnBar == 0 && this.allClientServed){
      winGame();
      console.log("win");
    }
  };
  this.addBoard = function(layer,board){
    this.board[layer] = board;
  }
  this.setActivate = function(layer, activate){
    this.board[layer].setActivate(activate);
    Game.setBoard(layer,this.board[layer]);
  }
  this.reset = function(){
    this.servedClient = 0;
    this.totalClient = 0;
    this.allClientServed = false;
    this.glassesOnBar = 0;
    this.currentLives = 3;
  }
};
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});


