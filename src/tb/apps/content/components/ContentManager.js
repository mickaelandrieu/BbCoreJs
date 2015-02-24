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
        'jquery',
        'content.models.Content',
        'content.models.ContentSet',
        'definition.manager',
        'content.container',
        'content.repository',
        'jsclass'
    ],
    function (Core,
              jQuery,
              Content,
              ContentSet,
              DefinitionManager,
              ContentContainer,
              ContentRepository
            ) {

        'use strict';

        var ContentManager = new JS.Class({

            contentClass: 'bb-content',
            identifierDataAttribute: 'bb-identifier',
            idDataAttribute: 'bb-id',
            dropZoneAttribute: '*[dropzone="true"]',
            imageClass: 'Element/Image',
            defaultPicturePath: '/resources/toolbar/html/img/filedrop.png',
            contentSelectedClass: 'bb-content-selected',

            /**
             * Search all contentset with dragzone="true" attribute
             * and dont have data-bb-id attribute for build element
             */
            buildContentSet: function () {
                var self = this,
                    dropzone = jQuery(this.dropZoneAttribute).not('[data-' + this.idDataAttribute + ']');

                dropzone.each(function () {
                    var currentTarget = jQuery(this),
                        objectIdentifier = currentTarget.data(self.identifierDataAttribute);

                    if (currentTarget.hasClass(self.contentClass) && typeof objectIdentifier === 'string') {
                        ContentContainer.addContent(self.buildElement(self.retrievalObjectIdentifier(objectIdentifier)));
                    }
                });
            },

            isUsable: function (type) {
                var contents = Core.config('unclickable_contents:contents'),
                    result = true;

                if (contents !== undefined) {
                    if (contents.indexOf(type) !== -1) {
                        result = false;
                    }
                }

                return result;
            },

            /**
             * Create new element from the API
             * @param {String} type
             * @returns {Promise}
             */
            createElement: function (type) {
                var self = this,
                    dfd = jQuery.Deferred();

                ContentRepository.save({'type': type}).done(function (data, response) {
                    dfd.resolve(self.buildElement({'type': type, 'uid': response.getHeader('BB-RESOURCE-UID')}));

                    return data;
                });

                return dfd.promise();
            },

            /**
             * Build a content/contentSet element according to the definition
             * @param {Object} event
             * @returns {Object}
             */
            buildElement: function (config) {
                var content,
                    objectIdentifier = this.buildObjectIdentifier(config.type, config.uid),
                    element = jQuery('[data-' + this.identifierDataAttribute + '="' + objectIdentifier + '"]');

                if (objectIdentifier !== undefined) {

                    content = ContentContainer.findByUid(config.uid);

                    if (null === content) {

                        config.definition = DefinitionManager.find(config.type);
                        config.jQueryObject = element;

                        if (config.definition !== null) {
                            if (config.definition.properties.is_container) {
                                content = new ContentSet(config);
                            } else {
                                content = new Content(config);
                            }
                        }

                        ContentContainer.addContent(content);
                    } else {
                        content.populate();
                    }
                }

                return content;
            },

            /**
             * Remove the content from dom and Content container
             * and change state of parent to updated
             * @param {Object} content
             * @returns {undefined}
             */
            remove: function (content) {
                if (typeof content === 'object') {
                    var parent = content.getParent();

                    if (typeof parent === 'object') {
                        parent.setUpdated(true);
                    }

                    content.jQueryObject.remove();
                    ContentContainer.remove(content);
                }
            },

            /**
             * Retrieve a content by a node (jQuery)
             * @param {Object} node
             * @returns {Mixed}
             */
            getContentByNode: function (node) {
                var identifier = node.data(this.identifierDataAttribute),
                    result;

                if (null !== identifier) {
                    result = this.buildElement(this.retrievalObjectIdentifier(identifier), true);
                }

                return result;
            },

            /**
             * Retrieve a object identifier for split uid and type
             */
            retrievalObjectIdentifier: function (objectIdentifier) {
                var regex,
                    object = {},
                    res;

                if (objectIdentifier) {
                    /*jslint regexp: true */
                    regex = /(.+)\(([a-f0-9]+)\)$/;
                    /*jslint regexp: false */

                    res = regex.exec(objectIdentifier);

                    if (null !== res) {
                        object.type = res[1];
                        object.uid = res[2];
                    }
                }

                return object;
            },

            computeImages: function (selector) {

                selector = selector || '';

                var self = this,
                    images = jQuery(selector + ' [data-' + this.identifierDataAttribute + '^="' + this.imageClass + '"]');

                images.each(function () {
                    var image = jQuery(this);

                    if (image.context.naturalWidth === 0) {
                        image.attr('src', self.defaultPicturePath);
                    }
                });
            },

            unSelectContent: function () {
                var currentSelected = jQuery('.' + this.contentSelectedClass),
                    currentContent;

                if (currentSelected.length > 0) {
                    currentContent = ContentContainer.find(currentSelected.data(this.idDataAttribute));
                    currentContent.unSelect();
                }
            },

            /**
             * Build an object identifier
             * @param {String} type
             * @param {String} uid
             * @returns {null|String}
             */
            buildObjectIdentifier: function (type, uid) {
                var objectIdentifier = null;

                if (typeof type === 'string' && typeof uid === 'string') {
                    objectIdentifier = type + '(' + uid + ')';
                }

                return objectIdentifier;
            }
        });

        return new JS.Singleton(ContentManager);
    }
);