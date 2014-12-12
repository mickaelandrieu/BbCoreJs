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

define(['text!content/tpl/button', 'tb.core.Renderer', 'jsclass'], function (template, Renderer) {
    'use strict';

    var Option = new JS.Class({

        /**
         * Initialize Option
         *
         * @param {Object} config
         */
        initialize: function (config) {
            this.config = config;

            this.id = Math.random().toString(36).substr(2);
            this.config.id = this.id;

            if (config.hasOwnProperty('callbackClick') && typeof config.callbackClick === 'function') {
                this.config.object.jQueryObject.on('click', '#' + this.id, config.callbackClick);
            }
        },

        /**
         * Render the option with template and config
         * @returns {String}
         */
        render: function () {
            return Renderer.render(template, this.config);
        }
    });

    return Option;
});
