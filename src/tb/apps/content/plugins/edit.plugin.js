define(['content.pluginmanager', 'jquery', 'jsclass'], function (PluginManager, jQuery) {
    'use strict';
    PluginManager.registerPlugin('edit', {
        ACCEPT_CONTENT_TYPE: "block_demo",
        onInit: function () {
            return;
        },
        colorToYellow: function () {
            if (this.getContentState("color") === 'yellow') {
                jQuery(this.getCurrentContentNode()).css('backgroundColor', '');
                this.setContentState('color', '');
            } else {
                jQuery(this.getCurrentContentNode()).css('backgroundColor', 'yellow');
                this.setContentState('color', 'yellow');
            }
        },
        editContent: function () {
            var contentNode = this.getCurrentContentNode(),
                h1 = jQuery(contentNode).find('h1');
            jQuery(contentNode).find('h1').attr('contenteditable', true);
            h1.focus();
        },
        canApplyOnContext: function () {
            return true;
        },
        onDisable: function () {
            this.callSuper();
        },
        getActions: function () {
            var self = this;
            return [{
                name: 'edit',
                ico: 'fa fa-circle-o',
                label: 'Color to yellow',
                cmd: self.createCommand(self.colorToYellow, self),
                checkContext: function () {
                    return self.getCurrentContentType() === self.ACCEPT_CONTENT_TYPE;
                }
            }, {
                ico: 'fa fa-bars',
                label: 'Add content',
                cmd: self.createCommand(self.editContent, self),
                checkContext: function () {
                    return self.getCurrentContentType() === self.ACCEPT_CONTENT_TYPE;
                }
            }];
        }
    });
});