
(function($){
  'use strict';
  
  app.session = new app.SessionModel();
  
  app.AppModel = app.BaseRecursiveModel.extend({
    
    defaults: _.extend({}, app.BaseRecursiveModel.prototype.defaults, {
      enabled: false
    })
  });   
  
  app.AppCollection = app.BaseRecursiveCollection.extend({
    model: app.AppModel
  });
  
  app.appcollection = new app.AppCollection();
  
  app.ChildView = Backbone.View.extend({
    
    template : _.template(templates.app_child_template||''),
    
    events : {
    },
    
    initialize : function(){
    },
    
    render : function(){

      this.el = this.template({model: this.model});
      return this;
    }
    
  });        
  app.AppView = Backbone.View.extend({
    
    el : '.backbone',
    
    template : _.template(templates.app_main_template),
    
    events : {
    },
    
    initialize : function(){
      this.render();
      this.childel = $('#child');
      this.listenTo(app.appcollection, 'add', this.addOne);
    },
    
    addOne: function (model) {
      var view = new app.ChildView({ model: model });
      this.childel.append(view.render().el);
    },

    render : function(){
      this.$el.html(this.template({}));
      return this;
    },
    
  });
  
  var AppInstance = new app.AppView();
  
  var instance = new app.AppModel();
  
  var instance2 = instance.deepclone().set_recursive({});
   
  app.appcollection.add(instance);  
  app.appcollection.add(instance2); 
  
})(jQuery);
