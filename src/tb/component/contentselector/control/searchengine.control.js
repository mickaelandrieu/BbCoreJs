define(['require', 'jquery', 'jsclass', 'text!cs-templates/searchengine.tpl'], function (require, jQuery) {
    'use strict';
    var ContentSearchEngine = new JS.Class({
        defaultConfig: {
            datepickerClass: '.show-calendar',
            datepickerFieldClass: '.bb5-datepicker',
            beforeDateClass: '.before-date',
            afterDateClass: '.after-date',
            titleFieldClass: '.content-title',
            searchBtnClass: '.search-btn'
        },

        initialize: function (config) {
            this.config = jQuery.extend({}, this.defaultConfig, config);
            jQuery.extend(this, {}, Backbone.Events);
            this.widget = jQuery(require('text!cs-templates/searchengine.tpl')).clone();
            this.initDatepicker();
            this.bindEvents();
        },

        initDatepicker: function () {
            this.widget.find(this.config.datepickerFieldClass).datetimepicker({
                timepicker: false,
                closeOnDateSelect: true,
                format: "d/m/Y",
                parentID: "#bb5-ui",
                onSelectDate: function (ct, field) {
                    jQuery(field).data('selectedTime', Math.ceil(ct.getTime() / 1000));
                }
            });
        },

        showOrInitDateTimePicker: function (e) {
            var dateField = jQuery(e.currentTarget).parents(".col-bb5-22").find(this.defaultConfig.datepickerFieldClass).eq(0);
            if (!jQuery(dateField).data('datetimepicker')) {
                this.initDatepicker();
            }
            jQuery(dateField).datetimepicker('show');
        },

        bindEvents: function () {
            jQuery(this.widget).on('click', this.config.datepickerClass, jQuery.proxy(this.showOrInitDateTimePicker, this));
            jQuery(this.widget).on('click', this.config.searchBtnClass, jQuery.proxy(this.handleSearch, this));
        },

        render: function (container, positionMethod) {
            positionMethod = (typeof positionMethod === "string") ? positionMethod : 'html';
            if (container && jQuery(container).length) {
                jQuery(container)[positionMethod](this.widget);
            } else {
                return this.widget;
            }
        },

        handleSearch: function () {
            var criteria = {};
            criteria.title = jQuery(this.config.titleFieldClass).eq(0).val();
            criteria.beforeDate = jQuery(this.config.beforeDateClass).eq(0).data('selectedTime') || '';
            criteria.afterDate = jQuery(this.config.afterDateClass).eq(0).data('selectedTime') || '';
            if (criteria.title.length || criteria.beforeDate.length || criteria.afterDate.length) {
                this.trigger("doSearch", criteria);
            }
        }
    });
    return {
        createSearchEngine: function (config) {
            config = config || {};
            return new ContentSearchEngine(config);
        },
        ContentSearchEngine: ContentSearchEngine
    };
});