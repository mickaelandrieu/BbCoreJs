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
        'content.models.Content',
        'content.models.ContentSet',
        'definition.manager',
        'content.container',
        'content.repository',
        'tb.core.Request',
        'tb.core.RequestHandler',
        'component!dnd',
        'jsclass'
    ],
    function (Core,
              jQuery,
              Content,
              ContentSet,
              DefinitionManager,
              ContentContainer,
              ContentRepository,
              Request,
              RequestHandler,
              dnd
            ) {

        'use strict';

        var dataTransfer = {},

            ContentManager = new JS.Class({

                contentClass: 'bb-content',
                contentHoverClass: 'bb-content-hover',
                contentSelectedClass: 'bb-content-selected',
                identifierAttribute: 'data-bb-identifier',
                idAttribute: 'data-bb-id',
                typeAttribute: 'data-bb-type',
                dndClass: 'bb-dnd',
                dropZoneAttribute: '*[dropzone="true"]',

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
                    jQuery('body').on('click', '.' + this.contentClass, jQuery.proxy(this.onClick, this));
                    jQuery('body').on('mouseenter', '.' + this.contentClass, jQuery.proxy(this.onMouseEnter, this));
                    jQuery('body').on('mouseleave', '.' + this.contentClass, jQuery.proxy(this.onMouseLeave, this));

                    dnd('body').addListeners('classcontent', '.' + this.dndClass);

                    Core.Mediator.subscribe('on:classcontent:dragstart', this.onDragStart, this);
                    Core.Mediator.subscribe('on:classcontent:dragover', this.onDragOver, this);
                    Core.Mediator.subscribe('on:classcontent:drop', this.onDrop, this);
                    Core.Mediator.subscribe('on:classcontent:dragend', this.onDragEnd, this);
                },

                /**
                 * Search all contentset with dragzone="true" attribute
                 * and dont have data-bb-id attribute for build element
                 */
                buildContentSet: function () {
                    var self = this,
                        dropzone = jQuery(this.dropZoneAttribute).not('[' + this.idAttribute + ']');

                    dropzone.each(function () {
                        var currentTarget = jQuery(this);

                        if (currentTarget.hasClass('bb-content') && currentTarget.data('bb-identifier')) {
                            ContentContainer.addContent(self.buildElement(currentTarget));
                        }
                    });
                },

                /**
                 * Create new element from the API
                 * @param {String} type
                 */
                createElement: function (type) {
                    return ContentRepository.save({'type': type});
                },

                /**
                 * Build a content/contentSet element according to the definition
                 * @param {Object} event
                 * @returns {Object}
                 */
                buildElement: function (element) {
                    var config = {},
                        identifier,
                        content,
                        id = element.attr(this.idAttribute),
                        objectIdentifier = element.attr(this.identifierAttribute);

                    if (id === undefined && objectIdentifier !== undefined) {

                        identifier = this.retrievalObjectIdentifier(objectIdentifier);
                        config.uid = identifier.uid;

                        config.type = identifier.type;
                        config.definition = DefinitionManager.find(config.type);

                        config.jQueryObject = element;

                        if (config.definition !== null) {
                            if (config.definition.properties.is_container) {
                                content = new ContentSet(config);
                            } else {
                                content = new Content(config);
                            }
                        }
                    } else {
                        content = ContentContainer.find(element.attr(this.idAttribute));
                    }

                    return content;
                },

                /**
                 * Retrieve a object identifier for split uid and type
                 */
                retrievalObjectIdentifier: function (objectIdentifier) {
                    var regex,
                        res = {};

                    if (objectIdentifier) {

                        regex = /(.+)\(([a-f0-9]+)\)$/;
                        res = regex.exec(objectIdentifier);

                        if (null !== res) {
                            res.type = res[1];
                            res.uid = res[2];
                        }
                    }

                    return res;
                },

                /**
                 * Build Request Object
                 * @param {String} url
                 * @param {String} accept
                 * @returns {Object}
                 */
                buildRequest: function (url, accept) {
                    var request = new Request();

                    if (accept) {
                        request.addHeader('Accept', accept);
                    }

                    request.setUrl(url);

                    return request;
                },

                /**
                 * Show the dropzone after and before each children
                 * @param {Object} contentSets
                 */
                showHTMLZoneForContentSet: function (contentSets, currentContentId) {
                    var self = this,
                        key,
                        contentSet,
                        childrens,
                        firstChild,
                        div = '<div dropzone="true" class="bb-dropzone">DROPZONE</div>';

                    for (key in contentSets) {
                        if (contentSets.hasOwnProperty(key)) {
                            contentSet = contentSets[key];

                            childrens = contentSet.getNodeChildrens();
                            firstChild = childrens.first();

                            if (firstChild) {
                                if (undefined !== currentContentId) {
                                    if (firstChild.attr(this.idAttribute) !== currentContentId) {
                                        firstChild.before(div);
                                    }
                                } else {
                                    firstChild.before(div);
                                }
                            } else {
                                contentSet.jQueryObject.prepend(div);
                            }

                            childrens.each(function () {
                                var currentTarget = jQuery(this),
                                    next = currentTarget.next('.' + self.contentClass);

                                if (undefined !== currentContentId) {
                                    if (currentTarget.attr(self.idAttribute) !== currentContentId &&
                                        next.attr(self.idAttribute) !== currentContentId) {

                                        currentTarget.after(div);
                                    }
                                } else {
                                    currentTarget.after(div);
                                }
                            });
                        }
                    }
                },

                /**
                 * Delete all dropzone
                 */
                cleanHTMLZoneForContentset: function () {
                    jQuery('.bb-dropzone').remove();
                },

                /**
                 * Used into a drop event.
                 * Verify if current contentset accept the content, create the content
                 * from api and show him on the html
                 * @param {Object} config
                 */
                doDropNewContent: function (config) {
                    var self = this;

                    if (null !== config.content) {
                        if (ContentContainer.isInArray(dataTransfer.contentSetDroppable, 'type', config.content.type)) {
                            this.createElement(dataTransfer.type).done(function (data, response) {
                                var htmlRequest = self.buildRequest(response.getHeader('Location'), 'text/html');

                                RequestHandler.send(htmlRequest).done(function (html) {
                                    self.dropAsHtml(config, html);
                                    config.content.setUpdated(true);
                                });

                                return data;
                            });
                        }
                    }
                },

                /**
                 * Used into a drop event.
                 * Move the content and update state of parent(s)
                 * @param {Object} config
                 */
                doDropContent: function (config) {
                    var content,
                        parentAsContent,
                        parent,
                        newParentAsContent;

                    if (dataTransfer.id) {

                        content = ContentContainer.find(dataTransfer.id);
                        parent = content.jQueryObject.parent('.' + this.contentClass);
                        this.dropAsHtml(config, content.jQueryObject);

                        if (parent.attr(this.idAttribute)) {
                            parentAsContent = ContentContainer.find(parent.attr(this.idAttribute));
                        } else {
                            parentAsContent = this.buildElement(parent);
                        }
                        parentAsContent.setUpdated(true);

                        if (config.parent) {
                            if (config.parent.attr(this.idAttribute)) {
                                newParentAsContent = ContentContainer.find(config.parent.attr(this.idAttribute));
                            } else {
                                newParentAsContent = this.buildElement(config.parent);
                            }
                            newParentAsContent.setUpdated(true);
                        }
                    }
                },

                /**
                 * Put the content html on the good place
                 *
                 * @param {Object} config
                 * @param {String} html
                 */
                dropAsHtml: function (config, html) {
                    if (config.parent) {
                        config.parent.prepend(html);
                    } else if (config.prevSibling) {
                        config.prevSibling.after(html);
                    }
                },

                /***** EVENTS *****/

                onDragStart: function (event) {
                    event.stopPropagation();
                    
                    var target = jQuery(event.target),
                        content,
                        id,
                        img,
                        type;

                    event.dataTransfer.effectAllowed = 'move';
                    if (target.attr(this.identifierAttribute)) {

                        dataTransfer.onDrop = this.doDropContent;

                        content = this.buildElement(target);
                        ContentContainer.addContent(content);

                        type = content.type;
                        id = content.id;
                        dataTransfer.id = id;

                        img = document.createElement('img');
                        img.src = content.definition.image;

                        event.dataTransfer.setDragImage(img, 50, 50);
                    } else {
                        if (target.attr(this.typeAttribute)) {
                            dataTransfer.onDrop = this.doDropNewContent;
                            type = target.attr(this.typeAttribute);
                        } else {
                            //stop drag
                        }
                    }

                    dataTransfer.type = type;

                    this.buildContentSet();

                    dataTransfer.contentSetDroppable = ContentContainer.findContentSetByAccept(type);

                    this.showHTMLZoneForContentSet(dataTransfer.contentSetDroppable, id);
                },

                onDragOver: function (event) {
                    if (jQuery(event.target).hasClass('bb-dropzone')) {
                        event.preventDefault();
                    }
                },

                onDrop: function (event) {
                    event.stopPropagation();

                    var target = jQuery(event.target),
                        config = {},
                        prev = target.prev('.' + this.contentClass),
                        parent = target.parent();

                    config.content = ContentContainer.find(parent.attr(this.idAttribute));
                    config.event = event;

                    if (prev.length === 0) {
                        config.parent = target.parent();
                    } else {
                        config.prevSibling = prev;
                    }

                    dataTransfer.onDrop.call(this, config);

                    return false;
                },

                onDragEnd: function (event) {
                    this.cleanHTMLZoneForContentset();
                    dataTransfer = {};
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
                        content = this.buildElement(jQuery(event.currentTarget)),
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
