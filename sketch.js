var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boyImage; 
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;
var backgroundImg
var score=0;
var jumpSound, collidedSound;
var cash,diamonds,jwellery,cashImg,diamondsImg,jwelleryImg;
var cashG,diamondsG,jwelleryG;
var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  boyImage = loadAnimation("boy1.png","boy2.png","boy3.png","boy4.png","boy5.png","boy6.png","boy7.png","boy8.png");
  cashImg = loadImage("cash.png");
  diamondsImg = loadImage("diamonds.png");
  jwelleryImg = loadImage("jwell.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  boy = createSprite(50,height-70,20,50);  
  boy.addAnimation("boy", boyImage);
  boy.scale = 0.5;
 
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  cashG=new Group();
  diamondsG=new Group();
  jwelleryG=new Group();
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //boy.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((keyDown("SPACE"))) {
      jumpSound.play( ) ;
      boy.velocityY = -10;
      

       //touches = [];
    }
    
    boy.velocityY = boy.velocityY + 0.8

  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    createCash();
    createDiamonds();
    createJwellery();
   

    if (cashG.isTouching(boy)) {
      cashG.destroyEach();
      score=score + 10;
    }
    else if (diamondsG.isTouching(boy)) {
      diamondsG.destroyEach();
      score=score + 20;
      
    }else if(jwelleryG.isTouching(boy)) {
      jwelleryG.destroyEach();
      score= score + 30;
    } 
    if(obstaclesGroup.isTouching(boy)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cashG.destroyEach();
    diamondsG.destroyEach();
    jwelleryG.destroyEach();
        
        
    cashG.setVelocityYEach(0);
    diamondsG.setVelocityYEach(0);
    jwelleryG.setVelocityYEach(0);
        
     
    
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }

  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+100,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(width+100,height-120,20,30);
   
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = boy.depth;
    boy.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
function createCash() {
  if (World.frameCount % 200 == 0) {
   // Modify the positions of cash 


    var cash = createSprite(600,height-120,20,30);
    cash.addImage(cashImg);
  cash.scale=0.12;
  cash.velocityX = -(6 + 3*score/100);
  cash.lifetime = 200;
  cashG.add(cash);
  }
}

function createDiamonds() {
  if (World.frameCount % 320 == 0) {
       // Modify the positions of diamonds 

    var diamonds = createSprite(600,height-120,20,30);
    diamonds.addImage(diamondsImg);
  diamonds.scale=0.03;
  diamonds.velocityX = -(6 + 3*score/100);
  diamonds.lifetime = 200;
  diamondsG.add(diamonds);
}
}

function createJwellery() {
  if (World.frameCount % 410 == 0) {
    //   Modify the positions of jwellery to make them spawn throughout the available screen size.

    var jwellery = createSprite(600,height-120,20,30);
    jwellery.addImage(jwelleryImg);
  jwellery.scale=0.13;
  jwellery.velocityX = -(6 + 3*score/100);
  jwellery.lifetime = 200;
  jwelleryG.add(jwellery);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  boy.changeAnimation("boy",boyImage);
  
  score = 0;
  
}
