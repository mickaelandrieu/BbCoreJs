define(['content.pluginmanager', 'jquery', 'jsclass'], function (PluginManager, jQuery) {


    PluginManager.registerPlugin('redonclick', {

         onInit: function () {
           this.bindEvents();
        },

        onDisable: function () {
            alert("sd");
        },

        onEnable: function () {
            alert('Radical blaze ');
        },

        onContextChange: function () {
            /* what do ? */
        },

        colorToRed: function () {
            jQuery(this.context.content).css({backgroundColor : "red"});
        },

        getAllowedContext: function () {
            return ['content.click', 'content.hover'];
        },


        bindEvents: function () {
            var self = this;
          jQuery(this.context.content).on('click', function (e) {
              if(!self.canApplyOnContext()) { return false; }
              if(!self.isEnabled) { return; }
          });

        },

        canApplyOnContext: function () {
            console.log("canApplyOnContext", this.context);
            return true;
        },

        getActions: function () {
            var self = this;
            return [{
                    ico: 'fa fa-edit',
                    label: 'Color to red',
                    cmd: self.createCommand(self.colorToRed, self)
            }];
        }

    });

});
