let canvas,
    player,
    ctx,
    foodArray = [],
    enemyArray = [];

canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext("2d");

//globals
const gravity = 0.8;
const ground = canvas.height/1.3;//use this for the land above the burrow
const bearSpeed = 5;



class Player{
    constructor(){
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.y = canvas.height - this.height;
        this.dx = 0;
        this.dy = 0;
        this.right = false;
        this.left = false;
        this.jumped = false;
        this.spikeSize = 30;
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.fill();
        // if(this.right){
        //     ctx.rect(this.x - this.spikeSize, this.y, this.spikeSize, this.height);
        //     ctx.strokeStyle = 'green';
        //     ctx.stroke();
        // }
        // else if(this.left){
        //     ctx.rect(this.x + this.width, this.y, this.spikeSize, this.height);
        //     ctx.strokeStyle = 'green';
        //     ctx.stroke();
        // }

        // else{
        //     ctx.rect(this.x, this.y, this.width, -this.spikeSize);
        //     ctx.rect(this.x - this.spikeSize, this.y, this.spikeSize, this.height);
        //     ctx.rect(this.x + this.width, this.y, this.spikeSize, this.height);
        //     ctx.strokeStyle = 'green';
        //     ctx.stroke();
        // }

    }

    update(){
        if(this.y + this.height < canvas.height){
            this.dy += gravity;
            this.y += this.dy;
        }
        if(this.jumped){
            this.y += this.dy;
        }
        if(this.y + this.height > canvas.height){
            this.jumped = false;
            // to not get stuck in the ground
            this.y = canvas.height - this.height;
        }
        this.x += this.dx;

        // keep within the canvas
        if (this.x < 0){
          this.x = 0;
        }
        else if (this.x + this.width > canvas.width){
          this.x = canvas.width - this.width;
        }
    }

    moveRight(){
        this.dx += 3;
        this.right = true;
    }
    moveLeft(){
        this.dx += -3;
        this.left = true;
    }
    stopRight(){
        this.dx += -3
        this.right = false;
    }
    stopLeft(){
        this.dx += 3;
        this.left = false;
    }
    jump(){
        this.dy = -20;
        this.jumped = true;
    }
    fall(){
      // can only fall when rising
      if (this.dy < 0){
        this.dy = this.dy * 0.2; // setting it to zero made it too...magentic
      }
    }
}

class Enemy{
    constructor(x, dx){
        this.width = 100;
        this.height = 100;
        this.x = x;
        this.y = canvas.height - this.height;
        this.dx = dx;
        this.dy = 0;
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.width,this.height);
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'blue';
        ctx.fill();
    }

    update(){
        this.x += this.dx;
    }
}

class Food{
    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

function hitDot(mouse, dot){
    //we need to check if its past the line of x
    if(mouse.x + mouse.width > dot.x - dot.radius &&//right side of square left side of dot
        mouse.y < dot.y + dot.radius &&//top of square bottom of dot
        mouse.x < dot.x + dot.radius &&
        mouse.y + mouse.height > dot.y + dot.radius){
            console.log('eat food');
            return true;
    }
}

//this function shouldnt return true or false but return the side the collision happened
function hitEnemy(dot, mouse){
    let left,right,top,bottom;
    if(mouse.x + mouse.width > dot.x - dot.width){
        right = true;
    }else{
        right = false;
    }

    if(mouse.x < dot.x + dot.width){
        left = true;
    }else{
        left = false;
    }

    if(mouse.y < dot.y + dot.height){
        top = true;
    }else{
        top = false;
    }

    if(mouse.y + mouse.height <= dot.y + dot.height){
        bottom = true;
    }else{
        bottom = false;
    }
    if(mouse.x + mouse.width + mouse.dx > dot.x - dot.width &&//right side of square left side of dot
        mouse.y < dot.y + dot.height &&//top of square bottom of dot
        mouse.x < dot.x + dot.width &&
        mouse.y + mouse.height <= dot.y + dot.height){
            return true;
    }
}

function update(){
    player.update();
    //check if hit food
    for (let i = 0; i < foodArray.length; i++) {
        if(hitDot(player, foodArray[i])){
            foodArray.splice(i, 1);
        }
    }

    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].update();
        //check if hit enemy
        if(hitEnemy(player, enemyArray[i]) || enemyArray[i].x > canvas.height + 1000 || enemyArray[i].x < -1500){
            enemyArray.splice(i, 1);
            console.log(enemyArray);

        }
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    player.draw();
    for (let i = 0; i < foodArray.length; i++) {
        foodArray[i].draw();
    }
    for (let i = 0; i < enemyArray.length; i++) {
        enemyArray[i].draw();
    }
}

function animate(){
    draw();
    update();
    requestAnimationFrame(animate);
}

//finish loading everything and then start our game
window.onload = function(){
    player = new Player();
    animate();
    //add food
    setInterval(()=>{
        foodArray.push(new Food(Math.random() * canvas.width/2 + canvas.width/2, Math.random() * 100 + 350, 10));
    }, 1000);

    setInterval(()=>{
        //also add enemies, maybe a different interval
        //we need to check where the player is
        //get random position for either side of the screen
        let leftRandom = Math.random() * -100 + -1000;
        let rightRandom = Math.random() * canvas.width + (canvas.width+500);
        if(Math.random() > 0.5){
            enemyArray.push(new Enemy(leftRandom, 5));
        }else{
            enemyArray.push(new Enemy(rightRandom, -5));
        }
    }, 5000);
};

document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 39 && player.right == false){//right
        player.moveRight();
    }
    if(e.keyCode == 37 && player.left == false){//left
        player.moveLeft();
    }
    if(e.keyCode == 38 && player.jumped == false){//up
        player.jump();
    }
});
document.addEventListener('keyup', (e)=>{
    if(e.keyCode == 39){//right
        player.stopRight();
    }
    if(e.keyCode == 37){//left
        player.stopLeft();
    }
    if(e.keyCode == 38){//up
      player.fall();
    }
});



/*
Thoughts on this game.

What if made a game about a porcupine.

I wanted my back game to be more intuitive with how it relates to the theme.




Ideas: In this game you move forward and have to turn around to take out your enemies
The enemies are things that want to eat you maybe?
Where are we going:
Searching for food and water, then trying to get back home.
Randomly generate levels
Counter for how much food we need for the day. like 0/5 for the day
once you get enough food you wont be hungry tonight
if you go to sleep with out food for the day you lose a heart?
the goal is to get hearts and mature them find a mate?

name for the game. maybe name based on the goal like:
find your other half
Maybe a character name


*/
