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

define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'tb.core', 'jquery', 'URIjs/URI', 'jsclass'], function (CoreDriverHandler, CoreRestDriver, Core, jQuery, URI) {
    'use strict';

    var putMandatoriesAttribute = ['title', 'alttitle', 'url', 'target', 'state', 'redirect', 'layout_uid'],

        /**
         * Page repository class
         * @type {Object} JS.Class
         */
        PageRepository = new JS.Class({

            TYPE: 'page',

            /**
             * Initialize of Page repository
             */
            initialize: function () {
                CoreRestDriver.setBaseUrl('/rest/1/');
                CoreDriverHandler.addDriver('rest', CoreRestDriver);
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
             * Find the current page
             * @todo change this method for get the current page with a rest service
             * @returns {Promise}
             */
            findCurrentPage: function () {
                var dfd =  jQuery.Deferred();

                CoreDriverHandler.read(this.TYPE, {}, {}, 0, 1).done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    dfd.resolve(data);
                }).fail(function (e) {
                    dfd.reject(e);
                });

                return dfd.promise();
            },

            setMetadata: function (page_uid, data) {
                Core.Mediator.subscribeOnce('rest:send:before', function (request) {
                    var url = new URI(request.url);

                    url.segment('metadata');

                    request.url = url.normalize().toString();
                });

                return CoreDriverHandler.update(this.TYPE, data, {'id': page_uid});
            },

            /**
             * Return the metadata of page
             * @param {String} page_uid
             * @returns {Promise}
             */
            getMetadata: function (page_uid) {
                Core.Mediator.subscribeOnce('rest:send:before', function (request) {
                    var url = new URI(request.url);

                    url.segment('metadata');

                    request.url = url.normalize().toString();
                });

                return CoreDriverHandler.read(this.TYPE, {'id': page_uid}, {}, 0, null);
            },

            /**
             * Get the page by uid
             * @param {String} uid
             */
            find: function (uid) {
                return CoreDriverHandler.read(this.TYPE, {'id': uid});
            },

            /**
             * Find pages with children
             * @param {String} uid
             */
            findChildren: function (parent_uid, start, limit) {
                var criterias = {'state': [0, 1, 2, 3], 'parent_uid': parent_uid};

                if (start === undefined) {
                    start = 0;
                }

                if (limit === undefined) {
                    limit = 25;
                }

                return CoreDriverHandler.read(this.TYPE, criterias, {'leftnode': 'asc'}, start, limit);
            },

            findRoot: function () {
                return CoreDriverHandler.read(this.TYPE);
            },

            /**
             * Search pages
             *
             * @param array filters
             * @param int start
             * @param int count
             * @param {Function} callback
             */
            search: function (filters, start, count, callback) {
                var qs = filters;

                if (start !== undefined && start !== null) {
                    qs.start = start;
                }

                if (count !== undefined && count !== null) {
                    qs.count = count;
                }

                return CoreDriverHandler.read(this.TYPE, qs, {}, 0, null, callback);
            },

            /**
             * Save the page with a correctly method
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
                    result = CoreDriverHandler.create(this.TYPE, data);
                }

                return result;
            },

            /**
             * Delete the page
             * @param {String} uid
             * @returns {Promise}
             */
            "delete": function (uid) {
                return CoreDriverHandler["delete"](this.TYPE, {'id': uid}, {}, 0, null);
            },

            /**
             * Clone the page
             * @param {String} uid
             * @param {Object} data
             * @returns {Promise}
             */
            clone: function (uid, data) {
                Core.Mediator.subscribeOnce('rest:send:before', function (request) {
                    var url = new URI(request.url);

                    url.segment(uid);
                    url.segment('clone');

                    request.url = url.normalize().toString();
                });

                return CoreDriverHandler.create(this.TYPE, data);
            },

            /**
             * Move node
             * @param {String} page_uid
             * @param {String} parent_uid
             * @param {String} next_uid
             */
            moveNode: function (page_uid, data) {
                return CoreDriverHandler.patch(this.TYPE, data, {'id': page_uid});
            },

            /**
             * Get workflow of page
             * @param {String} uid
             * @todo move to layout application
             * @returns {Promise}
             */
            getWorkflowState: function (layout_uid) {
                Core.Mediator.subscribeOnce('rest:send:before', function (request) {
                    var url = new URI(request.url);

                    url.segment('workflow_state');

                    request.url = url.normalize().toString();
                });
                return CoreDriverHandler.read('layout', {'id': layout_uid});
            },

            findLayouts: function (site_uid) {
                return CoreDriverHandler.read('layout', {'site_uid': site_uid}, {}, 0, null);
            }
        });

    return new JS.Singleton(PageRepository);
});
