var UIElement = function (cursorType, x, y, width, height, toggle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.cursorType = cursorType;
    
    this.toggle = toggle;
    this.active = false;
    this.clicked = false;
    
    this.sprite = new Sprite(this);
};

UIElement.prototype.click = function (game) {
    if (this.toggle) {
        this.active = !this.active;
    } else {
        this.clicked = !this.clicked;
    }
};