// ===========================
// Telegram Mini App
// ===========================

if (window.Telegram) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
// ===========================
// Игровые изображения
// ===========================

const backgroundImage = new Image();

backgroundImage.src =
"https://i.postimg.cc/TPg5QJ3P/25b5d789-62d6-46bf-8171-d058bc58e34e.jpg";


const platformImage = new Image();

platformImage.src =
"https://i.postimg.cc/HsNJghJH/5eb64731-c7e9-47f5-b3bc-b29ac6f1cd9e-removebg-preview.png";


const playerImage = new Image();

playerImage.src =
"https://i.postimg.cc/3w5dy0FY/3929a832-5d3f-492c-8b57-dfc7b16cef2e-removebg-preview.png";
// ===========================
// Canvas
// ===========================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===========================
// Интерфейс
// ===========================

const scoreElement = document.getElementById("score");
const jumpButton = document.getElementById("jumpButton");
const gameOverWindow = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restart");

// ===========================
// Игрок
// ===========================

const player = {

    x: 120,
    y: 0,

    width: 70,
    height: 70,

    color: "#ff4444",

    velocityX: 0,
    velocityY: 0,

    onGround: true

};

// ===========================
// Настройки физики
// ===========================

const gravity = 0.6;

const jumpPowerMultiplier = 0.35;

const maxJumpPower = 70;

// ===========================
// Мир
// ===========================

let cameraX = 0;

let score = 0;

let gameOver = false;

// ===========================
// Заряд прыжка
// ===========================

let charging = false;

let jumpPower = 0;

// ===========================
// Платформы
// ===========================

let platforms = [

    {
        x:0,
        width:350
    },

    {
        x:480,
        width:300
    },

    {
        x:930,
        width:360
    }

];

// ===========================
// Генерация платформ
// ===========================

function generatePlatform(){

    const last = platforms[platforms.length-1];

    const gap =
        120 +
        Math.random()*180;

    const width =
        260 +
        Math.random()*260;

    platforms.push({

        x:last.x+last.width+gap,

        width:width

    });

}

// ===========================
// Создаем запас платформ
// ===========================

for(let i=0;i<30;i++){

    generatePlatform();

}

// ===========================
// Игрок всегда стоит
// на первой платформе
// ===========================

player.y =
canvas.height-160-player.height;

// ===========================
// Управление кнопкой
// ===========================

jumpButton.addEventListener("mousedown",()=>{

    if(gameOver) return;

    if(!player.onGround) return;

    charging=true;

});

jumpButton.addEventListener("mouseup",()=>{

    if(gameOver) return;

    if(!player.onGround) return;

    charging=false;

    player.velocityX=
    jumpPower*jumpPowerMultiplier;

    player.velocityY=
    -(jumpPower*0.55);

    player.onGround=false;

    jumpPower=0;

});

jumpButton.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    if(gameOver) return;

    if(!player.onGround) return;

    charging=true;

});

jumpButton.addEventListener("touchend",(e)=>{

    e.preventDefault();

    if(gameOver) return;

    if(!player.onGround) return;

    charging=false;

    player.velocityX=
    jumpPower*jumpPowerMultiplier;

    player.velocityY=
    -(jumpPower*0.55);

    player.onGround=false;

    jumpPower=0;

});

// ===========================
// Рисуем платформы
// ===========================

function drawPlatforms(){

    for(let p of platforms){


        let x = p.x - cameraX;

        let y = canvas.height - 120;


        if(platformImage.complete){

            ctx.drawImage(

                platformImage,

                x,

                y,

                p.width,

                120

            );

        }

    }

}

// ===========================
// Рисуем игрока
// ===========================

function drawPlayer(){

    if(playerImage.complete){

        ctx.drawImage(

            playerImage,

            player.x,

            player.y,

            player.width,

            player.height

        );

    }

}

// ===========================
// Фон
// ===========================

