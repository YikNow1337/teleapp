import Phaser from "phaser";


// Настройки игры
const config = {

    type: Phaser.AUTO,

    width: 400,

    height: 700,


    parent: "game",


    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 900
            },

            debug: false
        }
    },


    scene: {

        create: create,

        update: update
    }
};


// Запуск игры
const game = new Phaser.Game(config);


// Переменные игры

let player;

let platform;

let cursors;


// Создание объектов
function create() {


    // Создаем персонажа
    player = this.physics.add.rectangle(
        100,
        300,
        40,
        40,
        0xff0000
    );


    // Делаем игрока физическим объектом
    this.physics.add.existing(player);


    player.body.setCollideWorldBounds(true);



    // Создаем платформу

    platform = this.add.rectangle(
        200,
        650,
        400,
        50,
        0x00ff00
    );


    this.physics.add.existing(platform, true);



    // Столкновение игрока с платформой

    this.physics.add.collider(
        player,
        platform
    );


    // Управление клавиатурой

    cursors = this.input.keyboard.createCursorKeys();


}


// Игровой цикл

function update() {


    // Прыжок вверх

    if (
        cursors.space.isDown &&
        player.body.touching.down
    ) {


        player.body.setVelocityY(-500);


    }

}