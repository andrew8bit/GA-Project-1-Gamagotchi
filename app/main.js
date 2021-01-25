// things to check in game development are timing, physics, logic. 
const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 800;
gameScreen.height = 500;
// ctx is short for context - standard practice. 
const ctx = gameScreen.getContext('2d');

const playerImage = document.querySelector("#gatchiPlayer")

// rect (x , y, width, height)
const screenDraw = () => { 
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
}

// create gatchi player

const player = {
    // width, height, and position of player;
    w:100,
    h:100,
    // this makes our image center as we take both sides of width and height into account. 
    x: 350,
    y: 350,
    // we set relative position to 0 for now, as controller input will change these values
    dx: 0,
    dy: 0
    
}

// creating a function to draw our gatchi

const drawPlayer = () => {
    // ctx drawImage method takes in source, and x and y of where we want, width and height, which we already defined.
    ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);

}

// these functions updates the screen without our character. This important to look at since it deals with timing in our game,
// we want out gamescreen to update constantly. 

const clearRect = () => {
    ctx.clearRect(0,0, gameScreen.width, gameScreen.height)
}
const clear = () => {
    clearRect(0,0, gameScreen.width, gameScreen.height)
}

//const update = () => {
    clear(); 
    // our screen was getting deleted previously so now we will add our screen update onto our update function. 
    screenDraw();

    drawPlayer();

    // requestAnimationFrame(update);
    // testing to see if our update function is looping properly
    // console.log('new frame is running!')
// }

// update();

// we are now making our object move, using event listeners. 

// we use the event, because we want to target the key the user inputs
const keyUp = (e) => {
    // testing to see if we get an input in our console.
    console.log(e.key);
}

const keyDown = (e) => {
    // testing to see if we get an input in our console.
    console.log(e.key)
}


document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)