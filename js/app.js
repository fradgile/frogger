// Enemies our player must avoid
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

    // width and height values are used extensively so
    // I'm creating variables instead of hardcoding all over the place
    this.width = 101;
    this.height = 171;

    // Give each enemy a random speed. Makes things a bit more interesting.
    this.speed = Math.random() + 0.25;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed*dt);
    if(this.x > ctx.canvas.width){ // When the enemy moves off the screen reset the enemy.
        this.reset();
    };

    //this.checkCollisions()


};

Enemy.prototype.checkCollisions = function() {

    // I want there to be an overlap of the images before a collision is recorded.
    // To accomplish this I used trial and error to come up with the following values.
    // The widthOverlap and heightOverlap values make the player image seem small than it is.

    var widthOverlap = 70;
    var heightOverlap = 30;

    function collides(x, y, width, height, x2, y2, width2, height2) {
        return (x < x2 + width2 && x + width > x2 &&
                y < y2 + height2 && height + y > y2);
    };

    if(collides(this.x,
                this.y,
                this.width,
                this.height,
//                player.x + widthOverlap,
//                player.y + heightOverlap,
//                player.width - widthOverlap,
//                player.height - heightOverlap)) {
                player.x, // + 30,
                player.y, // + 80,
                player.width, // - 40,
                player.height)){ // - 90)) {
        console.log("colision");
        player.resetScore();
        player.resetPosition();
    };
};


Enemy.prototype.reset = function() {
    this.x = this.width * (-1); // Start the enemy x coordinate off the canvas
    this.speed = Math.random() + 0.25;
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){

    this.canvasWidth = 505;
    this.canvasHeight = 606;

    // Load the image for the sprite
    this.sprite = 'images/char-boy.png';

    // width and height values are used extensively so
    // I'm creating variables instead of hardcoding all over the place
    //this.width = 76;
    //this.height = 85;

    this.width = 101;
    this.height = 171;

    // Setting the Enemy initial location - x, y coordinates
    // I'm placing the player in the middle of the canvas towards the bottom
    this.x = this.canvasWidth/2 - this.width/2;
    this.y = this.canvasHeight - this.height + 150;

    // Initial score is zero
    this.score = 0;
};

Player.prototype.update = function() {
    this.checkPlayerBounds();
    this.checkCollisions();
};

Player.prototype.setScore = function(val) {
    this.score = this.score + val;
    console.log("score = " + this.score);
};

Player.prototype.getScore = function() {
    return this.score;
};

Player.prototype.resetScore = function() {
    this.score = 0;
    console.log("score = " + this.score);
};

Player.prototype.resetPosition = function() {
    this.x = this.canvasWidth/2 - this.width/2;
    this.y = this.canvasHeight - this.height - 50;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Display the score
    ctx.font = "20px Arial";
    ctx.fillText("score: " + this.score,5, ctx.canvas.height - 35);
};

Player.prototype.handleInput = function(keyCode) {
    console.log("keyCode = " + keyCode);
    var stepSize = 20;  // I came up with 20 through trial and error.

    switch(keyCode) {
        case "up":
            this.y = this.y - stepSize;
            break;
        case "down":
            this.y = this.y + stepSize;
            break;
        case "left":
            this.x = this.x - stepSize;
            break;
        case "right":
            this.x = this.x + stepSize;
            break;
    };
};

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
    else if(this.y > ctx.canvas.height - this.height -55) {
        this.y = ctx.canvas.height - this.height -55;
    };

    // Check if player has reached the water.
    // If so increment the score and reset the player position.
    if(this.y <= 50) {
        this.setScore(1);
        this.resetPosition();
    }
};

Player.prototype.checkCollisions = function() {
  for (var i = 0; i < allEnemies.length; i++) {

    var enemy = allEnemies[i];

    if (this.x >= enemy.x + 0 &&
        this.x < enemy.x + 100 &&
        this.y >= enemy.y + 0 &&
        this.y < enemy.y + 85) {
            console.log("colision");
            this.resetScore();
            this.resetPosition();
        }
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
allEnemies = [];

// Start the enemies moving at random start times.

setTimeout(function(){
    //allEnemies.push(new Enemy(0, 60 + 83));
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
