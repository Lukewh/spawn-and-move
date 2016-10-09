var Sub = function() {
    'use strict';
    this.subs = {};
    this.latestId = 0;
};

Sub.prototype.listen = function(name, fn, context) {
    'use strict';
    
    if (!this.subs[name]) {
        this.subs[name] = [];
    }
    
    this.latestId += 1;
    
    this.subs[name].push({
        id: this.latestId,
        context: context || this,
        fn: fn
    });
    
    return this.latestId;
};

Sub.prototype.fire = function(name, data) {
    'use strict';
    var i,
        ii,
        passData = data || false;
    
    if (this.subs[name]) {
        for (i = 0, ii = this.subs[name].length; i < ii; i += 1) {
            this.subs[name][i].fn.call(this.subs[name][i].context, passData);
        }
    }
};

Sub.prototype.remove = function(name, id) {
    'use strict';
    var i,
        ii,
        index = false;
    
    if (this.subs[name] && this.subs[name].length > 0) {
        for (i = 0, ii = this.subs[name].length; i < ii; i += 1) {
            if (this.subs[name][i].id === id) {
                index = i;
                break;
            }
        }
        
        if (index !== false) {
            console.log('REMOVE: ' + index);
            this.subs[name].splice(index, 1);
        }
    }
};