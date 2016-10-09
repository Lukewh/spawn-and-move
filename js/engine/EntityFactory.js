var EntityFactory = function () {
    var entityName = arguments[0].charAt(0).toUpperCase() + arguments[0].slice(1);
    
    if (window.Entity[entityName] && typeof(window.Entity[entityName]) === 'function') {
        return new window.Entity[entityName](arguments);
    }
};