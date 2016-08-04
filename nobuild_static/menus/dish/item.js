define([
    "static/app",
    "text!static/menus/dish/item.html",
    "backbone"
], function(app, template, Backbone){


    var View = Backbone.View.extend({

        initialize: function (opts) {
            _.extend(this, {context:opts.context})
            this.template = _.template(template); 
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            _.bindAll(this, 'render');
        },

        events: {
        },

        render:function () {
            this.$el.html(this.template(_(this.model.toJSON()).extend(this.context)));
            return this;
        }

    });

    return View;
});

