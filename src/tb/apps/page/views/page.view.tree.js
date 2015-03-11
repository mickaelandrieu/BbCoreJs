/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

define(
    [
        'tb.core.Api',
        'jquery',
        'page.repository',
        'component!treeview'
    ],
    function (Api, jQuery, PageRepository, Tree) {

        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        var PageViewTree = Backbone.View.extend({

            limit_of_page: 10,

            /**
             * Initialize of PageViewClone
             */
            initialize: function (config) {

                this.config = config;
                if (typeof this.config.site_uid !== 'string') {
                    Api.exception('MissingPropertyException', 500, 'Property "site_uid" must be set to constructor');
                }

                this.site_uid = this.config.site_uid;

                this.initializeTree();
            },

            /**
             * Initialize tree
             */
            initializeTree: function () {
                var config = {
                        dragAndDrop: true,
                        onCreateLi: this.onCreateLi
                    };

                this.formatedData = [];

                if (this.config.popin === true) {
                    this.tree = Tree.createPopinTreeView(config);
                    this.treeView = this.tree.treeView;
                } else {
                    this.treeView = this.tree = Tree.createTreeView(config);
                }

                this.bindDefaultEvents();
            },

            /**
             * Event trigged when LI is created
             * @param {Object} node
             * @param {Object} li
             */
            onCreateLi: function (node, li) {

                var title = li.find('.jqtree-title');

                if (node.is_fake !== true) {
                    if (node.state === 0 || node.state === 2) {
                        title.html('<i class="bb5-ico-workflow offline"></i>' + title.html());
                    } else if (node.state === 3) {
                        title.html('<i class="bb5-ico-workflow masked"></i>' + title.html());
                    } else {
                        title.html('<i class="bb5-ico-workflow"></i>' + title.html());
                    }
                }
            },

            /**
             * Bind default events of tree
             */
            bindDefaultEvents: function () {
                this.treeView.on('tree.click', jQuery.proxy(this.onClick, this));
                this.treeView.on('tree.open', jQuery.proxy(this.onOpen, this));
            },

            /**
             * Event trigged on click in tree
             * @param {Object} event
             */
            onClick: function (event) {
                var self = this,
                    parent = event.node.parent;

                if (event.node.is_fake === true && self.config.do_pagination === true) {

                    self.findPages(parent.id, event, parent.range_to + 1).done(function (data) {
                        self.treeView.invoke('removeNode', event.node);
                        self.insertDataInNode(data, parent);
                    });
                }
            },

            /**
             * Event trigged on click in arrow in tree
             * @param {Object} event
             */
            onOpen: function (event) {
                var self = this;

                if (event.node.is_fake === true) {
                    return;
                }

                if (event.node.before_load) {
                    self.findPages(event.node.id, event, 0).done(function (data) {
                        self.insertDataInNode(data, event.node);
                    });
                }
            },

            /**
             * Find pages with page repository and add limit in current node
             * @param {String} parent_uid
             * @param {Object} event
             * @param {Number} start
             * @param {Number} limit
             */
            findPages: function (parent_uid, event, start) {
                var dfd = jQuery.Deferred(),
                    self = this;

                PageRepository.findChildren(parent_uid, start, this.limit_of_page).done(function (data, response) {

                    self.updateLimit(event, response);

                    dfd.resolve(data);
                }).fail(function (e) {
                    dfd.reject(e);
                });

                return dfd.promise();
            },

            /**
             * Update limit of node for create pagination
             * @param {Object} event
             * @param {Object} response
             */
            updateLimit: function (event, response) {
                var target;

                if (event.namespace === 'open') {
                    target = event.node;
                } else if (event.namespace === 'click') {
                    target = event.node.parent;
                }

                if (target !== undefined) {
                    target.range_total = response.getRangeTotal();
                    target.range_to = response.getRangeTo();
                    target.range_from = response.getRangeFrom();
                }
            },

            /**
             * Formate Page object to Node object
             * @param {Object} page
             * @returns {Object}
             */
            formatePageToNode: function (page) {

                page.id = page.uid;
                page.label = page.title;
                page.children = [];
                page.before_load = false;
                page.hasChildren = function () {
                    return this.children.length !== 0 || this.has_children === true;
                };

                if (page.has_children) {
                    page.before_load = true;
                    if (this.config.do_loading === true) {
                        page.children.push(this.buildNode('Loading...', {'is_fake': true}));
                    }
                }

                return page;
            },

            /**
             * Build a simple node
             * @param {String} label
             * @param {Object} properties
             * @returns {Object}
             */
            buildNode: function (label, properties) {
                var node = {};

                node.id = Math.random().toString(36).substr(2, 9);
                node.label = label;
                node.children = [];

                this.updateNode(node, properties);

                return node;
            },

            updateNode: function (node, properties) {
                var property;

                for (property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        node[property] = properties[property];
                    }
                }
            },

            /**
             * Insert data in node, remove loader and add pagination if necessary
             * @param {Object} data
             * @param {Object} node
             */
            insertDataInNode: function (data, node) {
                var key,
                    children = node.children;

                if (node.before_load) {
                    if (node.children.hasOwnProperty(0) && node.children[0].is_fake === true) {
                        this.treeView.invoke('removeNode', node.children[0]);
                    }
                    node.before_load = false;
                }

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        this.treeView.invoke('appendNode', this.formatePageToNode(data[key]), node);
                    }
                }

                if (node.range_total > children.length  && this.config.do_pagination === true) {
                    this.treeView.invoke('appendNode', this.buildNode('next results...', {'is_fake': true}), node);
                }
            },


            getTree: function () {
                var self = this,
                    dfd = jQuery.Deferred();

                PageRepository.findRoot().done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = [self.formatePageToNode(data[0])];
                    }

                    self.treeView.setData(data);

                    dfd.resolve(self.tree);
                });

                return dfd.promise();
            }
        });

        return PageViewTree;
    }
);