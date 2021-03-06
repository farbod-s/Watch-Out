var game = new Phaser.Game(288, 505, Phaser.AUTO, 'gameDiv');

var ground;
var green;
var yellow;
var cursors;

var score = 0;
var labelScore;

var leftToRight = true;
var isYellow = true;
var gameOver = false;

var toRightVel = 200;
var toLeftVel = -200;
var jumpVel = -750;
var gravity = 40;

var mainState = {
    preload: function() { 
        game.stage.backgroundColor = '#71c5cf';
        game.load.image('green', 'assets/green.png');
        game.load.image('yellow', 'assets/yellow.png');
        game.load.image('ground', 'assets/platform.png');
    },

    create: function() {
        this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        this.game.stage.scale.minWidth = 288;
        this.game.stage.scale.minHeight = 505;
        this.game.stage.scale.maxWidth = 1024;
        this.game.stage.scale.maxHeight = 768;
        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.pageAlignVertically = true;
        this.game.stage.scale.forceOrientation(true, false);
        this.game.stage.scale.setScreenSize(true);

        ground = game.add.sprite(0, game.world.height - 50, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        yellow = game.add.sprite(0, game.world.height - 150, 'yellow');
        yellow.scale.setTo(2, 2);
        yellow.body.gravity.y = gravity; 
        yellow.body.velocity.x = toRightVel;

        green = game.add.sprite(game.world.width - 50, game.world.height - 100, 'green');
        green.scale.setTo(1, 1);
        green.body.gravity.y = gravity; 
        green.body.velocity.x = toLeftVel;

        score = 0;  
        labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    },

    update: function() {
        game.physics.collide(yellow, ground);
        game.physics.collide(green, ground);

        if (yellow.inWorld == false || green.inWorld == false) {
            gameOver = false;
            this.restartGame(); 
        }

        game.physics.overlap(yellow, green, this.gameOver, null, this);  

        if (game.input.activePointer.isDown && game.input.activePointer.withinGame) {
            var checkJmp = false;
            if (leftToRight && game.input.activePointer.x <= (game.world.width / 2)) {
                checkJmp = true;
            }
            if (!leftToRight && game.input.activePointer.x >= (game.world.width / 2)) {
                checkJmp = true;
            }

            if (checkJmp) {
                if (isYellow && yellow.body.touching.down) {
                    yellow.body.velocity.y = jumpVel;
                } else if (!isYellow && green.body.touching.down) {
                    green.body.velocity.y = jumpVel;
                }
            }
        }   
    },

    restartGame: function() {
        var rand = Math.floor(Math.random() * 2);
        if (rand < 1) {
            leftToRight = true;
        } else {
            leftToRight = false;
        }

        rand = Math.floor(Math.random() * 2);
        if (rand < 1) {
            isYellow = true;
        } else {
            isYellow = false;
        }

        if (isYellow) {
            if (leftToRight) {
                yellow.reset(0, game.world.height - 150);
                yellow.body.velocity.x = toRightVel;

                green.reset(game.world.width - 50, game.world.height - 100);
                green.body.velocity.x = toLeftVel;
            } else {
                yellow.reset(game.world.width - 100, game.world.height - 150);
                yellow.body.velocity.x = toLeftVel;

                green.reset(0, game.world.height - 100);
                green.body.velocity.x = toRightVel;
            }

            yellow.scale.setTo(2, 2);
            green.scale.setTo(1, 1);
        } else {
            if (leftToRight) {
                yellow.reset(game.world.width - 50, game.world.height - 100);
                yellow.body.velocity.x = toLeftVel;

                green.reset(0, game.world.height - 150);
                green.body.velocity.x = toRightVel;
            } else {
                yellow.reset(0, game.world.height - 100);
                yellow.body.velocity.x = toRightVel;

                green.reset(game.world.width - 100, game.world.height - 150);
                green.body.velocity.x = toLeftVel;
            }

            yellow.scale.setTo(1, 1);
            green.scale.setTo(2, 2);
        }
        

        if (gameOver) {
            score = 0;
        } else {
            score += 1;
        }
        
        labelScore.setText(score.toString());
    },

    gameOver: function() {
        gameOver = true;
        this.restartGame();
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 