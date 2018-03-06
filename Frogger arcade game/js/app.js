//Canvas Width and height
const canvasWidth = 505;
const canvasHeight = 606;

//Resources width and height
const imgHeight = 171;
const imgWidth = 101;

// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor(x, y, sprite = 'images/enemy-bug.png') {
        this.sprite = sprite;
        //x and y coordinates:
        this.x = x;
        this.y = y;

        //speed of the bugs with Math.random() from
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        this.speed = Math.floor((Math.random() * 200) + 100);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        if (this.x <= canvasWidth) {
            this.x = this.x + this.speed * dt;
        } else {
            //to show as if its coming out from the left of screen
            this.x = -5;
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Enemy {
    constructor(x = (canvasWidth - imgWidth) / 2, y = canvasHeight - 175, sprite = 'images/char-horn-girl.png') {
        super(x, y, sprite);
        this.sprite = sprite;
    }
    handleInput(e) {
        this.selectedArrow = e;
    }
    update() {
        //if left Arrow is pressed:
        if (this.selectedArrow === 'left' && this.x > 0) { //player isn't on left edge
            this.x = this.x - imgWidth / 2;
        }

        //if right Arrow is pressed:
        if (this.selectedArrow === 'right' && this.x < 400) { //player isn't on right edge
            this.x = this.x + imgWidth / 2;
        }

        //if up Arrow is pressed:
        if (this.selectedArrow === 'up' && this.y > 0) {
            this.y = this.y - imgHeight / 2;
        }

        //if down Arrow is pressed:
        if (this.selectedArrow === 'down' && this.y < 400) {
            this.y = this.y + imgHeight / 2;
        }
        //When the Player reaches the End
        if (this.y < 0) {
            this.x = (canvasWidth - imgWidth) / 2;
            this.y = canvasHeight - imgHeight;
        }
       //to reset selected arrow after each arrow click
        this.selectedArrow='';



        allEnemies.forEach((enemy) => {
            //check if Enemy is within player width and height
            if (this.x >= enemy.x - imgWidth/2 && this.x <= enemy.x + imgWidth/2) {
                if (this.y >= enemy.y - imgHeight/2 && this.y <= enemy.y + imgHeight/2) {
                    this.x = (canvasWidth - imgWidth) / 2;
                    this.y = canvasHeight - imgHeight;
                }
            }
        });
    }


}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [new Enemy(0, 50), new Enemy(0, 140), new Enemy(0, 230)]; //creates an array of Enemies


// Place the player object in a variable called player
let player = new Player();


// This listens for Arrow presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
