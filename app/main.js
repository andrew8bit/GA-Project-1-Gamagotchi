///////////////////////////////////////////////////////////////////////////////////////////////////////////
//      ######      ###    ##     ##    ###     ######    #######  ########  ######  ##     ## ####      //
//     ##    ##    ## ##   ###   ###   ## ##   ##    ##  ##     ##    ##    ##    ## ##     ##  ##       //
//     ##         ##   ##  #### ####  ##   ##  ##        ##     ##    ##    ##       ##     ##  ##       //
//     ##   #### ##     ## ## ### ## ##     ## ##   #### ##     ##    ##    ##       #########  ##       //
//     ##    ##  ######### ##     ## ######### ##    ##  ##     ##    ##    ##       ##     ##  ##       //
//     ##    ##  ##     ## ##     ## ##     ## ##    ##  ##     ##    ##    ##    ## ##     ##  ##       //
//      ######   ##     ## ##     ## ##     ##  ######    #######     ##     ######  ##     ## ####      //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//********************************************************************************************************/
//***********************************  VARIABLES AND DOM ELEMENTS  ***************************************/
//********************************************************************************************************/

// DEFINING OUR GAME SCREEN AND CONTEXT. 
const gameScreen = document.querySelector("#gameScreen");
gameScreen.width = 1000;
gameScreen.height = 500;
const ctx = gameScreen.getContext('2d');

// DOM ELEMENTS TO TOGGLE SCREEN
const gameStartButton = document.body.querySelector('#gatchiEgg');
const splashScreen = document.body.querySelector('#splashScreen');
const gameDisplay = document.body.querySelector('#gameDiv');
const winScreenDisplay = document.body.querySelector('#winScreen');
const loseScreenDisplay = document.body.querySelector('#loseScreen');
const retryButton = document.body.querySelector('#retry')
const tutorialButton = document.body.querySelector('#tutorialButton');
const tutorialDesc = document.body.querySelector("#tutorialDesc");

// DOM ELEMENTS TO CHANGE THE VALUE DISPLAYED
const hpDisplay = document.querySelector('#lifePoints');
const hngrDisplay = document.querySelector('#hungerPoints');
const expDisplay = document.querySelector('#expPoints');

//***************************************  SPRITE ANIMATIONS  *********************************************/

// srctotalX = 4604
// srctotaly = 100
// totalsprites = 46
// width of each sprite is roughly 100
// essentially we are creating indexes from the sprite sheet. 
// index 0 - 3 = idleForwardFacing
// index 4-7 = idleRevFacing
// index 8 - 13 walkForwardFacing
// index 14 - 19 walkRevFacing
// index 20 - 27 jumpForwardFacing
// index 28 - 35 jumpRevFacing 
// index 36 - 41 hurtAnimation
// index 42 - 46 deathAnimation

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

let currentSpriteFrame = 0 // the first index of our spriteAnimationArray
let setIndex = 0 // the second index of our spriteAnimationArray

//********************************************************************************************************/
//***********************************************  OBJECTS  **********************************************/
//********************************************************************************************************/

// Defining our Player object
const player = {
    health:100,
    exp:0,
    hunger:100, 
    w:100, // width 
    h:100, // height
    x: 350, // pos x
    y: 350, // pos y
    dx: 0, // relative x 
    dy: 0, // relative y
    speed: 15, // what we change our relative position by
    jumping:'false',
    gravity: 6, // what forces player to come down  
}

// Player image
const images = {}
images.player = new Image();
images.player.src='/images/spritesheetp1.png';

// Our main enemy object - written using Object Oriented Programing - still need to refactor and learn more. 
function Enemy() {  
    this.x = Math.random()*1000;
    this.y = -100;
    this.w = 25;
    this.h = 25;
    this.color = '#FF0000';
    this.gravity = Math.random()*5
}

let enemy = new Enemy();
// Our large enemy
const bigBoss = {
    x : Math.random()*1000,
    y : -1000,
    w : 400,
    h : 250,
    color : '#393e46',
    gravity: 2,
}

