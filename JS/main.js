let character;
let items = [];
let inventory = [];
let gravity = 0.6;
let jumpForce = -12;
let cameraOffset = 0;
let inventoryheight = 150; 
let inventoryslotsize = 90; 
let canvasHeight; 

let showNavbar = false;
let currentItem = null;
let showinfoNavbar = false;

let standingcharacterImg, jumpingcharacterImg, movingcharacterImg;
let ArtifactImage = [];

let collectitem = true;

let requiredartifacts = ["Woodartifact", "Paperartifact", "Glassartifact", "Metalartifact", "Potteryartifact"]

let showlastbutton = false;
let showfinalwindow = false;


let allitemscollected = false;
let finalbookImage;

function setup() {
  canvasHeight = windowHeight - inventoryheight; 
  let canvas = createCanvas(windowWidth, windowHeight); 
  canvas.parent("p5-canvas-container"); 
//bg image
BGImage = loadImage('backgroundimage.png')
//for book image
finalbookImage = loadImage('finalbook.png');

//for player moving stuff replace latre (crunchy as hell)https://masterpose.itch.io/pixelduuuuudesmaker
  standingcharacterImg = loadImage('characterstanding.png');
  jumpingcharacterImg = loadImage('characterjumping.png');
  movingcharacterImg = loadImage('charactermoving.png');

//artifact images
  ArtifactImage['Woodartifact'] = loadImage('woodartifact.png');
  ArtifactImage['Paperartifact'] = loadImage('paperartifact.png');
  ArtifactImage['Glassartifact'] = loadImage('glassartifact.png');
  ArtifactImage['Metalartifact'] = loadImage('metalartifact.png');
  ArtifactImage['Potteryartifact'] = loadImage('potteryartifact.png');

character = new Character();

  let itemTypes = ["Woodartifact", "Paperartifact", "Glassartifact", "Metalartifact", "Potteryartifact"]; 
  let itemCount = itemTypes.length;

  //https://editor.p5js.org/slow_izzm/sketches/m7v7d87kL ref

  let padding = 3000 / (itemCount + 1); //3000px total length
  for (let i = 0; i < itemCount; i++) {
    let x = padding * (i + 1); //even distribution so no clumping
    let y = random(canvasHeight - 600, canvasHeight - 200); //random height generation
    let itemType = itemTypes[i]; 
    items.push(new Item(x, y, itemType)); 
  }
}

function draw() {
  background(BGImage); 

  //camera follow and check if item list empty
  if (!allitemscollected) {
    cameraOffset = constrain(character.x - width / 2, 0, 3000 - width);
    translate(-cameraOffset, 0);

    for (let i = items.length - 1; i >= 0; i--) {
      items[i].show();
      if (collectitem && items[i].isCollected(character)) {
        currentItem = items[i];
        showNavbar = true;
        items.splice(i, 1);
        collectitem = false;
      }
    }

    if (collectedallartifacts()) {
      allitemscollected = true;
      showlastbutton = true; 
    }

    character.update();
    character.show();
    drawInventory();
    if (showNavbar) {
      drawNavbar();
    }
    if (showinfoNavbar) {
      drawinfoNavbar();
    }
  }

  if (showlastbutton) {
    drawbutton();
  }

  if (showfinalwindow) {
    drawfinalwindow();
  }
}
class Character {
  constructor() {
    this.x = 100;
    this.y = canvasHeight - 30; 
    this.w = 75;
    this.h = 100;
    this.velocityY = 0;
    this.isOnGround = false;
    this.facingRight = true; 
  }


  //https://stackoverflow.com/questions/64573609/up-and-down-movement-in-p5-js-and-using-wasd; https://www.toptal.com/developers/keycode/a
  update() {
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
      this.facingRight = false; 
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
      this.facingRight = true; 
    }

        //gravity for falling
    this.velocityY += gravity;
    this.y += this.velocityY;

    //checks for falling 
    if (this.y + this.h > canvasHeight) {
      this.y = canvasHeight - this.h;
      this.velocityY = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }
  }

  
  show() {
    if (this.velocityY < 0) { 
      image(jumpingcharacterImg, this.x, this.y, this.w, this.h);
    } else if (this.isOnGround && (keyIsDown(LEFT_ARROW) || keyIsDown(65) || keyIsDown(68) || keyIsDown(RIGHT_ARROW))) { 
      image(movingcharacterImg, this.x, this.y, this.w, this.h);
    } else { 
      image(standingcharacterImg, this.x, this.y, this.w, this.h);
    }
  }

  jump() {
    this.velocityY = jumpForce;
  }
}

class Item {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.w = 75;
    this.h = 75;
    this.type = type;
  }

  show() {
    image(ArtifactImage[this.type], this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }

  isCollected(character) {
    return (
      character.x < this.x + this.w / 2 + 10 &&
      character.x + character.w > this.x - this.w / 2 - 10 &&
      character.y + character.h > this.y - this.h / 2 &&
      character.y + character.h <= this.y + this.h / 2
    );
  }
}

