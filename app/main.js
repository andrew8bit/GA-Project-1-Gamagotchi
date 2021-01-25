// things to check in game development are timing, physics, logic. 
const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 800;
gameScreen.height = 500;
// ctx is short for context - standard practice. 
const ctx = gameScreen.getContext('2d');

const playerImage = document.querySelector("#gatchiPlayer")

/************************* DEFINED OUR DRAW FUNCTIONS  **********************/

// creating our game screen
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
    dy: 0,
    // added a speed value so we can update our position in our controller section.
    speed: 20,
    // added this jumping boolean so we can force it to only jump once. 
    jumping:'false',
    gravity: 4
    
}

// creating a function to draw our gatchi

const drawPlayer = () => {
    // ctx drawImage method takes in source, and x and y of where we want, width and height, which we already defined.
    ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);

}
/****************** OBJECT COLLISION DETECTION *************/
// We are going to work on detecting the walls and running this function later by running if statements.
const detectWalls = () => {
    // Because of our canvas, we know the left side is at x 0 and the right side will be gameScreen.width. 
    // LEFT WALL 
    if (player.x < 0 - player.w / 2) {
        player.x = 0 - player.w / 2
    } // RIGHT WALL 
    // This right wall isn't working, because we have to account for the player width.
    else if (player.x > gameScreen.width - (player.w / 2)) {
        player.x = gameScreen.width - (player.w / 2)
    }
}

// We are going to detect the floors because character keeps falling when adding gravity 
const detectFloor = () => {
    if (player.y > gameScreen.height - 150) {
        player.y = gameScreen.height - 150
        player.jumping  = 'false'
        player.dy = 0
    }
}






/****************** UPDATING OUR SCREEN ********************/

// these functions updates the screen without our character. This important to look at since it deals with timing in our game,
// we want out gamescreen to update constantly. 

const clearRect = () => {
    ctx.clearRect(0,0, gameScreen.width, gameScreen.height)
}
const clear = () => {
    clearRect(0,0, gameScreen.width, gameScreen.height)
}

// we're going to add this newPos function in our update function to show our changed position when we update the screen. 
const newPos = () => {
    player.x += player.dx;
    player.y += player.dy;
    player.y += player.gravity
    
    detectWalls();
    detectFloor();
}


const update = () => {
    clear(); 
    // our screen was getting deleted previously so now we will add our screen update onto our update function. 
    // created screenDraw function in our draw section. 
    screenDraw();

    drawPlayer();

    newPos();

 

    requestAnimationFrame(update);
    // testing to see if our update function is looping properly
    console.log('new frame is running!')
}

update();

/******************** CONTROLLER  ***************************/
// we are now making our object move, using event listeners. 
// we need create a new position for our player by changing our dx and dy, which we previously set to 0. Our dy will not change unless we use the jump function.

// the way canvas position is formatted, to the right and down, our value goes up, the left and up, our values go down. 
const moveRight = () => {
    player.dx += player.speed * 0.9
}

const moveLeft = () => {
    player.dx -= player.speed * 0.9
}

const jump = () => {
    player.dy -= player.speed 
    player.jumping = 'true'
}

// we use the event, because we want to target the key the user input
const keyDown = (e) => {
    // testing to see if we get an input in our console.
    console.log(e.key)
    // console.log is reading our arrow key presses as 'ArrowRight,left,etc.'
    if (e.key === 'ArrowRight' || e.key === 'd') {
        // we're gonna run these functions, that we haven't defined yet. We will define these later up top before we use them.
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveLeft();

    } else if (e.key === 'ArrowUp' && player.jumping === 'false' || e.key === 'w' && player.jumping === 'false') {
        // we want this function to run on the key press and the state of the player is not currently jumping, to avoid jumping in the air. 
        jump();

        
    }
}
const keyUp = (e) => {
    // testing to see if we get an input in our console.
    console.log(e.key);
    // since we made our dx and dy the moving factors of our player, we know how to stop it by making it 0. or i hope. 
    if (
        e.key === 'ArrowRight' || e.key === 'd' || 
        e.key === 'ArrowLeft' || e.key === 'a' || 
        e.key === 'ArrowUp' || e.key === 'w' 
    ) {
        player.dx = 0;
        player.dy = 0;
        
        
    }
}


document.addEventListener('keydown', keyDown) 
document.addEventListener('keyup', keyUp)
