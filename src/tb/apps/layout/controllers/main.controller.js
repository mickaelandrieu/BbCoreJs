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
define(['require', 'tb.core', 'tb.core.Renderer', "component!treeview", 'jquery', 'component!contentselector', 'component!dataview', 'component!datastore'], function (require, bbCore, Renderer, TreeViewMng, jQuery, ContentSelector) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: {
            imports: []
        },
        onInit: function () {
            //this.rootView = jQuery(".jumbotron");
            this.tplRenderer = Renderer;
            //this.initRestDriver();
            //this.createTreeView();
            //this.createPopInTreeView();
            //this.dataListView = this.createDataViewList();
            this.contentSelector = this.createContentSelector();
            //this.bindEvents();
        },
        initRestDriver: function () {
            return;
            // CoreRestDriver.setBaseUrl('/rest/1/');
            // CoreDriverHandler.addDriver('rest', CoreRestDriver);
        },
        createContentSelector: function () {
            return ContentSelector.createContentSelector();
        },
        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },
        createDataViewList: function () {
            var DataStore = require('component!datastore');
            this.contentDataStore = new DataStore.RestDataStore({
                resourceEndpoint: "classcontent",
                restBaseUrl: "/rest/1",
                defaultCriteria: {}
            });
            /* test DataStore */
            return require('component!dataview').createDataView({
                allowMultiSelection: false,
                dataStore: this.contentDataStore,
                selectedItemCls: "selected",
                templatePath: "/template/path",
                itemRenderer: function (renderMode) {
                    if (renderMode === "list") {
                        return jQuery('<li class="bb5-selector-item">' + '<p><a href=""><img alt=" VendÃƒÂ©e Globe" src="http://bb5-demo.lp-digital.fr/images/62d83ec318257f1c28d34586518a0a51.jpg?1392309184"></a></p>' + '<p><a href=""> Vendée Globe</a></p>' + '<p><span data-i18n="mediaselector.width">L :</span> 312px, <span data-i18n="mediaselector.height">H :</span> 156px, 7.51 kB</p>' + '<p><button class="btn btn-simple btn-xs"><i class="fa fa-eye"></i> Voir</button> <button class="btn btn-simple btn-xs"><i class="fa fa-pencil"></i> Éditer</button> <button class="btn btn-simple btn-xs"><i class="fa fa-trash-o"></i> Supprimer</button></p>' + '</li>');
                    }
                    if (renderMode === "grid") {
                        return jQuery('<li class="bb5-selector-item">This is my item, francophonie, plus avancée</li>');
                    }
                }
            });
        },
        formatResponse: function (data) {
            var response = [],
                root;
            if (Array.isArray(data)) {
                jQuery.each(data, function (i, pageNode) {
                    if (pageNode.url === "/") {
                        root = jQuery.merge({}, pageNode);
                        root.label = pageNode.title;
                        root.children = [];
                        root.i = i; //useless
                        root.id = pageNode.uid;
                    } else {
                        pageNode.id = pageNode.uid;
                        pageNode.label = pageNode.title;
                        pageNode.children = [];
                        root.children.push(pageNode);
                    }
                });
                response.push(root);
            }
            return response;
        },
        createPopInTreeView: function () {
            if (this.popInTreeViews) {
                return;
            }
            this.popInTreeView = TreeViewMng.createPopinTreeView({
                autoDisplay: true,
                width: 200,
                height: 500,
                open: function () {
                    var data = [{
                        label: "Root",
                        id: 15,
                        children: [{
                            label: "feuille 1",
                            id: 12,
                            children: [{
                                id: 19,
                                label: "Sub 1"
                            }, {
                                id: 96,
                                label: "Sub 2"
                            }, {
                                id: 78,
                                label: "Sub 3"
                            }]
                        }, {
                            label: "feuille 2",
                            id: 23
                        }, {
                            label: "feuille 3",
                            id: 23
                        }]
                    }];
                    this.getTreeView().getRootNode();
                    this.getTreeView().appendNode({
                        label: "root",
                        id: 15
                    });
                    this.getTreeView().setData(data);
                    console.log(this.getTreeView().isRoot({
                        label: "root",
                        id: 15
                    }));
                },
                close: function () {
                    alert("res");
                }
            });
            window.popInTreeView = this.popInTreeView;
            this.popInTreeView.treeView.on("click", function (e) {
                console.log("element", e.node.element);
            });
        },
        createTreeView: function (renderContainer, data) {
            if (this.treeView) {
                return;
            }
            data = data || [];
            renderContainer = renderContainer || "";
            this.treeView = TreeViewMng.createTreeView(renderContainer, {
                data: data
            });
            bbCore.set("TestTreeView", this.treeView);
        },
        loadFail: function () {
            console.log("radical blaze");
        },
        genId: (function () {
            var compteur = 0;
            return function () {
                var inCpt = compteur + 1;
                return inCpt;
            };
        }()),
        bindEvents: function () {
            var self = this;
            jQuery(this.rootView).on("click", ".data-list-btn", function () {
                self.dataListView.render("#data-list");
                window.setTimeout(function () {
                    self.contentDataStore.on("onDataStateUpdate", function (data) {
                        self.dataListView.setData(data);
                    });
                    self.contentDataStore.applyFilter("category", "article").execute();
                }, 5000);
            });
            /*jQuery(this.rootView).on("click", ".show-tree-view", function () {
                var criterias = {},
                    orderBy = {},
                    start = 0,
                    limit = null;
                self.treeView.render(".renderContainer");
                CoreDriverHandler.read("page", criterias, orderBy, limit, start, function (response) {
                    data = self.formatResponse(response);
                    self.treeView.setData(data);
                });
            });*/
            jQuery(this.rootView).on("click", ".add_node_after", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId()
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "after", selectedNode);
            });
            jQuery(this.rootView).on("click", ".add_node_before", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId()
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "before", selectedNode);
            });
            jQuery(this.rootView).on("click", ".add_node_append", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId(),
                    data: {
                        effor: "sds",
                        dragon: "adversaire"
                    }
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "append", selectedNode);
            });
        },
        onDisabled: function () {
            return;
        },
        layoutListAction: function () {
            console.log(arguments);
        },

        homeAction: function () {
            try {
                var self = this,
                    data = {
                        appName: 'Indeed',
                        templateName: 'homeTemplate',
                        radical: 'staying'
                    },
                    responseHtml = this.tplRenderer.asyncRender('src/tb/apps/layout/templates/home.tpl', {
                        data: data
                    }); //action append, replace
                jQuery(this.rootView).html(responseHtml);
                setTimeout(function () {
                    self.contentSelector.display();
                }, 2000);
            } catch (e) {
                console.log(e);
            }

        },
        listAction: function (page, section) {
            console.log(page, section);
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: listAction</p>'));
        },
        paramsAction: function (p, s, d, u) {
            this.p = p;
            this.s = s;
            this.d = d;
            this.u = u;
        }
    });
});