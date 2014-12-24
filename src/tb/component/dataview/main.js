require.config({
    paths: {
        'dataviewTemplate': 'src/tb/component/dataview/templates',
        'dataStore': 'src/tb/component/dataview/DataStore'
    }
});
define(['require', 'tb.core.Api', 'BackBone', 'jquery', 'jsclass', 'tb.core.Api', 'text!dataviewTemplate/layout.tpl'], function (require) {
    'use strict';
    var mainTpl = require('text!dataviewTemplate/layout.tpl'),
        jQuery = require('jquery'),
        Api = require('tb.core.Api'),
        coreApi = require('tb.core.Api'),
        BaseDataView = new JS.Class({
            LIST_MODE: 'list',
            GRID_MODE: 'grid',
            defaultConfig: {
                cls: 'data-view',
                css: {
                    width: "450px",
                    height: "400px"
                },
                itemCls: 'data-view-item',
                itemSelectedCls: 'selected',
                rendererClass: '',
                renderAsCollection: false,
                allowMultiSelection: true,
                customItemEvents: {},
                itemRenderer: function () {
                    return '<p>An item renderer must be provided</p>';
                }
            },

            initialize: function (config) {
                jQuery.extend(this, {}, Backbone.Events);
                this.config = jQuery.extend({}, this.defaultConfig, config);
                this.build();
                this.currentRenderMode = this.LIST_MODE;
                this.renderers = {};
                this.buildDefaultRenderers();
                this.itemRenderer = this.config.itemRenderer;
                this.dataWrapper = jQuery(this.widget).find('.data-wrapper').eq(0);
                this.handleCustomItemEvents();
                this.selectionInfos = [];
                this.data = {};
                this.bindEvents();
            },

            handleCustomItemEvents: function () {
                var self = this;
                if (jQuery.isEmptyObject(this.config.customItemEvents)) {
                    return;
                }
                jQuery.each(this.config.customItemEvents, function (customEvent, data) {
                    if (!data.hasOwnProperty('evt') || data.hasOwnProperty('selector')) {
                        return true;
                    }
                    jQuery(self.widget).on(data.evt, data.selector, function (e) {
                        var itemNode = jQuery(e.target).closest(self.itemCls);
                        self.trigger(customEvent, e, jQuery(itemNode).data('item-data'));
                    });
                });
            },

            buildDefaultRenderers: function () {
                var listRenderer = {
                    name: "list",
                    render: function (items) {
                        var wrapper = jQuery("<ul/>");
                        wrapper.addClass("bb5-list-media bb5-list-media-is-list clearfix");
                        return jQuery(wrapper).html(items);
                    }
                },
                    gridRenderer = {
                        name: "grid",
                        render: function (items) {
                            var wrapper = jQuery("<ul/>");
                            wrapper.addClass("bb5-list-media bb5-list-media-is-grid clearfix");
                            return jQuery(wrapper).html(items);
                        }
                    };
                try {
                    this.registerRenderer(listRenderer);
                    this.registerRenderer(gridRenderer);
                } catch (e) {
                    Api.exception('BaseDataViewException', 46897, e);
                }
                /* register renderer */
            },

            bindEvents: function () {
                jQuery(this.widget).on("click", "." + this.config.itemCls, jQuery.proxy(this.handleItemClick, this));
                if (this.config.dataStore && typeof this.config.dataStore.on === "function") {
                    this.config.dataStore.on("dataStateUpdate", jQuery.proxy(this.setData, this));
                }
            },

            handleItemClick: function (e) {
                var target = jQuery(e.currentTarget),
                    data = target.data('item-data');
                if (target.hasClass(this.config.itemSelectedCls)) {
                    target.removeClass(this.config.itemSelectedCls);
                    this.trigger("itemUnselected", data, target);
                    return;
                }
                if (!this.config.allowMultiSelection) {
                    this.cleanSelection();
                }
                jQuery(target).addClass(this.config.itemSelectedCls);
                this.trigger("itemSelected", data, target);
                return true;
            },

            /* build the component */
            build: function () {
                this.widget = jQuery(mainTpl).clone();
                jQuery(this.widget).addClass(this.defaultConfig.cls);
                jQuery(this.widget).css(this.config.css);
            },

            setData: function (data) {
                this.data = data;
                this.updateUi();
            },

            updateUi: function () {
                var items = (this.renderAsCollection) ? this.data : this.renderItems(),
                    renderer = this.getModeRenderer(this.currentRenderMode).render(items);
                jQuery(this.dataWrapper).html(renderer);
            },

            getModeRenderer: function (mode) {
                var rendererName = mode + 'Renderer',
                    renderer;
                if (!this.renderers.hasOwnProperty(rendererName)) {
                    Api.exception('BaseDataViewException', 46897, '[getModeRenderer] "' + rendererName + '" can\'t be found.');
                }
                renderer = this.renderers[rendererName];
                if (typeof renderer.render !== "function") {
                    Api.exception('BaseDataViewException', 46898, '[getModeRenderer] renderer "' + rendererName + '" should provide a render function');
                }
                return this.renderers[mode + 'Renderer'];
            },

            registerRenderer: function (renderer) {
                if (jQuery.isEmptyObject(renderer)) {
                    Api.exception('BaseDataViewException', 46898, '[registerRenderer] renderer must be an object and should not be empty');
                }
                if (!renderer.hasOwnProperty('name') || typeof renderer.name !== 'string') {
                    Api.exception('BaseDataViewException', 46899, '[registerRenderer] renderer must have a name "' + JSON.stringify(renderer));
                }
                if (!renderer.hasOwnProperty("render") && typeof renderer.render !== "function") {
                    Api.exception('BaseDataViewException', 46900, '[registerRenderer] must provided a render function');
                }
                this.renderers[renderer.name + 'Renderer'] = renderer;
            },

            genId: (function () {
                var i = 0;
                return function (prefix) {
                    prefix = (typeof prefix === 'string') ? prefix + '_' : '';
                    i = i + 1;
                    return prefix + i;
                };
            }()),

            renderItems: function () {
                var self = this,
                    ctn = document.createDocumentFragment();
                jQuery.each(this.data, function (i, item) {
                    var itemRender = jQuery(self.itemRenderer(self.currentRenderMode, item)); // when is a class it should provide a render
                    jQuery(itemRender).data("view-item", self.genId("item"));
                    jQuery(itemRender).data("item-data", item);
                    jQuery(itemRender).data("item-no", i);
                    jQuery(itemRender).addClass(self.config.itemCls);
                    if (!itemRender || itemRender.length === 0) {
                        coreApi.exception('BaseDataViewException', 50002, '[renderItems] InvalidAppConfig [appPath] key is missing');
                    }
                    ctn.appendChild(jQuery(itemRender).get(0));
                });
                return ctn;
            },

            setRenderMode: function (mode) {
                var selections = this.getSelection();
                this.currentRenderMode = mode;
                this.updateUi();
                this.selectItems(selections);
            },

            render: function (container) {
                if (container && jQuery(container).length) {
                    jQuery(container).html(this.widget);
                    return;
                }
                return this.widget;
            },

            getSelection: function () {
                var selections = jQuery(this.dataWrapper).find("." + this.config.itemSelectedCls),
                    result = [];
                if (selections.length) {
                    jQuery.each(selections, function (i) {
                        var item = selections[i];
                        result.push(jQuery(item).data('itemData'));
                    });
                }
                return result;
            },

            cleanSelection: function () {
                this.dataWrapper.find("." + this.config.itemCls).removeClass(this.config.itemSelectedCls);
            },

            selectItems: function (items) {
                var self = this,
                    itemRender,
                    item;
                items = (jQuery.isArray(items)) ? items : [items];
                jQuery.each(items, function (i) {
                    item = items[i];
                    var selector = '[data-uid="' + item.uid + '"]';
                    itemRender = self.dataWrapper.find(selector);
                    if (itemRender.length) {
                        jQuery(itemRender).addClass(self.config.itemSelectedCls);
                    }
                });
            }
        });
    return {
        createDataView: function (config) {
            return new BaseDataView(config);
        },
        DataView: BaseDataView
    };
});