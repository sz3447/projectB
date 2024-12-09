let bttn;
function setup() {
  createCanvas(400, 400);
  bttn = createButton ("GO TO ANOTHER PAGE");
  bttn.mousePressed(redirect);
  bttn.size(100, 50);

}

function draw() {
  background(220);

}

function redirect(){
  window.location.href = "main-game.html";
}