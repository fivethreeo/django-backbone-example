define([
    "static/app",
    "backbone",
    "text!static/menus/restaurant/list.html",
    "static/menus/restaurant/item",
    "static/menus/restaurant/collection"
], function(app, Backbone, template, itemview, collection){


    var View = Backbone.View.extend({

        initialize: function () {
            this.template = _.template(template); 
            this.collection = new collection();
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            _.bindAll(this, 'render');
        },

        events: {
        },

        render:function () {
            this.$el.html(this.template({}));
            this.$list = $('.content-main', this.$el);
            this.collection.fetch({reset:true});
            return this;
        },

        addOne: function (model) {
            var view = new itemview({ model: model });
            this.$list.append(view.render().$el);
        },

        addAll: function () {
            this.$list.html('');
            this.collection.each(this.addOne, this);
        },
    });

    return {name:'restaurant_list',label:'Restaurants',view:View};
});


