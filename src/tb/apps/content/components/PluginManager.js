require.config({
    paths: {
        'contentplugin': 'src/tb/apps/content/plugins/contentplugin',
        'actionContainer': 'src/tb/apps/content/components/ContentActionWidget'
    }
});
define(['tb.core', 'jquery', 'tb.core.Utils', 'tb.core.Api', 'actionContainer', 'jsclass'], function (Core, jQuery, Utils, Api, ContentActionWidget) {
    'use strict';
    var mediator = Core.Mediator,
        pluginsInfos = {},
        instance = null,
        AbstractPlugin = new JS.Class({
            initialize: function () {
                this.context = {};
                this.enabled = false;
                this.state = {};
            },

            onInit: function () {
                Api.exception('PluginException', 75001, 'onInit must be overrided');
            },

            onEnable: function () {
                this.isEnabled = true;
            },

            onDisable: function () {
                this.enabled = false;
            },

            setContentState: function (key, value) {
                if (!key && typeof key !== 'string') {
                    Api.exception('PluginException', 75001, 'setContentState key');
                }
                if (value === 'undefined') {
                    Api.exception('PluginException', 75002, 'setContentState value can\'t be undefined');
                }
                if (!this.context.hasOwnProperty('content')) {
                    Api.exception('PluginException', 75003, 'setContentState a content must be provided');
                }
                var contentState = this.state[this.getCurrentContent()];
                if (!contentState) {
                    this.state[this.getCurrentContent()] = {};
                    contentState = this.state[this.getCurrentContent()];
                }
                contentState[key] = value;
            },

            getContentState: function (key) {
                var result = null,
                    stateConfig;
                if (!this.context.hasOwnProperty('content')) {
                    Api.exception('PluginException', 75004, 'getContentState a content must be provided');
                }
                stateConfig = this.state[this.getCurrentContent()];
                if (stateConfig && stateConfig.hasOwnProperty(key)) {
                    result = stateConfig[key];
                }
                return result;
            },

            isEnabled: function () {
                return this.enabled;
            },

            getCurrentContent: function () {
                var result = null;
                if (this.context.hasOwnProperty('content')) {
                    result = this.context.content;
                }
                return result;
            },

            getCurrentContentNode: function () {
                var result = '',
                    currentContent = this.getCurrentContent();
                if (currentContent) {
                    result = currentContent.jQueryObject;
                }
                return result;
            },

            getCurrentContentType: function () {
                return this.context.content.type;
            },

            canApplyOnContext: function () {
                return false;
            },

            createCommand: function (func, context) {
                if (typeof func !== 'function') {
                    Api.exception('PluginException', 75005, 'createCommand func must be a function.');
                }
                var Command, funcContext = context || this;
                Command = (function (f, c) {
                    return function () {
                        this.execute = function () {
                            f.call(c);
                        };
                    };
                }(func, funcContext));
                return new Command();
            },

            setContext: function (context) {
                if (!context) {
                    Api.exception('PluginException', 75005, 'setContext func must be a function.');
                }
                var previousContext = this.context;
                this.context = context;
                this.onContextChange(previousContext);
            },

            onContextChange: function () {
                return;
            },

            getActions: function () {
                return [];
            }
        }),
        PluginManager = new JS.Class({
            initialize: function () {
                this.pluginsInfos = pluginsInfos;
                this.enabled = false;
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
            registerNameSpace: function () {
                Api.exception('PluginException', 75008, "Not implemented yet");
            },

            enable: function () {
                this.enabled = true;
            },

            disable: function () {
                this.enabled = false;
            },

            isEnabled: function () {
                return this.enabled;
            },

            isPluginLoaded: function (puglinName) {
                if (this.pluginsInstance.hasOwnProperty(puglinName)) {
                    return true;
                }
                return false;
            },

            getPluginInstance: function (pluginName) {
                return this.pluginsInstance[pluginName];
            },

            enablePlugins: function () {
                var self = this,
                    context = {};
                mediator.subscribe("on:classcontent:click", function (content) {
                    try {
                        context.content = content;
                        jQuery(context.content.jQueryObject).css('position', 'relative');
                        context.scope = 'content-click';
                        context.events = ['on:classcontent:click'];
                        self.context = context;
                        var plugins = ["edit", "contenttype"];
                        self.initPlugins(plugins);
                    } catch (e) {
                        Api.exception('PluginException', 75006, e);
                    }
                });
                this.enable();
            },

            handleLoading: function (pluginInfos) {
                /* at this stage we know that the plugin is ready */
                try {
                    var pluginName = pluginInfos.name,
                        pluginInstance = new this.pluginsInfos[pluginName]();
                    pluginInstance.setContext(this.context);
                    pluginInstance.onInit();
                    this.pluginsInstance[pluginName] = pluginInstance;
                } catch (e) {
                    Api.exception('PluginException', 75006, e);
                }
            },

            handleLoadingErrors: function (pluginInfos) {
                Api.exception('PluginException', 75007, "Error while loading plugin [" + pluginInfos.name + "]");
            },

            disablePlugins: function () {
                var pluginInstance,
                    self = this;
                jQuery.each(this.pluginsInstance, function (i) {
                    pluginInstance = self.pluginsInstance[i];
                    if (pluginInstance) {
                        pluginInstance.onDisable();
                    }
                });
                /* hide content action */
                this.contentActionWidget.hide();
                this.disable();
            },

            initPlugins: function (pluginsName) {
                var self = this,
                    pluginName,
                    pluginInstance,
                    pluginActions = [],
                    pluginsToLoad = [];
                /* if the plugin is already loaded */
                jQuery.each(pluginsName, function (i) {
                    pluginName = pluginsName[i];
                    if (self.isPluginLoaded(pluginName)) {
                        pluginInstance = self.getPluginInstance(pluginName);
                        pluginInstance.setContext(self.context);
                        if (pluginInstance.canApplyOnContext()) {
                            jQuery.merge(pluginActions, pluginInstance.getActions());
                        }
                    } else {
                        pluginsToLoad[i] = 'contentplugin!' + pluginName;
                    }
                });
                if (pluginActions.length) {
                    this.handlePluginActions(pluginActions);
                }
                if (!pluginsToLoad.length) {
                    return;
                }
                /* All plugins are loaded at this stage */
                Utils.requireWithPromise(pluginsToLoad).done(function () {
                    var pluginInfos = Array.prototype.slice.call(arguments),
                        actionsList = [],
                        pluginConf;
                    jQuery.each(pluginInfos, function (i) {
                        pluginConf = pluginInfos[i];
                        pluginInstance = self.getPluginInstance(pluginConf.name);
                        pluginInstance.setContext(self.context);
                        if (pluginInstance && pluginInstance.canApplyOnContext()) {
                            jQuery.merge(actionsList, pluginInstance.getActions());
                        }
                    });
                    self.handlePluginActions(actionsList);
                }).fail(function (response) {
                    Api.exception('PluginException', 75006, " initPlugins " + response);
                });
            },

            handlePluginActions: function (pluginActions) {
                if (!this.isEnabled()) {
                    return false;
                }
                var actions = [];
                jQuery.each(pluginActions, function (i) {
                    var action = pluginActions[i];
                    if (action.hasOwnProperty("checkContext") && action.checkContext()) {
                        actions.push(action);
                    }
                });
                this.contentActionWidget.setContent(this.context.content.jQueryObject);
                this.contentActionWidget.appendActions(actions);
                this.contentActionWidget.show();
            },
            
            createPluginClass: function (def) {
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
                Api.exception('PluginManagerException', 75006, " A plugin named " + pluginName + " already exists.");
            }
            def.getName = (function (name) {
                return function () {
                    return name;
                };
            }(pluginName));
            pluginsInfos[pluginName] = this.getInstance().createPluginClass(def);
        },
        AbstractPlugin: AbstractPlugin
    };
});