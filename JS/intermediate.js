let bttn;
function setup() {
  createCanvas(400, 400);
  bttn = createButton ("GO TO ANOTHER PAGE");
  bttn.mousePressed(redirect);
  bttn.size(200, 100);

}

function draw() {
  background(220);

}

function redirect(){
  window.location.href = "main-game.html";
}