function drawBackground(){

    if(backgroundImage.complete){

        let pattern =
        ctx.createPattern(
            backgroundImage,
            "repeat"
        );

        ctx.fillStyle = pattern;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

}
// ===========================
// Физика
// ===========================

function updatePlayer() {

    // Заряжаем прыжок
    if (charging) {

        jumpPower += 0.8;

        if (jumpPower > maxJumpPower)
            jumpPower = maxJumpPower;

    }

    // Если игрок в воздухе
    if (!player.onGround) {

        player.velocityY += gravity;

        player.x += player.velocityX;

        player.y += player.velocityY;

        // воздух постепенно тормозит
        player.velocityX *= 0.992;

    }

    // Проверяем платформы
    let landed = false;

    for (let p of platforms) {

        const left = p.x - cameraX;
        const right = left + p.width;

        const groundY = canvas.height - 120;

        // Игрок находится над платформой
        if (
            player.x + player.width > left &&
            player.x < right &&
            player.velocityY >= 0 &&
            player.y + player.height >= groundY &&
            player.y + player.height <= groundY + 20
        ) {

            player.y = groundY - player.height;
            player.velocityY = 0;
            player.velocityX = 0;
            player.onGround = true;

            landed = true;

            break;

        }

    }

    // Если не приземлился
    if (!landed && !player.onGround) {

        if (player.y > canvas.height + 100) {

            loseGame();

        }

    }

}

// ===========================
// Камера
// ===========================

function updateCamera() {

    const target = player.x - 120;

    if (target > cameraX) {

        cameraX = target;

    }

}

// ===========================
// Генерация мира
// ===========================

function updateWorld() {

    const last = platforms[platforms.length - 1];

    if (last.x - cameraX < canvas.width + 600) {

        generatePlatform();

    }

    // Удаляем очень старые платформы

    while (platforms.length > 0 &&
           platforms[0].x + platforms[0].width < cameraX - 300) {

        platforms.shift();

        score++;

        scoreElement.innerText = score;

    }

}

// ===========================
// Проигрыш
// ===========================

function loseGame() {

    gameOver = true;

    finalScore.innerText = score;

    gameOverWindow.style.display = "block";

}

// ===========================
// Рестарт
// ===========================

function restartGame() {

    score = 0;

    scoreElement.innerText = 0;

    gameOver = false;

    gameOverWindow.style.display = "none";

    cameraX = 0;

    jumpPower = 0;

    charging = false;

    player.x = 120;

    player.y = canvas.height - 160 - player.height;

    player.velocityX = 0;

    player.velocityY = 0;

    player.onGround = true;

    platforms = [

        { x: 0, width: 350 },

        { x: 480, width: 300 },

        { x: 930, width: 360 }

    ];

    for (let i = 0; i < 30; i++) {

        generatePlatform();

    }

}

restartButton.onclick = restartGame;
// ===========================
// Индикатор силы прыжка
// ===========================

function drawPowerBar() {

    if (!charging)
        return;

    ctx.fillStyle = "#000";

    ctx.fillRect(20, canvas.height - 45, 220, 20);

    ctx.fillStyle = "#00ff00";

    ctx.fillRect(
        20,
        canvas.height - 45,
        (jumpPower / maxJumpPower) * 220,
        20
    );

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(20, canvas.height - 45, 220, 20);

}

// ===========================
// Отрисовка очков
// ===========================

function drawScore() {

    scoreElement.innerText = score;

}

// ===========================
// Игровой цикл
// ===========================

function gameLoop() {

    if (!gameOver) {

        updatePlayer();

        updateCamera();

        updateWorld();

    }

    drawBackground();

    drawPlatforms();

    drawPlayer();

    drawPowerBar();

    drawScore();

    requestAnimationFrame(gameLoop);

}

// ===========================
// Запуск игры
// ===========================

gameLoop();

// ===========================
// Изменение размера окна
// ===========================

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

});

// ===========================
// Клавиша пробел
// (для игры с компьютера)
// ===========================

document.addEventListener("keydown", (e) => {

    if (e.code === "Space") {

        if (!player.onGround)
            return;

        charging = true;

    }

});

document.addEventListener("keyup", (e) => {

    if (e.code === "Space") {

        if (!player.onGround)
            return;

        charging = false;

        player.velocityX = jumpPower * jumpPowerMultiplier;

        player.velocityY = -(jumpPower * 0.55);

        player.onGround = false;

        jumpPower = 0;

    }

});
