let bttn;
function setup() {
  createCanvas(400, 400);
  bttn = createButton ("START");
  bttn.mousePressed(redirect);
  bttn.size(200, 100);
  bttn.position(130, 150);

}

function draw() {
}

function redirect(){
  window.location.href = "main-game.html";
}