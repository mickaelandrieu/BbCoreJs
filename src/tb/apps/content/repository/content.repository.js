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

        var putMandatoriesAttribute = ['type'],
            /**
             * Contnet repository class
             * @type {Object} JS.Class
             */
            ContentRepository = new JS.Class({

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
                },

                /**
                 * Find all categories
                 * @returns {Promise}
                 */
                findCategories: function () {
                    return CoreDriverHandler.read(this.TYPE + '/category');

                },

                /**
                 * Verify if the method is put method with a mandatories attributes array
                 * @param {Object} data
                 * @returns {Boolean}
                 */
                isPutMethod: function (data) {
                    var key,
                        mandatory,
                        isValid = true;

                    for (key in putMandatoriesAttribute) {
                        if (putMandatoriesAttribute.hasOwnProperty(key)) {
                            mandatory = putMandatoriesAttribute[key];
                            if (!data.hasOwnProperty(mandatory)) {
                                isValid = false;
                                break;
                            }
                        }
                    }

                    return isValid;
                },

                /**
                 * Save the content with a correctly method
                 * @param {Object} data
                 * @returns {Promise}
                 */
                save: function (data) {
                    var result,
                        uid;

                    if (data.hasOwnProperty('uid')) {
                        uid = data.uid;

                        delete data.uid;

                        if (this.isPutMethod(data)) {
                            result = CoreDriverHandler.update(this.TYPE, data, {'id': uid}, {}, 0, null);
                        } else {
                            result = CoreDriverHandler.patch(this.TYPE, data, {'id': uid});
                        }
                    } else {
                        result = CoreDriverHandler.create(this.TYPE + '/' + data.type);
                    }

                    return result;
                }
            });

        return new JS.Singleton(ContentRepository);
    }
);
