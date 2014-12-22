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

define(['jsclass'], function () {

    'use strict';

    var ContentContainer = new JS.Class({

        contents: [],

        /**
         * Find element in elements with id
         * @param {String} id
         * @returns {Object}
         */
        find: function (id) {
            var key,
                content,
                result = null;

            for (key in this.contents) {
                if (this.contents.hasOwnProperty(key)) {
                    content = this.contents[key];
                    if (content.id === id) {
                        result = content;
                        break;
                    }
                }
            }

            return result;
        },

        findContentSetByAccept: function (accept) {
            var key,
                content,
                result = [];

            for (key in this.contents) {
                if (this.contents.hasOwnProperty(key)) {
                    content = this.contents[key];
                    if (content.isContentSet) {
                        if (content.accept(accept)) {
                            result.push(content);
                        }
                    }
                }
            }

            return result;
        },

        isInArray: function (array, key, value) {
            var i,
                item,
                result = false;

            for (i in array) {
                if (array.hasOwnProperty(i)) {
                    item = array[i];
                    if (item[key] === value) {
                        result = true;
                        break;
                    }
                }
            }

            return true;
        },

        /**
         * Add content to the container
         * @param {Object} content
         */
        addContent: function (content) {
            if (null !== content && content !== undefined) {
                if (null === this.find(content.id)) {
                    this.contents.push(content);
                }
            }
        }
    });

    return new JS.Singleton(ContentContainer);
});
