var EntityBase = function () {
    this.name = arguments[0];
    
    this.x = arguments[1];
    this.y = arguments[2];
    this.width = arguments[3];
    this.height = arguments[4];
    
    this.sprite = new Sprite(this);
    this.sprite.setSnapping(true);
    
    this.toggle = false;
    this.clicked = false;
    this.active = false;
    this.hovered = false;
};

EntityBase.prototype.click = function () {
    if (this.toggle) {
        this.active = !this.active;
    } else {
        this.clicked = !this.clicked;
    }
};

EntityBase.prototype.hover = function () {
    this.hovered = true;
};

EntityBase.prototype.unhover = function () {
    this.hovered = false;
};