// EXP OBJECT
const exp = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#FFF000',
    gravity : 1 + Math.random()*5
}

// HP UP OBJECT
const health = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#00FF00',
    gravity : 1 + Math.random()*5
}

// FOOD OBJECT
const food = {
    x : Math.random()*1000,
    y : -100,
    w : 25,
    h : 25,
    color : '#FFA500',
    gravity : 1 + Math.random()*5
}

//********************************************************************************************************/
//*********************************************  FUNCTIONS  **********************************************/
//********************************************************************************************************/

// drawing our Game Screen

const screenDraw = () => { 
    // background
    ctx.beginPath();
    // rect (x , y, width, height)
    ctx.rect(0,0,gameScreen.width, gameScreen.height);
    ctx.fillStyle = "#bbf1fa"
    ctx.fill();
    ctx.closePath();
    // floor
    ctx.beginPath();
    // rect (x , y, width, height)
    ctx.rect(0,450,gameScreen.width, 50);
    ctx.fillStyle = "#393e46"
    ctx.fill();
    ctx.closePath();
}
// drawing our Player
const drawPlayer = () => {
    // 9 parameters
    // (image, sourceX, sourceY, sourceWidth, sourceHeight, player x, player y, player w and player h)
    ctx.drawImage(images.player, spriteAnimationSet[currentSpriteFrame][setIndex], 0, 100, 100, player.x, player.y , player.w, player.h)
}
// drawing our Objects 
const drawRect = (x,y,w,h,color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h)
}

/************************************* OBJECT COLLISION AND HIT DETECTION ********************************/

// DETECT WALLS
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

// DETECT FLOOR
const detectFloor = () => {
    if (player.y > gameScreen.height - 150) {
        player.y = gameScreen.height - 150
        player.jumping  = 'false'
        player.dy = 0
    }
}

// CEILING FOR OUR PLAYER
const jumpCeiling = () => {
    if (player.y < gameScreen.height * (1/3)) {
        player.y = gameScreen.height * (1/3)
        player.jumping = 'true'
    }
}

// RED SQUARE VS PLAYER DETECTION
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

