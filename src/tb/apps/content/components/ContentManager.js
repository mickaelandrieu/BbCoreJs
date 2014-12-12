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

define(
    [
        'jquery',
        'content.models.Content',
        'content.models.ContentSet',
        'definition.manager',
        'content.container',
        'jsclass'
    ],
    function (jQuery, Content, ContentSet, DefinitionManager, ContentContainer) {

        'use strict';

        var ContentManager = new JS.Class({

            contentClass: 'bb5-content',
            contentHoverClass: 'bb5-content-hover',
            contentSelectedClass: 'bb5-content-selected',
            identifierAttribute: 'data-bb-identifier',
            idAttribute: 'data-bb-id',

            elements: [],

            /**
             * listen the DOM
             */
            listen: function () {
                this.bindEvents();
            },

            /**
             * Bind events for content
             */
            bindEvents: function () {
                jQuery('.' + this.contentClass).on('click', jQuery.proxy(this.onClick, this));
                jQuery('.' + this.contentClass).on('mouseenter', jQuery.proxy(this.onMouseEnter, this));
                jQuery('.' + this.contentClass).on('mouseleave', jQuery.proxy(this.onMouseLeave, this));
            },

            /**
             * Build a content/contentSet element according to the definition
             * @param {Object} event
             * @returns {Object}
             */
            buildElement: function (event) {
                var currentTarget = jQuery(event.currentTarget),
                    config = {},
                    identifier,
                    content,
                    id = currentTarget.attr(this.idAttribute),
                    objectIdentifier = currentTarget.attr(this.identifierAttribute);

                if (id === undefined && objectIdentifier !== undefined) {
                    identifier = this.retrievalObjectIdentifier(objectIdentifier);
                    config.uid = identifier.uid;

                    config.classname = identifier.classname;
                    config.definition = DefinitionManager.find(config.classname);
                    config.jQueryObject = currentTarget;

                    if (config.definition !== null) {
                        if (config.definition.properties.is_container) {
                            content = new ContentSet(config);
                        } else {
                            content = new Content(config);
                        }
                    }
                } else {
                    content = ContentContainer.find(currentTarget.attr(this.idAttribute));
                }

                return content;
            },

            /**
             * Retrieve a object identifier for split uid and classname
             */
            retrievalObjectIdentifier: function (objectIdentifier) {
                var regex,
                    res = {};

                if (objectIdentifier) {

                    regex = /(.+)\(([a-f0-9]+)\)$/;
                    res = regex.exec(objectIdentifier);

                    if (null !== res) {
                        res.classname = res[1];
                        res.uid = res[2];
                    }
                }

                return res;
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

                var currentSelected = jQuery('.' + this.contentSelectedClass),
                    content = this.buildElement(event),
                    currentContent;

                if (currentSelected.length > 0) {
                    currentContent = ContentContainer.find(currentSelected.attr(this.idAttribute));
                    currentContent.unSelect();
                }

                ContentContainer.addContent(content);

                content.select();
            },

            /**
             * Event trigged on mouse enter in content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseEnter: function (event) {
                event.stopImmediatePropagation();

                jQuery('.' + this.contentHoverClass).removeClass(this.contentHoverClass);

                jQuery(event.currentTarget).addClass(this.contentHoverClass);
            },

            /**
             * Event trigged on mouse leave from content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseLeave: function (event) {
                var currentTarget = jQuery(event.currentTarget),
                    parentToSelect = currentTarget.parent('.' + this.contentClass);

                currentTarget.removeClass(this.contentHoverClass);

                if (parentToSelect.length > 0) {
                    jQuery(parentToSelect).trigger("mouseenter", {
                        userTrigger: true
                    });
                }
            }

            /***** EVENTS END *****/
        });

        return new JS.Singleton(ContentManager);
    }
);
