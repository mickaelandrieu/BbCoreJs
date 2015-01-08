define(['content.pluginmanager', 'jquery', 'jsclass'], function (PluginManager, jQuery) {
    PluginManager.registerPlugin('contenttype', {
        ACCEPT_CONTENT_TYPE: "Bloc/contentset_bfm",
        onInit: function () {
            this.bindEvents();
        },
        /*onDisable: function () {
            alert("sd");
        },

        onEnable: function () {
            alert('Radical blaze ');
        },*/
        onContextChange: function () {
            /* what do ? */
        },

        addNewContent: function () {
            var no = this.getContentState("no") || 1,
                content = "Content no: " + no;
            this.getCurrentContentNode().append($("<p>"+content+"<p>"));
            this.setContentState("no", no + 1);
        },

        getAllowedContext: function () {
            return ['content.click', 'content.hover'];
        },

        bindEvents: function () {
            var self = this;
            jQuery(this.context.content).on('click', function (e) {
                if (!self.canApplyOnContext()) {
                    return false;
                }
                if (!self.isEnabled) {
                    return;
                }
            });
        },

        canApplyOnContext: function () {
            console.log("canApplyOnContext", this.context);
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
                    return self.getCurrentContentType() == self.ACCEPT_CONTENT_TYPE;
                }
            }];
        }
    });
});