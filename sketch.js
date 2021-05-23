var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running,money,  mario_collided;
var ground, invisibleGround, groundImage;

var moneyGroup, moneyImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3,obstacle4,obstacle5;
var score=0;
var life=3;

var bgSound, jumpSound, deadSound, gameoverSound


var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backimg13.png");
  moneySound = loadSound("coin.wav");
  bgSound = loadSound("backgroundSound.mp3")
  jumpSound= loadSound("SmallJumpwav.wav")
  deadSound = loadSound("MarioDiedSound.wav")
  
  moneyImage = loadImage("money.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1530, 760);
  mario = createSprite(130,400,50,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;
  
  ground = createSprite(0,650,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible=false;
  
  gameOver = createSprite(750,250);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(750,300);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.9;
  restart.scale = 0.9;

  gameOver.visible = false;
  restart.visible = false;
  
  moneyGroup = new Group();
  obstaclesGroup = new Group();
  
  //score = 0;
}

function draw() {
  background(groundImage);
  textSize(30);
  stroke(0);
  fill(255);
  text("Score: "+ score, 1400,40);
  
  //text("life: "+ life , 500,60);
  textSize(30);
  stroke(0);
  fill(255);
  text("life: "+ life, 1400,65);

  drawSprites();
  if (gameState===PLAY){
  // score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 139) {
      jumpSound.play();
      mario.velocityY = -20;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);
    
    spawnMoney();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(mario)){
        life=life-1;
        gameState = END;
        deadSound.play();

   } 
   
   if(moneyGroup.isTouching(mario)){
        score=score+1;
        moneySound.play();
        moneyGroup[0].destroy();
    }
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    moneyGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.5;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    moneyGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  else if(life===0){
    reset();
  }
}

function spawnMoney() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var money = createSprite(900,1100,10,10);
    money.y = Math.round(random(80,120));
    money.addImage(moneyImage);
    money.scale = 0.1;
    money.velocityX = -3; 
    
     //assign lifetime to the variable
    money.lifetime = 200;
    
    //adjust the depth
    money.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    moneyGroup.add(money);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(900,600,40,40);    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle3);
              break;
      case 3: obstacle.addImage(obstacle4);
              break;
      case 4:obstacle.addImage(obstacle5);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  moneyGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
   score = 0;
  
}