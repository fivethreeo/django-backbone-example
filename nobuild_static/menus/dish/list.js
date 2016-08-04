define([
    "static/app",
    "backbone",
    "text!static/menus/dish/list.html",
    "static/menus/dish/item",
    "static/menus/dish/collection",
    "backbone-filter"
], function(app, Backbone, template, itemview, collection, filteredcollection){


    var View = Backbone.View.extend({

        initialize: function () {
            this.template = _.template(template);
            this.limit = 1000;
            this.groupby = 'restaurant_type';
            this.collection = new collection(); 
            this.filteredcollection = new filteredcollection(this.collection);
            this.listenTo(this.filteredcollection, 'add', this.addOne);
            this.listenTo(this.filteredcollection, 'reset', this.addAll);
            _.bindAll(this, 'render', 'reload', 'makeReCombined', 'makeRe', 'makeReS');
        },

        events: {
        },

        render:function () {
            var that = this;
            this.$el.html(this.template({}));
            this.collection.comparator = function(model) {
                return model.get('restaurant') + that.padToFour(model.get('number'));
            }
            this.collection.fetch({reset:true,data:{limit:this.limit}});
            return this;
        },

        padToFour: function (number) {
          if (number<=9999) { number = ("000"+number).slice(-4); }
          return number;
        },

        makeReStr: function(str) {
            // ^ost|[,\s]ost|ost[,\s]|ost$
            return '^' + str + '|[,\\s]' + str + '|' + str + '[,\\s]|' + str + '$'
        },

        makeRe: function(str) {
            return new RegExp(this.makeReStr(str));
        },

        makeReS: function(strs) {
            return _.map(strs, this.makeRe);
        },

        testReS: function(res, str) {
            return _.reduce(_.map(res, function (re) {
                return re.test(str);
            }), function (a, b) {
                return a & b;
            });
        },

        makeReCombined: function(strs) {
            return new RegExp(_.map(strs, this.makeRe).join('|'));
        },

        reload:function () {

            var that = this;
            if (this.with) {
                var res = this.makeReS(this.with);
                this.filteredcollection.filterBy('with', function(model) {
                    return that.testReS(res, model.get('indgredients'));
                });
            }
            else {
                this.filteredcollection.removeFilter('with');
            }
            if (this.without) {
                var re = this.makeReCombined(this.without);
                this.filteredcollection.filterBy('without', function(model) {
                    return !re.test(model.get('indgredients'));
                }); 
            }
            else {
                this.filteredcollection.removeFilter('without');
            }
            if (this.type && this.type != 'all') {
                this.filteredcollection.filterBy('type', function(model) {
                    return that.type == model.get('sopin_dishtype_flat')
                }); 
            }
            else {
                this.filteredcollection.removeFilter('type');
            }
            if (this.kitchen && this.kitchen != 'all') {
                this.filteredcollection.filterBy('kitchen', function(model) {
                    return that.kitchen == model.get('kitchen_flat')
                }); 
            }
            else {
                this.filteredcollection.removeFilter('kitchen');
            }
            if (this.groupby == 'restaurant_type') {
                this.collection.comparator = function(model) {
                    return model.get('restaurant') + that.padToFour(model.get('number'));
                }
            }
            else {
                this.collection.comparator = function(model) {
                    return model.get('sopin_dishtype_flat') + model.get('restaurant').name + that.padToFour(model.get('number'));
                }
            }
            var data = {limit:this.limit};
            /*
            if (this.type != 'all') data['sopin_dishtype__name__exact'] = this.type
            if (this.kitchen != 'all') data['kitchen__name__exact'] = this.kitchen*/
            this.collection.fetch({reset:true,data:data});
            return this;
        },

        addOne: function (model) {
            var context = {
                prevmodel:{},
                groupby:this.groupby
            }
            var view = new itemview({ model: model, context:context });
            this.$list.append(view.render().$el);
        },

        addAll: function () {
            var that = this;
            this.$el.html('');
            this.collection.sort();
            var previousmodel = null;
            var lastid = this.filteredcollection.at(-1).get('id');
            this.filteredcollection.each(function (model) {
                var context = {
                    prevmodel:previousmodel?previousmodel.toJSON():{},
                    lastmodel:lastid==model.get('id'),
                    groupby:that.groupby,
                    restaurants: app.restaurant,
                    restaurant_dishtypes: app.restaurant_dishtype
                }
                var view = new itemview({ model: model, context:context});
                this.$el.append(view.render().$el);
                previousmodel = model;
            }, this);
        }
    });
    return View;
});