// BLACK SQUARE VS PLAYER DETECTION
const bigBossHitDetect = () => {
    if (
        bigBoss.x + 400 > player.x  && bigBoss.x < player.x + 100 &&
        bigBoss.y + 250  > player.y  && bigBoss.y < player.y + 100

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

// YELLOW SQUARE VS PLAYER DETECTION
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

// GREEN SQUARE VS PLAYER DETECTION
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

// ORANGE SQUARE VS PLAYER DETECTION
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

/****************************************** SCREEN UPDATE FUNCTIONS **************************************/

// updates the player value to be displayed to user
const gameEssentials = ()=> {
    hpDisplay.textContent = player.health
    hngrDisplay.textContent = Math.floor(player.hunger)
    expDisplay.textContent = player.exp
}

// clears old screen
const clear = () => {
    ctx.clearRect(0,0, gameScreen.width, gameScreen.height)
}

// sets new position for objects
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

/**********************************************  CONTROLLER FUNCTIONS  *************************************/

const moveRight = () => {
    player.dx += player.speed * 0.8
    currentSpriteFrame = 2
    spriteIndex = 1
}
    
const moveLeft = () => {
    player.dx -= player.speed * 0.8
    currentSpriteFrame = 3
    spriteIndex = 1
}
        
const jump = () => {
    player.dy -= player.speed 
    player.jumping = 'true'
    currentSpriteFrame = 5
    spriteIndex = 3
}
        
const keyDown = (e) => {

    if (e.key === 'ArrowRight' || e.key === 'd') {
    moveRight();
    } 

    else if (e.key === 'ArrowLeft' || e.key === 'a') {
    moveLeft();
    } 
    
    else if (e.key === 'ArrowUp' && player.jumping === 'false' || e.key === 'w' && player.jumping === 'false') {
    jump();
    }
}

const keyUp = (e) => {

    if (
        e.key === 'ArrowRight' || e.key === 'd' || 
        e.key === 'ArrowLeft' || e.key === 'a' || 
        e.key === 'ArrowUp' || e.key === 'w' 
    ) {
        player.dx = 0;
        player.dy = 0; 
    }
}

// CONTROLLER EVENT LISTENERS
document.addEventListener('keydown', keyDown) 
document.addEventListener('keyup', keyUp)

/********************************************  SCREEN TOGGLE FUNCTIONS  *************************************/

const gameStart = () => {

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

const tutorialDisplay = () => {

    if (tutorialDesc.style.display === "none") {
        tutorialDesc.style.display = "block"
    } else {
        tutorialDesc.style.display = "none"
    }
}

const winScreen = () => {

    if (gameDisplay.style.display === 'block') {
        gameDisplay.style.display = 'none'
    } else {
        gameDisplay.style.display = 'none'
    }
    if (winScreenDisplay.style.display === "none") {
        winScreenDisplay.style.display = 'block'
    } else {
        winScreenDisplay.style.display = 'block'
    }
}

const loseScreen = () => {
    if (gameDisplay.style.display === 'block') {
        gameDisplay.style.display = 'none'
    } else {
        gameDisplay.style.display = 'none'
    }

    if (loseScreenDisplay.style.display === "none") {
        loseScreenDisplay.style.display = 'block'
    } else {
        loseScreenDisplay.style.display = 'block'
    }   
}

const retryGame = () => {
    if (loseScreenDisplay.style.display === 'block') {
        loseScreenDisplay.style.display = 'none'
    } else {
        loseScreenDisplay.style.display = 'none'
    }
    if (gameDisplay.style.display === 'none') {
        gameDisplay.style.display = "block"
    } else {
        gameDisplay.style.display = 'block'
    }
  
    cancelAnimationFrame(id)
    // repositioning object and player values so when we reset, our player object is safe
    player.hunger = 100
    player.health = 100
    player.exp = 0
    bigBoss.x = Math.random()*1000
    bigBoss.y = -1000

    update()
    clear()
}

// TOGGLE SCREEN EVENT LISTENERS
retryButton.addEventListener('click', retryGame)
tutorialButton.addEventListener('click', tutorialDisplay);
gameStartButton.addEventListener('click', gameStart);


//********************************************************************************************************/
//*********************************************  GAME LOOP  **********************************************/
//********************************************************************************************************/

let id; // initializing so our update can have an id to stop

const update = () => {
    // clears old screen
    clear(); 
    // draws current screen
    screenDraw(); 

    // drawing our objects onto the screen
    drawRect(enemy.x, enemy.y, enemy.w, enemy.h, enemy.color);
    drawRect(exp.x, exp.y, exp.w, exp.h, exp.color);
    drawRect(health.x, health.y, health.w, health.h, health.color);
    drawRect(food.x, food.y, food.w, food.h, food.color);
    drawRect(bigBoss.x, bigBoss.y, bigBoss.w, bigBoss.h, bigBoss.color);
    drawPlayer();
    
    newPos();
    gameEssentials(); // updates our game values every frame 
    hungerStrikes(); 

    id = requestAnimationFrame(update);

    winLossCheck();
    // console.log('new frame is running!')
}

// checks our Win or Loss Condition
const winLossCheck = () => {

    if (player.exp >= 1000) {
    
        cancelAnimationFrame(id);
        winScreen(); // toggle the win sceen
    }

    else if (player.health <= 0 || player.hunger <=0) {

        currentSpriteFrame = 7;
        setIndex = 0;
    
        cancelAnimationFrame(id);
        loseScreen(); // toggle the losing screen
    }
}

// decrements our player hunger value 
const hungerStrikes = () => {
    if (player.hunger > 0) {
        player.hunger -= .1
    } 
}