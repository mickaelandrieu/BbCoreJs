/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
define(['jquery', 'tb.core.Renderer', 'text!main/tpl/toolbar'], function (jQuery, Renderer, template) {

    'use strict';

    /**
     * View of bundle's index
     * @type {Object} Backbone.View
     */
    var MainViewIndex = Backbone.View.extend({

        /**
         * Initialize of MainViewIndex
         * @param {Object} config
         */
        initialize: function (config) {
            this.el = config.tbSelector;
            this.toolbar = {
                menus: [
                    {
                        label: 'parameter',
                        text: 'General settings',
                        url: '#',
                        active: true,
                        items: [
                            {
                                label: 'site',
                                text: 'Website parameters',
                                url: '#site',
                                active: true
                            },
                            {
                                label: 'template',
                                text: 'Gabarit',
                                url: '#appLayout/home',
                                active: false
                            },
                            {
                                label: 'theme',
                                text: 'Theme',
                                url: '#theme',
                                active: false
                            },
                            {
                                label: 'block',
                                text: 'Bloc',
                                url: '#block',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'user',
                        text: 'Users and roles management',
                        url: '#',
                        active: false,
                        items: [
                            {
                                label: 'user',
                                text: 'Users management',
                                url: '#user',
                                active: false
                            },
                            {
                                label: 'role',
                                text: 'Roles managements',
                                url: '#role',
                                active: false
                            },
                            {
                                label: 'right',
                                text: 'Rights managements',
                                url: '#right',
                                active: false
                            },
                            {
                                label: 'workflow',
                                text: 'Workflow management',
                                url: '#workflow',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'contribute',
                        text: 'Contribution',
                        url: '#/contribution/index',
                        active: false,
                        items: [
                            {
                                label: 'edit',
                                text: 'Edition',
                                url: '#/contribution/index',
                                active: false
                            },
                            {
                                label: 'page',
                                text: 'Pages management',
                                url: '#pages',
                                active: false
                            },
                            {
                                label: 'content',
                                text: 'Content management',
                                url: '#content',
                                active: false
                            },
                            {
                                label: 'library',
                                text: 'Media',
                                url: '#library',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'pages',
                        text: 'Pages management',
                        url: '#/page/manage',
                        active: false,
                        items: [
                        ]
                    },
                    {
                        label: 'bundle',
                        text: 'Extensions',
                        url: '#/bundle/index',
                        active: false,
                        items: [
                            {
                                label: 'activate',
                                text: 'Activate / Deactivate',
                                url: '#',
                                active: false
                            },
                            {
                                label: 'admin',
                                text: 'Manage',
                                url: '#',
                                active: false
                            }
                        ]
                    }
                ]
            };

        },

        /**
         * Render the template into the DOM with the Renderer
         * @returns {Object} MainViewIndex
         */
        render: function () {
            jQuery(this.el).html(Renderer.render(template, this.toolbar));

            return this;
        }
    });

    return MainViewIndex;
});