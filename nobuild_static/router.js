/**
 * @desc        backbone router for pushState page routing
 */

define([
    "static/app",
    "static/index/indexview",
    "static/header/headerview",
    "static/menus/dish/list",
    "static/controls/controlsview"
], function(app, indexview, headerview, dishview, controlsview){

    var WebRouter = Backbone.Router.extend({

        initialize: function(){
           _.bindAll(this, 'show', 'index');
        },

        routes: {
            "" : "index"
        },

        show: function(view, options){

            // Every page view in the router should need a header.
            // Instead of creating a base parent view, just assign the view to this
            // so we can create it if it doesn't yet exist
            if(!this.headerView){
                this.headerView = new headerview({});
                this.headerView.setElement($(".header")).render();
            }

            if(!this.controlsView){
                this.controlsView = new controlsview({});
                this.controlsView.setElement($("#controls")).render();
            }

            // Close and unbind any existing page view
            if(this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();

            // Establish the requested view into scope
            this.currentView = view;
            $('#content').html( this.currentView.render().$el);

        },

        index: function() {
            // Fix for non-pushState routing (IE9 and below)
            var hasPushState = !!(window.history && history.pushState);
            if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
            else this.show(app.mainview);
        }

    });

    return WebRouter;

});