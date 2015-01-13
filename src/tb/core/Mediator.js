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
define('tb.core.Mediator', ['tb.core.Api'], function (Api) {
    'use strict';

    var Component = function topic(callback, context) {
            this.callback = callback;
            this.context = context;
        },

        Mediator = function mediator() {
            this.topics = {};
            this.publicated = {};
            this.subscribe_once = {};
        };

    /**
     * Component execution callback
     * @return {undefined}
     */
    Component.prototype.execute = function componentExecution() {
        if (this.context === undefined) {
            this.callback.apply(undefined, arguments);
        } else {
            this.callback.apply(this.context, arguments);
        }
    };

    /**
     * Subscribe to a topic
     * @param  {String}   topic    [description]
     * @param  {Function} callback [description]
     * @param  {Object}   context  [description]
     * @return {undefined}
     */
    Mediator.prototype.subscribe = function mediatorSubscribe(topic, callback, context) {
        var component = new Component(callback, context);
        if (!this.topics.hasOwnProperty(topic)) {
            this.topics[topic] = [];
        }

        this.topics[topic].push(component);

        if (this.publicated.hasOwnProperty(topic)) {
            component.execute.apply(component, this.publicated[topic].args);
        }
    };

    /**
     * Publish a topic and keep this topic in memory
     * @return {undefined}
     */
    Mediator.prototype.subscribeOnce = function mediatorSubscribeOnce(topic, callback, context) {
        if (!this.subscribe_once.hasOwnProperty(topic)) {
            this.subscribe_once[topic] = [];
        }

        this.subscribe_once[topic].push(callback);
        this.subscribe(topic, callback, context);
    };

    /**
     * Unsubscribe to a topic
     * @param  {String}   topic    [description]
     * @param  {Function} callback [description]
     * @param  {Object}   context  [description]
     * @return {undefined}
     */
    Mediator.prototype.unsubscribe = function mediatorUnsubscribe(topic, callback) {
        var i;

        if (this.topics.hasOwnProperty(topic)) {
            for (i = 0; i < this.topics[topic].length; i = i + 1) {
                if (this.topics[topic][i].callback === callback) {
                    this.topics[topic].splice(i, 1);
                }
            }
        }
    };

    /**
     * Publish a topic
     * @return {undefined}
     */
    Mediator.prototype.publish = function mediatorPublish() {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift(),
            i,
            callback;

        if (this.topics.hasOwnProperty(topic)) {
            for (i = 0; i < this.topics[topic].length; i = i + 1) {
                callback = this.topics[topic][i].callback;
                try {
                    this.topics[topic][i].execute.apply(this.topics[topic][i], args);
                } catch (e) {
                    Api.exception.silent('MediatorException', 12201, 'Mediator as catch an error on "' + topic + '" topic with the following message: "' + e + '"');
                }
                if (this.subscribe_once.hasOwnProperty(topic)) {
                    for (i = 0; i < this.subscribe_once[topic].length; i = i + 1) {
                        if (this.subscribe_once[topic][i] === callback) {
                            this.unsubscribe(topic, callback);
                        }
                    }
                }
            }
        }
    };

    /**
     * Publish a topic and keep this topic in memory
     * @return {undefined}
     */
    Mediator.prototype.persistentPublish = function mediatorPersistentPublish() {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift();

        this.publish.apply(this, arguments);

        this.publicated[topic] = {
            args: args
        };
    };

    /**
     * Remove a topic publish
     * @param  {String} topic [description]
     * @return {undefined}
     */
    Mediator.prototype.removePublish = function mediatorRemovePublication(topic) {
        this.publicated[topic] = null;
        delete this.publicated[topic];
    };

    Api.register('Mediator', new Mediator());
});

