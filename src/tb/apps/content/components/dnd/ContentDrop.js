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
    'app.content/components/dnd/ContentDrop',
    [
        'tb.core',
        'jquery',
        'component!notify',
        'content.container',
        'content.manager',
        'jsclass'
    ],
    function (Core,
              jQuery,
              Notify,
              ContentContainer,
              ContentManager
            ) {

        'use strict';

        return new JS.Class({

            bindEvents: function (Manager) {

                this.manager = Manager;

                Core.Mediator.subscribe('on:classcontent:drop', this.onDrop, this);
            },

            unbindEvents: function () {
                Core.Mediator.unsubscribe('on:classcontent:drop', this.onDrop);
            },

            onDrop: function (event) {
                event.stopPropagation();

                var target = jQuery(event.target),
                    config = {},
                    parent = target.parents(this.manager.droppableClass + ':first'),
                    parentObjectIdentifier = ContentManager.retrievalObjectIdentifier(parent.data(this.manager.identifierDataAttribute));

                config.event = event;

                config.position = this.manager.getPosition(target, parent);
                config.parent = ContentManager.buildElement(parentObjectIdentifier);
                config.type = this.manager.dataTransfer.content.type;

                if (this.manager.dataTransfer.isNew === true) {
                    this.addContent(config);
                } else {
                    this.updateContent(config);
                }
            },

            /**
             * Used into a drop event.
             * Verify if current contentset accept the content, create the content
             * from api and show him on the html
             * @param {Object} config
             */
            addContent: function (config) {

                if (ContentContainer.isInArray(this.manager.dataTransfer.contentSetDroppable, 'type', config.parent.type)) {

                    ContentManager.createElement(config.type).then(
                        function (content) {
                            config.parent.append(content, config.position);
                        },
                        function () {
                            Notify.error('An error occured when drop a new content');
                        }
                    );
                }
            },

            /**
             * Used into a drop event.
             * Move the content to a new contentset
             * and set updated old contentset
             * @param {Object} config
             */
            updateContent: function (config) {

                var content = ContentContainer.find(this.manager.dataTransfer.content.id),
                    oldParent = content.jQueryObject.parents('.' + this.manager.contentClass + ':first'),
                    oldParentAsContent;

                oldParentAsContent = ContentManager.getContentByNode(oldParent);

                content.jQueryObject.remove();
                content.jQueryObject.length = 0;

                config.parent.append(content, config.position);

                oldParentAsContent.setUpdated(true);
            }
        });
    }
);