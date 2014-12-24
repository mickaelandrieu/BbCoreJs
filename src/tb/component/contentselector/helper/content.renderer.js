require.config({
    paths: {
        'content.datastore': 'src/tb/component/contentselector/datastore/content.datastore'
    }
});
define(['require', 'content.datastore', 'jquery', 'jsclass', 'nunjucks', 'text!cs-templates/content.delete.tpl', 'text!cs-templates/content.grid.view.tpl', 'tb.core.Api', 'text!cs-templates/content.list.view.tpl'], function (require) {
    'use strict';
    var nunjucks = require('nunjucks'),
        jQuery = require('jquery'),
        Api = require('tb.core.Api'),

        ContentRenderer = new JS.Class({
            // defaultConfig : {},
            initialize: function () {
                this.templates = {
                    list: require('text!cs-templates/content.list.view.tpl'),
                    grid: require('text!cs-templates/content.list.view.tpl'),
                    //no difference
                    deleteContent: require('text!cs-templates/content.delete.tpl')
                };
                this.itemData = null;
                this.restContentDataStore = require('content.datastore');
                this.popinManager = require('component!popin');
                this.popin = this.popinManager.createPopIn({
                    modal: true,
                    minHeight: 200,
                    minWidth: 450,
                    title: "Content preview"
                });
            },

            bindContentEvents: function (item, itemData) {
                item = jQuery(item);
                item.on('click', ".show-content-btn", jQuery.proxy(this.showContentPreview, this, itemData));
                item.on('click', ".del-content-btn", jQuery.proxy(this.deleteContent, this, itemData));
                return item;
            },

            /* use cache, load item template according to render mode*/
            render: function (renderMode, item) {
                var itemData = item;
                item = nunjucks.renderString(this.templates[renderMode], item);
                return this.bindContentEvents(item, itemData);
            },

            showContentPreview: function (itemData) {
                var self = this;
                self.popin.setContent(jQuery("<p></p>"));
                self.popin.display();
                self.popin.mask();
                self.addButtons();
                jQuery.ajax({
                    url: "/rest/1/classcontent/" + itemData.type + '/' + itemData.uid,
                    dataType: 'html'
                }).done(function (response) {
                    self.popin.unmask();
                    self.popin.setContent(jQuery(response));
                    self.popin.display();
                }).fail(function (response) {
                    self.popin.unmask();
                    Api.exception('ContentRendererException', 57567, 'error while showing showContentPreview ' + response);
                });
            },

            deleteContent: function (itemData) {
                var self = this,
                    content;
                self.itemData = itemData;
                self.popin.setContent(jQuery("<p></p>"));
                self.popin.mask();
                self.addButtons();
                self.popin.display();
                jQuery.ajax({
                    url: "/rest/1/page",
                    data: {
                        content_uid: itemData.uid,
                        content_type: itemData.type
                    }
                }).done(function (data) {
                    data = data || [];
                    var templateData = {
                        isOrphaned: (data.length === 0),
                        items: data
                    };
                    content = nunjucks.renderString(self.templates.deleteContent, templateData);
                    self.popin.unmask();
                    self.popin.setContent(jQuery(content));
                    self.popin.display();
                }).fail(function (response) {
                    self.popin.unmask();
                    Api.exception('ContentRendererException', 57567, '[deleteContent] ContentRendererException error while deleting content ' + response);
                });
            },

            addButtons: function () {
                var self = this;
                this.deleting = true;
                self.popin.addButton('Yes', function () {
                    self.popin.setContent("<p>Please wait while the content is being deleted...</p>");
                    self.restContentDataStore.remove(self.itemData.type, self.itemData.uid);
                });
                self.popin.addButton("No", function () {
                    self.popin.hide();
                });
            }
        });
    return ContentRenderer;
});