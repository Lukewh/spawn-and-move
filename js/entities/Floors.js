var Entity = Entity || {};

Entity.Floor = function () {
    EntityBase.apply(this, arguments[0]);
    
    this.sprite.loadImage('standard', 'images/floor.png');
    this.sprite.loadImage('active', 'images/floor-selected.png');
};

Entity.Floor.prototype = Object.create(EntityBase.prototype);
Entity.Floor.constructor = Entity.Floor;

Entity.Floor.prototype.update = function () {
    /*if (this.hovered && this.click && this.image !== 'selected') {
        this.setImage('selected');
        this.rerender = true;
    } else if (!this.hovered && this.image === 'selected' && !this.clicked) {
        this.setImage('standard');
        this.rerender = true;
    }*/
    
    if (this.sprite.image !== 'active' && (this.hovered || this.active)) {
        this.sprite.setImage('active');
        this.sprite.rerender = true;
    } else if (this.sprite.image === 'active' && (!this.hovered && !this.active)) {
        this.sprite.setImage('standard');
        this.sprite.rerender = true;
    }
};