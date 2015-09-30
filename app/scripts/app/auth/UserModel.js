
define('app/auth/UserModel', [
  'app',
  'app/base/BaseModels'
], function(app, models) {

  var UserModel = models.BaseModel.extend({

    initialize: function(){
    },

    defaults: {
        id: 0,
        username: '',
        name: '',
        email: ''
    },

    url: function(){
        return app.API + '/user';
    }

  });
  
  return UserModel;

});
