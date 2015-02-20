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

define(
    [
        'content.pluginmanager',
        'jsclass'
    ],
    function (PluginManager) {

        'use strict';

        PluginManager.registerPlugin('dnd', {

            /**
             * Initialization of plugin
             */
            onInit: function () {
                return;
            },


            doDnd: function () {
                console.log('dnd');
            },

            /**
             * Verify if the plugin can be apply on the context
             * @returns {Boolean}
             */
            canApplyOnContext: function () {
                return true;
            },

            /**
             * 
             * @returns {Array}
             */
            getActions: function () {
                var self = this;

                return [
                    {
                        name: 'dnd',
                        ico: 'fa fa-hand-o-up bb-dnd btn-dnd',
                        label: 'Drag and drop',
                        cmd: self.createCommand(self.doDnd, self),
                        checkContext: function () {
                            return true;
                        }
                    }
                ];
            }
        });
    }
);