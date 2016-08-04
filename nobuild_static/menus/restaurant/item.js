define([
    "static/app",
    "text!static/menus/restaurant/item.html",
    "backbone"
], function(app, template, Backbone){


    var View = Backbone.View.extend({

        initialize: function () {
            this.template = _.template(template); 
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            _.bindAll(this, 'render');
        },

        events: {
        },

        render:function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

    return View;
});

