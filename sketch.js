var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameover,restart

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var jumpsound,diesound,checkpointsound;

var score;


function preload(){
  trex_running = loadAnimation("camle_1.png","camle_2.png","camle_3.png");
  trex_collided = loadAnimation("camle_1.png");
  gameOverimg=loadImage("gameOver.png")
  restartimg=loadImage("restart.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
 jumpsound=loadSound("jump.mp3");
  diesound=loadSound("die.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  gameover=createSprite(300,110,30,30);
  gameover.addImage(gameOverimg);
  restart=createSprite(300,130,20,20);
  gameover.visible=false;
  restart.addImage(restartimg  )
  restart.visible=false;
  restart.scale=0.5
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.2;
  trex.debug =false;
  trex.setCollider("rectangle",0,0,200,200)
  
  
  Ground = createSprite(300,190,600,20);
  Ground.shapeColor = "peru"
   invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background("skyblue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -15;
      jumpsound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  if(score>0 && score%100==0){
  checkpointsound.play();
  }
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    obstaclesGroup.setVelocityXEach(ground.velocityX)
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      diesound.play();
      
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     trex.velocityY=0;
     obstaclesGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     cloudsGroup.setLifetimeEach(-1)
     trex.changeAnimation("collided",trex_collided);
     gameover.visible=true;
     restart.visible=true;
     if(mousePressedOver(restart)){
       reset();
     }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach(); 
  gameover.visible=false;
  restart.visible=false;
  score=0;
  trex.changeAnimation("running")
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -4;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

