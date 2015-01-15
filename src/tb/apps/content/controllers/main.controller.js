define(
    [
        'tb.core',
<<<<<<< HEAD
        'content.dnd.manager',
        'content.mouseevent.manager',
=======
        'content.manager',
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
        'content.view.contribution.index',
        'definition.manager',
        'content.repository'
    ],
<<<<<<< HEAD
    function (Core, DndManager, MouseEventManager, ContributionIndexView, DefinitionManager, ContentRepository) {
=======
    function (Core, ContentManager, ContributionIndexView, DefinitionManager, ContentRepository) {
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f

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
<<<<<<< HEAD

                DndManager.listen();
                MouseEventManager.listen();
=======
                ContentManager.listen();
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
            }
        });
    }
);
