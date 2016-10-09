/*
    Location
        0: x
        1: y
        2: time (Time spent at location to complete task)
        
    Order Object
        0: id
        1: action
        2: in progress
        3: Location
*/

var Orders = function () {
    this.orders = [];
    this.orderId = 0;
};

Orders.prototype.add = function () {
    var action,
        startLocation,
        tempOrder;
    
    if (Array.isArray(arguments[0])) {
        
    } else {
        action = arguments[0];
        startLocation = arguments[1];
        
        tempOrder = [action, false];
        if (action === 'move') {
            tempOrder.push([startLocation[0], startLocation[1], startLocation[2]]);
        } else if (action === 'construct') {
            tempOrder.push([startLocation[0], startLocation[1], startLocation[2]]);
        } else if (action === 'destruct') {
            tempOrder.push([startLocation[0], startLocation[1], startLocation[2]]);
        }
        
        if (!this.exists(tempOrder)) {
            this.orderId += 1;
            tempOrder.unshift(this.orderId.toString());
            this.orders.push(tempOrder);
            return tempOrder;
            console.log(tempOrder);
        } else {
            console.log('Exists');
        }
    }
};

Orders.prototype.exists = function (order) {
    var items = this.orders.filter(function (item) {
        return JSON.stringify(item.slice(1)) === JSON.stringify(order);
    });
    
    if (items.length > 0) {
        return true;
    } else {
        return false;
    }
};

Orders.prototype.remove = function (id) {
    var i,
        ii,
        index = false;
    
    for (i = 0, ii = this.orders.length; i < ii; i += 1) {
        if (this.orders[i][0] === id) {
            index = i;
            break;
        }
    }
    
    if (index === false) {
        return false;
    } else {
        this.orders.splice(index, 1);
        return true;
    }
};

Orders.prototype.get = function (count) {
    var i,
        ii,
        result = [];
    
    for (i = 0, ii = this.orders.length; i < ii; i += 1) {
        if (this.orders[i][2] === false) {
            result.push(this.orders[i]);
        }
        
        if (result.length === count) {
            break;
        }
    }
    
    return result;
};

Orders.prototype.start = function (id) {
    var i,
        ii;
    
    for (i = 0, ii = this.orders.length; i < ii; i += 1) {
        if (this.orders[i][0] === id) {
            this.orders[i][2] = true;
            return true;
        }
    }
    
    return false;
};