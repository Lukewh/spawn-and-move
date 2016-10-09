var UI = UI || {};

UI.AddActor = function () {
    UIElement.apply(this, arguments);
};

UI.AddActor.prototype = Object.create(UIElement.prototype);
UI.AddActor.constructor = UI.AddActor;

UI.AddActor.prototype.update = function (game) {
    if (this.sprite.image !== 'active' && this.active) {
        this.sprite.setImage('active');
        this.sprite.rerender = true;
        if (game.cursor.type !== 'add:actor') {
            game.cursor.type = 'add:actor';
            game.cursor.src = this;
        }
    } else if (this.sprite.image === 'active' && !this.active) {
        this.sprite.setImage('standard');
        this.sprite.rerender = true;
        if (game.cursor.type !== 'click') {
            game.cursor.type = 'click';
            game.cursor.src = false;
        }
    }
    
    if (this.clicked) {
        this.clicked = false;
    }
};