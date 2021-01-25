const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = window.innerWidth;
gameScreen.height = window.innerHeight;
const ctx = gameScreen.getContext('2d');

// rect (x , y, width, height)
ctx.beginPath();
ctx.rect(0,0,gameScreen.width, gameScreen.height);
ctx.fill();

