define([
    "static/app",
    "backbone",
    "static/menus/dishtype/model"
], function(app, Backbone, model){
    
      var Collection = Backbone.Collection.extend({
        model: model,
        
        // A catcher for the meta object TastyPie will return.
        meta: {},

        // Set the (relative) url to the API for the item resource.
        url: app.local ? app.API + "sopin_dishtypes/" : '/sopin_dishtypes.json',

        // Our API will return an object with meta, then objects list.
        parse: function(response) {
            this.meta = response.meta;
            return response.objects;
        }
    });

    return Collection;

});

