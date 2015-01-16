define(['jquery', 'text!content/tpl/content-action', 'jsclass'], function (jQuery, template) {
    'use strict';
    var ContentActionWidget = new JS.Class({
        initialize: function () {
            this.content = null;
            this.widget = jQuery(template).clone();
            jQuery(this.widget).addClass('content-actions');
        },

        setContent: function (content) {
            this.content = content;
        },

        /*  listen to context */
        appendActions: function (actions) {
            this.cleanActions();
            var btnCtn = document.createDocumentFragment(),
                actionInfos;
            jQuery.each(actions, function (i) {
                actionInfos = actions[i];
                var button = jQuery("<button></button>").clone();
                button.attr("title", actionInfos.label);
                button.addClass(actionInfos.ico);
                jQuery(button).on("click", (function (actionInfos) {
                    return function () {
                        actionInfos.cmd.execute();
                    };
                }(actionInfos)));
                btnCtn.appendChild(jQuery(button).get(0));
            });
            this.widget.append(btnCtn);
        },

        cleanActions: function () {
            //jQuery(this.content).find(this.widget).remove();
            this.widget.empty();
        },

        show: function () {
            jQuery(this.content).append(this.widget);
        },
        
        hide: function () {
            this.widget.empty();
        }
    });
    return ContentActionWidget;
});