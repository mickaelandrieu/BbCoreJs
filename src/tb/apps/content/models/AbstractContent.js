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
<<<<<<< HEAD
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
=======
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
>>>>>>> #3783 start DOMParser for content
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
<<<<<<< HEAD
define(
['tb.core', 'jquery', 'jsclass'], function (Core, jQuery) {
    'use strict';
    var AbstractContent = new JS.Class({
        mainTag: '#bb5-ui',
        contentClass: '.bb-content',
        /**
         * Initialize AbstractContent
         *
         * @param {Object} config
         */
        initialize: function (config) {
            this.config = config;

            this.updated = false;

            this.computeMandatoryConfig(config);

            this.populate();

            this.bindEvents();
        },

        setUpdated: function (isUpdate) {
            if (typeof isUpdate === 'boolean') {
                this.updated = isUpdate;
            }
        },

        /**
         * Add properties to the content like bb-content class or id
         */
        populate: function () {
            this.jQueryObject.attr('data-bb-id', this.id);
        },

        /**
         * Bind events of content
         */
        bindEvents: function () {
            jQuery('html').off().on('click', jQuery.proxy(this.onClickOut, this));
            this.jQueryObject.on('click', jQuery.proxy(this.onClick, this));
            this.jQueryObject.on('mouseenter', jQuery.proxy(this.onMouseEnter, this));
            this.jQueryObject.on('mouseleave', jQuery.proxy(this.onMouseLeave, this));
        },

        /**
         * Select the content
         */
        select: function () {
            this.addClass('bb-content-selected');
        },

        /*
         * Unselect the content
         */
        unSelect: function () {
            this.removeClass('bb-content-selected');
        },

        /**
         * compute and verify the config
         * jQueryObject, objectIdentifier and id must be set
         *
         * @param {Object} config
         */
        computeMandatoryConfig: function (config) {
            if (typeof config.jQueryObject !== 'object') {
                Core.exception('BadTypeException', 500, 'The jQueryObject must be set');
            }
            this.jQueryObject = config.jQueryObject;
            if (typeof config.uid !== 'string') {
                Core.exception('BadTypeException', 500, 'The uid must be set');
            }
            this.uid = config.uid;
            if (typeof config.type !== 'string') {
                Core.exception('BadTypeException', 500, 'The type must be set');
            }
            this.type = config.type;
            if (typeof config.definition === 'object') {
                this.definition = config.definition;
            } else {
                this.definition = null;
            }
            this.id = Math.random().toString(36).substr(2);
        },

        /**
         * Add a class to the content
         * @param {String} className
         */
        addClass: function (className) {
            this.jQueryObject.addClass(className);
        },

        /**
         * RemoveClass to the content
         * @param {String} className
         */
        removeClass: function (className) {
            this.jQueryObject.removeClass(className);
        }
        
    });
    return AbstractContent;
});
=======

define(
    [
        'tb.core',
        'tb.core.ViewManager',
        'content.models.Option',
        'jquery',
        'text!content/tpl/options_container',
        'jsclass'
    ],
    function (Core, ViewManager, Option, jQuery, optionsContainerTpl) {

        'use strict';

        var AbstractContent = new JS.Class({

            mainTag: '#bb5-ui',

            optionsContainerClass: 'bb5-content-actions',

            /**
             * Initialize AbstractContent
             *
             * @param {Object} config
             */
            initialize: function (config) {
                this.options = [];
                this.config = config;

                this.computeMandatoryConfig(config);

                this.populate();

                this.bindEvents();
            },

            /**
             * Add properties to the content like bb5-content class or id
             */
            populate: function () {
                this.jQueryObject.addClass('bb5-content');
                this.jQueryObject.attr('data-bb-id', this.id);
            },

            /**
             * Bind events of content
             */
            bindEvents: function () {
                jQuery('html').off().on('click', jQuery.proxy(this.onClickOut, this));
                this.jQueryObject.on('click', jQuery.proxy(this.onClick, this));
                this.jQueryObject.on('mouseenter', jQuery.proxy(this.onMouseEnter, this));
                this.jQueryObject.on('mouseleave', jQuery.proxy(this.onMouseLeave, this));
            },

            /**
             * Select the content
             */
            select: function () {
                this.jQueryObject.addClass('bb5-content-selected');

                this.showOptions();
            },

            /*
             * Unselect the content
             */
            selectOut: function () {
                this.jQueryObject.removeClass('bb5-content-selected');
            },

            /**
             * Build the options with config, callback
             * of the content
             */
            showOptions: function () {
                if (this.options.length === 0) {

                    var key,
                        option,
                        config = this.config.optionsConfig;

                    for (key in config) {
                        if (config.hasOwnProperty(key)) {
                            option = config[key];
                            option.object = this;

                            option.classes = 'bb5-button ' + option.icoClass + ' bb5-button-square bb5-invert';

                            this.options.push(new Option(option));
                        }
                    }

                    this.jQueryObject.append(ViewManager.render(optionsContainerTpl, {'classes': this.optionsContainerClass, 'options': this.options}));
                }

                this.jQueryObject.children('.' + this.optionsContainerClass).removeClass('hidden');
            },

            /**
             * Hide options of the content
             */
            hideOptions: function () {
                this.jQueryObject.children('.' + this.optionsContainerClass).addClass('hidden');
            },

            /**
             * compute and verify the config
             * jQueryObject, objectIdentifier and id must be set
             *
             * @param {Object} config
             */
            computeMandatoryConfig: function (config) {
                if (typeof config.jQueryObject !== 'object') {
                    Core.exception('BadTypeException', 500, 'The jQuery object must be an object');
                }
                this.jQueryObject = config.jQueryObject;

                if (typeof config.objectIdentifier !== 'string') {
                    Core.exception('BadTypeException', 500, 'The object identifier must be a string');
                }
                this.objectIdentifier = config.objectIdentifier;

                this.retrievalObjectIdentifier();

                this.id = Math.random().toString(36).substr(2);
            },

            /**
             * Retrieve a object identifier for split uid and classname
             */
            retrievalObjectIdentifier: function () {
                var regex,
                    res;

                if (this.objectIdentifier) {

                    regex = /(.+)\(([a-f0-9]+)\)$/;
                    res = regex.exec(this.objectIdentifier);

                    if (null !== res) {
                        this.classname = res[1];
                        this.uid = res[2];
                    }
                }
            },

            /***** EVENTS *****/

            /**
             * Event trigged on click
             *
             * @param {Object} event
             * @returns {Boolean}
             */
            onClick: function (event) {
                event.stopPropagation();

                this.select();

                return false;
            },

            /**
             * Event trigged when user click out of content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onClickOut: function (event) {
                event.stopPropagation();

                this.selectOut();
                this.hideOptions();

                return false;
            },

            /**
             * Event trigged on mouse enter in content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseEnter: function (event) {
                event.stopPropagation();

                this.jQueryObject.addClass('bb5-content-hover');

                return false;
            },

            /**
             * Event trigged on mouse leave from content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseLeave: function (event) {
                event.stopPropagation();

                this.jQueryObject.removeClass('bb5-content-hover');

                return false;
            }

            /***** EVENTS END *****/
        });

        return AbstractContent;
    }
);
>>>>>>> #3783 start DOMParser for content
