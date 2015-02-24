/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

define(
    [
        'jquery',
        'content.manager',
        'content.container',
        'tb.core.Renderer',
        'text!content/tpl/breadcrumb'
    ],
    function (jQuery, ContentManager, ContentContainer, Renderer, template) {

        'use strict';

        var Breadcrumb = {

            contentClass: '.bb-content',
            identifierAttribute: 'bb-identifier',
            breadCrumbItemClass: '.breadcrumb-item',
            contentIdAttribute: 'bb-content-id',

            show: function (content, selector) {

                var self = this,
                    jQueryObject = content.jQueryObject,
                    parents = jQueryObject.parents(this.contentClass),
                    elements = [];

                this.selector = selector;

                elements.push(this.computeElement(content));

                parents.each(function () {
                    var parent = jQuery(this),
                        element = ContentManager.getContentByNode(parent);

                    if (ContentManager.isUsable(element.type)) {
                        elements.push(self.computeElement(element));
                    }
                });

                jQuery(selector).html(Renderer.render(template, {'elements': elements.reverse()}));

                this.bindEvents();
            },

            computeElement: function (content) {
                return {
                    'name': content.getDefinition('properties').name,
                    'id': content.id
                };
            },

            bindEvents: function () {
                jQuery(this.selector).off('click').on('click', this.breadCrumbItemClass, jQuery.proxy(this.onClick, this));
            },

            onClick: function (event) {
                var target = jQuery(event.currentTarget),
                    content = ContentContainer.find(target.data(this.contentIdAttribute));

                ContentManager.unSelectContent();

                content.select();

                this.show(content, this.selector);
            }
        };

        return {
            show: jQuery.proxy(Breadcrumb.show, Breadcrumb)
        };
    }
);