// things to check in game development are timing, physics, logic. 
const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 800;
gameScreen.height = 500;
const ctx = gameScreen.getContext('2d');

const playerImage = document.querySelector("#gatchiPlayer")

// rect (x , y, width, height)
ctx.beginPath();
ctx.rect(0,0,gameScreen.width, gameScreen.height);
ctx.fillStyle = "#bbf1fa"
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(0,450,gameScreen.width, 50);
ctx.fillStyle = "#393e46"
ctx.fill();
ctx.closePath();

// create gatchi player

const player = {
    // width, height, and position of player;
    w:100,
    h:200,
    x: 300,
    y: 300,
    // we set relative position to 0 for now, as controller input will change these values
    dx: 0,
    dy: 0
    
}

// creating a function to draw our gatchi

const drawPlayer = () => {
    // ctx drawImage method takes in source, and x and y of where we want, width and height, which we already defined.
    ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);

}

// this function updates the screen with out character. This important to look at since it deals with timing in our game,
// we want out gamescreen to update constantly. 
const update = () => {
    drawPlayer()
}

update();
