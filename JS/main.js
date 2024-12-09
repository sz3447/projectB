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

function setup() {
  canvasHeight = windowHeight - inventoryheight; 
  let canvas = createCanvas(windowWidth, windowHeight); 
  canvas.parent("p5-canvas-container"); 

//for player moving stuff
  standingcharacterImg = loadImage('placeholder.jpg');
  jumpingcharacterImg = loadImage('placeholder.jpg');
  movingcharacterImg = loadImage('placeholder.jpg');

//artifact images, placeholders for now
  ArtifactImage['Woodartifact'] = loadImage('artifact 1.png');
  ArtifactImage['Paperartifact'] = loadImage('artifact 2.jpg');
  ArtifactImage['Glassartifact'] = loadImage('artifact 3.png');
  ArtifactImage['Metalartifact'] = loadImage('artifact 4.jpg');
  ArtifactImage['Potteryartifact'] = loadImage('artifact 5.png');

character = new Character();

  let itemTypes = ["Woodartifact", "Paperartifact", "Glassartifact", "Metalartifact", "Potteryartifact"]; 
  let itemCount = itemTypes.length;



  let padding = 3000 / (itemCount + 1);
  for (let i = 0; i < itemCount; i++) {
    let x = padding * (i + 1); 
    let y = random(canvasHeight - 600, canvasHeight - 200); 
    let itemType = itemTypes[i]; 
    items.push(new Item(x, y, itemType)); 
  }
}

function draw() {
  background(44,61,85);

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

class Character {
  constructor() {
    this.x = 100;
    this.y = canvasHeight - 30; 
    this.w = 30;
    this.h = 30;
    this.velocityY = 0;
    this.isOnGround = false;
    this.facingRight = true; 
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
      this.facingRight = false; 
    }
    if (keyIsDown(RIGHT_ARROW)) {
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
    } else if (this.isOnGround && (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))) { 
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
    this.w = 30;
    this.h = 30;
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
  fill(50);
  rect(0, canvasHeight, width, inventoryheight);

//text
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Inventory", leftMargin / 2, canvasHeight + inventoryheight / 2); 

  fill(80);
  for (let i = 0; i < 6; i++) { 
    let x = leftMargin + 6 + i * (inventoryslotsize + 6);
    let y = canvasHeight + (inventoryheight - inventoryslotsize) / 2;
    rect(x, y, inventoryslotsize, inventoryslotsize);

    if (i < inventory.length) {
      let itemType = inventory[i];
      image(ArtifactImage[itemType], x + inventoryslotsize / 2 - 15, y + inventoryslotsize / 2 - 15, 30, 30);
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
    text("You have found an artifact! Choose an option.", navbarX + navbarWidth / 2, navbarY + navbarHeight / 2);
  
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
        
    if (currentItem.type === 'Woodartifact') {
      itemDescription = "textplaceholder for wood artifact";
    } else if (currentItem.type === 'Glassartifact') {
      itemDescription = "text placeolder for glass artifact";
    } else if (currentItem.type === 'Metalartifact') {
      itemDescription = "textplaceholder for metal artifact ";
    } else if (currentItem.type === 'Potteryartifact') {
      itemDescription = "text placeholder for pottery artifact";
    } else if (currentItem.type === 'Paperartifact') {
      itemDescription = "textplaceholder for paper artifact";
    }
    text(itemDescription, width / 2, height / 2);
}

function keyPressed() {
  if (key === ' ') {
    character.jump(); //juumpy
  }
}


//https://editor.p5js.org/juang3ac/sketches/Oa75kUDgI P5 reference

function mousePressed() {
  if (showNavbar) {
    if (mouseX > 100 && mouseX < 250 && mouseY > (height - 300 + 30) && mouseY < (height - 300 + 70)) {
      inventory.push(currentItem.type); 
      showNavbar = false; 
      showinfoNavbar = false; 
      collectitem = true; 
    }

    if (mouseX > width - 250 && mouseX < width - 100 && mouseY > (height - 300 + 30) && mouseY < (height - 300 + 70)) {
        showinfoNavbar = true; 
    }
  }
}
