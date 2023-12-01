let setting = document.getElementById("s");
let pop = document.querySelector(".popUp-box");
let gameBoard = document.querySelector(".game-board");
let score = document.getElementById("sc");
let high = document.getElementById("high");
let sc =0;
let speed = 150;
//color
let defaultEl = document.getElementById("D");
if(localStorage.getItem("Settings") !=null){
    let details = JSON.parse(localStorage.getItem("Settings"));
    document.getElementById("B").value = details.board_color; 
    document.getElementById("S").value = details.score_color;
    document.getElementById("SN").value = details.snake_color;
    document.getElementById("F").value = details.food_color;
    document.getElementById("sel").value = details.speed;
    document.querySelector(".game-board").style.background = details.board_color;
    document.querySelector(".container").style.background = details.score_color;
    speed = details.speed;
    if(details.active){
        defaultEl.checked=true;
    }else{
        defaultEl.checked= false;
    }
}

let highScore = JSON.parse(localStorage.getItem("Score")) || 0;
high.textContent = `High Score is : ${highScore}`;
//pop Up open on setting click
setting.addEventListener('click', ()=>{
  pop.classList.toggle("hurr");
})
function save(){
    pop.classList.remove("hurr");
    if(defaultEl.checked){
        var set_color = {
            board_color: "#0e2149",
            score_color: "#31304D",
            snake_color: "#00fffb",
            food_color: "#ff0015",
            speed: 110,
            active: true
        }
    }else{
         set_color = {
            board_color: document.getElementById("B").value,
            score_color: document.getElementById("S").value,
            snake_color: document.getElementById("SN").value,
            food_color: document.getElementById("F").value,
            speed: document.getElementById("sel").value
        }
    }
    localStorage.setItem("Settings", JSON.stringify(set_color));
    document.querySelector(".game-board").style.background = set_color.board_color;
    document.querySelector(".container").style.background =set_color.score_color;
    speed = set_color.speed;
    clearInterval(start);
    console.log(set_color.speed);
    setInterval(game, speed);
}


//create food and Snake with HTML div and insert in Game Board
let foodX= 15, foodY = 15;
let snakeX =  12, snakeY= 22;
let velX=0,  velY=0;
const updateFood= ()=>{
    foodX = Math.floor(Math.random()*30)+1;
    foodY= Math.floor(Math.random()*30)+1;
}

function increseScore(){
    sc++;
    score.textContent = `Score is : ${sc}`;
}
let snakeBody = [];
let i;
function game(){
    console.log(speed);
    let foodClr;
    let snkClr;
    if(localStorage.getItem("Settings") !=null){
     details = JSON.parse(localStorage.getItem("Settings"));
     foodClr = details.food_color;
     snkClr = details.snake_color;
    }
    let html = `<div class="food" style="grid-area: ${foodY}/${foodX}; background-color: ${foodClr};"></div>`;
    // html+=`<div class="head" style="grid-area: ${snakeY}/${snakeX};"></div>`;
    if (snakeX == foodX && snakeY == foodY){
        updateFood();
        increseScore();
        snakeBody.push([foodX, foodY]);
        console.log(snakeBody);
    }
    for(let i=snakeBody.length-1; i>0; i--){
        snakeBody[i]= snakeBody[i-1];
    }
    snakeBody[0] = [snakeX, snakeY];
    snakeX+=velX;
    snakeY+= velY;
    if(snakeX<=0 || snakeX>=32 || snakeY<=0 || snakeY>=32){
        gamOver();
        clearInterval(start);
    }
    for(i=0; i<snakeBody.length; i++){
        html+=`<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}; background-color: ${snkClr}"></div>`; 
        if(i!=0 && snakeBody[0][1]===snakeBody[i][1] && i!=0 && snakeBody[0][0]===snakeBody[i][0]){
            gamOver();
            alert("Game over! Press Ok to restart");
        }
    }

    gameBoard.innerHTML = html;

}
updateFood();
let start = setInterval(game, speed);
function direction(e){
    if (e.key == "ArrowUp" && velY!=1){
        velX =0;
        velY =-1;
    }else if (e.key=="ArrowDown" && velY!=-1){
        velX=0;
        velY=1;
    }
    else if (e.key=="ArrowRight" && velX!=-1){
        velY=0;
        velX =1;
    }
    else if (e.key=="ArrowLeft" && velX!=1){
        velY =0;
        velX = -1;
    }

}
//key press
window.addEventListener("keydown", direction);

//gamOver
function gamOver(){
    //compare high score and current score and put in localstorage
    highScore = sc>=highScore ? sc : highScore;
    localStorage.setItem("Score", JSON.stringify(highScore));
    location.reload();
}


//arrow button
let btn = document.getElementsByClassName("r");
btn = Array.from(btn);
btn.forEach(e => {
  e.addEventListener("click", ()=>{
    direction({key:e.dataset.key});
  });  
});


