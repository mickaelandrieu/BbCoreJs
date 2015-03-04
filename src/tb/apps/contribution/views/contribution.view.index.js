define(
    [
        'tb.core.Api',
        'jquery',
        'tb.core.ApplicationManager',
        'tb.core.Renderer',
        'text!contribution/tpl/index'
    ],
    function (Core, jQuery, ApplicationManager, Renderer, template) {

        'use strict';

        /**
         * View of contribution's index
         * @type {Object} Backbone.View
         */
        var BundleViewIndex = Backbone.View.extend({

            id: 'contribution-tab',

            initialize: function (config) {

                this.alreadyLoaded = false;
                if (config !== undefined) {
                    this.alreadyLoaded = (config.alreadyLoaded === true);
                }
            },

            /**
             * Events of view
             */
            bindEvents: function () {
                var element = jQuery('#' + this.id);

                element.on('click', 'ul#edit-tab li', this.manageMenu);
                element.on('click', '#new-page', this.showNewPage);
                element.on('click', '#global-save', this.manageSave);
                element.on('click', '#bundle-toolbar-tree', this.showTree);
                element.on('click', '#bundle-toolbar-global-validate', this.manageValidate);
                element.on('click', '#bundle-toolbar-global-cancel', this.manageCancel);
            },

            showTree: function () {
                var config = {
                        do_loading: true,
                        do_pagination: true,
                        site_uid: Core.get('site.uid'),
                        popin: true
                    };

                ApplicationManager.invokeService('page.main.tree', config);
            },

            showNewPage: function () {
                return ApplicationManager.invokeService('page.main.newPage', {'parent_uid': Core.get('page.uid')});
            },

            manageMenu: function (event) {
                var self = jQuery(event.currentTarget);

                jQuery('ul#edit-tab li.active').removeClass('active');
                self.addClass('active');

                jQuery('div#contrib-tab-apps div.tab-pane.active').removeClass('active');
                jQuery('div#' + self.children('a').data('type') + '-contrib-tab').addClass('active');
            },

            /**
             * Call service `save` into main application
             */
            manageSave: function () {
                ApplicationManager.invokeService('main.main.save');
            },

            /**
             * Call service `validate` into main application
             */
            manageValidate: function () {
                ApplicationManager.invokeService('main.main.validate');
            },

            /**
             * Call service `cancel` into main application
             */
            manageCancel: function () {
                ApplicationManager.invokeService('main.main.cancel');
            },

            /**
             * Render the template into the DOM with the Renderer
             * @returns {Object} BundleViewIndex
             */
            render: function () {
                var self = this;

                ApplicationManager.invokeService('main.main.toolbarManager').done(function (Service) {
                    Service.append('contribution-tab', Renderer.render(template, this.contribution));

                    if (self.alreadyLoaded !== true) {
                        self.bindEvents();
                    }
                });

                return this;
            }
        });

        return BundleViewIndex;
    }
);