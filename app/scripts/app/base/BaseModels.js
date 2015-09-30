define('app/base/BaseModels', [
  'backbone'
], function(Backbone) {
  
  var models = {}
  
  models.BaseModel = Backbone.Model.extend({
    
    deepclone: function() {
      var that = this;
      var attributes = _.clone(this.attributes);
    
      _.map(_.keys(this.attributes), function(key) {
          if (attributes[key] && attributes[key].deepclone) attributes[key] = that.get(key).deepclone();
      })
      
      return new this.constructor(attributes);
    }
    
  });
    
  models.BaseRecursiveModel = models.BaseModel.extend({

    set_recursive: function(dict) {
      var that = this;
      _.mapObject(dict, function(value, key) {
          if (that.attributes[key] && that.attributes[key].set_recursive) { that.attributes[key].set_recursive(value); }
          else { that.set(key, value); }
      })
      return that;
      
    }
  });
  models.BaseCollection = Backbone.Collection.extend({

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: 'order',
        
    deepclone: function() {
      return new this.constructor(_.map(this.models, function(m) { return m.deepclone ? m.deepclone() : m.clone(); }));  
    }
  });
  
  models.BaseRecursiveCollection = models.BaseCollection.extend({
    
    set_recursive: function(list) {
      var that = this;
      _.map(_.range(list.length), function(index) {
          if (that.models.length > index) {
            if (that.models[index].set_recursive) that.models[index].set_recursive(list[index]);
          }
          else {
            var obj = that.create({});
            if (obj.set_recursive) obj.set_recursive(list[index]);
          }
      })
      return that;
      
    }
  });
  return models;
});
