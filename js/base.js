/*globals Phaser */

//(function () {
    'use strict';
    var TILE_SIZE = 24,
        MAP_WIDTH = 10,
        MAP_HEIGHT = 10,
        MAP = [
            [], // Below
            [], // Middle
            [] // Above
        ],
        MAP_BOT = MAP[0],
        MAP_MID = MAP[1],
        MAP_TOP = MAP[2],
        ACTORS = [],
        mousePosition = [0, 0],
        lastMousePosition = [0, 0],
        GAME = new LG(
            'gameCanvas',
            TILE_SIZE,
            {
                create: create,
                update: update,
                onmousemove: mousemove,
                onmousedown: mousedown
            },
            {
                ui: [
                    {
                        type: 'addActor',
                        cursorType: 'add:actor',
                        x: MAP_WIDTH * TILE_SIZE,
                        y: 0,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        toggle: true,
                        images: [
                            {
                                type: 'standard',
                                path: 'images/buttonBg.png'
                            },
                            {
                                type: 'active',
                                path: 'images/buttonBg-active.png'
                            },
                            {
                                type: 'overlay',
                                path: 'images/actor.png',
                                align: 'center'
                            }
                        ]
                    }
                ]
            }
        );
    
    function create() {
        var x,
            xx,
            y,
            yy,
            entity;
        
        this.canvas.setAttribute('width', (MAP_WIDTH * TILE_SIZE) + TILE_SIZE);
        this.canvas.setAttribute('height', MAP_HEIGHT * TILE_SIZE);
        
        for (y = 0, yy = MAP_HEIGHT; y < yy; y += 1) {
            MAP_BOT[y] = [];
            MAP_MID[y] = [];
            MAP_TOP[y] = [];
            
            for (x = 0, xx = MAP_WIDTH; x < xx; x += 1) {
                entity = new EntityFactory('floor', x, y, TILE_SIZE, TILE_SIZE);
                MAP_BOT[y][x] = entity;
                MAP_MID[y][x] = false;
                MAP_TOP[y][x] = false;
            }
        }
        
        this.setEntities(MAP);
        this.setActors(ACTORS);
    }
    
    function update() {
        
    }
    
    function mousedown(e) {
        e.preventDefault();
        var x,
            y,
            result;
        
        if (e.target === this.canvas) {
            this.subs.fire('click', [e.offsetX, e.offsetY]);
        }
    }
    
    function mousemove(e) {
        e.preventDefault();
        var x,
            y,
            result,
            current,
            previous;
        
        if (e.target === this.canvas) {
            result = this.getPositionTile(e.offsetX, e.offsetY);
            x = result[0];
            y = result[1];
            
            mousePosition = [x, y];
            
            if (mousePosition[0] !== lastMousePosition[0]
                || mousePosition[1] !== lastMousePosition[1]) {
                current = this.entities[0][mousePosition[1]][mousePosition[0]];
                
                previous = this.entities[0][lastMousePosition[1]][lastMousePosition[0]];
                
                if (current && current.hover) {
                    current.hover();
                }
                
                if (previous && previous.unhover) {
                    previous.unhover();
                }
                
                lastMousePosition = mousePosition;
                this.cursor.position = [e.offsetX, e.offsetY];
            }
        }
    }

    for (var i = 0, ii = 500; i < ii; i += 1) {
        GAME.jobs.add('move', [(Math.floor(Math.random() * MAP_WIDTH) * TILE_SIZE), (Math.floor(Math.random() * MAP_HEIGHT) * TILE_SIZE), Math.floor(Math.random() * 2000)]);
    }
    
    GAME.subs.listen('add:actor', function (args) {
        var x = this.getTilePosition(args.ele.x),
            y = this.getTilePosition(args.ele.y),
            actor = new Actor.Worker('Dave', x, y, 24, 24);
        
        ACTORS.push(actor);
        
    }, GAME);
        
    GAME.start();
//})();