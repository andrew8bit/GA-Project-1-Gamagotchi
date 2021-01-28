// things to check in game development are timing, physics, logic. 
const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 1000;
gameScreen.height = 500;
// ctx is short for context - standard practice. 
const ctx = gameScreen.getContext('2d');

/****************** SPRITE ANIMATIONS  ******************************/
// const playerImage = document.querySelector("#gatchiPlayer")
// this is where we declare all of our sprites
// we moved all our sprites into one long spritesheet. 
// srctotalX = 3604
// srctotaly = 100
// totalsprites = 36
// width of each sprite is roughly 100
// essentially we are creating indexes from the sprite sheet. 
// index 0 - 3 = idleForwardFacing
// index 4-7 = idleRevFacing
// index 8 - 13 walkForwardFacing
// index 14 - 19 walkRevFacing
// index 20 - 27 jumpForwardFacing
// index 28 - 35 jumpRevFacing 
// index 37 - hurtAnimation
// index 42 - deathAnimation

const spriteAnimationSet = 
[[0, 100, 200, 300], // idleForwardFacing [0]
[400,500,600, 700], // idleRevFacing [1]
[800,900,1000,1100,1200,1300], // walkForwardFacing [2]
[1400,1500,1600,1700,1800,1900], // walkRevFacing [3]
[2000,2100,2200,2300,2400,2500,2600,2700], // jumpForwardFacing [4]
[2800,2800,2900,3000,3100,3200,3300,3400,3500], // jumpRevFacing [5]
[3700], // hurtAnimation [6]
[4300] // deathAnimation [7]
]
let currentSpriteFrame = 0
let setIndex = 0  
// create gatchi player
const player = {
    // we are going to define game elements
    health:100,
    exp:0,
    hunger:100,
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
    speed: 15,
    // added this jumping boolean so we can force it to only jump once. 
    jumping:'false',
    gravity: 6,
    
    // // we needed to store the images into this player object, our draw function has no relation to this player currently 
    // images: {} - we don't need thisn anymore because we put the player x and y into the draw function instead 
    
}

const images = {}
// creates a new image 
images.player = new Image();
images.player.src='/images/spritesheetp1.png';

/****************************** SOUND EFFECTS ************************************/


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


// creating a function to draw our gatchi
// we are getting the images from our sprite sheet, and drawing it to our canvas. 
const drawPlayer = () => {
    // ctx drawImage method takes in source, and x and y of where we want, width and height, which we already defined.
    // ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);
    // we will change our drawPlayer function to take in 9 parameters eventually to animate sprites
    // (image, sourceX, sourceY, sourceWidth, sourceHeight, player x, player y, player w and player h)

    ctx.drawImage(images.player, spriteAnimationSet[currentSpriteFrame][setIndex], 0, 100, 100, player.x, player.y , player.w, player.h)

}

function Enemy() {  
    this.x = Math.random()*1000;
    this.y = -100;
    this.w = 25;
    this.h = 25;
    this.color = '#FF0000';
    this.gravity = Math.random()*5
}

let enemy = new Enemy();


// const enemy = {
//     x : Math.random()*1000,
//     y : -100,
//     w : 25,
//     h : 25,
//     color : '#FF0000',
//     gravity : Math.random()*5
// }

const bigBoss = {
    x : Math.random()*1000,
    y : -1000,
    w : 400,
    h : 250,
    color : '#393e46',
    gravity: 2,
}

const exp = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#FFF000',
    gravity : 1 + Math.random()*5
}
const health = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#00FF00',
    gravity : 1 + Math.random()*5
}
const food = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#FFA500',
    gravity : 1 + Math.random()*5
}
const drawRect = (x,y,w,h,color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h)
    // console.log('something appeared!')
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

// We are going to create an invisible ceiling for our character to prevent us from holding the up key and flying.
// I do not know if this is a smart work around. 
const jumpCeiling = () => {
    if (player.y < gameScreen.height * (1/3)) {
        player.y = gameScreen.height * (1/3)
        player.jumping = 'true'
    }
}


