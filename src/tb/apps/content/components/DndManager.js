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
        'tb.core',
        'tb.core.Renderer',
        'jquery',
        'text!content/tpl/dropzone',
        'component!dnd',
        'content.container',
        'content.manager',
        'jsclass'
    ],
    function (Core,
              Renderer,
              jQuery,
              dropZoneTemplate,
              dnd,
              ContentContainer,
              ContentManager
            ) {

        'use strict';

        var dataTransfer = {},

            DndManager = new JS.Class({

                contentClass: 'bb-content',
                identifierDataAttribute: 'bb-identifier',
                idDataAttribute: 'bb-id',
                typeDataAttribute: 'bb-type',
                dndClass: 'bb-dnd',
                dropZoneAttribute: '*[dropzone="true"]',
                dropZoneClass: 'bb-dropzone',

                listen: function () {
                    this.bindEvents();
                },

                bindEvents: function () {
                    dnd('body').addListeners('classcontent', '.' + this.dndClass);

                    Core.Mediator.subscribe('on:classcontent:dragstart', this.onDragStart, this);
                    Core.Mediator.subscribe('on:classcontent:dragover', this.onDragOver, this);
                    Core.Mediator.subscribe('on:classcontent:drop', this.onDrop, this);
                    Core.Mediator.subscribe('on:classcontent:dragend', this.onDragEnd, this);
                },

                /**
                 * Show the dropzone after and before each children
                 * @param {Object} contentSets
                 */
                showHTMLZoneForContentSet: function (contentSets, currentContentId) {
                    var key,
                        contentSet,
                        children,
                        firstChild,
                        div = Renderer.render(dropZoneTemplate, {'class': this.dropZoneClass});
                    
                    for (key in contentSets) {
                        if (contentSets.hasOwnProperty(key)) {
                            contentSet = contentSets[key];

                            contentSet.isChildrenOf(currentContentId);
                            if (contentSet.id !== currentContentId && !contentSet.isChildrenOf(currentContentId)) {

                                children = contentSet.getNodeChildren();
                                firstChild = children.first();

                                if (firstChild.length > 0) {
                                    if (undefined !== currentContentId) {
                                        if (firstChild.data(this.idDataAttribute) !== currentContentId) {
                                            firstChild.before(div);
                                        }
                                    } else {
                                        firstChild.before(div);
                                    }
                                } else {
                                    contentSet.jQueryObject.prepend(div);
                                }

                                this.putDropZoneAroundContentSetChildren(children, div, currentContentId);
                            }
                        }
                    }
                },

                /**
                 * Put HTML dropzone around the contentset's children
                 * @param {Object} children
                 * @param {String} template
                 * @param {String} currentContentId
                 */
                putDropZoneAroundContentSetChildren: function (children, template, currentContentId) {
                    var self = this;

                    children.each(function () {
                        var currentTarget = jQuery(this),
                            next = currentTarget.next('.' + self.contentClass);

                        if (undefined !== currentContentId) {
                            if (currentTarget.data(self.idDataAttribute) !== currentContentId &&
                                    next.data(self.idDataAttribute) !== currentContentId) {

                                currentTarget.after(template);
                            }
                        } else {
                            currentTarget.after(template);
                        }
                    });
                },

                /**
                 * Delete all dropzone
                 */
                cleanHTMLZoneForContentset: function () {
                    jQuery('.' + this.dropZoneClass).remove();
                },

                /**
                 * Used into a drop event.
                 * Verify if current contentset accept the content, create the content
                 * from api and show him on the html
                 * @param {Object} config
                 */
                doDropNewContent: function (config) {
                    if (config.type) {
                        if (ContentContainer.isInArray(dataTransfer.contentSetDroppable, 'type', config.parent.type)) {
                            ContentManager.createElement(dataTransfer.type).done(function (content) {
                                config.parent.append(content, config.position);
                            });
                        }
                    }
                },

                /**
                 * Return position of element will be dropped
                 * @param {Object} zone
                 * @returns {Number}
                 */
                getPosition: function (zone) {
                    var prev = zone.prev('.' + this.contentClass),
                        parent = zone.parents(this.dropZoneAttribute + ':first'),
                        identifier = parent.data(this.identifierDataAttribute),
                        contentSet = ContentManager.buildElement(ContentManager.retrievalObjectIdentifier(identifier)),
                        pos = 0;

                    if (prev.length > 0) {
                        contentSet.getNodeChildren().each(function (key) {
                            if (this === prev.get(0)) {
                                pos = key + 1;
                                return false;
                            }
                        });
                    }

                    return pos;
                },

                /**
                 * Used into a drop event.
                 * Move the content to a new contentset 
                 * and set updated old contentset
                 * @param {Object} config
                 */
                doDropContent: function (config) {
                    var content,
                        oldParent,
                        oldParentAsContent;

                    if (dataTransfer.id) {
                        content = ContentContainer.find(dataTransfer.id);

                        oldParent = content.jQueryObject.parents('.' + this.contentClass + ':first');

                        if (oldParent.data(this.idDataAttribute)) {
                            oldParentAsContent = ContentContainer.find(oldParent.data(this.idDataAttribute));
                        } else {
                            oldParentAsContent = ContentManager.buildElement(oldParent);
                        }
                        oldParentAsContent.setUpdated(true);

                        config.parent.append(content, config.position);
                    }
                },

                /***** EVENTS *****/

                /**
                 * Event trigged on start drag content
                 * @param {Object} event
                 */
                onDragStart: function (event) {
                    event.stopPropagation();
                    
                    var target = jQuery(event.currentTarget),
                        identifier,
                        content,
                        id,
                        img,
                        type;

                    if (target.hasClass('btn-dnd')) {
                        identifier = target.parents('.' + this.contentClass + ':first').data(this.identifierDataAttribute);
                    } else {
                        identifier = target.data(this.identifierDataAttribute);
                    }
                    
                    event.dataTransfer.effectAllowed = 'move';

                    if (identifier !== undefined) {

                        dataTransfer.onDrop = this.doDropContent;

                        content = ContentManager.buildElement(ContentManager.retrievalObjectIdentifier(identifier));
                        ContentContainer.addContent(content);
                        
                        type = content.type;
                        id = content.id;
                        dataTransfer.id = id;

                        img = document.createElement('img');
                        img.src = content.definition.image;
                        
                        event.dataTransfer.setDragImage(img, 50, 50);
                    } else {
                        if (target.data(this.typeDataAttribute)) {
                            dataTransfer.onDrop = this.doDropNewContent;
                            type = target.data(this.typeDataAttribute);
                        }
                    }

                    dataTransfer.type = type;

                    ContentManager.buildContentSet();

                    dataTransfer.contentSetDroppable = ContentContainer.findContentSetByAccept(type);

                    this.showHTMLZoneForContentSet(dataTransfer.contentSetDroppable, id);
                },

                /**
                 * Event trigged on drag over dropzone
                 * @param {Object} event
                 */
                onDragOver: function (event) {
                    if (jQuery(event.target).hasClass('bb-dropzone')) {
                        event.preventDefault();
                    }
                },

                /**
                 * Event trigged on drop content
                 * @param {Object} event
                 * @returns {Boolean}
                 */
                onDrop: function (event) {
                    event.stopPropagation();

                    var target = jQuery(event.target),
                        config = {},
                        parent = target.parents(this.dropZoneAttribute + ':first'),
                        parentObjectIdentifier = ContentManager.retrievalObjectIdentifier(parent.data(this.identifierDataAttribute));

                    config.event = event;

                    config.position = this.getPosition(target);
                    config.parent = ContentManager.buildElement(parentObjectIdentifier);
                    config.type = dataTransfer.type;

                    dataTransfer.onDrop.call(this, config);

                    return false;
                },

                /**
                 * Event trigged on drag end content
                 * @param {Object} event
                 * @returns {Boolean}
                 */
                onDragEnd: function (event) {
                    event.stopPropagation();

                    this.cleanHTMLZoneForContentset();

                    dataTransfer = {};

                    return false;
                }

                /***** EVENTS END *****/
            });

        return new JS.Singleton(DndManager);
    }
);