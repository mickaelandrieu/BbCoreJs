require.config({
    paths: {
        'cs-templates': 'src/tb/component/contentselector/templates',
        'cs-view': 'src/tb/component/contentselector/views',
        'cs-control': 'src/tb/component/contentselector/control',
        'jqLayout': 'lib/jquery.layout/jquery.layout-latest',
        'node.formater': 'src/tb/component/contentselector/helper/node.formater',
        'pagerangeselector.control': 'src/tb/component/contentselector/control/pageselector.control',
        'content.renderer': 'src/tb/component/contentselector/helper/content.renderer',
        'content.datastore': 'src/tb/component/contentselector/datastore/content.datastore'
    }
});
define(['require', 'jquery', 'text!cs-templates/layout.tpl', 'tb.component/popin/main', 'component!rangeselector', 'component!dataview', 'component!mask', 'text!cs-templates/layout.tpl', 'content.renderer', 'cs-control/searchengine.control', 'jqLayout', "component!datastore", "component!treeview", "component!pagination", "node.formater", 'nunjucks', 'content.datastore'], function (require, jQuery, layout, PopInMng) {
    'use strict';
    var formater = require('node.formater'),
        ContentRenderer = require('content.renderer'),
        ContentSelectorWidget = new JS.Class({
            VIEW_MODE: "view",
            EDIT_MODE: "edit",
            defautConfig: {
                autoDisplay: true,
                dialogConfig: {
                    title: "<i class='fa fa-inbox'></i> Contents selector",
                    draggable: false,
                    resizable: false,
                    autoOpen: false,
                    height: jQuery(window).height() - (20 * 2),
                    width: jQuery(window).width() - (20 * 2)
                },
                pagination: {
                    itemsOnPage: 5
                },
                pageSelector: {
                    range: [1, 10, 1]
                },
                categoryTreeView: {},
                contentDataView: {},
                searchEngine: {}
            },

            initialize: function (userConfig) {
                /* The purpose is to setup child components*/
                this.config = jQuery.extend({}, this.defautConfig, userConfig);
                this.isLoaded = false;
                this.state = {};
                this.mode = this.VIEW_MODE;
                this.widget = jQuery(layout).clone();
                this.popIn = this.initPopIn();
                this.popIn.addOption("open", jQuery.proxy(this.onOpen, null, this));
                this.options = jQuery({}, this.defautConfig, userConfig);
                this.contentRenderer = new ContentRenderer();
                this.initComponents();
                this.initControls();
                this.bindEvents();
            },

            initControls: function () {
                this.pageRangeSelector = require("component!rangeselector").createPageRangeSelector(this.config.pageSelector);
                this.searchEngine = require("cs-control/searchengine.control").createSearchEngine(this.config.searchEngine);
                this.contentPagination.setItemsOnPage(this.pageRangeSelector.getValue(), true);
            },

            /* create components */
            initComponents: function () {
                this.contentRestDataStore = require('content.datastore');
                this.categoryTreeView = this.createCategoryTreeView();
                this.contentDataView = this.createDataView();
                this.contentPagination = this.createPagination();
                this.maskMng = require('component!mask').createMask({});
                this.mainZone = jQuery(this.widget).find('.bb5-windowpane-main').eq(0);
            },

            createDataView: function () {
                var defaultConfig = {
                    allowMultiSelection: true,
                    selectedItemCls: "selected",
                    css: {
                        width: "auto",
                        height: "auto"
                    }
                },
                    dataViewConfig = jQuery.extend({}, defaultConfig, this.contentDataView);
                dataViewConfig.itemRenderer = jQuery.proxy(this.contentRenderer.render, this.contentRenderer);
                dataViewConfig.dataStore = this.contentRestDataStore;
                return require('component!dataview').createDataView(dataViewConfig);
            },

            createPagination: function () {
                return require('component!pagination').createPagination(this.config.pagination);
            },

            createCategoryTreeView: function () {
                return require('component!treeview').createTreeView(this.config.categoryTreeView);
            },
            /**
             * This fonction is called only once for each instance
             * the tree is loaded here the prevent useless rest call
             **/
            onReady: function () {
                var self = this,
                    catTreeCtn = jQuery(this.widget).find('.bb5-windowpane-tree .bb5-treeview').eq(0),
                    contentViewCtn = jQuery(this.widget).find('.data-list-ctn').eq(0),
                    pageRangeCtn = jQuery(this.widget).find('.max-per-page-selector').eq(0),
                    paginationCtn = jQuery(this.widget).find('.content-selection-pagination').eq(0),
                    searchEnginerCtn = jQuery(this.widget).find(".bb5-form-wrapper").eq(0);
                this.categoryTreeView.render(catTreeCtn);
                this.contentDataView.render(contentViewCtn);
                this.contentPagination.render(paginationCtn, 'replaceWith');
                this.pageRangeSelector.render(pageRangeCtn, 'replaceWith');
                this.searchEngine.render(searchEnginerCtn, 'html');
                jQuery.ajax({
                    url: '/rest/1/classcontent/category'
                }).done(function (data) {
                    var formattedData = formater.format('category', data);
                    self.categoryTreeView.setData(formattedData);
                });
            },

            initLayout: function () {
                return jQuery(this.widget).layout({
                    applyDefaultStyles: true,
                    closable: false,
                    west__childOptions: {
                        center__paneSelector: ".inner-center",
                        north__paneSelector: ".ui-layout-north",
                        south__paneSelector: ".ui-layout-south"
                    },
                    center__childOptions: {
                        center__paneSelector: ".inner-center",
                        inner__paneSelector: ".ui-layout-north"
                    }
                });
            },

            showMask: function () {
                this.maskMng.mask(this.mainZone);
            },

            hideMask: function () {
                this.maskMng.unmask(this.mainZone);
            },

            bindEvents: function () {
                var self = this;
                /* show mask */
                this.contentRestDataStore.on('processing', function () {
                    self.showMask();
                });
                this.contentRestDataStore.on('doneProcessing', function () {
                    self.hideMask();
                });
                jQuery(this.widget).on('click', '.viewmode-btn', function (e) {
                    var viewMode = jQuery(e.currentTarget).data('viewmode');
                    self.setDataViewMode(viewMode);
                });
                /* When click on a node */
                this.categoryTreeView.on('click', function (e) {
                    var selectedNode = e.node;
                    if (jQuery(selectedNode.element).hasClass("jqtree-selected")) {
                        return false;
                    }
                    if (selectedNode.isRoot) {
                        return;
                    }
                    if (selectedNode.isACategory) {
                        self.contentRestDataStore.unApplyFilter('byClasscontent').applyFilter('byCategory', selectedNode.name);
                    } else {
                        self.contentRestDataStore.unApplyFilter('byCategory').applyFilter('byClasscontent', selectedNode.type);
                    }
                    /* always reset pagination when we change category*/
                    self.contentRestDataStore.setStart(0).setLimit(self.pageRangeSelector.getValue()).execute();
                });
                /* When range Changes */
                this.pageRangeSelector.on("pageRangeSelectorChange", function (val) {
                    self.contentRestDataStore.setLimit(val);
                    self.contentPagination.setItemsOnPage(val); // -->will trigger pageChange
                });
                /* When page changes */
                this.contentPagination.on("pageChange", function (page) {
                    var limit = self.pageRangeSelector.getValue(),
                        start = (page - 1) * limit,
                        seletectedNode = self.categoryTreeView.getSelectedNode();
                    self.contentRestDataStore.setStart(start);
                    if (!seletectedNode || (seletectedNode && seletectedNode.isRoot)) {
                        return;
                    }
                    self.contentRestDataStore.execute();
                });
                /* When we must update the query task */
                this.searchEngine.on("doSearch", function (criteria) {
                    jQuery.each(criteria, function (key, val) {
                        if (criteria[key] !== undefined) {
                            var filterName = 'by' + key.charAt(0).toUpperCase() + key.slice(1);
                            self.contentRestDataStore.applyFilter(filterName, val);
                        }
                    });
                    self.contentRestDataStore.execute();
                });
                /* when we have contents */
                self.contentRestDataStore.on("dataStateUpdate", jQuery.proxy(this.updateCurrentNodeInfos, this));
            },
            updateCurrentNodeInfos: function () {
                var resultTotal = this.contentRestDataStore.getTotal();
                jQuery(this.widget).find(".result-infos").html(this.categoryTreeView.getSelectedNode().name + ' - ' + resultTotal + ' item(s)');
                /* update pagination here */
                this.contentPagination.setItems(resultTotal);
            },
            setDataViewMode: function (mode) {
                var availableMode = ['grid', 'list'];
                jQuery(this.widget).find('.viewmode-btn').removeClass("active");
                jQuery(this.widget).find(".bb5-sortas" + mode).addClass("active");
                if (availableMode.indexOf(mode) !== -1) {
                    this.contentDataView.setRenderMode(mode);
                }
            },
            setContenttypes: function (contentypeArr) {
                var data = formater.format("contenttype", contentypeArr);
                this.categoryTreeView.setData(data);
            },
            initPopIn: function () {
                PopInMng.init("#bb5-ui");
                return PopInMng.createPopIn(this.config.dialogConfig);
            },
            onOpen: function (selector) {
                selector.onReady();
                selector.onReady = jQuery.noop;
                if (!selector.isLoaded) {
                    jQuery(this).html(selector.widget);
                }
                var widgetLayout = selector.initLayout();
                widgetLayout.resizeAll();
                widgetLayout.sizePane("west", 201); //useful to fix layout size
                selector.isLoaded = true;
            },
            render: function () {
                return this.widget;
            },
            display: function () {
                this.popIn.display();
            }
        });
    return {
        createContentSelector: function (config) {
            config = config || {};
            return new ContentSelectorWidget(config);
        },
        ContentSelectorWidget: ContentSelectorWidget
    };
});