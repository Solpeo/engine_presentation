function arkanoid(div_id, part){

    var game = new Engine.Timer({
        type: Engine.Timer.VSYNC,
        loop: true
    });

    // PART13
    // GAMEOVER
    game.on('over', function(){

        initBricks();
        initPaddle();
        initBall();

    });

    game.initPaddle = initPaddle;
    game.initBall = initBall;
    game.initBricks = initBricks;

    part = part === undefined ? null : part;

    // PART 1
    // CREATE VIEWPORT AND SCENE
    var viewport = new Engine.Viewport({
        width: 800,
        height: 600,
        id: div_id,
        background: 'black'
    });

    var camera = new Engine.Camera({
        //scrollable: true
    });

    viewport.addCamera(camera);

    var scene = new Engine.Scene();

    camera.lookAt(scene);

    // PART2
    // CREATE ROOT NODE
    var layout = new Engine.Node();

    scene.appendChild(layout);

    // PART3
    // CREATE LOCATION BORDERS
    var AREA = new Engine.Box(-400, -300, 800, 600);
    var BORDER = 30;

    var top_bar = new Engine.Geometry.Rectangle({
        parent: layout,
        left: AREA.x,
        top: AREA.y,
        width: AREA.w,
        height: BORDER,
        fill: 'image(assets/images/bricks.png)'
    });

    // Same for left_bar and right_bar

    var left_bar = new Engine.Geometry.Rectangle({
        parent: layout,
        left: AREA.x,
        top: AREA.y,
        width: BORDER,
        height: AREA.h,
        fill: 'image(assets/images/bricks.png)'
    });

    var right_bar = new Engine.Geometry.Rectangle({
        parent: layout,
        left: AREA.x + AREA.w - BORDER,
        top: AREA.y,
        width: BORDER,
        height: AREA.h,
        fill: 'image(assets/images/bricks.png)'
    });

    if (part === 'borders') return game;

    // PART4
    // CREATE A PADDLE
    var paddle = new Engine.Geometry.Rectangle({
        parent: layout,
        name: 'paddle',
        fill: 'image(assets/images/paddle.png)',
        width: 120,
        height: 20
    });

    // CREATE A BALL
    var ball = new Engine.Geometry.Oval({
        parent: layout,
        fill: 'green',
        radius: 11
    });

    if (part === 'paddle&ball') return game;

    var BALL_ACCELERATION = 0.25,
        BALL_SPEED_X = 0,
        BALL_SPEED_Y = 0;

    function initPaddle(){

        paddle.setPosition(- paddle.width / 2 + AREA.x + AREA.w / 2, AREA.y + AREA.h - paddle.height);

    }

    function initBall(){

        ball.setPosition(paddle.left + paddle.width / 2 - ball.width / 2, paddle.top - ball.height);

        BALL_SPEED_Y = - BALL_ACCELERATION;
        if ((Math.random() - 0.5) > 0)
            BALL_SPEED_X = BALL_ACCELERATION;
        else
            BALL_SPEED_X = - BALL_ACCELERATION;

    }

    initPaddle();
    initBall();

    if (part === 'init paddle&ball') return game;

    // PART6
    // CREATE BRICKS
    var BRICKS_X = 6;
    var BRICKS_Y = 5;
    var BRICKS_MARGIN = 25;

    var BRICK_WIDTH = (AREA.w - 2 * BORDER - (BRICKS_X + 1) * BRICKS_MARGIN) / BRICKS_X;
    var BRICK_HEIGHT = (AREA.h / 2 - 2 * BORDER - (BRICKS_Y + 1) * BRICKS_MARGIN) / BRICKS_Y;

    // list of bricks instances
    var bricks = [];

    function randomColor(){

        return ['red', 'orange','yellow'].random();

    }

    function initBricks(){

        while(bricks.length) bricks.pop().destroy();

        for (var i = 0; i < BRICKS_X; i++){

            for (var j = 0; j < BRICKS_Y; j++) {

                var left = 2 * BORDER + AREA.x + i * BRICKS_MARGIN + i * BRICK_WIDTH;
                var top = 2 * BORDER + AREA.y + j * BRICKS_MARGIN + j * BRICK_HEIGHT;

                bricks.push(new Engine.Geometry.Rectangle({
                    parent: layout,
                    fill: randomColor(),
                    left: left,
                    top: top,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT
                }));

            }
        }
    }

    initBricks();

    if (part === 'bricks') return game;

    // PART7
    // GAME LOOP

    // PART8
    // HANDLING INPUT
    var PADDLE_SPEED = 0,
        PADDLE_ACCELERATION = 0.4;

    // key pressed
    Engine.Input.on('keydown', function(e){

        switch(e.key){
            case 'A':
                PADDLE_SPEED -= PADDLE_ACCELERATION; break;
            case 'D':
                PADDLE_SPEED += PADDLE_ACCELERATION; break;
        }

    // key release
    });

    Engine.Input.on('keyup', function (e){
            switch(e.key){
                case 'A':
                    PADDLE_SPEED += PADDLE_ACCELERATION; break;
                case 'D':
                    PADDLE_SPEED -= PADDLE_ACCELERATION; break;
            }
        });

    if (part === 'input') return game;

    // update paddle position
    game.on('step', function(){
        var dt = this.stepprogress;
        var left = Math.max(left_bar.right,
            Math.min(paddle.left + dt * PADDLE_SPEED,
                right_bar.left - paddle.width)
        );
        paddle.setPosition(left, paddle.top);
    });

    if (part === 'loop') return game;

    // PART9
    // MOVING THE BALL

    game.on('step', function(){

        var dt = this.stepprogress;

        ball.setPosition(ball.left + dt * BALL_SPEED_X, ball.top + dt * BALL_SPEED_Y);

    });

    if (part === 'move ball') return game;

    // PART10
    // COLLISIONS

    // BALL WITH BARS
    game.on('step', function(){

        if(
            Engine.Box.overlap(ball.left, ball.top, ball.width, ball.height,
                top_bar.left, top_bar.top, top_bar.width, top_bar.height) ||
                Engine.Box.overlap(ball.left, ball.top, ball.width, ball.height,
                    paddle.left, paddle.top, paddle.width, paddle.height)
            ){
            BALL_SPEED_Y *= -1;
            game.trigger('bounce');
        }

        if(
            Engine.Box.overlap(ball.left, ball.top, ball.width, ball.height,
                left_bar.left, left_bar.top, left_bar.width, left_bar.height) ||
                Engine.Box.overlap(ball.left, ball.top, ball.width, ball.height,
                    right_bar.left, right_bar.top, right_bar.width, right_bar.height)
            ){
            BALL_SPEED_X *= -1;
            game.trigger('bounce');
        }

        if(!Engine.Box.overlap(ball.left, ball.top, ball.width, ball.height,
            AREA.x, AREA.y, AREA.w, AREA.h))
            game.trigger('over');
    });

    // BALL WITH ANY OF BRICKS
    game.on('step', function(){
        bricks.some(collide);
    });

    function collide(brick){

        if (Engine.Box.overlap(brick.left, brick.top, brick.width, brick.height,
            ball.left, ball.top, ball.width, ball.height)){

            game.trigger('hit', brick);

            bricks.remove(brick);
            brick.destroy();

            if (!bricks.length)

                game.trigger('success');

            if (Math.random() < 0.5)

                BALL_SPEED_X *= -1;

            else

                BALL_SPEED_Y *= -1;

            return true;

        }

        return false;

    }

    if (part === 'collisions') return game;

    // PART11
    // SOUNDS
    var sounds = {
        collision: new Engine.Sound({
            src: "assets/sounds/collision"
        }),
        bounce: new Engine.Sound({
            src: "assets/sounds/bounce"
        })
    };

    game.on('bounce', function(){

        sounds.bounce.stop();
        sounds.bounce.play();

    });

    game.on('hit', function(){

        sounds.collision.stop();
        sounds.collision.play();

    });

    if (part === 'sounds') return game;

    // PART12
    // PARTICLES
    game.on('hit', function(brick){

        // size of emitter geometry
        var width = 4 * brick.width;
        var height = 4 * brick.height;

        new Engine.Particles({
            parent: layout,
            iterations: 5,
            emitDelay: 50,
            redrawDelay: 1,
            width: width,
            height: height,
            left: brick.left + brick.width / 2 - width / 2,
            top: brick.top + brick.height / 2 - height / 2,
            amount: 15,
            on: {
                beforecreateparticle: function(i){

                    this.lifetime = Math.random() * 500 + 900;
                    this.originX = Math.random() * 20 - 10 + width / 2;
                    this.originY = Math.random() * 20 - 10 + height / 2;
                    this.dx = (Math.random() - 0.5)  * width;
                    this.dy = (Math.random() - 0.5) * height;
                    this.fill = brick.color + ' 5px 5px';
                    this.opacity = Math.random() / 2;
                }
            }
        });
    });

    if (part === 'particles') return game;

    new Engine.Isometry.Transform.Z({
        parent: scene,
    }).appendChild(layout);

    camera.setZoom(0.8);

    if (part === 'isometry') return game;

    var angle = 0;

    t = new Engine.Isometry.Transform.Z({
        parent: scene,
    })

    t.appendChild(layout);

    camera.setZoom(0.8);

    game.on('step', function(){

        angle += Math.PI / 180;

        Engine.Isometry.TILE_WIDTH = (Math.cos(angle) - 0.5) * 64;
        Engine.Isometry.TILE_HEIGHT = (Math.sin(angle) - 0.5) * 32;

        t.set('align', 'x').set('align', 'z');

    });

    if (part === 'psychedelic') return game;

    return game;
                
}