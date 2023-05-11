window.addEventListener('resize', startGame);

const scoreBoard = document.getElementById('scoreBoard');
//const recordBoard = document.getElementById("recordBoard");
const wrapper = document.getElementById('wrapper');
const cctitle = document.getElementById('cc-title');
const startGameText = document.getElementById('startGame');
const drinkContainer = document.getElementById('drinkContainer');
const cctitleContainer = document.getElementById('cctitleContainer')
const header = document.getElementById('header')
const sub = document.getElementById('sub')


var ballEl;
var bounces = 0;
//let record = 0;
const bouncesStart = 0;
var latestScore = 0;
var scoreToWin = 5;

var x = 100;                 // initial x position of the ball
var y = 100;                 // initial y position of the ball
var initialSpeedY = -10;     // initial vertical speed of the ball
var speedY = initialSpeedY;  // initial vertical speed of the ball
var speedX = 0;              // initial horizontal speed of the ball
var gravity = 0.4;           // acceleration due to gravity
var damping = 0.2;           // loss of energy on bouncing


var ballWH = 60;
var lives = 1;
var click = false;
//let recordMode = false;
var interval;

var animationSpin = null;
var animationZoom;

//variables for array and db
var scoreArr = [];          //save score and gameDone()
var done;
var game_type;
var st;


var gameHeight = wrapper.offsetHeight + 'px';
var gameWidth = wrapper.offsetWidth + 'px';

wrapper.style.height = gameHeight;
wrapper.style.width = gameWidth;

ballEl = document.createElement('img');
ballEl.className = 'ball';
ballEl.src = '/3.png';
ballEl.style.width = ballWH + 'px';
ballEl.style.height = ballWH + 'px';
ballEl.style.top = ballWH + 'px';
ballEl.style.left = ballWH + 'px';

gameDiv.appendChild(ballEl);

drinkEl = document.createElement('img');
drinkEl.className = 'drink';
drinkEl.src = '/4.png';

drinkContainer.appendChild(drinkEl);

startGameText.innerText = 'Starta';
gameDiv.style.display = 'none';
cctitleContainer.style.display = 'none';
//header.innerText = 'Få över 20 poäng för att vara med och tävla!';
//sub.innerText = 'De 30 bästa tiderna med över 20poäng vinner varsitt flak Ár Performance';

ballEl.addEventListener('click', function (event) {
    bounces += 1;

    click = true;
    speedY = -10; // reset the vertical speed of the ball on clicking

    //speedX based on the horizontal position of the click relative to the ball's center
    var clickX = event.clientX - wrapper.offsetLeft;
    var ballCenterX = x + ballWH / 2;
    var diffX = ballCenterX - clickX;
    speedX = diffX / 10; //horizontal speed of the ball

    animationSpin = ballEl.animate(
        [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ],
        {
            duration: 4000,
            iterations: Infinity
        }
    );

    /*     if (bounces > record) {
            record = bounces;
            if (!recordMode) {
                bounces = bounces;
                recordMode = true;
            }
        } */
});
//recordBoard.innerText = '0';

function startGame(/* dataCards, 
                      _done, 
                      _game_type,
                      _st, 
                      _scoreToWin*/) {

    /*      game_type = _game_type;
            done = _done;
            st = _st;
            scoreToWin = _scoreToWin; */

    bounces = 0;
    click = false;
    scoreBoard.innerText = bouncesStart;
    startGameText.style.display = 'none';
    gameDiv.style.display = 'flex';
    drinkContainer.style.display = 'none';
    cctitleContainer.style.display = 'flex';
    header.style.display = 'none';
    sub.style.display = 'none';

    clearInterval(interval);

    update();
}

function update() {
    interval = setInterval(() => {
        x += speedX;
        y += speedY;
        speedY += gravity;

        //collision with the bottom of the screen
        if (y + ballWH > wrapper.clientHeight - ballWH) {
            y = wrapper.clientHeight - (ballWH * 2);
            speedY = -speedY * damping;
            speedX = -speedX;
            //recordMode = false;

            if (speedX < 1 && bounces < scoreToWin) {
                click = false;
                speedX = 0;
                gameLost();

            } else if (speedX < 1 && bounces >= scoreToWin) {
                click = false;
                speedX = 0;
                gameWon();
            }
        }

        //collision with the left or right side of the screen
        if (x < 0 || x + ballWH > wrapper.clientWidth) {
            speedX = -speedX; // reverse the horizontal speed of the ball to simulate a bounce
        }

        // update the ball
        ballEl.style.top = y + 'px';
        ballEl.style.left = x + 'px';
        scoreBoard.innerText = bounces;

        /*         //update record number and style according to the current number of bounces
                if (recordMode) {
                    recordBoard.classList.add("recordmode");
                } else {
                    recordBoard.classList.remove("recordmode");
                } */
        scoreBoard.innerText = bounces;
        //recordBoard.innerText = record;
    }, 22);
}


function gameLost() {
    if (bounces >= 1) {
        var lastBounces = bounces;
        bounces = 0;
        //record = record;

        scoreBoard.innerText = bounces;
        cctitle.innerText = 'Du fick: ' + lastBounces + ' poäng. Försök igen!';

        // clear interval
        clearInterval(interval);

        if (!click && animationSpin) {
            animationSpin.pause();
        }
        startGame();
    }
}


function gameWon() {
    scoreBoard.innerText = bounces;
    cctitle.innerText = bounces;
    cctitle.innerText = 'Du fick: ' + bounces + ' poäng! Du vann!';
    scoreArr.unshift(gameDone);
    scoreArr.unshift(bounces);
    //console.log(scoreArr)

    if (animationSpin) {
        animationSpin.pause();
    }
    gameDone();
}

function gameDone() {
    if (game_type == "contestJuggle") {
        done(game_type, encodeString((Date.now() - st).toString()));
    } else if (game_type == "couponJuggle") {
        done("contestJuggle", encodeString((Date.now() - st).toString()));
    }
}

var encodeString = function (val/*:String*/) {
    var res/*:String*/ = "";

    for (var i/*:Number*/ = 0; i < val.length; i++) {
        res += String.fromCharCode((val.charCodeAt(i) + 64));
    }

    return res;
};