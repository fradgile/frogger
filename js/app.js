// Global variables. These variables don't belong to the player or enemy.
var CANVASWIDTH = 505, //Can't use ctx.canvas.width when creating Player initially because the canvas doesn't exist yet.
    CANVASHEIGHT = 606;

// Enemies our player must avoid

/**
* @description Represents an enemy, to be avoided.
* @constructor
* @param {string} x - The x-axis coordinate
* @param {string} y - The y-axis coordinate
*/
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    // Load the image for the sprite
    this.sprite = 'images/enemy-bug.png';

    // Setting the Enemy initial location - x, y coordinates
    this.x = x;
    this.y = y;

    this.width = 101;
    this.height = 171; // There is quite a bit of clear space here. Above and below the actual character.

    this.charWidth = 95; // This is the actual width of the character. To be used for collisions.
    this.charHeight = 60;// This is the actual height of the character. To be used for collisions.

    this.speed = this.setRandomSpeed();
};

/**
* @description Generates a random number that respresents the speed of the enemy
* @returns {number} Speed of the enemy
*/
Enemy.prototype.setRandomSpeed = function() {
    // Give each enemy a random speed. Makes things a bit more interesting.
     return (Math.random() + 0.25);
};

/**
* @description Update the enemy's position
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed*dt);
    if(this.x > ctx.canvas.width){ // When the enemy moves off the screen reset the enemy.
        this.reset();
    }
};

/**
* @description Reset the enemy position and speed
*/
Enemy.prototype.reset = function() {
    // When the enemy has moved off the screen reset the enemy position and speed.
    // Start the enemy x coordinate off the canvas.
    this.x = this.width * (-1);
    this.speed = this.setRandomSpeed();
};

/**
* @description Draw the enemy on the screen
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Represents the player
* @constructor
*/
var Player = function(){
    // Load the image for the sprite
    this.sprite = 'images/char-boy.png';

    this.width = 101; // There is quite a bit of clear space here. Left and right the actual character.
    this.height = 171;// There is quite a bit of clear space here. Above and below the actual character.

    this.charWidth = 60; // This is the actual width of the character. To be used for collisions.
    this.charHeight = 60;// This is the actual height of the character. To be used for collisions.

    this.bottomOffset = 32; // Used to position the player correctly at the bottom of the canvas.

    this.x;
    this.y;
    this.resetPosition();

    this.score;
    this.setScore(0);
};

/**
* @description Update the player
*/
Player.prototype.update = function() {
    this.checkPlayerBounds();
    this.checkCollisions();
};

/**
* @description Getter function for the score
*/
Player.prototype.getScore = function() {
    return(this.score);
};

/**
* @description Setter function for the score
*/
Player.prototype.setScore = function(val) {
    // setter function for the score.
    this.score = val;
};

/**
* @description Reset the player position on the screen
*/
Player.prototype.resetPosition = function() {
    // I'm placing the player in the middle of the canvas towards the bottom
    this.x = CANVASWIDTH/2 - this.width/2;
    this.y = CANVASHEIGHT - this.height - this.bottomOffset;
    console.log("resetPosition");
};

/**
* @description Draw the player on the screen
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Display the score
    ctx.font = "20px Arial";
    ctx.fillText("score: " + this.score,5, ctx.canvas.height - 35);
};

/**
* @description Interpret the input from the arrow keys
* @param {string} a
*/
Player.prototype.handleInput = function(keyCode) {
    //console.log("keyCode = " + keyCode);
    var horizontalStepSize = 101;
    var verticalStepSize = 82;

    switch(keyCode) {
        case "up":
            this.y = this.y - verticalStepSize;
            break;
        case "down":
            this.y = this.y + verticalStepSize;
            break;
        case "left":
            this.x = this.x - horizontalStepSize;
            break;
        case "right":
            this.x = this.x + horizontalStepSize;
            break;
    }
};

/**
* @description Make sure the player can't move off the canvas and register a score
*/
Player.prototype.checkPlayerBounds = function() {
    // Check bounds
    // Prevent player moving off the left side of canvas.
    if(this.x < 0) {
        this.x = 0;
    }
    // Prevent player moving off the right side of canvas.
    else if(this.x > ctx.canvas.width - this.width) {
        this.x = ctx.canvas.width - this.width;
    }
    // Prevent player moving off the top of the canvas.
    if(this.y < 0) {
        this.y = 0;
    }
    // Prevent player moving too far down the canvas.
    else if(this.y > ctx.canvas.height - this.height - this.bottomOffset) {
        this.y = ctx.canvas.height - this.height - this.bottomOffset;
    }

    // Check if player has reached the water.
    // If so increment the score and reset the player position.
    if(this.y <= 50) {
        this.setScore(this.getScore() + 1);
        this.resetPosition();
    }
};

/**
* @description Check if there is a collision between player and enemy
*/
Player.prototype.checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {

        var enemy = allEnemies[i];

        // Axis-Aligned Bounding Box collision detection.
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if (this.x < enemy.x + enemy.charWidth &&
           this.x + this.charWidth > enemy.x &&
           this.y < enemy.y + enemy.charHeight &&
           this.charHeight + this.y > enemy.y) {

            console.log("collision");
            this.setScore(0);
            this.resetPosition();
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
allEnemies = [];

// Start the enemies moving at random start times.
setTimeout(function(){
    allEnemies.push(new Enemy(-101, 60));
}, Math.floor((Math.random() * 2000) + 1));

setTimeout(function(){
    allEnemies.push(new Enemy(-101, 60 + 83));
}, Math.floor((Math.random() * 2000) + 1));

setTimeout(function(){
    allEnemies.push(new Enemy(-101, 60 + 83 + 83));
}, Math.floor((Math.random() * 2000) + 1));

// Place the player object in a variable called player
player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
