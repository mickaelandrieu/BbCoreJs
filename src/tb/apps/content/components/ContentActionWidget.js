define(['jquery', 'text!content-templates/content-action.twig', 'jsclass'], function (jQuery, template) {

    var ContentActionWidget = new JS.Class({

        initialize: function () {
            this.content = null;
            this.widget = jQuery(template).clone();
            jQuery(this.widget).css({
                'position' : 'absolute',
                'top': '-20px',
                'right': '0px',
                'border': '1px solid blue'
            });
        },

        setContent: function (content) {
            this.content = content;
        },


        appendActions: function (actions) {
            this.cleanActions();
            var btnCtn = document.createDocumentFragment(),
                actionInfos;
            $.each(actions, function (i, action) {
                actionInfos = actions[i];
                var button = jQuery("<button></button>").clone();
                button.attr("title", actionInfos.label);
                button.addClass(actionInfos.ico);

                $(button).on("click",(function(actionInfos){
                    return function () {
                        actionInfos.cmd.execute();
                    }
                }(actionInfos)));
                btnCtn.appendChild($(button).get(0));
            });
            this.widget.append(btnCtn);
        },

        cleanActions: function () {
            //jQuery(this.content).find(this.widget).remove();
            this.widget.empty();
        },

        showOn: function (content) {
            content = content || this.content;
            jQuery(content).append(this.widget);
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