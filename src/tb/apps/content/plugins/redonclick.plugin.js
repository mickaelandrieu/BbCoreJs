define(['content.pluginmanager', 'jsclass'], function (PluginManager) {

    PluginManager.registerPlugin('redonclick', {

        getAvailableContext: function () {
            return ['content.click', 'content.hover'];
        },

        init: function () {

        },
        
        checkContext: function (context) {

        }


    });

});
