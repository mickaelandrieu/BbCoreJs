require.config({
    paths: {
        'contentplugin': 'src/tb/apps/content/plugins/contentplugin',
        'actionContainer': 'src/tb/apps/content/components/ContentActionWidget'
    }
});
define(['tb.core', 'jquery', 'tb.core.Utils', 'actionContainer', 'jsclass'], function (Core, jQuery, Utils, ContentActionWidget) {
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
        pluginsInfos = {},
        instance = null,
        Command = function Command(func, context) {
            this.execute = function () {
                func.call(context);
            }
        }
    AbstractPlugin = new JS.Class({
        initialize: function () {
            this.context = {};
            this.enabled = false;
        },

        onInit: function () {
            console.log("onInit function");
        },

        onEnable: function () {
            this.isEnabled = true;
        },

        onDisable: function () {
            this.enabled = false;
        },

        isEnabled: function () {
            return this.enabled;
        },

        createBtn: function () {},

        /* Check Rather the plugin can be */
        canApplyOnContext: function () {
            return false;
        },
        createCommand: function (func, context) {
            if (typeof func !== 'function') {
                Core.exception("PluginException: createCommand parameter must be a function.");
            }
            var command, context = context || this;
            command = (function (f, c) {
                return new function () {
                    this.execute = function () {
                        f.call(c);
                    }
                }
            }(func, context));
            return command;
        },
        setContext: function (context) {
            var previousContext = this.context;
            this.context = context;
            this.onContextChange(previousContext);
        },

        onContextChange: function () {},

        editAction: function () {
            alert("radical blaze");
        },

        getActions: function () {
            return [];
        }
    });
    var PluginManager = new JS.Class({
        initialize: function (config) {
            this.pluginsInfos = pluginsInfos;
            this.pluginsInstance = {};
            this.pluginNameSpace = {}; //where to look for a plugin. This will allows us to load plugins provided by users
            this.contentActionWidget = new ContentActionWidget();
            this.bindEvents();
        },
        bindEvents: function () {
            mediator.subscribe('on:pluginManager:loadingErrors', jQuery.proxy(this.handleLoadingError, this), this);
            mediator.subscribe('on:pluginManager:loading', jQuery.proxy(this.handleLoading, this), this);
        },
        /**
         * Namespaces allow us to
         * default namespace is tbplugin
         * plugin!next/redonclick
         **/
        registerNameSpace: function () {},

        isPluginLoaded: function (puglinName) {
            if (this.pluginsInstance.hasOwnProperty(puglinName)) {
                return true;
            }
            return false;
        },

        getPluginInstance: function (pluginName) {
            return this.pluginsInstance[pluginName];
        },

        watchContents: function () {
            var self = this,
                context;
            mediator.subscribe("on:classcontent:click", function (e) {
                var context = {};
                context.content = e.currentTarget;
                jQuery(context.content).css('position', 'relative');
                context.scope = 'content-click';
                context.events = ['on:classcontent:click'];
                self.context = context;
                var plugins = ["edit", "redonclick"];
                self.initPlugins(plugins); // check
            });
        },

        handleLoading: function (pluginInfos) {
            /* at this stage we know that the plugin is ready */
            try {
                var pluginName = pluginInfos['name'],
                    instance = new this.pluginsInfos[pluginName]();
                instance.setContext(this.context);
                instance.onInit();
                this.pluginsInstance[pluginName] = instance;
            } catch (e) {
                console.log(e);
            }
        },

        handleLoadingErrors: function (pluginInfos) {
            console.log('Error while loading plugin');
        },

        disablePlugins: function () {
            jQuery.each(this.pluginsInstance, function (i, instance) {
                instance = this.pluginsInstance[i];
                instance.onDisable();
            });
            /* hide content action */
            this.contentActionWidget.hide();
        },

        handleContentActions: function () {

        },

        initPlugins: function (pluginsName) {
            var self = this,
                pluginName,
                pluginInstance,
                contentPlugins = [],
                pluginsToLoad = [];
            jQuery.each(pluginsName, function (i) {
                pluginName = pluginsName[i];
                if (self.isPluginLoaded(pluginName)) {
                    pluginInstance = self.getPluginInstance(pluginName);
                    pluginInstance.setContext(self.context);
                    contentPlugins.push(pluginInstance);
                    /* deal with content Actions here */
                } else {
                    pluginsToLoad[i] = 'contentplugin!' + pluginName;
                }
            });

            this.handlePluginActions(contentPlugins);

            if (!pluginsToLoad.length) {
                return;
            }
            /* all plugins are loaded at this stage */
            Utils.requireWithPromise(pluginsToLoad).done(function () {
                var pluginInfos = Array.prototype.slice.call(arguments),
                    instances = [],
                    pluginConf;
                    jQuery.each(pluginInfos, function (i) {
                        pluginConf = pluginInfos[i];
                        instance = self.getPluginInstance(pluginConf.name);
                        if (instance) {
                            instances.push(instance);
                        }
                    });
                self.handlePluginActions(instances);
            });
        },

        /* show Content actions*/
        handlePluginActions: function (pluginInstances) {
            var pluginActions = [],
                instance,
                actions;
            jQuery.each(pluginInstances, function (i) {
                var instance = pluginInstances[i];
                    actions = instance.getActions();
                    jQuery.each(actions, function (i) {
                        var action = actions[i];
                        pluginActions.push(action);
                    });
            });
            this.contentActionWidget.setContent(this.context.content);
            this.contentActionWidget.appendActions(pluginActions);
            this.contentActionWidget.show();
        },

        createPluginClass: function (def) {
            /* Remove mandatory, protected methods here */
            /*if(def.hasOwnProperty("initialize")) {
            }*/
            return new JS.Class(AbstractPlugin, def);
        }
    });
    return {

        getInstance: function () {
            if (!instance) {
                instance = new PluginManager();
            }
            return instance;
        },

        registerPlugin: function (pluginName, def) {
            if (pluginsInfos.hasOwnProperty(pluginName)) {
                throw "PluginManagerException A plugin named " + pluginName + " already exists";
            }
            def.getName = (function (name) {
                return function () {
                    return name;
                }
            }(pluginName));
            pluginsInfos[pluginName] = this.getInstance().createPluginClass(def);
        },

        AbstractPlugin: AbstractPlugin
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