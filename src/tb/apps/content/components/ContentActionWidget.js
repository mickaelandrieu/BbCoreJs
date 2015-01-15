<<<<<<< HEAD
define(['jquery', 'text!content/tpl/content-action', 'jsclass'], function (jQuery, template) {
=======
define(['jquery', 'text!content-templates/content-action.twig', 'jsclass'], function (jQuery, template) {
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
    'use strict';
    var ContentActionWidget = new JS.Class({
        initialize: function () {
            this.content = null;
            this.widget = jQuery(template).clone();
<<<<<<< HEAD
             jQuery(this.widget).addClass('content-actions');
        },

        setContent: function (content) {
            this.content = content;
        },

=======
            jQuery(this.widget).css({
                'position': 'absolute',
                'top': '-20px',
                'right': '0px'
            });
        },
        setContent: function (content) {
            this.content = content;
        },
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
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
<<<<<<< HEAD

=======
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
        cleanActions: function () {
            //jQuery(this.content).find(this.widget).remove();
            this.widget.empty();
        },
<<<<<<< HEAD

=======
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
        showOn: function (content) {
            content = content || this.content;
            jQuery(content).append(this.widget);
        },
<<<<<<< HEAD

        show: function () {
            jQuery(this.content).append(this.widget);
        },

=======
        show: function () {
            jQuery(this.content).append(this.widget);
        },
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
        hide: function () {
            this.widget.empty();
        }
    });
    return ContentActionWidget;
});