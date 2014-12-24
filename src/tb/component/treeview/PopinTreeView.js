define(["jquery", "tb.component/treeview/TreeView", "tb.component/popin/main"], function (jQuery, TreeViewMng, PopInMng) {
    'use strict';
    var popInTemplate = jQuery("<div class='bb5-windowpane-tree'><div class='action-ctn'><input type='checkbox'/>Show folder</div><div class='bb5-treeview'>Loading...</div></div>").clone(),
        PopInTreeview = new JS.Class({
            defaultConfig: {
                height: 300,
                width: 350,
                title: "Page tree",
                autoDisplay: false
            },
            initialize: function (options) {
                this.options = jQuery.extend({}, this.defaultConfig, options);
                this.isLoaded = false;
                this.treeView = TreeViewMng.createTreeView(null, this.options);
                this.checkParameters();
                this.popIn = this.createPopIn();
                this.popIn.setContent(popInTemplate);
                this.popIn.addOption("create", jQuery.proxy(this.initOnCreate, this));
                this.popIn.addOption("open", jQuery.proxy(this.initOnOpen, this));
                if (this.options.hasOwnProperty("autoDisplay") && this.options.autoDisplay) {
                    this.display();
                }
            },

            getPopIn: function () {
                return this.popIn;
            },

            getTreeView: function () {
                return this.treeView;
            },
            checkParameters: function () {
                this.options.open = (typeof this.options.open === "function") ? jQuery.proxy(this.options.open, this) : function () {
                    return;
                };
                this.options.create = (typeof this.options.create === "function") ? jQuery.proxy(this.options.create, this) : function () {
                    return;
                };
                if (!this.options.hasOwnProperty("data") || !Array.isArray(this.options.data)) {
                    this.options.data = [];
                }
            },
            initOnCreate: function () {
                var content = this.popIn.getContent(),
                    container = jQuery(content).find(".bb5-treeview");
                this.treeView.render(container);
                this.options.create(); //won't be need
            },
            initOnOpen: function () {
                if (this.isLoaded) {
                    return;
                }
                this.options.open();
                this.isLoaded = true;
            },
            createPopIn: function () {
                PopInMng.init("#bb5-ui");
                return PopInMng.createPopIn(this.options);
            },
            display: function () {
                this.popIn.display();
            },
            hide: function () {
                this.popIn.hide();
            }
        });
    return {
        createPopInTreeView: function (options) {
            return new PopInTreeview(options);
        }
    };
});