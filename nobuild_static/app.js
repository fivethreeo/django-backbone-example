/**
 * @desc        app globals
 */
define([
    "jquery",
    "underscore",
    "backbone"
],
function($, _, Backbone) {

    var app = {
        root : "/",                     // The root path to run the application through.
        URL : "/",                      // Base application URL
        API : "/api/v1/",               // Base API URL (used by models & collections)
        local: !location.hostname.match('hongri.no'),
        // Show alert classes and hide after specified timeout
        showAlert: function(title, text, klass) {
            $("#header-alert").removeClass("alert-danger alert-warning alert-success alert-info");
            $("#header-alert").addClass(klass);
            $("#header-alert").html('<button class="close" data-dismiss="alert">×</button><strong>' + title + '</strong> ' + text);
            $("#header-alert").show('fast');
            setTimeout(function() {
                $("#header-alert").hide();
            }, 7000 );
        }
    };

    $.ajaxSetup({ cache: false });          // force ajax call on all browsers


    // Global event aggregator
    app.eventAggregator = _.extend({}, Backbone.Events);
  
    app.getCookie = function(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    };
    
    app.addCsrfHeader = function(xhr) {
      // Set the CSRF Token in the header for security
      var token = app.getCookie('csrftoken');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    };
    
    Backbone.toFormData = function (attributes) {
      if (!!window.FormData) {
        data = new FormData();
        $.each(attributes, function (name, value) {
          if ($.isArray(value)) {
            if (value.length > 0) {
              $.each(value, function(index, item_value) {
                data.append(name, item_value);
              })
            }
          } else {
            data.append(name, value)
          }
        });
        return data
      }
      throw new Error('FormData not supported by browser');
    }
    
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
        
    var oldSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        options.beforeSend = function(xhr){
          app.addCsrfHeader(xhr);
        };
        return oldSync(method, model, options);
    };
    app.make_attrs = function(dict) {
        return _.map(_.pairs(dict), function(pair) {
          return pair[1] ? pair[0] + '="' + pair[1] + '"' : '';
      }).join(' ');
    };
    
    app.nosyncdecorator = function(model) {
      model.prototype.sync = function() { return null; };
      model.prototype.fetch = function() { return null; };
      model.prototype.save = function() { return null; }
      return model
    };
    
    // View.close() event for garbage collection
    Backbone.View.prototype.close = function() {
        this.remove();
        this.unbind();
        if (this.onClose) {
            this.onClose();
        }
    };

    return app;

});