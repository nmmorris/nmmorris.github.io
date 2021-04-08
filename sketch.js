/***********************************************************************************
  Project 2: Lesbian Visibility Maze Game
  by Natalie Morris

***********************************************************************************/

// Navigation variables
var lastKeyPressed = 0;
var keyFront = 1;
var keyBack = 2;
var keyLeft = 3;
var keyRight = 4;
var keyHeld;

// Adventure Manager variables 
var adventureManager;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects
var clickableButtonPressed;

// indexes into the clickable array (constants)
const playGameIndex = 0;

// p5.play variables
var playerSprite;
var playerAnimation;

// MC Sprite animation variables
var spriteFrontIdle;
var spriteLeftIdle;
var spriteRightIdle;
var spriteBackIdle;
var spriteFrontWal;
var spriteLeftWalk;;
var spriteRightWalk;
var spriteBackWalk;

// Other sprite variables
var starSprite;
var startScreenSprite;
var sexySprite;
var censorXXXSprite;
var censorPornSprite;
var censor18PlusSprite;

// Button variables
var textWindow;
var interactButton;

// Instructions image variables
var instructions1;
var instructions2;
var instructions3;
var interactBox;

// Sexy room image variables
var sexyDetail;
var sexyDialogue1;
var sexyDialogue2;
var sexyDialogue3;
var sexyEsc;
var sexy18Plus;
var sexy18PlusBlack;
var sexyPorn;
var sexyPornBlack;
var sexyXXX;
var sexyXXXBlack;
var sexyMouse;
var sexyPointer;
var sexyCensor;

// Detail movement variables
var detailMove;
var detailSpeed;

// Interaction booleans
var portalOpen = false;
var sexyRoomActive = false;
var interactSexyLadies = false;
var censorsOpen = false;
var censored18Plus = false;;
var censoredXXX = false;
var censoredPorn = false;
var escActive = false;

// Allocate Adventure Manager with states table and interaction tables and load animations
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager("data/adventureStates.csv", "data/interactionTable.csv", "data/clickableLayout.csv");

  // Load clickable images for instructions
  instructions1 = loadImage('assets/instructions/instructions1.png');
  instructions2 = loadImage('assets/instructions/instructions2.png');
  instructions3 = loadImage('assets/instructions/instructions3.png');
  interactBox = loadImage('assets/interact.png');

  // Load clickable images for sexy room
  sexyDialogue1 = loadImage('assets/sexroom/dialogue1.png')
  sexyDialogue2 = loadImage('assets/sexroom/dialogue2.png')
  sexyDialogue3 = loadImage('assets/sexroom/dialogue3.png')
  sexyPornBlack = loadImage('assets/sexroom/pornblack.png');

  // Load sprite animations
  spriteFrontIdle = loadAnimation('assets/sprite/em_spritefront1.png', 'assets/sprite/em_spritefront2.png');
  spriteLeftIdle = loadAnimation('assets/sprite/em_spriteleftstand1.png', 'assets/sprite/em_spriteleftstand2.png');
  spriteRightIdle = loadAnimation('assets/sprite/em_spriterightstand1.png', 'assets/sprite/em_spriterightstand2.png');
  spriteBackIdle = loadAnimation('assets/sprite/em_spriteback1.png', 'assets/sprite/em_spriteback2.png');
  spriteFrontWalk = loadAnimation('assets/sprite/em_spritefrontwalk1.png', 'assets/sprite/em_spritefront1.png',
   'assets/sprite/em_spritefrontwalk2.png', 'assets/sprite/em_spritefront1.png');
  spriteLeftWalk = loadAnimation('assets/sprite/em_spriteleft1.png', 'assets/sprite/em_spriteleftstand1.png',
   'assets/sprite/em_spriteleft2.png', 'assets/sprite/em_spriteleftstand1.png');
  spriteRightWalk = loadAnimation('assets/sprite/em_spriteright1.png', 'assets/sprite/em_spriterightstand1.png',
   'assets/sprite/em_spriteright2.png', 'assets/sprite/em_spriterightstand1.png');
  spriteBackWalk = loadAnimation('assets/sprite/em_spritebackwalk1.png', 'assets/sprite/em_spriteback1.png',
   'assets/sprite/em_spritebackwalk2.png', 'assets/sprite/em_spriteback1.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  angleMode(DEGREES); // change the angle mode from radians to degrees

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // Create MC sprite
  playerSprite = createSprite(width/2, height/2);

  // Create other sprites
  starSprite = createSprite(width/2 - 450, height/2);
  starSprite.addImage(loadImage('assets/instructions/star.png'));

  startScreenSprite = createSprite(width/2, height/2);
  startScreenSprite.addImage(loadImage('assets/instructions/screen.png'));

  sexySprite = createSprite(width/2, height/2);
  sexySprite.addImage(loadImage('assets/sexroom/pornwindow.png'));

  censorXXXSprite = createSprite(1120, 200);
  censorXXXSprite.addImage(loadImage('assets/sexroom/censorbutton.png'));
  censor18PlusSprite = createSprite(140, 320);
  censor18PlusSprite.addImage(loadImage('assets/sexroom/censorbutton.png'));
  censorPornSprite = createSprite(width/2, 560);
  censorPornSprite.addImage(loadImage('assets/sexroom/censorbutton.png'));

  // Setup detail bounce variables
  detailMove = 5;
  detailSpeed = .1;

  // Control speeds of sprite animations
  spriteFrontIdle.frameDelay = 14;
  spriteLeftIdle.frameDelay = 14;
  spriteRightIdle.frameDelay = 14;
  spriteBackIdle.frameDelay = 14;
  spriteFrontWalk.frameDelay = 12;
  spriteLeftWalk.frameDelay = 12;
  spriteRightWalk.frameDelay = 12;
  spriteBackWalk.frameDelay = 12;

  // Add animations
  playerSprite.addAnimation('regular', spriteFrontIdle);
  playerSprite.addAnimation('frontWalk', spriteFrontWalk);
  playerSprite.addAnimation('leftIdle', spriteLeftIdle);
  playerSprite.addAnimation('leftWalk', spriteLeftWalk);
  playerSprite.addAnimation('rightIdle', spriteRightIdle);
  playerSprite.addAnimation('rightWalk', spriteRightWalk);
  playerSprite.addAnimation('backIdle', spriteBackIdle);
  playerSprite.addAnimation('backWalk', spriteBackWalk);

  // Default animation front idle
  lastKeyPressed = keyFront;

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // Make buttons
  setupTextWindow();
  setupInteractBox();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // responds to keydowns
  moveSprite();

  // this is a function of p5.js, not of this sketch
  drawSprite(playerSprite);
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry
  adventureManager.keyPressed(key);  
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//

// When front, back, left, or right arrow is pressed the animation changes
// Store a new value inside of the lastKeyPressed
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW)) {
    playerSprite.velocity.x = 10;
    playerSprite.changeAnimation('rightWalk');
    lastKeyPressed = keyRight;
    keyHeld = true;
  }
  else if(keyIsDown(LEFT_ARROW)) {
    playerSprite.velocity.x = -10;
    playerSprite.changeAnimation('leftWalk');
    lastKeyPressed = keyLeft;
    keyHeld = true;
  }
  else {
    playerSprite.velocity.x = 0;
    keyHeld = false;
  }

  if(keyIsDown(DOWN_ARROW)) {
    playerSprite.velocity.y = 10;
    playerSprite.changeAnimation('frontWalk');
    lastKeyPressed = keyFront;
    keyHeld = true;
  }
  else if(keyIsDown(UP_ARROW)) {
    playerSprite.velocity.y = -10;
    playerSprite.changeAnimation('backWalk');
    lastKeyPressed = keyBack;
    keyHeld = true;
  }
  else {
    playerSprite.velocity.y = 0;
  }

