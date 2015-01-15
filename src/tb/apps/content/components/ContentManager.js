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
<<<<<<< HEAD
=======
        'tb.core',
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
        'jquery',
        'content.models.Content',
        'content.models.ContentSet',
        'definition.manager',
        'content.container',
        'content.repository',
        'tb.core.Request',
<<<<<<< HEAD
        'jsclass'
    ],
    function (jQuery,
=======
        'tb.core.RequestHandler',
        'component!dnd',
        'jsclass'
    ],
    function (Core,
              jQuery,
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
              Content,
              ContentSet,
              DefinitionManager,
              ContentContainer,
              ContentRepository,
<<<<<<< HEAD
              Request
=======
              Request,
              RequestHandler,
              dnd
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f
            ) {

        'use strict';

<<<<<<< HEAD
        var ContentManager = new JS.Class({

            contentClass: 'bb-content',
            identifierDataAttribute: 'bb-identifier',
            idDataAttribute: 'bb-id',
            dropZoneAttribute: '*[dropzone="true"]',

            /**
             * Search all contentset with dragzone="true" attribute
             * and dont have data-bb-id attribute for build element
             */
            buildContentSet: function () {
                var self = this,
                    dropzone = jQuery(this.dropZoneAttribute).not('[data-' + this.idDataAttribute + ']');

                dropzone.each(function () {
                    var currentTarget = jQuery(this);

                    if (currentTarget.hasClass(self.contentClass) && currentTarget.data(self.identifierDataAttribute)) {
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
                    id = element.data(this.idDataAttribute),
                    objectIdentifier = element.data(this.identifierDataAttribute);

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
                    content = ContentContainer.find(element.data(this.idDataAttribute));
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
                    /*jslint regexp: true */
                    regex = /(.+)\(([a-f0-9]+)\)$/;
                    /*jslint regexp: false */

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
            }
        });
=======
        var dataTransfer = {},

            ContentManager = new JS.Class({

                contentClass: 'bb-content',
                contentHoverClass: 'bb-content-hover',
                contentSelectedClass: 'bb-content-selected',
                identifierDataAttribute: 'bb-identifier',
                idDataAttribute: 'bb-id',
                typeDataAttribute: 'bb-type',
                dndClass: 'bb-dnd',
                dropZoneAttribute: '*[dropzone="true"]',
                dropZoneClass: 'bb-dropzone',

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
                        dropzone = jQuery(this.dropZoneAttribute).not('[data-' + this.idDataAttribute + ']');

                    dropzone.each(function () {
                        var currentTarget = jQuery(this);

                        if (currentTarget.hasClass(self.contentClass) && currentTarget.data(self.identifierDataAttribute)) {
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
                        id = element.data(this.idDataAttribute),
                        objectIdentifier = element.data(this.identifierDataAttribute);

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
                        content = ContentContainer.find(element.data(this.idDataAttribute));
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
                        /*jslint regexp: true */
                        regex = /(.+)\(([a-f0-9]+)\)$/;
                        /*jslint regexp: false */

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
                    var key,
                        contentSet,
                        childrens,
                        firstChild,
                        div = '<div dropzone="true" class="' + this.dropZoneClass + '">DROPZONE</div>';

                    for (key in contentSets) {
                        if (contentSets.hasOwnProperty(key)) {
                            contentSet = contentSets[key];

                            contentSet.isChildrenOf(currentContentId);
                            if (contentSet.id !== currentContentId && !contentSet.isChildrenOf(currentContentId)) {

                                childrens = contentSet.getNodeChildrens();
                                firstChild = childrens.first();

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

                                this.putDropZoneAroundContentSetChildrens(childrens, div, currentContentId);
                            }
                        }
                    }
                },

                /**
                 * Put HTML dropzone around the contentset's children
                 * @param {Object} childrens
                 * @param {String} template
                 * @param {String} currentContentId
                 */
                putDropZoneAroundContentSetChildrens: function (childrens, template, currentContentId) {
                    var self = this;

                    childrens.each(function () {
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

                        if (parent.data(this.idDataAttribute)) {
                            parentAsContent = ContentContainer.find(parent.data(this.idDataAttribute));
                        } else {
                            parentAsContent = this.buildElement(parent);
                        }
                        parentAsContent.setUpdated(true);

                        if (config.parent) {
                            if (config.parent.data(this.idDataAttribute)) {
                                newParentAsContent = ContentContainer.find(config.parent.data(this.idDataAttribute));
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

                /**
                 * Event trigged on start drag content
                 * @param {Object} event
                 */
                onDragStart: function (event) {
                    event.stopPropagation();

                    var target = jQuery(event.target),
                        content,
                        id,
                        img,
                        type;

                    event.dataTransfer.effectAllowed = 'move';

                    if (target.data(this.identifierDataAttribute)) {

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
                        if (target.data(this.typeDataAttribute)) {
                            dataTransfer.onDrop = this.doDropNewContent;
                            type = target.data(this.typeDataAttribute);
                        }
                    }

                    dataTransfer.type = type;

                    this.buildContentSet();

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
                        prev = target.prev('.' + this.contentClass),
                        parent = target.parent();

                    config.content = ContentContainer.find(parent.data(this.idDataAttribute));
                    config.event = event;

                    if (prev.length === 0) {
                        config.parent = target.parent();
                    } else {
                        config.prevSibling = prev;
                    }

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
                        currentContent = ContentContainer.find(currentSelected.data(this.idDataAttribute));
                        currentContent.unSelect();
                    }
                    Core.Mediator.publish('on:classcontent:click', content, event);
                    ContentContainer.addContent(content);
                    content.select();
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
>>>>>>> acf3006eba0b2ba557139aed71de0b43ff38a60f

        return new JS.Singleton(ContentManager);
    }
);