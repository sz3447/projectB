let button;

function setup(){
    createCanvas(400,400);
    canvas.parent("p5-canvas-container");
    button = createButton("START");
    button.mousePressed(redirect);
}

function redirect() {
    window.location.href = "main-game.html";
}