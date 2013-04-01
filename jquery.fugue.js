/*
 * jQuery Fugue Plugin
 * For Ajax Form submit
 * Copyright (c) 2012 Lancee (xrhy.me)
 * Dual licensed under the MIT and GPL licenses:
 */

!(function() {
  (function($, Export) {
    "use strict";

    $.fugue = function(ajaxform, options) {
      if (!ajaxform || ajaxform.nodeName.toLowerCase()!=="form") {
        throw new Error('this is not a form');
      }

      $.support.formdata = Export.FormData !== undefined;

      var Fugue = function() {
        this.init();
      };

      Fugue.prototype = {
        constructor: Fugue,

        init: function() {
          var $form = $(ajaxform).data('fugue', this),
              self = this;

          self.$el = $form.addClass('fugue');

          options = $.extend({}, $.fugue.default, options);
          options.type = $form.attr('method') || options.type;
          options.url = $form.attr('action') || options.url;
          $form.on('submit', function(e) {
            (e.preventDefault)?e.preventDefault():e.returnValue = false;
            self.submit(e);
          });
          self.options = options;
        },

        serialize: function() {
          options.beforeSerialize();
          if ($.support.formdata) {
            var dataArray = this.$el.serializeArray(),
                data = {};
            $.each(dataArray, function(i, field) {
              data[field.name] = field.value;
            });
            options.data = $.extend({}, options.data, data);
          }
          this.options = options;
        },

        submit: function(e) {
          this.serialize();
          options.beforeSubmit();
          delete this.options['beforeSubmit'],
          delete this.options['beforeSerialize'];
          $.ajax(this.options);
        },
        options: $.fugue.default
      }

      return new Fugue();

    }

    $.fugue.default = {
      beforeSerialize: function() {},
      beforeSubmit: function() {},
      type: 'POST',
      dataType: 'json'
    };

    $.fn.fugue = function(options, callback) {
      var fugue = $(this).data('fugue');

      if ($.isFunction(options)) {
        callback = options;
        options = null;
      }
      if((typeof(options)).match('object|undefined')) {
        return this.each(function(i) {
          if(!fugue) {
            fugue = $.fugue(this, options);
            if(callback)
              callback.call(fugue);
          } else {
            if(callback)
              callback.call(fugue);
          }
        });
      } else {
        throw new Error('arguments[0] is not a instance of Object');
      }
    }

  })(jQuery, window);

}).call(this);