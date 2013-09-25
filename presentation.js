var demoSlides = {

    try3: {

        init: function(id){
            this.scene = new Engine.Scene();

            this.viewport = new Engine.Viewport({
                width: 600,
                height: 600,
                id: id,
                background: 'black',
                cameras: [
                        new Engine.Camera({
                            lookAt: this.scene
                        })
                ]
            });

            var square = new Engine.Transform({
                children: [
                    new Engine.Geometry.Rectangle({
                        width: 100,
                        height: 100,
                        fill: 'red'
                    })
                ]
            });
            this.scene.appendChild(square);

            this.timer = new Engine.Timer({
                autoplay: false,
                duration: 1000,
                loop: true,
                on: {
                    step: function(){
                        var co = this.progress / this.duration;
                        square.reset().rotate(co * 2 * Math.PI);
                    }
                }
            });
        },

        start: function(){
            this.timer.play();
        },

        stop: function(){
            this.timer.stop();
        }

    },

    pathfinding_demo: {

        init: function(div_id){
             
            this.scene = new Engine.Scene();

            this.drawLine = function (fromX,fromY, toX, toY, fill, width){
                var width = width || 1;
                var length = Math.sqrt( Math.pow(fromX-toX,2) + Math.pow(fromY-toY,2) );
                var angle = Math.atan( (fromY-toY) / (fromX - toX));
                var toReturn = new Engine.Transform({
                    children: [
                        new Engine.Transform({
                            children: [
                                new Engine.Geometry.Rectangle({
                                    width: length,
                                    height: width,
                                    fill: fill
                                })
                            ]
                        })
                    ]
                });
                toReturn.children[0].rotate(angle);
                var down = (angle < 0) ? Math.min(toY,fromY) + Math.abs(toY - fromY) : Math.min(toY,fromY);
                toReturn.translate(Math.min(fromX,toX), down);
                return toReturn;
            };
        
            this.drawTileLine = function(tileXFrom, tileYFrom, tileXTo, tileYTo, fill, width){
                var pxFrom = this.map.toPx(tileXFrom, tileYFrom, this.map.TILE_SIZE / 2, this.map.TILE_SIZE /2);
                var pxTo = this.map.toPx(tileXTo, tileYTo, this.map.TILE_SIZE / 2, this.map.TILE_SIZE /2);
                return this.drawLine(pxFrom[0], pxFrom[1], pxTo[0], pxTo[1], fill, width);
            };

            var camera;
        
            this.viewport = new Engine.Viewport({
                width: 700,
                height: 500,
                background: 'black',
                id: div_id,
                cameras: [
                    camera = new Engine.Camera({
                        lookAt: this.scene,
                        x: 350,
                        y: 250
                    })
                ]
            });
        
            this.map = new Engine.Image({
                name: 'map',
                src: "images/venezuela.png"
            });
        
            this.map.TILE_SIZE = 20;
            this.map.toPx = function(tileX,tileY,offsetX,offsetY){
                offsetX = offsetX || this.TILE_SIZE / 2;
                offsetY = offsetY || this.TILE_SIZE / 2;
                return [this.left + offsetX + this.TILE_SIZE * tileX,
                        this.top + offsetY + this.TILE_SIZE * tileY];
            };
            this.map.toTile = function(sceneX, sceneY){
                return [Math.floor((sceneX - this.left) / this.TILE_SIZE),
                        Math.floor((sceneY - this.top) / this.TILE_SIZE)]
            };
        
            this.scene.appendChild(this.map);
        
            this.scoremap = [
                [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,1,5,5,5,5,5,5,5  ],
                [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,2,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,5,5  ],
                [5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,2,1,3,3,3,5,5,5,5,5,1,1,5,5,5,5,5,1,1  ],
                [5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,5,5,5,5,5,5,1,1,1,5,5,5,5,5,5  ],
                [5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,1,1,1,5,5,5,5,5,5  ],
                [5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,2,4,4,5,5,5,5,5,5  ],
                [5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,3,1,3,1,1,1,1,1,5  ],
                [5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1  ],
                [5,5,1,2,2,2,2,2,2,1,1,1,3,1,1,1,1,5,5,5,5,1,1,1,1,1,2,2,1,1,1,1,1,1,1  ],
                [1,1,1,2,5,9,5,5,2,1,1,3,3,1,1,1,1,3,3,3,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1  ],
                [1,1,1,1,5,9,5,3,2,1,3,6,2,1,1,1,1,2,3,1,1,1,1,1,1,2,2,2,2,1,1,1,1,1,1  ],
                [1,1,1,1,2,3,3,2,1,1,2,6,2,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1  ],
                [1,1,1,1,1,2,2,1,1,1,2,6,2,1,1,1,1,1,3,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,6,2,1,1,1,1,5,5,1,1,2,2,2,2,2,2,2,2,2,3,1,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,6,2,1,1,1,5,5,5,5,1,1,1,2,2,2,2,4,4,4,3,2,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,6,2,1,1,5,5,5,5,5,1,1,2,2,2,2,2,2,4,4,3,2,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,6,2,1,1,5,5,5,5,5,5,1,2,2,2,2,2,4,4,4,2,1,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,2,1,1,1,3,5,5,5,5,5,1,1,2,1,3,3,4,4,2,1,1,1,1,1  ],
                [1,1,1,1,1,1,1,1,1,2,6,2,1,1,1,1,3,5,5,5,5,1,1,2,2,3,3,4,2,1,1,1,1,1,1  ],
                [3,2,1,1,1,1,2,2,2,6,6,2,1,1,1,1,1,5,5,5,3,1,4,4,4,4,3,2,1,1,1,1,1,1,1  ],
                [3,3,2,1,1,3,2,2,6,6,2,1,1,1,1,1,1,5,5,3,1,2,4,6,6,2,2,1,1,1,1,1,1,1,1  ],
                [3,3,3,3,3,3,2,6,6,2,1,1,1,1,1,1,1,1,1,1,2,4,7,7,2,2,1,1,1,1,1,1,1,1,1  ],
                [2,3,3,1,1,2,2,6,3,2,1,1,1,1,1,1,1,1,3,3,4,9,9,2,2,1,1,1,1,1,1,1,1,1,1  ],
                [2,1,2,1,1,2,2,6,3,2,1,1,1,1,1,1,1,1,4,9,9,9,2,2,1,1,1,1,1,1,1,1,1,1,1  ],
                [2,1,2,1,1,2,2,6,3,2,1,1,1,1,1,1,1,1,4,9,9,3,2,1,1,1,1,1,1,1,1,1,1,1,1  ]
            ];
        
            this.scene.appendChild(new Engine.Geometry.Rectangle({
                name: 'origin',
                width: this.map.TILE_SIZE / 4,
                height: this.map.TILE_SIZE / 4,
                left: -1000,
                top: -1000,
                fill: 'blue'
            }));
        
            this.scene.appendChild(new Engine.Geometry.Rectangle({
                name: 'destination',
                width: this.map.TILE_SIZE / 4,
                height: this.map.TILE_SIZE / 4,
                left: -1000,
                top: -1000,
                fill: 'green'
            }));
        
            var origin = [null, null];
            var destination = [null, null];
        
            function costColor(cost){
                cost = cost / 9;
                var r = Math.floor(255 * cost);
                var g = 255 - Math.floor(255 * cost);
                return "rgb(" + r + "," + g + ",0)";
            }
        
            function drawPath(origin, path){
                var step = null;
                var parent = null;
                var segments = [];
        
                while(step = path.pop()){
                    console.log(step);
                    parent = step.parent || {x: origin[0], y: origin[1]};
                    segments.push(demoSlides.pathfinding_demo.drawTileLine(step.x, step.y, parent.x, parent.y, costColor(step.cost), 4));
                }
        
                return segments;
            }
        
            //this.scene.addEventListener('mousedown', function(e){
            this.viewport.div.addEventListener('mousedown', function(e){

                var bounds = this.getBoundingClientRect();

                var px = (e.pageX - bounds.left) / bounds.width * this.offsetWidth;
                var py = (e.pageY - bounds.top) / bounds.height * this.offsetHeight;

                px = camera.toSceneX(px);
                py = camera.toSceneY(py);

                console.log('Hi! - ' + px + ',' + py);

                window.mapclick = e;
                var tile = demoSlides.pathfinding_demo.map.toTile(px, py);
                var x = tile[0];
                var y = tile[1];
                var location = [null,null];

                var map = demoSlides.pathfinding_demo.map,
                    scene = demoSlides.pathfinding_demo.scene,
                    scoremap = demoSlides.pathfinding_demo.scoremap;
        
                if(destination[0])
                {
                    // Reset
                    map.path = null;
                    origin[0] = origin[1] = destination[0] = destination[1] = null;
                    scene.origin.setPosition(-1000,-1000);
                    scene.destination.setPosition(-1000,-1000);
                    for (var i = 0, ii = map.segments.length; i < ii; i++)
                    {
                        scene.removeChild(map.segments[i]);
                    }
                }
                else if(origin[0])
                {
                    map.path = Engine.Path.search(origin[0], origin[1], x, y, function(x,y){
                        if(scoremap[y] && scoremap[y][x])
                            return scoremap[y][x];
                        else
                            return 10000;
                    }, function(field){
                        return field;
                    });
                    map.segments = drawPath(origin, map.path);
                    for (var i = 0, ii = map.segments.length; i < ii; i++)
                    {
                        scene.appendChild(map.segments[i]);
                    }
        
                    destination[0] = x;
                    destination[1] = y;
                    location = map.toPx(x,y,map.TILE_SIZE / 2 - 0.5*scene.destination.width, map.TILE_SIZE / 2 - 0.5*scene.destination.height);
                    scene.destination.setPosition(location[0], location[1]);
                }
                else
                {
                    origin[0] = x;
                    origin[1] = y;
                    location = map.toPx(x,y,map.TILE_SIZE / 2 - 0.5*scene.origin.width, map.TILE_SIZE / 2  - 0.5*scene.origin.height);
                    scene.origin.setPosition(location[0], location[1]);
                }
        
                console.log(x, y, scoremap[y][x]);
            })
        }

    },

    arkanoid_demo: {

        init: function(div_id, part){

                part = part === undefined ? Infinity : part;

                // PART 1
                // CREATE VIEWPORT AND SCENE
                this.viewport = new Engine.Viewport({
                    width: 800,
                    height: 600,
                    id: div_id,
                    background: 'black'
                });

                this.camera = new Engine.Camera({
                    scrollable: true
                });

                this.viewport.addCamera(this.camera);

                this.scene = new Engine.Scene();

                this.camera.lookAt(this.scene);

                if (part === 1) return;

                // PART2
                // CREATE ROOT NODE
                //var layout = new Engine.Node();

                Engine.Isometry.TILE_WIDTH = 64;
                Engine.Isometry.TILE_HEIGHT = 16;
                this.layout = new Engine.Isometry.Transform.Z();

                this.scene.appendChild(this.layout);

                if (part === 2) return;

                // PART3
                // CREATE LOCATION BORDERS
                var AREA = new Engine.Box(150, 100, 500, 600);
                var BORDER = 30;

                var top_bar = new Engine.Geometry.Rectangle({
                    parent: this.layout,
                    left: AREA.x,
                    top: AREA.y,
                    width: AREA.w,
                    height: BORDER,
                    fill: 'image(assets/images/bricks.png)'
                });

                // Same for left_bar and right_bar

                var left_bar = new Engine.Geometry.Rectangle({
                    parent: this.layout,
                    left: AREA.x,
                    top: AREA.y,
                    width: BORDER,
                    height: AREA.h,
                    fill: 'image(assets/images/bricks.png)'
                });

                var right_bar = new Engine.Geometry.Rectangle({
                    parent: this.layout,
                    left: AREA.x + AREA.w - BORDER,
                    top: AREA.y,
                    width: BORDER,
                    height: AREA.h,
                    fill: 'image(assets/images/bricks.png)'
                });

                if (part === 3) return;

                // PART4
                // CREATE A PADDLE
                var paddle = new Engine.Geometry.Rectangle({
                    parent: this.layout,
                    name: 'paddle',
                    fill: 'image(assets/images/paddle.png)',
                    width: 120,
                    height: 20
                });

                // CREATE A BALL
                var ball = new Engine.Geometry.Oval({
                    parent: this.layout,
                    fill: 'green',
                    radius: 11
                });

                if (part === 4) return;

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

                if (part === 5) return;

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

                if (part === 6) return;

                function initBricks(){

                    while(bricks.length) bricks.pop().destroy();

                    for (var i = 0; i < BRICKS_X; i++){

                        for (var j = 0; j < BRICKS_Y; j++) {

                            var left = 2 * BORDER + AREA.x + i * BRICKS_MARGIN + i * BRICK_WIDTH;
                            var top = 2 * BORDER + AREA.y + j * BRICKS_MARGIN + j * BRICK_HEIGHT;

                            bricks.push(new Engine.Geometry.Rectangle({
                                parent: demoSlides.arkanoid_demo.layout,
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

                if (part === 7) return;

                // PART7
                // GAME LOOP
                var game = this.game = new Engine.Timer({
                    type: Engine.Timer.VSYNC,
                    loop: true
                });

                if (part === 8) return;

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

                if (part === 9) return;

                // update paddle position
                this.game.on('step', function(){
                    var dt = this.stepprogress;
                    var left = Math.max(left_bar.right,
                        Math.min(paddle.left + dt * PADDLE_SPEED,
                            right_bar.left - paddle.width)
                    );
                    paddle.setPosition(left, paddle.top);
                });

                if (part === 10) return;

                // PART9
                // MOVING THE BALL

                this.game.on('step', function(){

                    var dt = this.stepprogress;

                    ball.setPosition(ball.left + dt * BALL_SPEED_X, ball.top + dt * BALL_SPEED_Y);

                });

                // PART10
                // COLLISIONS

                // BALL WITH BARS
                this.game.on('step', function(){

                    var game = demoSlides.arkanoid_demo.game;

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
                this.game.on('step', function(){
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

                this.game.on('bounce', function(){

                    sounds.bounce.stop();
                    sounds.bounce.play();

                });

                this.game.on('hit', function(){

                    sounds.collision.stop();
                    sounds.collision.play();

                });

                // PART12
                // PARTICLES
                this.game.on('hit', function(brick){

                    // size of emitter geometry
                    var width = 4 * brick.width;
                    var height = 4 * brick.height;

                    new Engine.Particles({
                        parent: demoSlides.arkanoid_demo.layout,
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

                // PART13
                // GAMEOVER
                this.game.on('over', function(){

                    initBricks();
                    initPaddle();
                    initBall();

                });

                // initialize game
                //this.game.play();
                
        },

        start: function(){
            this.game.play();
        },

        stop: function(){
            this.game.stop();
        }
    },

    particles_demo: {

        init: function(div_id){
            /** Shortcuts */
            var Particles = Engine.Particles,
                Sound = Engine.Sound,

                random = Math.random,
                sin = Math.sin,
                cos = Math.cos,
                pow = Math.pow,
                PI = Math.PI;

            /** Main config */
            var BASE_URI = '/engine_presentation/';

            /** Helpers */
            function getRandom(from, to){

                from = from || 0;
                to = to || 0;

                return random() * (to - from) + from;

            }

            /** Sounds */
            var START_SOUND = 'assets/sounds/start',
                KABOOM_SOUND = 'assets/sounds/kaboom';

            var playSound = (function(){

                var config = {
                    autoplay: true,
                    src: ''
                };

                return function(type){

                    config.src = BASE_URI + type;

                    return new Sound(config);

                }

            }());

            /** Viewport */
            var scene;
            new Engine.Viewport({
                id: div_id,
                width: 700,
                height: 500,
                background: 'black',
                cameras: [
                    new Engine.Camera({
                        lookAt: scene = new Engine.Scene
                    })
                ]
            });

            var WIDTH = 600,
                HEIGHT = 400;

            var FILLS = [
                'gradient(radial, 7 7 0, 7 7 7, from(yellow), stop(0.3, red), to(transparent)) 14px 14px',
                'gradient(radial, 7 7 0, 7 7 7, from(yellow), stop(0.3, green), to(transparent)) 14px 14px',
                'gradient(radial, 7 7 0, 7 7 7, from(yellow), stop(0.3, blue), to(transparent)) 14px 14px',
                'gradient(radial, 5 5 0, 5 5 5, from(yellow), stop(0.3, red), to(transparent)) 10px 10px',
                'gradient(radial, 5 5 0, 5 5 5, from(yellow), stop(0.3, green), to(transparent)) 10px 10px',
                'gradient(radial, 5 5 0, 5 5 5, from(yellow), stop(0.3, blue), to(transparent)) 10px 10px',
            ];

            function customGravity(emitter, stepprogress, i, position, lifetime, timeleft, move){

                var progress = timeleft[i] / lifetime[i];

                i *= 2;

                move[i + 1] += cos(progress * PI / 2) * stepprogress / 4;

            }

            customGravity.shortcutArguments = ['position', 'lifetime', 'timeleft', 'move'];

            this.emitter = new Particles({
                parent: scene,
                autoplay: false,
                width: WIDTH,
                height: HEIGHT,
                left: -WIDTH / 2,
                top: -HEIGHT / 2,
                originY: HEIGHT,
                funcs: [customGravity],
                opacity: false,
                rotate: false,
                on: {
                    beforeemit: function(){

                        this.emitDelay = getRandom(500, 7000) | 0;
                        this.lifetime = getRandom(1700, 2200) | 0;
                        this.amount = getRandom(4, 7) | 0;

                        playSound(START_SOUND);

                    },
                    beforecreateparticle: function(){

                        this.dx = getRandom(-WIDTH / 5, WIDTH / 5) | 0;
                        this.dy = getRandom(- HEIGHT * 0.8, - HEIGHT * 0.7) | 0;
                        this.fill = FILLS[getRandom(0, FILLS.length) | 0];

                    },
                    emitterdestroyed: function(emitter){

                        var position = emitter.position;

                        for (var i = 0, n = position.length; i < n; i += 2)

                            emitSubEmitter(position[i] + this.left, position[i + 1] + this.top, emitter.shape[i / 2 + 0.5 | 0]);

                        playSound(KABOOM_SOUND);

                    }
                }
            });

            function emitSubEmitter(left, top, shape){

                var WIDTH = 300,
                    HEIGHT = 300,
                    AMOUNT = 20;

                var imageSteps = shape.image.steps,
                    color1 = imageSteps[0].color,
                    color2 = imageSteps[1].color;

                new Particles({
                    parent: scene,
                    autoplay: true,
                    iterations: 0,
                    width: WIDTH,
                    height: HEIGHT,
                    left: -WIDTH / 2 + left,
                    top: -HEIGHT / 3 + top,
                    amount: AMOUNT,
                    fill: 'gradient(radial, 4 4 0, 4 4 4, from('+color1+'), stop(0.7, '+color2+'), to(transparent)) 8px 8px',
                    lifetime: 1000,
                    originY: HEIGHT / 3,
                    opacity: 0.4,
                    rotate: false,
                    on: {
                        beforecreateparticle: function(i){

                            var expr = PI * 2 * i / AMOUNT;

                            this.dx = sin(expr) * getRandom(0, WIDTH / 3);
                            this.dy = cos(expr) * getRandom(0, HEIGHT / 3);

                        }
                    }
                });

            }
        },

        start: function(){
            this.emitter.play();
        },

        stop: function(){
            this.emitter.stop();
        }

    },

    spriteanimation_demo: {

        init: function(div_id) {

            var Animation = Engine.Timer.Animation,
                Rectangle = Engine.Geometry.Shape.Rectangle;

            var viewport = new Engine.Viewport({
                width: 700,
                height: 500,
                id: div_id
            });

            var scene = new Engine.Scene();

            var camera = new Engine.Camera({
                lookAt: scene
            });

            viewport.addCamera(camera);

            var WIDTH = 100,
                HEIGHT = 100,
                FROM = -400,
                TO = 400;

            var bg = new Rectangle({
                parent: scene,
                left: FROM,
                width: Math.abs(FROM) + Math.abs(TO),
                height: HEIGHT,
                fill: 'black'
            });

            var rect = new Rectangle({
                parent: scene,
                left: FROM,
                width: WIDTH,
                height: HEIGHT,
                fill: 'rgba(255, 0, 0, .5)'
            });

            this.anim = new Animation({
                autoplay: false,
                duration: 5000,
                //frameDuration: 100,
                easing: Animation.EASING.easeIn,
                frames: [
                    function(frameprogress){

                        var progress = frameprogress / this.frameDuration;

                        var c = progress * 255 | 0;

                        rect.setFill('rgba('+c+', '+(255-c)+', 0, .5)');

                    },
                    function(frameprogress){

                        var progress = frameprogress / this.frameDuration;

                        rect.setPosition((TO + Math.abs(FROM) - WIDTH) * progress + FROM);

                    }
                ]
            });

        },

        start: function(){

            this.anim.play();

        },

        stop: function(){

            this.anim.stop();

        }

    }

};