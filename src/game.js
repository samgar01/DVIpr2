var sprites = {
 bartender: { sx: 511, sy: 0, w: 57, h: 66, frames: 1 },
 client: { sx: 511, sy: 66, w: 32, h: 32, frames: 1 },
 beer_full: { sx: 511, sy: 98, w: 23, h: 32, frames: 1 },
 beer_empty: { sx: 511, sy: 130, w: 23, h: 32, frames: 1 },
 background: { sx: 0, sy: 480, w: 511, h: 480, frames: 1 },
 foreground: { sx: 0, sy: 0, w: 511, h: 480, frames: 1 }
};

var enemies = {
  client_0:   { x: 125,   y: 80, sprite: 'client'},
  client_1:   { x: 95,   y: 178, sprite: 'client'},
  client_2:   { x: 62,   y: 272, sprite: 'client'},
  client_3:   { x: 30,   y: 369, sprite: 'client'}
};

var OBJECT_BARTENDER = 1,
    OBJECT_BEER_FULL = 2,
    OBJECT_CLIENT = 4,
    OBJECT_BEER_EMPTY = 8,
    OBJECT_DEADZONE = 16;

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }
  Game.setBoard(3,new TitleScreen("Alien Invasion",
                                  "Press fire to start playing",
                                  playGame));
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
  var board = new GameBoard();
  board.add(new Player());
  //board.add(new Client(125,80));
  board.add(new DeadZone(124,64,OBJECT_BEER_FULL));
  board.add(new DeadZone(95,162,OBJECT_BEER_FULL));
  board.add(new DeadZone(62,256,OBJECT_BEER_FULL));
  board.add(new DeadZone(30,353,OBJECT_BEER_FULL));
  board.add(new DeadZone(325,64,OBJECT_CLIENT));
  board.add(new DeadZone(360,177,OBJECT_CLIENT));
  board.add(new DeadZone(393,274,OBJECT_CLIENT));
  board.add(new DeadZone(424,369,OBJECT_CLIENT));
  board.add(new DeadZone(348,64,OBJECT_BEER_EMPTY));
  board.add(new DeadZone(383,177,OBJECT_BEER_EMPTY));
  board.add(new DeadZone(416,274,OBJECT_BEER_EMPTY));
  board.add(new DeadZone(447,369,OBJECT_BEER_EMPTY));
  board.add(new Spawner(0, 2, '', 1000, 5000));
  board.add(new Spawner(1, 3, '', 3000, 1500));
  board.add(new Spawner(2, 4, '', 6000, 800));
  board.add(new Spawner(3, 5, '', 3000, 1000));
  //               bar|clients|type|frec|delay
  //board.add(new Level(level1,winGame));



  Game.setBoard(0,new Background());
  Game.setBoard(1,board);
 // Game.setBoard(0,new Background());
};

var winGame = function() {
  Game.setBoard(3,new TitleScreen("You win!",
                                  "Press fire to play again",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("You lose!",
                                  "Press fire to play again",
                                  playGame));
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
      this.board.add(new Beer(this.x,this.y));
      this.serve = this.serveTime;
    }
  }
};
Player.prototype = new Sprite();
Player.prototype.type = OBJECT_BARTENDER;

var Beer = function(x,y) {
  this.setup('beer_full', {vx: -100});
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


var Client = function(x,y) {
  this.setup('client', {vx: 25});
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
  this.board.add(new Glass(this.x,this.y));
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
    loseGame();
  }
};
DeadZone.prototype.draw = function(ctx) {
  ctx.strokeRect(this.x, this.y, this.w, this.h);
};

var Spawner = function(bar, numClient, tipo, frec, delay){
	this.w=0;
  this.h=0;
	this.bar = bar;
	this.numClient = numClient;
	this.tipo = tipo;
	this.frec = frec;
	this.delay = delay;
	this.t = 0;
	this.currNumClient = 0;
	this.firstDelayClient = false;
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
};
Spawner.prototype = new Sprite();
Spawner.prototype.step = function(dt)  {
	if(this.numClient > this.currNumClient){
	  if (this.t == 0){
	  	this.board.add(new Client(this.x,this.y));
	  	this.currNumClient++;
	  }
	  this.t += dt * 1000;
	  if(this.t >= this.delay && !this.firstDelayClient){
	  	this.board.add(new Client(this.x,this.y));
	  	this.firstDelayClient = true;
	  	this.currNumClient++;
	  }
	  if(this.firstDelayClient && (this.t-(this.delay+(this.frec*(this.currNumClient-2)))) > this.frec){
	  	this.board.add(new Client(this.x,this.y));
	  	this.currNumClient++;
	  }
	}
};

Spawner.prototype.draw = function(ctx) {
};


window.addEventListener("load", function() {
  Game.initialize("game",sprites,playGame);
});


