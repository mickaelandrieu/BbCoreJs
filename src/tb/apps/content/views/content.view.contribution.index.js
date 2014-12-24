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
        'text!content/tpl/contribution/index',
        'text!content/tpl/carousel_blocks',
        'tb.core.Renderer',
        'text!content/tpl/palette_blocks'
    ],
    function (jQuery,
              template,
              carouselBlocksTpl,
              Renderer,
              paletteBlocksTpl
            ) {

        'use strict';

        /**
         * View of content contribution index
         * @type {Object} Backbone.View
         */
        var ContentViewContributionIndex = Backbone.View.extend({

            /**
             * Point of Toolbar in DOM
             */
            el: '#contrib-tab-apps',
            carouselBlocksId: '#carousel-contrib-blocks',
            carouselId: '#carousel-blocks',
            selectCategoriesId: '#select-categories-blocks-contrib',
            paletteBlocksId: '#palette-contrib-blocks',
            dialogContainerClass: '.bb5-dialog-container',
            paletteBlocksDalogId: '#palette-blocks',
            togglePaletteClasses: '.bb5-data-toggle .bb5-data-toggle-header',

            /**
             * Initialize of ContentViewContributionIndex
             */
            initialize: function (config) {
                this.categories = this.manageCategories(config.categories);

                this.bindUiEvents();
            },

            /**
             * Events of view
             */
            bindUiEvents: function () {
                jQuery(this.el).on('change', this.selectCategoriesId, jQuery.proxy(this.onSelectCategory, this));
                jQuery(this.el).on('click', this.paletteBlocksId, jQuery.proxy(this.onPaletteBlocksClick, this));
                jQuery(this.dialogContainerClass).on('click', this.togglePaletteClasses, jQuery.proxy(this.doToggleHeaderEvent, this));
            },

            /* PALETTE MANAGE */
            onPaletteBlocksClick: function () {
                if (!this.paletteLoaded) {
                    jQuery(this.dialogContainerClass).html(Renderer.render(paletteBlocksTpl, {categories: this.categories}));

                    jQuery(this.paletteBlocksDalogId).dialog({
                        width: 323,
                        height: 400 > jQuery(window).height() - 40 ? jQuery(window).height() - 40 : 400,
                        autoOpen: false,
                        appendTo: '#bb5-ui .bb5-dialog-container'
                    });

                    jQuery(this.paletteBlocksDalogId).dialog('open');

                    this.paletteLoaded = true;
                } else {
                    if (jQuery(this.paletteBlocksDalogId).dialog('isOpen')) {
                        jQuery(this.paletteBlocksDalogId).dialog('close');
                    } else {
                        jQuery(this.paletteBlocksDalogId).dialog('open');
                    }
                }
            },

            doToggleHeaderEvent: function (event) {
                var currentTarget = jQuery(event.currentTarget);

                jQuery(this.paletteBlocksDalogId).find('.bb5-data-toggle.open').not(currentTarget.parent()).removeClass('open');

                currentTarget.parent().toggleClass('open');
            },
            /* END PALETTE MANAGE */

            onSelectCategory: function (event) {
                var currentTarget = jQuery(event.currentTarget),
                    optionSelected = currentTarget.children('option:selected');

                this.showBlocksByCategory(optionSelected.val());

                jQuery(this.carouselId).carousel();
            },


            manageCategories: function (categories) {
                var key,
                    blockKey,
                    category,
                    block;

                for (key in categories) {
                    if (categories.hasOwnProperty(key)) {
                        category = categories[key];
                        category.show = false;

                        for (blockKey in category.contents) {
                            if (category.contents.hasOwnProperty(blockKey)) {
                                block = category.contents[blockKey];
                                if (block.visible) {
                                    category.show = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                return categories;
            },

            getCategoryById: function (categoryId) {
                var key,
                    category,
                    result = null;

                for (key in this.categories) {
                    if (this.categories.hasOwnProperty(key)) {
                        category = this.categories[key];
                        if (category.id === categoryId) {
                            result = category;
                            break;
                        }
                    }
                }

                return result;
            },

            getAllBlocks: function () {
                var key,
                    blockKey,
                    category,
                    block,
                    blocks = [];

                for (key in this.categories) {
                    if (this.categories.hasOwnProperty(key)) {
                        category = this.categories[key];
                        for (blockKey in category.contents) {
                            if (category.contents.hasOwnProperty(blockKey)) {
                                block = category.contents[blockKey];
                                if (block.visible) {
                                    blocks.push(category.contents[blockKey]);
                                }
                            }
                        }
                    }
                }

                return blocks;
            },

            showBlocksByCategory: function (categoryId) {
                var category = this.getCategoryById(categoryId),
                    key,
                    html = '',
                    flag = 0,
                    data = {},
                    contents;

                data.blocks = [];
                data.active = true;

                if (null === category) {
                    contents = this.getAllBlocks();
                } else {
                    contents = category.contents;
                }

                for (key in contents) {
                    if (contents.hasOwnProperty(key)) {
                        if (contents[key].visible) {
                            data.blocks.push(contents[key]);
                            flag = flag + 1;
                            if (flag === 3) {
                                html = html + Renderer.render(carouselBlocksTpl, data);
                                flag = 0;
                                data.blocks = [];
                                data.active = false;
                            }
                        }
                    }
                }

                if (data.blocks.length > 0) {
                    html = html + Renderer.render(carouselBlocksTpl, data);
                }

                jQuery(this.carouselBlocksId).html(html);
            },

            /**
             * Render the template into the DOM with the Renderer
             * @returns {Object} PageViewContributionIndex
             */
            render: function () {
                jQuery(this.el).html(Renderer.render(template, {'categories': this.categories}));

                this.showBlocksByCategory('_all');
            }
        });

        return ContentViewContributionIndex;
    }
);