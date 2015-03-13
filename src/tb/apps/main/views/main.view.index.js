/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
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
                        text: 'general_settings',
                        url: '#',
                        active: true,
                        items: [
                            {
                                label: 'site',
                                text: 'website_parameters',
                                url: '#site',
                                active: true
                            },
                            {
                                label: 'template',
                                text: 'gabarit',
                                url: '#appLayout/home',
                                active: false
                            },
                            {
                                label: 'theme',
                                text: 'theme',
                                url: '#theme',
                                active: false
                            },
                            {
                                label: 'block',
                                text: 'block',
                                url: '#block',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'user',
                        text: 'users_management',
                        url: '#/user/index',
                        active: false,
                        items: [
                            {
                                label: 'user',
                                text: 'users_management',
                                url: '#user',
                                active: false
                            },
                            {
                                label: 'role',
                                text: 'roles_management',
                                url: '#role',
                                active: false
                            },
                            {
                                label: 'right',
                                text: 'rights_management',
                                url: '#right',
                                active: false
                            },
                            {
                                label: 'workflow',
                                text: 'workflow_management',
                                url: '#workflow',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'contribute',
                        text: 'contribution',
                        url: '#/contribution/index',
                        active: false,
                        items: [
                            {
                                label: 'edit',
                                text: 'edition',
                                url: '#/contribution/index',
                                active: false
                            },
                            {
                                label: 'page',
                                text: 'pages_management',
                                url: '#pages',
                                active: false
                            },
                            {
                                label: 'content',
                                text: 'content_management',
                                url: '#content',
                                active: false
                            },
                            {
                                label: 'library',
                                text: 'media',
                                url: '#library',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'pages',
                        text: 'pages_management',
                        url: '#/page/manage',
                        active: false,
                        items: [
                        ]
                    },
                    {
                        label: 'bundle',
                        text: 'extensions',
                        url: '#/bundle/index',
                        active: false,
                        items: [
                            {
                                label: 'activate',
                                text: 'activate_deactivate',
                                url: '#',
                                active: false
                            },
                            {
                                label: 'admin',
                                text: 'manage',
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
