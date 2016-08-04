define([
    "static/app",
    "text!static/index/index.html",
    "backbone"
], function(app, indextemplate, Backbone){

    var IndexView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'render');

        },

        events: {
        },

        render:function () {
            this.template = _.template(indextemplate); 
            this.$el.html(this.template({}));
            return this;
        }

    });

    return IndexView;
});

