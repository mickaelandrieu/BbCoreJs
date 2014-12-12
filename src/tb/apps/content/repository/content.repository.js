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
        'tb.core.DriverHandler',
        'tb.core.RestDriver'
    ],
    function (CoreDriverHandler, CoreRestDriver) {

        'use strict';

        /**
         * Contnet repository class
         * @type {Object} JS.Class
         */
        var ContentRepository = new JS.Class({

            TYPE: 'classcontent',

            /**
             * Initialize of Page repository
             */
            initialize: function () {
                CoreRestDriver.setBaseUrl('/rest/1/');
                CoreDriverHandler.addDriver('rest', CoreRestDriver);
            },

            /**
             * Find all definitions
             * @returns {Promise}
             */
            findDefinitions: function () {
                return CoreDriverHandler.read(this.TYPE + '/definition');
            }
        });

        return new JS.Singleton(ContentRepository);
    }
);
