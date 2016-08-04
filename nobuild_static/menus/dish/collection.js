define([
    "static/app",
    "backbone",
    "static/menus/dish/model"
], function(app, Backbone, model){
    
      var Collection = Backbone.Collection.extend({
        model: model,
        
        // A catcher for the meta object TastyPie will return.
        meta: {},

        // Set the (relative) url to the API for the item resource.
        url: app.local ? app.API + "dishes_flat/" : '/dishes_flat.json',

        // Our API will return an object with meta, then objects list.
        parse: function(response) {
            this.meta = response.meta;
            return response.objects;
        }
    });

    return Collection;

});

