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
        'tb.core',
        'jquery',
        'content.container',
        'content.manager',
        'jsclass'
    ],
    function (Core,
              jQuery,
              ContentContainer,
              ContentManager
            ) {

        'use strict';

        var MouseEventManager = new JS.Class({

            contentClass: 'bb-content',
            contentHoverClass: 'bb-content-hover',
            contentSelectedClass: 'bb-content-selected',
            idDataAttribute: 'bb-id',

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
                var body = jQuery('body');

                body.on('click', '.' + this.contentClass, jQuery.proxy(this.onClick, this));
                body.on('mouseenter', '.' + this.contentClass, jQuery.proxy(this.onMouseEnter, this));
                body.on('mouseleave', '.' + this.contentClass, jQuery.proxy(this.onMouseLeave, this));
            },

            /**
             * Event trigged on click
             *
             * @param {Object} event
             * @returns {Boolean}
             */
            onClick: function (event) {
                event.stopPropagation();

                var currentSelected = jQuery('.' + this.contentSelectedClass),
                    content = ContentManager.buildElement(jQuery(event.currentTarget)),
                    currentContent;

                if (currentSelected.length > 0) {
                    currentContent = ContentContainer.find(currentSelected.data(this.idDataAttribute));
                    currentContent.unSelect();
                }

                ContentContainer.addContent(content);

                content.select();
                Core.Mediator.publish('on:classcontent:click', content, event);

                return false;
            },

            /**
             * Event trigged on mouse enter in content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseEnter: function (event) {
                event.stopImmediatePropagation();

                Core.Mediator.publish('on:classcontent:mouseenter', event);

                jQuery('.' + this.contentHoverClass).removeClass(this.contentHoverClass);

                jQuery(event.currentTarget).addClass(this.contentHoverClass);
            },

            /**
             * Event trigged on mouse leave from content zone
             * @param {Object} event
             * @returns {Boolean}
             */
            onMouseLeave: function (event) {

                Core.Mediator.publish('on:classcontent:mouseleave', event);

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

        return new JS.Singleton(MouseEventManager);
    }
);