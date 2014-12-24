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
define('tb.core.Renderer', ['require', 'nunjucks', 'jquery', 'tb.core.Utils', 'jsclass'], function (require, nunjucks) {
    'use strict';

    var jQuery = require('jquery'),

        config = {},

        instance,

        Renderer = new JS.Class({
            initialize: function () {
                var error_tpl = config.error_tpl || '<p>Error while loading template</p>',
                    placeholder = config.placeholder || '<p>Loading...</p>';

                this.engine = nunjucks;
                this.render_action = 'html';
                this.error_msg = jQuery(error_tpl).clone();
                this.placeholder = jQuery(placeholder);
            },

            getEngine: function () {
                return this.engine;
            },

            asyncRender: function (path, params, config) {
                params = params || {};
                config = config || {};
                config.placeholder = config.placeholder || this.placeholder;
                config.action = config.action || 'html';
                if (!path || typeof path !== "string") {
                    throw 'Renderer:asyncRender [path] parameter should be a string';
                }
                require('tb.core.Utils').requireWithPromise(['text!' + path]).then(
                    jQuery.proxy(this.onTemplateReady, this, config, params),
                    jQuery.proxy(this.errorRenderer, this, config)
                );

                return jQuery(config.placeholder);
            },

            render: function (template, params) {
                params = params || {};

                return this.engine.renderString(template, params);
            },

            errorRenderer: function (config) {
                jQuery(config.placeholder)[config.action](this.error_msg);
            },

            onTemplateReady: function (config, params, template) {
                jQuery(config.placeholder)[config.action](this.engine.renderString(template, params));
            }
        }),

        getInstance = function () {
            if (instance === undefined) {
                instance = new Renderer();
            }
            return instance;
        },

        initRenderer = function (conf) {
            config = conf;
        },

        invocMethod = function (method_name) {
            return (function (instance) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    return instance[method_name].apply(instance, args);
                };
            }(getInstance()));
        },

        ApiRender = {
            init: initRenderer,
            getEngine: invocMethod('getEngine'),
            render: invocMethod('render'),
            asyncRender: invocMethod('asyncRender')
        };

    return ApiRender;
});