const enemyHitDetect = () => {
    if (
        enemy.x  > player.x  && enemy.x < player.x + 100 &&
        enemy.y  > player.y  && enemy.y < player.y + 100
        ) {

        enemy.y = -10;
        enemy.x = Math.random()*1000;
        if (player.health > 0) {
        player.health -= 20;
        // console.log(player.health)
        currentSpriteFrame = 6;
        setIndex = 0;
        }
    }
}

const bigBossHitDetect = () => {
    if (
        bigBoss.x + 400 > player.x  && bigBoss.x < player.x + 100 &&
        bigBoss.y + 250  > player.y  && bigBoss.y - 250 < player.y + 100

        ) {
            currentSpriteFrame = 7;
            setIndex = 0;
        // bigBoss.y = -1500;
        // bigBoss.x = Math.random()*1000;
        if (player.health > 0) {
        player.health = 0
        // console.log(player.health)
        }

    }
}

const expHitDetect = () => {
    if (
        exp.x  > player.x  && exp.x < player.x + 100 &&
        exp.y  > player.y  && exp.y < player.y + 100
        ) {
        exp.y = -10
        exp.x = Math.random()*1000
        player.exp += 50
        console.log(player.exp)
    }
}

const healthHitDetect = () => {
    if (
        health.x  > player.x  && health.x < player.x + 100 &&
        health.y  > player.y  && health.y < player.y + 100
        ) {
        health.y = -10
        health.x = Math.random()*1000
        if (player.health < 100 && player.health >0 ) {
        player.health += 10
        }
    }
}

const foodHitDetect = () => {
    if (
        food.x  > player.x  && food.x < player.x + 100 &&
        food.y  > player.y  && food.y < player.y + 100
        ) {
        food.y = -10
        food.x = Math.random()*1000
        if (player.hunger < 80 && player.hunger > 0) {
            player.hunger += 20
        }
    }
}


/****************** UPDATING OUR SCREEN ********************/
// we are going to update the display located in our HTML. 
const hpDisplay = document.querySelector('#lifePoints');
const hngrDisplay = document.querySelector('#hungerPoints');
const expDisplay = document.querySelector('#expPoints');

const gameEssentials = ()=> {
    hpDisplay.textContent = player.health
    hngrDisplay.textContent = Math.floor(player.hunger)
    expDisplay.textContent = player.exp
}


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
    enemy.y += enemy.gravity
    exp.y += exp.gravity
    health.y += health.gravity
    food.y += food.gravity
    bigBoss.y += bigBoss.gravity

    if (enemy.y > gameScreen.height-75) {
        enemy.y = -10
        enemy.x = Math.random() * 1000
    }
    else if (exp.y > gameScreen.height-75) {
        exp.y = -10
        exp.x = Math.random() * 1000
    }
    else if (health.y > gameScreen.height-75) {
        health.y = -10
        health.x = Math.random() * 1000
    }
    else if (food.y > gameScreen.height-75) {
        food.y = -10
        food.x = Math.random() * 1000
    }
    else if (bigBoss.y > gameScreen.height) {
        bigBoss.y = - 2000
        bigBoss.x = Math.random() * 1000
    }
    
    detectWalls();
    detectFloor();
    jumpCeiling();
    bigBossHitDetect();
    enemyHitDetect();
    expHitDetect();
    healthHitDetect();
    foodHitDetect();

}

/***************** WIN / LOSS CONDITIONS **********************/

const winLossCheck = () => {
    if (player.exp >= 1000) {
        
        cancelAnimationFrame(requestID);
        console.log('Sanity Check')
        // toggle the win sceen
    }
    else if (player.health <= 0 || player.hunger <=0) {
        currentSpriteFrame = 7;
        setIndex = 0;
        cancelAnimationFrame(requestID);
        console.log('Sanity Check')
        
        // toggle the losing hurt screen
    }
    else if (player.hunger <= 0) {

        cancelAnimationFrame(requestID);
        console.log('Sanity Check')
        // toggle the losing screen hunger
    }
}

