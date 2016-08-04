define([
    "static/app",
    "text!static/header/header.html",
    "backbone"
], function(app, headertemplate, Backbone){

    var HeaderView = Backbone.View.extend({

        template: _.template(headertemplate),

        initialize: function () {
            _.bindAll(this, 'onRemoveAccountClick','render');

        },
        
        events: {
        },
      

        onRemoveAccountClick: function(evt){
        },


        render: function () {
            this.$el.html(this.template({  }));
            return this;
        },

    });

    return HeaderView;
});
