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

    var DefinitionManager = new JS.Class({

        definitions: [],

        /**
         * Add a definition
         * @param {Object} definition
         */
        addDefinition: function (definition) {
            if (null === this.find(definition.type)) {
                this.definitions.push(definition);
            }
        },

        /**
         * Set all definitions
         * @param {Object} definitions
         */
        setDefinitions: function (definitions) {
            var key;

            for (key in definitions) {
                if (definitions.hasOwnProperty(key)) {
                    this.addDefinition(definitions[key]);
                }
            }
        },

        /**
         * find definition by type
         * @param {String} type
         * @returns {null|Object}
         */
        find: function (type) {
            var key,
                definition,
                result = null;

            for (key in this.definitions) {
                if (this.definitions.hasOwnProperty(key)) {
                    definition = this.definitions[key];
                    if (definition.type === type) {
                        result = definition;
                        break;
                    }
                }
            }

            return result;
        }
    });

    return new JS.Singleton(DefinitionManager);
});

