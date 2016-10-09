var ActorBase = function () {
    this.name = arguments[0];
    
    this.x = arguments[1];
    this.previousX = this.x;
    this.y = arguments[2];
    this.previousY = this.y;
    this.width = arguments[3];
    this.height = arguments[4];
    
    this.paused = false;
    this.pausedTimeout = false;
    this.idle = true;
    this.speed = 1;
    this.maxJobs = 1;
    this.jobs = [];
    this.currentJob = false;
        
    this.sprite = new Sprite(this);
};

ActorBase.prototype.setX = function (x) {
    this.x = x;
    this.sprite.x = x;
};

ActorBase.prototype.setY = function (y) {
    this.y = y;
    this.sprite.y = y;
};

ActorBase.prototype.lookAtPoint = function (coords) {
    var angle = Math.atan2(coords[1] - this.y, coords[0] - this.x) * 180 / Math.PI;
    
    this.sprite.setAngle(angle);
};

ActorBase.prototype.setPause = function (time) {
    var that = this;
    
    this.paused = true;
    
    if (this.pausedTimeout) {
        clearTimeout(this.pausedTimeout);
    }
    
    this.pausedTimeout = setTimeout(function () {
        that.paused = false;
    }, time);
};

ActorBase.prototype.addJob = function (job) {
    this.jobs.push(job);
    
    job[2] = true;
};

ActorBase.prototype.findJobs = function (game) {
    var diff = this.maxJobs - this.jobs.length,
        newJobs,
        i,
        ii;
    
    if (diff > 0) {
        newJobs = game.jobs.get(diff);
        for (i = 0, ii = newJobs.length; i < ii; i += 1) {
            newJobs[i].gameRef = game;
            this.addJob(newJobs[i]);
        }
    }
};

ActorBase.prototype.move = function () {
    if (!this.paused) {
        if (this.jobs.length > 0 && this.currentJob === false) {
            this.currentJob = this.jobs.shift();
            this.idle = false;
        } else if (this.currentJob) {
            if (Math.round(this.x) === this.currentJob[3][0] && Math.round(this.y) === this.currentJob[3][1]) {
                if (this.currentJob[3][2]) {
                    this.setPause(this.currentJob[3][2]);
                }
                this.currentJob.gameRef.jobs.remove(this.currentJob[0]);
                this.currentJob = false;
            } else {
                this.lookAtPoint([this.currentJob[3][0], this.currentJob[3][1]]);

                this.setX(this.x + this.speed * Math.cos(this.sprite.angle * Math.PI / 180));
                this.setY(this.y + this.speed * Math.sin(this.sprite.angle * Math.PI / 180));
            }
        } else if (this.jobs.length === 0) {
            this.idle = true;
        }
    }
};