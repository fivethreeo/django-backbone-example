define([
    "static/app",
    "text!static/controls/controls.html",
    "backbone",
    "static/menus/dishtype/collection",
    "static/menus/kitchen/collection",
    "select2"
], function(app, template, Backbone, typecollection, kitchencollection){

    var View = Backbone.View.extend({

        get_used: function() {
            return _.union(this.used.with, this.used.without);
        },

        get_unused: function(objects) {
            var used = this.get_used();
            return _.reject(objects, function(obj){
                return _.contains(used, obj.name);
            })
        },

        get_prefixed: function(objects, prefix) {
            return _.filter(objects, function(obj){
                return obj.name.lastIndexOf(prefix, 0) === 0;
            })
        },

        initialize: function () {
            this.used = {with:[],without:[]}
            var that = this
            this.select2conf = {
                  language: {inputTooLong:function(e){var t=e.input.length-e.maximum;return"Vennligst fjern "+t+" tegn"},inputTooShort:function(e){var t=e.minimum-e.input.length,n="Vennligst skriv inn ";return t>1?n+=" flere tegn":n+=t+" tegn til",n},loadingMore:function(){return"Laster flere resultater…"},maximumSelected:function(e){return"Du kan velge maks "+e.maximum+" elementer"},noResults:function(){return"Ingen treff"},searching:function(){return"Søker…"}},
                  ajax: {
                    url: app.local ? app.API + "indgredients/" : '/indgredients.json',
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                      return {
                        name__startswith: params.term, // search term
                        page: params.page
                      };
                    },
                    processResults: function (data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;
                        return {
                            results:_.map(that.get_prefixed(that.get_unused(data.objects), params.term), function(obj) { obj.text = obj.name; obj.id = obj.name; return obj; })
                        }
                    },
                    cache: false
                  },
                  minimumInputLength: 1,
                  allowClear: true,
                  createTag: function(params) { return undefined; },
                  multiple: true,
                  tags: true
                }
            this.template = _.template(template);
            this.typecollection = new typecollection();
            this.kitchencollection = new kitchencollection();
            this.listenTo(this.typecollection, 'reset', this.addTypes);
            this.listenTo(this.kitchencollection, 'reset', this.addKitchens);
            this.with_exclude = []
            this.without_exclude = []
            _.bindAll(this, 'render', 'reload', 'updateWith', 'updateWithout', 'get_unused', 'get_used');
        },

        events: {
            'change #groupby,#type,#kitchen': 'reload',
            'change #with': 'updateWith',
            'change #without': 'updateWithout'
        },
  
        updateWith:function (e) { this.used.with = $(e.target).val(); this.reload(); },

        updateWithout:function (e) { this.used.without = $(e.target).val();  this.reload(); },

        render:function () {
            this.$el.html(this.template({}));
            this.$groupby = $('#groupby', this.$el);
            this.$type = $('#type', this.$el);
            this.$kitchen = $('#kitchen', this.$el);
            this.$with = $('#with', this.$el).select2(this.select2conf)
            this.$without = $('#without', this.$el).select2(this.select2conf)
            this.typecollection.fetch({reset:true});
            this.kitchencollection.fetch({reset:true});
            return this;
        },

        reload:function () {
            app.mainview.groupby = this.$groupby.val();
            app.mainview.type = this.$type.val();
            app.mainview.kitchen = this.$kitchen.val();
            app.mainview.with = this.$with.val();
            app.mainview.without = this.$without.val();
            app.mainview.reload();
            return this;
        },

        addTypes: function () {
            this.$type.append('<option value="all">Alle</option>');
            this.typecollection.each(function(model){
                var obj = model.toJSON()
                this.$type.append('<option value="' + obj.name +'">'+obj.name+'</option>');
            }, this);
        },

        addKitchens: function () {
            this.$kitchen.append('<option value="all">Alle</option>');
            this.kitchencollection.each(function(model){
                var obj = model.toJSON()
                this.$kitchen.append('<option value="' + obj.name +'">'+obj.name+'</option>');
            }, this);
        }
    });


    return View;
});

