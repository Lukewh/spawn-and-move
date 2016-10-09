var ActorFactory = function () {
    var actorName = arguments[0].charAt(0).toUpperCase() + arguments[0].slice(1);
    
    if (window.Actor[actorName] && typeof(window.Actor[actorName]) === 'function') {
        return new window.Actor[actorName](arguments);
    }
};