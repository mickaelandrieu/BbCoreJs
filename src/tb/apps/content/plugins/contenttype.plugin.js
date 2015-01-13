define(['content.pluginmanager', 'jquery', 'jsclass'], function (PluginManager, jQuery) {
    'use strict';
    PluginManager.registerPlugin('contenttype', {
        ACCEPT_CONTENT_TYPE: ["Bloc/contentset_bfm", 'home/home_container'],
        onInit: function () {
            this.bindEvents();
        },
        onContextChange: function () {
            this.callSuper();
        },
        addNewContent: function () {
            if (this.isEnabled()) {
                return false;
            }
            var no = this.getContentState("no") || 1,
                content = "Content no: " + no;
            this.getCurrentContentNode().append(jQuery("<p>" + content + "<p>"));
            this.setContentState("no", no + 1);
        },
        getAllowedContext: function () {
            return ['content.click', 'content.hover'];
        },
        bindEvents: function () {
            var self = this;
            jQuery(this.context.content).on('click', function () {
                if (!self.canApplyOnContext()) {
                    return false;
                }
                if (!self.isEnabled) {
                    return;
                }
            });
        },
        canApplyOnContext: function () {
            return true;
        },
        getActions: function () {
            var self = this;
            return [{
                ico: 'fa fa-plus',
                label: 'Add new content',
                context: '',
                cmd: self.createCommand(self.addNewContent, self),
                checkContext: function () {
                    return (jQuery.inArray(self.getCurrentContentType(), self.ACCEPT_CONTENT_TYPE) === -1) ? false : true;
                }
            }];
        }
    });
});