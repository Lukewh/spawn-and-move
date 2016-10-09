var Actor = Actor || {};

Actor.Worker = function () {
    ActorBase.apply(this, arguments);
    
    this.sprite.loadImage('standard', 'images/actor.png');
};

Actor.Worker.prototype = Object.create(ActorBase.prototype);
Actor.Worker.constructor = Actor.Worker;

Actor.Worker.prototype.update = function (game) {
    if (this.idle) {
        this.lookAtPoint([game.cursor.position[0], game.cursor.position[1]]);
    }
    if (this.jobs.length < this.maxJobs) {
        this.findJobs(game);
    }
    this.move();
};