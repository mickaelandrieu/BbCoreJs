/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
define('tb.core.Utils', ['jquery', 'tb.core.Api'], function (jQuery, Api) {
    'use strict';
    /**
     * Simple data container with action events
     * Events : [onInit, onAdd, onChange, onReplace, onDestroy, onDelete]
     *
     **/
    var SmartList = function SmartList(config) {
            this.dataContainer = {};
            this.itemCount = 0;
            this.idKey = null;
            this.maxEntry = null;
            /*events*/
            this.onChange = function () {
                return;
            };
            this.onDestroy = function () {
                return;
            };
            this.onInit = function () {
                return;
            };
            this.onAdd = function () {
                return;
            };
            this.onReplace = function () {
                return;
            };
            this.onDelete = function () {
                return;
            };
            if (typeof this.init !== 'function') {
                this.init = function (config) {
                    if (config && !config.hasOwnProperty("idKey")) {
                        throw "SmartList:init if a config param is provided a config.idKey is expected";
                    }
                    config = config || {};
                    this.name = config.name || 'list_' + new Date().getTime();
                    var data = config.data || {};
                    this.onChange = ((typeof config.onChange === 'function') ? config.onChange : this.onChange);
                    this.onDestroy = ((typeof config.onDestroy === 'function') ? config.onDestroy : this.onDestroy);
                    if (config.idKey) {
                        this.idKey = config.idKey;
                    }
                    this.onInit = ((typeof config.onInit === 'function') ? config.onInit : this.onInit);
                    this.onAdd = ((typeof config.onAdd === 'function') ? config.onAdd : this.onAdd);
                    this.onReplace = ((typeof config.onReplace === 'function') ? config.onReplace : this.onReplace);
                    this.onDelete = ((typeof config.onDelete === 'function') ? config.onDelete : this.onDelete);
                    if (config.maxEntry) {
                        this.maxEntry = parseInt(config.maxEntry, 10);
                    }
                    this.setData(data);
                    this.itemCount = this.getSize();
                };
            }
            /**
             * Set max entry into the Smartlist
             * @param {number} maxEntry [max entry authorized]
             */
            SmartList.prototype.setMaxEntry = function (maxEntry) {
                this.maxEntry = maxEntry || null;
            };
            /**
             * Setter
             * @param {string} key   [value identifier]
             * @param {mixed}  value [value]
             */
            SmartList.prototype.set = function (key, value) {
                if (this.idKey && !jQuery.isPlainObject(key)) {
                    throw "SmartList:set item should be an object when and idKey is set";
                }
                if (this.idKey && jQuery.isPlainObject(key)) {
                    if (!key.hasOwnProperty(this.idKey)) {
                        throw "SmartList:set should have a key " + this.idKey;
                    }
                    value = key;
                    key = key[this.idKey];
                }

                if (!this.dataContainer.hasOwnProperty(key)) {
                    var bound = this.itemCount + 1;
                    if (this.maxEntry && (bound > this.maxEntry)) {
                        return;
                    }
                    this.itemCount = bound;
                }
                this.dataContainer[key] = value;
                this.onChange(this.dataContainer, this.name, value);
            };
            /**
             * Getter
             * @param  {string} key [value identifier]
             * @return {mixed}      [value]
             */
            SmartList.prototype.get = function (key) {
                return this.dataContainer[key] || false;
            };
            /**
             * Destroy the Smartlist
             */
            SmartList.prototype.destroy = function () {
                var self = this;
                this.dataContainer = {};
                this.itemCount = 0;
                this.onDestroy(self);
            };
            /**
             * Reset the Smartlist
             */
            SmartList.prototype.reset = function () {
                this.destroy();
            };
            /**
             * Get all datas
             * @return {object} [the data container]
             */
            SmartList.prototype.getData = function () {
                return this.dataContainer;
            };
            /**
             * Transform the data container into an Array
             * @param  {boolean} clear [true if you want a clean array]
             * @return {array}         [data conainer as array]
             */
            SmartList.prototype.toArray = function (clear) {
                var self = this,
                    cleanData = [];
                if (clear) {
                    jQuery.each(this.dataContainer, function (key) {
                        cleanData.push(self.dataContainer[key]);
                    });
                } else {
                    cleanData = jQuery.makeArray(this.dataContainer);
                }
                return cleanData;
            };
            /**
             * Replace item
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            SmartList.prototype.replaceItem = function (item) {
                if (!arguments.length) {
                    throw "SmartList:replaceItem expects one parameter";
                }
                if (!item.hasOwnProperty(this.idKey)) {
                    throw "SmartList:deleteItem [item] should have a [" + this.idKey + "] key";
                }
                this.dataContainer[item[this.idKey]] = item;
                this.onReplace(this.dataContainer, this.name, item);
            };
            /**
             * Delete Item
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            SmartList.prototype.deleteItem = function (item) {
                if (!arguments.length) {
                    throw "SmartList:replaceItem expects one parameter";
                }
                if (!jQuery.isPlainObject(item)) {
                    throw "SmartList:deleteItem [item] should be a object";
                }
                if (!item.hasOwnProperty(this.idKey)) {
                    throw "SmartList:deleteItem [item] should have a [" + this.idKey + "] key";
                }
                delete this.dataContainer[item[this.idKey]];
                this.itemCount = this.itemCount - 1;
                this.onDelete(this.dataContainer, this.name, item);
            };
            /**
             * Delete item by identifier
             * @param  {string} identifier [description]
             */
            SmartList.prototype.deleteItemById = function (identifier) {
                if (!this.dataContainer.hasOwnProperty(identifier)) {
                    return false;
                }
                delete this.dataContainer[identifier];
                this.itemCount = this.itemCount - 1;
                this.onDelete(this.dataContainer, this.name, identifier);
            };
            /**
             * Set data
             * @param {mixed}  data  [Data to store]
             */
            SmartList.prototype.setData = function (data) {
                var item,
                    self = this;
                if (!data) {
                    throw "SmartList:setData data must be provided";
                }
                if (jQuery.isArray(data)) {
                    if (!this.idKey) {
                        throw "SmartList:setData idKey must be provided";
                    }
                    jQuery.each(data, function (i) {
                        item = data[i];
                        if (item.hasOwnProperty(self.idKey)) {
                            self.set(item);
                        }
                    });
                } else {
                    this.dataContainer = data;
                }
                this.onInit(this.dataContainer);
            };
            /**
             * Add data
             * @param {mixed} data [Data to store]
             */
            SmartList.prototype.addData = function (data) {
                var self = this,
                    item,
                    items = [];
                if (jQuery.isArray(data)) {
                    if (!this.idKey) {
                        throw "SmartList:addData idKey must be provided";
                    }
                    jQuery.each(data, function (i) {
                        item = data[i];
                        if (item.hasOwnProperty(self.idKey)) {
                            self.set(item);
                            items.push(item);
                        }
                    });
                } else {
                    this.dataContainer = jQuery.extend(true, this.dataContainer, data);
                }
                this.onAdd(items);
            };
            /**
             * Get Smartlist size
             * @return {number} [the object size]
             */
            SmartList.prototype.getSize = function () {
                var items = this.toArray(true);
                return items.length;
            };
            return this.init(config);
        },
        /**
         * require with Promise
         * @param  {[type]} dep [description]
         * @return {[type]}     [description]
         */
        requireWithPromise = function (dep, keepRequireContext) {
            var def = new jQuery.Deferred();
            if (keepRequireContext) {

                dep.splice(0, 0, 'require');

                require(dep, function (req) {
                    def.resolve.call(this, req);
                }, function (reason) {
                    def.reject(reason);
                });
            } else {
                require(dep, function () {
                    def.resolve.apply(this, arguments);
                }, function (reason) {
                    def.reject(reason);
                });
            }
            return def.promise();
        };
    Api.register('SmartList', SmartList);
    return {
        SmartList: SmartList,
        requireWithPromise: requireWithPromise
    };
});