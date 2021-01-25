const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 800;
gameScreen.height = 500;
const ctx = gameScreen.getContext('2d');

// rect (x , y, width, height)
ctx.beginPath();
ctx.rect(0,0,gameScreen.width, gameScreen.height);
ctx.fillStyle = "#FFB26B"
ctx.fill();
ctx.closePath()

// // placeholder character 


