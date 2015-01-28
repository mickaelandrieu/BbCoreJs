define(
    [
        'tb.core',
        'content.dnd.manager',
        'content.mouseevent.manager',
        'content.save.manager',
        'content.view.contribution.index',
        'definition.manager',
        'content.repository'
    ],
    function (Core,
              DndManager,
              MouseEventManager,
              SaveManager,
              ContributionIndexView,
              DefinitionManager,
              ContentRepository) {

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

            /**
             * Call method save into SaveManager
             */
            saveService: function () {
                SaveManager.save();
            },
            
            /**
             * Call method save into SaveManager
             */
            cancelService: function () {
                SaveManager.cancel();
            },

            contributionIndexAction: function () {
                var self = this;

                if (this.categories !== undefined) {
                    self.createView(ContributionIndexView, {'categories': this.categories}, true);
                } else {
                    ContentRepository.findCategories().done(function (categories) {
                        self.categories = categories;
                        self.createView(ContributionIndexView, {'categories': categories}, true);
                    });
                }
            },

            createView: function (Constructor, config, render) {
                var view = new Constructor(config);

                if (render) {
                    view.render();
                }
            },

            findDefinitionsService: function (page_uid) {
                return this.repository.findDefinitions(page_uid);
            },

            listenDOMService: function (definitions) {
                DefinitionManager.setDefinitions(definitions);

                DndManager.listen();
                MouseEventManager.listen();
            }
        });
    }
);
