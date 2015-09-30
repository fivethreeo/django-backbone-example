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
        API : "/api/v1/",                   // Base API URL (used by models & collections)

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
    
    Backbone.asFormData = false;
    
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
    
    Backbone.newsync = function(method, model, options) {
      var type = methodMap[method];
  
      // Default options, unless specified.
      _.defaults(options || (options = {}), {
        emulateHTTP: Backbone.emulateHTTP,
        emulateJSON: Backbone.emulateJSON
        asFormData: Backbone.asFormData
      });
  
      // Default JSON-request options.
      var params = {type: type, dataType: 'json'};
  
      // Ensure that we have a URL.
      if (!options.url) {
        params.url = _.result(model, 'url') || urlError();
      }
  
      // Ensure that we have the appropriate request data.
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        if (options.asFormData) {
          if (method === 'patch') throw new Error('"patch" method does not work with asFormData');
          params.contentType = false;
          params.data = Backbone.toFormData(options.attrs || model.toJSON(options)));
        }
        else {
          params.contentType = 'application/json';
          params.data = JSON.stringify(options.attrs || model.toJSON(options));
        }
        
      }
  
      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
      }
  
      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }
  
      // Don't process data on a non-GET request.
      if (params.type !== 'GET' && !options.emulateJSON) {
        params.processData = false;
      }
  
      // If we're sending a `PATCH` request, and we're in an old Internet Explorer
      // that still has ActiveX enabled by default, override jQuery to use that
      // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
      if (params.type === 'PATCH' && noXhrPatch) {
        params.xhr = function() {
          return new ActiveXObject("Microsoft.XMLHTTP");
        };
      }
  
      // Make the request, allowing the user to override any Ajax options.
      var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      model.trigger('request', model, xhr, options);
      return xhr;
    };
  
    var noXhrPatch =
      typeof window !== 'undefined' && !!window.ActiveXObject &&
        !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);
  
    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
    };
      
    var oldSync = Backbone.newsync;
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