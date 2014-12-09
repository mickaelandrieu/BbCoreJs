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

define(['jquery', 'content.models.Content', 'jsclass'], function (jQuery, Content) {

    'use strict';

    var DOMParser = new JS.Class({

        attributesToParse: ['data-bb-identifier'],

        elements: [],

        /**
         * Parse each element found with selectors to be search
         */
        parse: function () {
            var key,
                attribute,
                elements = [];

            for (key in this.attributesToParse) {
                if (this.attributesToParse.hasOwnProperty(key)) {
                    attribute = this.attributesToParse[key];
                    elements = elements.concat(this.buildElements(jQuery('[' + attribute + ']'), attribute));
                }
            }
        },

        /**
         * Build elements found with this selector in array
         * @param {Object} elements
         * @param {String} selector
         * @returns {Array}
         */
        buildElements: function (elements, selector) {
            var self = this,
                array = [];

            elements.each(function () {
                array.push(self.buildElement(this, selector));
            });

            return array;
        },

        /**
         * Build element with Content or ContentSet class.
         * ContentSet class is used if element have is_contentset=true
         * @param {Object} element
         * @param {String} selector
         * @returns {Object}
         */
        buildElement: function (element, selector) {
            var config = {},
                jQueryElement = jQuery(element);

            config.objectIdentifier = jQueryElement.attr(selector);
            config.jQueryObject = jQueryElement;

            return new Content(config);
        }
    });

    return new JS.Singleton(DOMParser);
});
