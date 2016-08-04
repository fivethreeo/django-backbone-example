/**
 * Main app initialization and initial auth check
 */

require([
    "static/app",
    "static/router",
    "static/menus/dish/list",
    "static/menus/restaurant/collection",
    "static/menus/restaurant_dishtype/collection"
],
function(app, WebRouter, dishview, restaurant, restaurant_dishtype) {

    // Just use GET and POST to support all browsers
    Backbone.emulateHTTP = true;

    app.mainview = new dishview({});
    app.router = new WebRouter();

    app.restaurant = new restaurant();
    app.restaurant_dishtype = new restaurant_dishtype();
    app.restaurant.fetch({reset:true});
    app.restaurant_dishtype.fetch({reset:true});


    // HTML5 pushState for URLs without hashbangs
    var hasPushstate = !!(window.history && history.pushState);
    if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' });
    else Backbone.history.start();

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router. If the link has a `data-bypass`
    // attribute, bypass the delegation completely.
    $('#content-app').on("click", "a:not([data-bypass])", function(evt) {
        evt.preventDefault();
        var href = $(this).attr("href");
        app.router.navigate(href, { trigger : true, replace : false });

    });
});