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
        'content.repository',
        'tb.core.Request',
        'jsclass'
    ],
    function (jQuery,

              Content,
              ContentSet,
              DefinitionManager,
              ContentContainer,
              ContentRepository,
              Request
            ) {

        'use strict';


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

        return new JS.Singleton(ContentManager);
    }
);