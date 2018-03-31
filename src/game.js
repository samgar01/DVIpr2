var sprites = {
 bartender: { sx: 511, sy: 0, w: 57, h: 66, frames: 1 },
 client: { sx: 511, sy: 66, w: 34, h: 32, frames: 1 },
 beer_full: { sx: 511, sy: 99, w: 23, h: 32, frames: 1 },
 beer_empty: { sx: 511, sy: 131, w: 23, h: 32, frames: 1 },
 background: { sx: 0, sy: 480, w: 511, h: 480, frames: 1 },
 foreground: { sx: 0, sy: 0, w: 511, h: 480, frames: 1 }
};

var enemies = {
  client_0:   { x: 125,   y: 80},
  client_1:   { x: 95,   y: 176},
  client_2:   { x: 62,   y: 272},
  client_3:   { x: 30,   y: 368}
};

var OBJECT_BARTENDER = 1,
    OBJECT_BEER_FULL = 2,
    OBJECT_CLIENT = 4,
    OBJECT_BEER_EMPTY = 8,
    OBJECT_DEADZONE = 16,
    NUM_VELOCIDADES = 3,
    VELOCIDAD_BEER_FULL = -100;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

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

  GameManager.addBoard(0,boardLayerWin);
  GameManager.addBoard(1,boardLayerLose);
  GameManager.addBoard(2,boardLayerStart);
  GameManager.addBoard(3,boardLayerBackground);
};

var level1 = [
 // Start,   End, Gap,  Type,   Override
  [ 0,      4000,  500, 'client_0' ],
  [ 6000,   13000, 800, 'client_0' ],
  [ 10000,  16000, 400, 'client_0' ],
  [ 17800,  20000, 500, 'client_0'],
  [ 18200,  20000, 500, 'client_0'],
  [ 18200,  20000, 500, 'client_0'],
  [ 22000,  25000, 400, 'client_0'],
  [ 22000,  25000, 400, 'client_0']
];



var playGame = function() {
  GameManager.reset();
  var boardLayerPlayer = new GameBoard(true);
  boardLayerPlayer.add(new Player());
  //boardLayerPlayer.add(new Client(125,80));
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
  boardLayerPlayer.add(new Spawner(0, 1, [25,50,60], 'client', 1000, 5000));
  boardLayerPlayer.add(new Spawner(1, 1, [25,30,35], 'client', 3000, 1500));
  boardLayerPlayer.add(new Spawner(2, 1, [25,05,10], 'client', 6000, 800));
  boardLayerPlayer.add(new Spawner(3, 1, [25,90,35], 'client', 3000, 1000));
  //               bar|clients|type|frec|delay
  //boardLayerPlayer.add(new Level(level1,winGame));
  GameManager.addBoard(4,boardLayerPlayer);
  Game.setBoard(4,boardLayerPlayer);

 // Game.setBoard(0,new Background());

 GameManager.setActivate(0,false);
 GameManager.setActivate(1,false);
 GameManager.setActivate(2,false);
 GameManager.setActivate(3,true);
 GameManager.setActivate(4,true);
};

var winGame = function() {
  /*Game.boards[3].setActivate(false);
  Game.boards[4].setActivate(false);

  var boardLayerWin = new GameBoard(true);
  boardLayerWin.add(new TitleScreen("You win!",
                                  "Press serve to play again",
                                  playGame));
  Game.setBoard(2,boardLayerWin);*/
  GameManager.setActivate(3,false);
  GameManager.setActivate(4,false);
  GameManager.setActivate(0,true);
};

var loseGame = function() {
  /*Game.boards[3].setActivate(false);
  Game.boards[4].setActivate(false);

  var boardLayerLose = new GameBoard(true);
  boardLayerLose.add(new TitleScreen("You lose!",
                                  "Press serve to play again",
                                  playGame));
  Game.setBoard(2,boardLayerLose);*/
  GameManager.setActivate(3,false);
  GameManager.setActivate(4,false);
  GameManager.setActivate(1,true);
};

var Background = function() {

  this.setup('background', {});
  this.x =0;
  this.y=0;

  this.step= function(){};
};

Background.prototype = new Sprite();

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

var Beer = function(x,y,velocidad) {
  this.setup('beer_full', {vx: velocidad});
  this.x = x-this.w;
  this.y = y;
};
Beer.prototype = new Sprite();
Beer.prototype.type = OBJECT_BEER_FULL;

Beer.prototype.step = function(dt)  {
  this.x += this.vx * dt;
  var collision = this.board.collide(this,OBJECT_CLIENT);
  if(collision) {
  	collision.hit();
    this.board.remove(this);
  }
};


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
    GameManager.youHaveLost();
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

var GameManager = new function(){
  this.servedClient = 0;
  this.totalClient = 0;
  this.allClientServed = false;
  this.glassesOnBar = 0;
  this.board = [];

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
  this.youHaveLost = function(){
    loseGame();
  }
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
  }
};
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});


