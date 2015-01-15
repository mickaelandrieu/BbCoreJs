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

define(
    [
        'tb.core',
        'jquery',
        'jsclass'
    ],
    function (Core, jQuery) {

        'use strict';

        var AbstractContent = new JS.Class({

            mainTag: '#bb5-ui',

            contentClass: '.bb-content',

            /**
             * Initialize AbstractContent
             *
             * @param {Object} config
             */
            initialize: function (config) {
                this.config = config;

                this.updated = false;

                this.computeMandatoryConfig(config);

                this.populate();

                this.bindEvents();
            },

            setUpdated: function (isUpdate) {
                if (typeof isUpdate === 'boolean') {
                    this.updated = isUpdate;
                }
            },

            /**
             * Add properties to the content like bb-content class or id
             */
            populate: function () {
                this.jQueryObject.attr('data-bb-id', this.id);
            },

            /**
             * Bind events of content
             */
            bindEvents: function () {
                jQuery('html').off().on('click', jQuery.proxy(this.onClickOut, this));
                this.jQueryObject.on('click', jQuery.proxy(this.onClick, this));
                this.jQueryObject.on('mouseenter', jQuery.proxy(this.onMouseEnter, this));
                this.jQueryObject.on('mouseleave', jQuery.proxy(this.onMouseLeave, this));
            },

            /**
             * Select the content
             */
            select: function () {
                this.addClass('bb-content-selected');
            },

            /*
             * Unselect the content
             */
            unSelect: function () {
                this.removeClass('bb-content-selected');
            },

            /**
             * compute and verify the config
             * jQueryObject, objectIdentifier and id must be set
             *
             * @param {Object} config
             */
            computeMandatoryConfig: function (config) {
                if (typeof config.jQueryObject !== 'object') {
                    Core.exception('BadTypeException', 500, 'The jQueryObject must be set');
                }
                this.jQueryObject = config.jQueryObject;

                if (typeof config.uid !== 'string') {
                    Core.exception('BadTypeException', 500, 'The uid must be set');
                }
                this.uid = config.uid;

                if (typeof config.type !== 'string') {
                    Core.exception('BadTypeException', 500, 'The type must be set');
                }
                this.type = config.type;

                if (typeof config.definition === 'object') {
                    this.definition = config.definition;
                } else {
                    this.definition = null;
                }

                this.id = Math.random().toString(36).substr(2);
            },

            /**
             * Add a class to the content
             * @param {String} className
             */
            addClass: function (className) {
                this.jQueryObject.addClass(className);
            },

            /**
             * RemoveClass to the content
             * @param {String} className
             */
            removeClass: function (className) {
                this.jQueryObject.removeClass(className);
            }
        });

        return AbstractContent;
    }
);