/******************** CONTROLLER  ***************************/
// we are now making our object move, using event listeners. 
// we need create a new position for our player by changing our dx and dy, which we previously set to 0. Our dy will not change unless we use the jump function.

// the way canvas position is formatted, to the right and down, our value goes up, the left and up, our values go down. 
const moveRight = () => {
    player.dx += player.speed * 0.8
    currentSpriteFrame = 2
    spriteIndex = 1
    
    // for (let i = 0; i < spriteAnimationSet[2].length; i++) {
        //     spriteIndex = spriteAnimationSet[2][i]
        // }
    }
    
    const moveLeft = () => {
        player.dx -= player.speed * 0.8
        currentSpriteFrame = 3
        spriteIndex = 1
        // for (let i = 0; i < spriteAnimationSet[3].length; i++) {
            //     spriteIndex = spriteAnimationSet[3][i] 
            // }
        }
        
        const jump = () => {
            player.dy -= player.speed 
            player.jumping = 'true'
            currentSpriteFrame = 5
            spriteIndex = 3
        }
        
        // we use the event, because we want to target the key the user input
        const keyDown = (e) => {
            // testing to see if we get an input in our console.
            // console.log(e.key)
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
    // console.log(e.key);
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

/***************** DOM VARIABLES AND SCREENS *******************/
const gameStartButton = document.body.querySelector('#gatchiEgg');
const splashScreen = document.body.querySelector('#splashScreen');
const gameDisplay = document.body.querySelector('#gameDiv');
const winScreenDisplay = document.body.querySelector('#winScreen')
const loseScreenDisplay = document.body.querySelector('#loseScreen')

const gameStart = () => {
    // splashScreen.style.display = 'none';
    // gameDisplay.style.display= "";
    // console.log(gameDisplay)
    
    if (splashScreen.style.display === "none") {
        splashScreen.style.display = "block"
    } else {
        splashScreen.style.display = "none"
    }
    if (gameDisplay.style.display === "block") {
        gameDisplay.style.display = "none"
    } else {
        gameDisplay.style.display = "block"
    }
    update();
}
const tutorialButton = document.body.querySelector('#tutorialButton');
const tutorialDesc = document.body.querySelector("#tutorialDesc");

const tutorialDisplay = () => {
    if (tutorialDesc.style.display === "none") {
        tutorialDesc.style.display = "block"
    } else {
        tutorialDesc.style.display = "none"
    }
}

const winScreen = () => {

}

const loseScreen = () => {

}

tutorialButton.addEventListener('click', tutorialDisplay);
gameStartButton.addEventListener('click', gameStart);
/************************ GAME LOOP *************************/

const update = () => {
    clear(); 
    
    
    // our screen was getting deleted previously so now we will add our screen update onto our update function. 
    // created screenDraw function in our draw section. 
    screenDraw();
    
    drawRect(enemy.x, enemy.y, enemy.w, enemy.h, enemy.color);
    drawRect(exp.x, exp.y, exp.w, exp.h, exp.color);
    drawRect(health.x, health.y, health.w, health.h, health.color);
    drawRect(food.x, food.y, food.w, food.h, food.color);
    drawRect(bigBoss.x, bigBoss.y, bigBoss.w, bigBoss.h, bigBoss.color);
    
    newPos();
    
    drawPlayer();
    
    gameEssentials();
    
    if (player.hunger > 0) {
        player.hunger -= .1
    } 
    
    winLossCheck();
    // console.log(enemy.x)
    
    const requestID = requestAnimationFrame(update);


    // testing to see if our update function is looping properly
    console.log('new frame is running!')
}

// update();
