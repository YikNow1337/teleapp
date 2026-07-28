let player;
let platforms;
let cursors;

const config = {
    type: Phaser.AUTO,

    width: 400,
    height: 700,

    parent: "game",

    backgroundColor: "#87CEEB",

    physics: {
        default: "arcade",

        arcade: {
            gravity: {
                y: 1000
            },

            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

function preload() {

    // Загружаем изображения

    this.load.image("background", "assets/background.png");

    this.load.image("platform", "assets/platform.png");

    this.load.image("player", "assets/player.png");

}

function create() {

    // Фон

    this.add.image(200, 350, "background");



    // Платформы

    platforms = this.physics.add.staticGroup();

    platforms.create(200, 680, "platform");



    // Игрок

    player = this.physics.add.sprite(100, 550, "player");

    player.setCollideWorldBounds(true);

    player.setBounce(0);



    // Столкновение

    this.physics.add.collider(player, platforms);



    // Клавиатура

    cursors = this.input.keyboard.createCursorKeys();

}

function update() {

    if (
        cursors.space.isDown &&
        player.body.blocked.down
    ) {

        player.setVelocityY(-550);

    }

}