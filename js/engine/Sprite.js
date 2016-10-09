var Sprite = function (parent) {
    this.images = {};
    this.image = 'standard';
    
    this.x = parent.x;
    this.y = parent.y;
    this.width = parent.width || 0;
    this.height = parent.height || 0;
    
    this.previousAngle = 0;
    this.angle = 0;
    
    this.snapping = false;
    
    this.rerender = true;
};

Sprite.prototype.getCenter = function (game) {
    if (this.snapping) {
        return [game.getTilePosition(this.x) + (this.width / 2), game.getTilePosition(this.y) + (this.height / 2)];
    } else {
        return [this.x + (this.width / 2), this.y + (this.height / 2)];
    }
};

Sprite.prototype.setAngle = function (newAngle) {
    if (newAngle !== this.angle) {
        this.previousAngle = this.angle;
        this.angle = newAngle;
    }
};

Sprite.prototype.loadImage = function (type, url, align) {
    if (url) {
        var image = new Image(),
            that = this,
            offsetX = 0,
            offsetY = 0;

        image.onload = function () {
            try {
                if (!that.images[type]) {
                    that.images[type] = {};
                }
                that.images[type].image = image;
                that.images[type].width = image.width;
                that.images[type].height = image.height;
                if (align) {
                    if (align === 'center') {
                        that.images[type].offsetX = (that.width - image.width) / 2;
                        that.images[type].offsetY = (that.height - image.height) / 2;
                    }
                }
            } catch(e) {
                console.error(e);
            }
        };
        
        image.src = url;
    }
};

Sprite.prototype.setImage = function (type) {
    if (this.images[type]) {
        this.image = type;
    }
};

Sprite.prototype.render = function (game) {
    var x = this.snapping ? game.getTilePosition(this.x) : this.x,
        y = this.snapping ? game.getTilePosition(this.y) : this.y,
        xOffset,
        yOffset,
        angle = (this.angle + 90) * Math.PI / 180,
        previousAngle = (this.previousAngle + 90) * Math.PI / 180,
        center = this.getCenter(game);
    
    if (this.image !== false && this.images[this.image]) {
        
        xOffset = this.images[this.image].width / 2;
        yOffset = this.images[this.image].height / 2;
        
        game.ctx.save();
        
        game.ctx.translate(x, y);
        game.ctx.translate(this.width / 2, this.height / 2);
        game.ctx.rotate(angle);
        game.ctx.drawImage(this.images[this.image].image, -xOffset, -yOffset);
        
        if (this.images.overlay) {
            if (this.images.overlay.offsetX) {
                xOffset -= this.images.overlay.offsetX;
            }
            if (this.images.overlay.offsetY) {
                yOffset -= this.images.overlay.offsetY;
            }
            
            game.ctx.drawImage(this.images.overlay.image, -xOffset, -yOffset);
        }
        
        game.ctx.restore();
        
        this.rerender = false;
    }
};

Sprite.prototype.setSnapping = function (set) {
    this.snapping = set;
};