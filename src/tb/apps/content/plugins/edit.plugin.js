define(['content.pluginmanager', 'jquery', 'jsclass'], function (PluginManager, jQuery) {

    PluginManager.registerPlugin('edit', {

        onInit: function () {
           
        },

        colorToYellow: function () {
           jQuery(this.context.content).css('backgroundColor', 'yellow');
        },

        canApplyOnContext: function () {
            return true;
        },

        getActions: function () {
             var self = this;
            return [{
                    ico: 'fa fa-edit',
                    label: 'Color to yellow',
                    cmd: self.createCommand(self.colorToYellow, self)
            }];
        }

    });

});