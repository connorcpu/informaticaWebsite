var canvasWidth = 600;
var canvasHeight = 400;

var player;
var playerWidth = 30;
var playerHeight = 30;
var playerYPos = (canvasHeight / 2) - (playerHeight / 2);

var fallSpeed = 0;
var interval = null;

var isJumping = false;
var startJumpSpeed = 9;
var jumpSpeed = startJumpSpeed;
var jumpLength = 300;
//40 speed change cycles at 800 jumpLength; 50 at 1000
//speechange makes a nice parabola jumping motion based on the starting speed but it also needs the update interval and the time a jump will last
var speedChange = startJumpSpeed / (jumpLength / 20);

var blockWidth = 50;
var blockInterval = null; 
var blockMoveSpeed = 1.5;
const blockArray = [];
var blockGap = 150;
var minBlockSize = 30;

var XOffset = 15;
var gameOver = false;

var score = 0;

var gameCanvas = {

   canvas: document.createElement("canvas"),
   start: function() {

      document.addEventListener('keydown', function(e){

         if(e.keyCode == 32 && !isJumping){
            
            isJumping = true;
            setTimeout(function () {
               resetJump();
            }, jumpLength);

         }

      });
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);

   }

}

function startGame(){

   document.getElementById("button").remove();

   gameCanvas.start();

   player = new createPlayer(playerWidth, playerHeight, XOffset);

   blockInterval = setInterval(addBlock, 4000);
   interval = setInterval(updateCanvas, 20);


}

function random(min, max){

   return Math.random() * (max - min) + min;

}

function addBlock(){

   blockSize = random(minBlockSize, canvasHeight - minBlockSize - blockGap);

   block = new createBlock(0, blockSize);
   blockArray.push(block);

   //bottom block
   bottomBlock = new createBlock(blockSize + blockGap, canvasHeight - (blockSize + blockGap))
   blockArray.push(bottomBlock);

}

function createBlock(y, height){

   this.x = canvasWidth;
   this.y = y;
   this.height = height;
   this.width = blockWidth;

   this.draw = function(){
   
      ctx = gameCanvas.context;
      ctx.fillStyle = "red"
      ctx.fillRect(this.x, this.y, this.width, this.height);

   }

   this.move = function(){

      this.x -= blockMoveSpeed;

      if(this.x < -blockWidth){

         blockArray.shift();

            score += 0.5
         }

   }

}

function createPlayer(width, height, x){

   this.width = width;
   this.height = height;
   this.x = x;
   this.y = playerYPos;

   this.checkColision = function(rect){

      if(rect.x + rect.width > this.x &&
         rect.y + rect.height > this.y &&
         this.x + this.width > rect.x &&
         this.y + this.height > rect.y){

         gameOver = true;

      }

   }

   this.checkRoof = function(){

      if(this.y < 0){

         gameOver = true;

      } else if(this.y >= (canvasHeight - this.height)){

        gameOver = true; 

      }

   }

   this.draw = function(){

      ctx = gameCanvas.context;
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.font = "20px Courier New"
      ctx.fillText("SCORE: " + score, 2, canvasHeight - 5);
      cook = document.cookie;
      ctx.fillText("HIGHSCORE: " + cook.substring(cook.indexOf('=') + 1), 2, 20);

   }

   this.makeFall = function(){

      if(!isJumping){

         this.y += fallSpeed;
         fallSpeed += speedChange;
         this.stopPlayer();

      }

   }

   this.stopPlayer = function(){

      var ground = canvasHeight - this.height;

      if(this.y > ground){

         this.y = ground;

      }

   }

   this.jump = function() {
      if(isJumping){

         this.y -= jumpSpeed;
         jumpSpeed -= speedChange;

      }

   }

}

function updateCanvas() {

   ctx = gameCanvas.context;
   ctx.clearRect(0, 0, canvasWidth, canvasHeight);

   player.makeFall();
   player.jump();
   player.draw();
   player.checkRoof();

   for(let i = 0; i < blockArray.length; i++){

      blockArray[i].move();
      player.checkColision(blockArray[i]);
      blockArray[i].draw();

   }

   checkGameOver();

}

function checkGameOver(){

   if(gameOver){

      clearInterval(interval);

      ctx = gameCanvas.context;
      ctx.font = "90px Courier New"
      ctx.fillText("GAME OVER", (canvasWidth - ctx.measureText("GAME OVER").width) / 2, 200);

      cook = document.cookie

      if(parseInt(cook.substring(cook.indexOf('=') + 1)) < score || cook == ""){
         
         ctx.fillStyle = "yellow";
         ctx.font = "30px Courier New";
         ctx.fillText("old highscore: " + cook.substring(cook.indexOf('=') + 1), (canvasWidth - ctx.measureText("old highscore: " + cook.substring(cook.indexOf('=') + 1)).width) / 2, 250);
         ctx.fillText("new highscore: " + score, (canvasWidth - ctx.measureText("new highscore: " + score).width) / 2, 300);
         ctx.fillText("NEW HIGH SCORE", (canvasWidth - ctx.measureText("NEW HIGH SCORE").width) / 2, 350);
         
         document.cookie = "highscore=" + score;
      
      }
   }

}

function resetJump(){

   jumpSpeed = startJumpSpeed;
   isJumping = false;
   fallSpeed = 0;

}

