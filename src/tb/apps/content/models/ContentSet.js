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

define(['content.models.AbstractContent', 'jsclass'], function (AbstractContent) {

    'use strict';

    var ContentSet = new JS.Class(AbstractContent, {

        /**
         * Initialize Content
         *
         * @param {Object} config
         */
        initialize: function (config) {
            config.optionsConfig = this.defaultOptionsConfig;

            this.callSuper(config);
        },

        /**
         * Default options config
         */
        defaultOptionsConfig: [
            {
                icoClass: 'bb5-ico-add',
                title: 'Add a new item to this container',
                dataType: 'bb5-ico-add',
                label: 'Add',
                callbackClick: function () {
                    console.log('click add');
                }
            },
            {
                icoClass: 'bb5-ico-info',
                title: 'Informations',
                dataType: 'bb5-ico-info',
                label: 'Informations',
                callbackClick: function () {
                    console.log('click Informations');
                }
            },
            {
                icoClass: 'bb5-ico-parameter',
                title: 'Parameters',
                dataType: 'bb5-ico-parameter',
                label: 'Parameters',
                callbackClick: function () {
                    console.log('click Parameters');
                }
            },
            {
                icoClass: 'bb5-ico-lib',
                title: 'Content selector',
                dataType: 'bb5-ico-lib',
                label: 'Content selector',
                callbackClick: function () {
                    console.log('click Content selector');
                }
            }
        ]
    });

    return ContentSet;
});
