define(
    [
        'tb.core',
        'content.manager',
        'content.view.contribution.index',
        'definition.manager',
        'content.repository'
    ],
    function (Core, ContentManager, ContributionIndexView, DefinitionManager, ContentRepository) {

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
                try {
                    var view = new Constructor(config);

                    if (render) {
                        view.render();
                    }
                } catch (e) {
                    console.log(e);
                }
            },

            findDefinitionsService: function (page_uid) {
                return this.repository.findDefinitions(page_uid);
            },

            listenDOMService: function (definitions) {
                DefinitionManager.setDefinitions(definitions);
                ContentManager.listen();
            }
        });
    }
);