let leftMargin = 250; 
function drawInventory() {
  push();
  resetMatrix(); 

  //backgroiund
  fill(16,30, 39);
  rect(0, canvasHeight, width, inventoryheight);

//text
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Inventory", leftMargin / 2, canvasHeight + inventoryheight / 2); 

//inventory slots
  fill(240, 255, 255);
  for (let i = 0; i < 5; i++) { 
    let x = leftMargin + 5 + i * (inventoryslotsize + 5);
    let y = canvasHeight + (inventoryheight - inventoryslotsize) / 2;
    rect(x, y, inventoryslotsize, inventoryslotsize);

    if (i < inventory.length) {
      let itemType = inventory[i];
      image(ArtifactImage[itemType], x + inventoryslotsize / 2 - 33, y + inventoryslotsize / 2 - 33, 75, 75);
    } else {
      fill(0);
      textSize(16);
      textAlign(CENTER, CENTER);
      text("Empty", x + inventoryslotsize / 2, y + inventoryslotsize / 2);
    }
  }

  pop();
}

function drawNavbar() {
    resetMatrix();
    fill(0, 0, 0, 150); 
    let navbarX = 60; 
    let navbarY = height - 300 ; 
    let navbarWidth = width - 100; 
    let navbarHeight = 100; 
    rect(navbarX, navbarY, navbarWidth, navbarHeight); 
  
    //center text
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("You have found an artifact! Choose an option to proceed.", navbarX + navbarWidth / 2, navbarY + navbarHeight / 2);
  
//left button for the inventory
    fill(255);
    rect(100, navbarY + 30, 150, 40);  
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Add to Inventory", 175, navbarY + 50);  
  
//right button for artifact desc
    fill(255);
    rect(width - 250, navbarY + 30, 150, 40);  
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Learn more", width - 175, navbarY + 50);  
}

function drawinfoNavbar() {
    fill(0, 0, 0, 150); 
    rect(50, height / 2 - 100, width - 100, 200);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
        
    if (currentItem.type === 'Woodartifact') {                                                                                                     // 
      itemDescription = "Wood can be used to create many things including shelter, furniture, tools, and other objects. It's something very valuable.";
    } else if (currentItem.type === 'Glassartifact') {
      itemDescription = "Glass is also very valuable. It can insulate, protect, and clarify. It can also be used to make unique sculptures.";
    } else if (currentItem.type === 'Metalartifact') {
      itemDescription = "Metals are essential for fancy architecture, machinery, and smithing. It can also be used to make everyday objects.";
    } else if (currentItem.type === 'Potteryartifact') {
      itemDescription = "Pottery was a valuable commodity in the past, used for storing and transporting food. Now, it's used to make pretty wares.";
    } else if (currentItem.type === 'Paperartifact') {
      itemDescription = "Paper once allowed for the transcription of knowledge and spreading it across the world. Use it to jot down unique ideas.";
    }
    text(itemDescription, width / 2, height / 2);
}


//checking for every itme in the inventory
function collectedallartifacts(){
  return requiredartifacts.every((item) => inventory.includes(item));
}

function drawbutton(){
  resetMatrix();
  fill(0, 0, 0, 150);
  rect(width/2-206, height/2-30, 400, 75, 100);

  //text
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("All artifacts collected. View last item.", width/2, height/2);
}

function drawfinalwindow(){
  resetMatrix();
  fill(0,0,0, 180);
  rect(width/2 - 340, height/2 -100, 700, 75, 100);

  //text
  fill(255);
  textSize(23);
  textAlign(CENTER,CENTER);
  text("This item holds the answers to what you seek. Use it wisely.", width/2, height/2 - 60);

  //book image
  if (finalbookImage){
    image(finalbookImage, width/2-200, height/2 -30, 400, 400)  ;
  }
}

function keyPressed() {
  if (key === ' ') {
    character.jump(); //juumpy
  }
}


//https://editor.p5js.org/juang3ac/sketches/Oa75kUDgI P5 reference

function mousePressed() {
  if (showlastbutton) {
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 - 30 &&
      mouseY < height / 2 + 30
    ) {
      showlastbutton = false;
     showfinalwindow = true
    }
  }

  if (showNavbar) {
    if (
      mouseX > 100 &&
      mouseX < 250 &&
      mouseY > height - 300 + 30 &&
      mouseY < height - 300 + 70
    ) {
      inventory.push(currentItem.type);
      showNavbar = false;
      showinfoNavbar = false;
      collectitem = true;
    }

    if (
      mouseX > width - 250 &&
      mouseX < width - 100 &&
      mouseY > height - 300 + 30 &&
      mouseY < height - 300 + 70
    ) {
      showinfoNavbar = true;
    }
  }
}