define(['tb.core', 'tb.core.SmartList', 'jsclass'], function (Core, SmartList) {

    /**
     * Plugin anatomy
     * (For now) A plugin concern a content
     *  [Capability]
     *  * Provide action to the content --> buttons
     *  * Can be configured by users
     *  * Can work silently
     *  * When available can know when to show action
     *
     **/
    var mediator = Core.Mediator,
        AbstractPlugin = new JS.Class({

            initialize : function () {
                this.context = {};
                this.init();
            },

            init: function () { console.log("init function"); },

            createBtn: function () {},

            checkContext: function () {
             /**
             * Check rather the plugin must be visible in this particulier context
             */
                return true;
            },

            setContext: function (context) {

            },

            editAction : function () {
                alert("radical blaze");
            },

            exposeActions: function () {
                var self = this;
                return [{
                    icon: 'fa fa-edit',
                    scope: 'content-edit',
                    action: function () {
                        self.editAction();
                    }
                }];
            }



    });

    var PluginManager = new JS.Class({

        initialize: function (config) {
            this.pluginContainer =  new SmartList();
            this.defContainer = {};
            this.pluginNameSpace = {next:'../sdsd/sdd/'}; //where to look for a pluggin. This will allows us to load plugins provided by users
            this.handleContentEvents();
        },

        /**
         * Namespaces allow us to
         * default namespace is tbplugin
         * plugin!next/redonclick
         **/
        registerNameSpace: function () {},

        isPluginLoaded: function (puglinName) {

        },

        handleContentEvents: function () {
            var self = this;
            mediator.subscribe(" content:click", function () {
                routeToplugins();
            });

        },


        registerPlugin: function (puglinName, def) {
            if(this.defContainer.hasOwnProperty(puglinName)) {
                throw "PluginManagerException A plugin named " + puglinName +" already exists";
            }
            this.defContainer[puglinName] = this.createPluginClass(def);
        },

        applyPlugins : function () {

        },

        createPluginClass: function (def) {
            /* Remove mandatory protected methods here */
            /*if(def.hasOwnProperty("initialize")) {
            }*/
            var pluginClass = new JS.Class(AbstractPlugin, def);

        },

        /* notify when plugin */
        loadPlugin: function (pluglinName) {

        }
    });

return {
    PluginManager : PluginManager
}

});

/**
 * Usage:
 * Le plugin Manager écoute les événements susceptibles de réveiller un ou plusieurs plugin
 * Lorsque ces événements se produisent
 *  1. Le plugin est chargé
 *      loadplugin(pluginName).init()
 *  2. Le plugin execute l'action par défaut pour l'événement ...
 *  3. Le plugin prend la main ou pas?
 *  4. Notion de plugin silencieux --> selection multiple par exemple?
 *
 **/