// Use lastKeyPressed to use idle animations
  if(!keyHeld) {
    if(lastKeyPressed === keyRight) {
      playerSprite.changeAnimation('rightIdle');
    }
    if(lastKeyPressed === keyLeft) {
      playerSprite.changeAnimation('leftIdle');
    }
    if(lastKeyPressed === keyFront) {
      playerSprite.changeAnimation('regular');
    }
    if(lastKeyPressed === keyBack) {
      playerSprite.changeAnimation('backIdle');
    }
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed;
  }
}

clickableButtonPressed = function() {
    // these clickables are ones that change your state
    // so they route to the adventure manager to do this
    adventureManager.clickablePressed(this.name); 
}

function setupTextWindow() {
  // Create clickable text window
  textWindow = new Clickable();

  textWindow.image = instructions1;
  textWindow.width = instructions1.width;
  textWindow.height = instructions1.height;

  textWindow.locate(width/2 - 240, height/2 - 300);
  textWindow.onPress = textWindowPressed;
}

textWindowPressed = function() {
  // If we are on the instructions room, window 1, clicking with change to window 2
  if (textWindow.image === instructions1) {
    textWindow.image = instructions2;
    textWindow.width = instructions2.width;
    textWindow.height = instructions2.height;
  }
  else if (textWindow.image === instructions3) {
    portalOpen = true;
  }

  // If we are in sexy room and open to dialogue 1, clicking will change to dialogue 2
  if (textWindow.image === sexyDialogue1) {
    textWindow.image = sexyDialogue2;
    textWindow.width = sexyDialogue2.width;
    textWindow.height = sexyDialogue2.height;
  }
  else if (textWindow.image === sexyDialogue2) {    
    textWindow.image = sexyDialogue3;
    textWindow.width = sexyDialogue3.width;
    textWindow.height = sexyDialogue3.height;
    censorsOpen = true;
  }
}

function setupInteractBox() {
  // Create clickable interact button
  interactButton = new Clickable();

  interactButton.image = interactBox;
  interactButton.width = interactBox.width;
  interactButton.height = interactBox.height;
  interactButton.onPress = interactButtonPressed;
}

