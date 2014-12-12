define(['tb.core', 'content.manager', 'definition.manager'], function (Core, ContentManager, DefinitionManager) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'content',

        config: {
            imports: ['content.repository']
        },

        /**
         * Initialize of Bundle Controller
         */
        onInit: function () {
            this.repository = require('content.repository');
        },

        findDefinitionsService: function (page_uid) {
            return this.repository.findDefinitions(page_uid);
        },

        listenDOMService: function (definitions) {
            DefinitionManager.setDefinitions(definitions);
            ContentManager.listen();
        }
    });
});
