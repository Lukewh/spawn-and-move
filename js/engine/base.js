var LG = function (canvas, tileSize, funcs, conf) {
    'use strict';
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled  = false;
    this.ctx.oImageSmoothingEnabled  = false;
    this.ctx.webkitImageSmoothingEnabled  = false;
    
    this.TILE_SIZE = tileSize;
    
    this.entities = [];
    this.actors = [];
    this.renderList = [];
    this.GUIItems = [];
    
    this.jobs = new Orders();
    
    this.cursor = {
        type: 'click',
        src: false,
        position: [0, 0]
    };
    
    if (conf.ui) {
        this.setUI(conf.ui);
    }
    
    this.loop = false;
    this.now = false;
    this.dt = 0;
    this.last = TIME.timestamp();
    this.step = 1/60;
    
    this.subs = new Sub();
    
    this.subs.listen('click', function (coords) {
        var i,
            ii,
            ele = false,
            tile = [];
                
        // Check for GUIItems
        for (i = 0, ii = this.GUIItems.length; i < ii; i += 1) {
            if (coords[0] >= this.GUIItems[i].x &&
                    coords[0] <= this.GUIItems[i].x + this.GUIItems[i].width &&
                    coords[1] >= this.GUIItems[i].y &&
                    coords[1] <= this.GUIItems[i].y + this.GUIItems[i].height) {
                ele = this.GUIItems[i];
                break;
            }
        }
        
        if (!ele) {
            tile = this.getPositionTile(coords[0], coords[1]);
            // Check the grid
            if (this.entities.length > 0) {
                if (this.entities[0][tile[1]][tile[0]] &&
                    this.entities[0][tile[1]][tile[0]].click) {
                    ele = this.entities[0][tile[1]][tile[0]];
                }
            }
        }
        
        if (ele) {
            if (ele.click) {
                ele.click(this);
            }
            if (this.cursor.type !== 'click' && this.cursor.src !== ele) {
                this.subs.fire(this.cursor.type, {ele: ele});
            }
        }
    }, this);
    
    this.create = funcs.create.bind(this) || false;

    this.update = funcs.update.bind(this) || function () {};
    
    this.canvas.onmousedown = funcs.onmousedown.bind(this) || false;
    this.canvas.onmousemove = funcs.onmousemove.bind(this) || false;
    
    if (this.create) {
        this.create();
    }
};

LG.prototype.start = function () {
    this.loop = requestAnimationFrame(this.frame.bind(this));
};

LG.prototype.stop = function () {
    cancelAnimationFrame(this.loop);
};

LG.prototype.frame = function () {
    if (fpsmeter) {
        fpsmeter.tickStart();
    }
    this.now = TIME.timestamp();
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
    
    this.render(this.dt);
    while (this.dt > this.step) {
        this.dt = this.dt - this.step;
        this.localUpdate(this.step);
    }

    this.last = this.now;
    this.loop = requestAnimationFrame(this.frame.bind(this));
    if (fpsmeter) {
        fpsmeter.tick();
    }
};

LG.prototype.localUpdate = function (step) {
    var merged;
    
    function flattenArray(a, b) {
        var flat = a.concat(b);
        
        if (Array.isArray(flat[0])) {
            return flat.reduce(flattenArray);
        } else {
            return flat;
        }
    }
    
    this.update();
    
    merged = this.entities.reduce(flattenArray);

    this.updateSingle(merged);
    
    this.updateSingle(this.actors.slice(0));
    
    this.updateSingle(this.GUIItems.slice(0));
};

LG.prototype.updateSingle = function (entities) {
    'use strict';
    var entity = entities.shift();
    
    if (entity) {
        if (entity.update) {
            entity.update(this);
            //if (entity.sprite.rerender === true) {
                this.renderList.push(entity);
            //}
        }
    }
    
    if (entities.length > 0) {
        this.updateSingle(entities);
    }
};

LG.prototype.render = function () {
    'use strict';
    var i,
        ii;
    
    if (this.renderList.length > 0) {
        // Clear screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render each item in each layer
        this.renderEntities(this.renderList);
    }
};

LG.prototype.renderEntities = function (entities) {
    'use strict';
    
    var entity = entities.shift();
    
    if (entity.sprite && entity.sprite.render) {
        entity.sprite.render(this);
    }
    
    if (entities.length > 0) {
        this.renderEntities(entities);
    }
};

LG.prototype.setEntities = function (entities) {
    this.entities = entities;
};

LG.prototype.setActors = function (actors) {
    this.actors = actors;
};

LG.prototype.getTilePosition = function (coord) {
    return coord * this.TILE_SIZE;
};

LG.prototype.getPositionTile = function (x, y) {
    return [Math.floor(x / this.TILE_SIZE), Math.floor(y / this.TILE_SIZE)];
};

LG.prototype.setUI = function (conf) {
    var i,
        ii,
        j,
        jj,
        ele,
        type;
    
    if (conf.length > 0) {
        for (i = 0, ii = conf.length; i < ii; i += 1) {
            type = conf[i].type.charAt(0).toUpperCase() + conf[i].type.slice(1);

            if (window.UI && window.UI[type]) {
                ele = new window.UI[type](conf[i].cursorType,
                                    conf[i].x,
                                    conf[i].y,
                                    conf[i].width,
                                    conf[i].height,
                                    conf[i].toggle || false);
            } else {
                ele = new UIElement(conf[i].cursorType,
                                    conf[i].x,
                                    conf[i].y,
                                    conf[i].width,
                                    conf[i].height,
                                    conf[i].toggle || false);
            }
            
            if (conf[i].images) {
                for (j = 0, jj = conf[i].images.length; j < jj; j += 1) {
                    ele.sprite.loadImage(conf[i].images[j].type, conf[i].images[j].path, conf[i].images[j].align || false);
                }
            }

            this.GUIItems.push(ele);
        }
    }
    
    console.log(this.GUIItems);
};