interactButtonPressed = function() {
  // Star demo prompt from Instructions page
  if (textWindow.image === instructions2) {
    textWindow.image = instructions3;
  }

  // Entering start screen
  if (portalOpen) {
    adventureManager.changeState('Sexy', null);
  }

  // Interacting with sexy ladies
  if (sexyRoomActive) {
    interactSexyLadies = true;
    textWindow.locate(100, 100);
    textWindow.image = sexyDialogue1;
    textWindow.width = sexyDialogue1.width;
    textWindow.height = sexyDialogue1.height;
  }
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

class InstructionsScreen extends PNGRoom {
  preload() {
  }

  draw() {
    super.draw();

    // Draw clickable textbox with instructions inside
    textWindow.draw();

    // Showing the second instructions page will prompt a star to appear
    if (textWindow.image === instructions2) {
      drawSprite(starSprite);

      // When the player walks up to the star, the interact button appears
      if(playerSprite.overlap(starSprite)) {
        // Update the position of the interact to appear above the player
        interactButton.locate(playerSprite.position.x - 40, playerSprite.position.y - 140);
        interactButton.draw();
      }
    }

    if (portalOpen) {
      textWindow.image = null;
      drawSprite(startScreenSprite);

      // When player overlaps with the screen portal, interact button prompts
      if(playerSprite.overlap(startScreenSprite)) {
        // Update the position of the interact to appear above the player
        interactButton.locate(playerSprite.position.x - 40, playerSprite.position.y - 140);
        interactButton.draw();
      }
    }
  }
}

class SexRoom extends PNGRoom {
  preload() {
    // Draw sparkles and bubbles
    sexyDetail = loadImage('assets/sexroom/detail.png');
    sexyEsc = loadImage('assets/sexroom/escbutton.png')
    sexyPorn = loadImage('assets/sexroom/pornwindow.png');
    sexyXXX = loadImage('assets/sexroom/xxxwindow.png');
    sexy18Plus = loadImage('assets/sexroom/18pluswindow.png');
    sexyMouse = loadImage('assets/sexroom/mouse.png');
    sexyPointer = loadImage('assets/sexroom/point.png');
    sexyXXXBlack = loadImage('assets/sexroom/xxxblack.png');
    sexy18PlusBlack = loadImage('assets/sexroom/18plusblack.png');
  }

  draw() {
    super.draw();
    sexyRoomActive = true;

    // Draw porn window with lesbians inside
    drawSprite(sexySprite);

    // Draw other porn ads
    if (!censoredXXX) {
      image(sexyXXX, 1000, 10);
    }
    else if (censored18Plus){
      image(sexyXXXBlack, 1000, 10);
    }

    if (!censored18Plus) {
      image(sexy18Plus, 50, 350);
    }
    else if (censored18Plus){
      image(sexy18PlusBlack, 50, 350);
    }

    if (censoredPorn) {
      image(sexyPornBlack, width/2 - sexyPornBlack.width / 2, height/2 - sexyPornBlack.height / 2);
    }

    // Draw mouse and cursors on top of images and sexySprite
    image(sexyMouse, 1000 + detailMove, 150);
    image(sexyMouse, 180 + detailMove, 520);
    image(sexyPointer, 800 + detailMove, 490);

    // Draw sparkles
    image(sexyDetail, 0, 0 + detailMove);

    // Make sparkles and bubbles in sexyDetail bounce
    if (detailMove > 10) {
      detailSpeed = -.2;
    }

    if (detailMove < 0) {
      detailSpeed = .2;
    }

    detailMove = detailMove + detailSpeed;

    // The interact button will only prompt if you are overlapping with the sexy ladies
    // Once you interact with them, the button diappears so you can click on the text window
    if( (playerSprite.overlap(sexySprite)) && (!interactSexyLadies) ) {
      interactButton.locate(playerSprite.position.x - 40, playerSprite.position.y - 140);
      interactButton.draw();
    }

    // If you interact with the porn window, the text window appears
    if( (interactSexyLadies) && (!escActive) ) {
      textWindow.draw();
    }

    // If you have prompted dialogue three the censorship buttons appear
    if (censorsOpen) {
      drawSprite(censorXXXSprite);
      drawSprite(censorPornSprite);
      drawSprite(censor18PlusSprite);
      if (playerSprite.overlap(censorXXXSprite)) {
        censorXXXSprite.remove();
        censoredXXX = true;
      }
      if (playerSprite.overlap(censorPornSprite)) {
        censorPornSprite.remove();
        censoredPorn = true;
        sexySprite.changeImage(sexyPornBlack);
      }
      if (playerSprite.overlap(censor18PlusSprite)) {
        censor18PlusSprite.remove();
        censored18Plus = true;
      }
    }

    if ( (censoredXXX) && (censoredPorn) && (censored18Plus) ) {
      escActive = true;
      image(sexyEsc, 50, 50);
    }
  }
}
