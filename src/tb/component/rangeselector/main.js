define(['underscore', 'jquery', 'jsclass', 'BackBone'], function (underscore, jQuery) {
    'use strict';
    var RangeSelector = new JS.Class({
        defaultConfig: {
            range: [1, 50],
            cls: 'max-per-page-selector input-xs',
            optionCls: 'page',
            selected: 1,
            css: {}
        },

        initialize: function (userConfig) {
            userConfig = userConfig || {};
            this.config = jQuery.extend({}, this.defaultConfig, userConfig);
            jQuery.extend(this, {}, Backbone.Events);
            this.widget = jQuery("<select/>");
            this.widget.addClass(this.config.cls);
            this.updateUi();
            this.select(this.config.selected, true);
            this.bindEvents();
        },

        updateUi: function () {
            var self = this,
                optionsFragment = document.createDocumentFragment(),
                start = this.config.range[0] || 10,
                stop = this.config.range[1] + 10 || 60,
                step = this.config.range[2] || 10,
                options = underscore.range(start, stop, step);
            jQuery.each(options, function (i, value) {
                var option = jQuery('<option/>').val(value).text(value).addClass(self.config.optionCls);
                jQuery(option).data('no', i);
                optionsFragment.appendChild(jQuery(option).get(0));
            });
            this.widget.append(jQuery(optionsFragment));
        },

        select: function (val, silent) {
            val = parseInt(val, 10);
            silent = (typeof silent === 'boolean') ? silent : false;
            this.widget.val(val);
            this.currentStep = val;
            if (!silent) {
                this.handleChange(this);
            }
        },

        setRange: function (range) {
            this.config.range = range;
            this.updateUi();
            this.select(this.config.selected, true);
        },

        handleChange: function (selector) {
            selector.currentStep = this.val();
            selector.trigger('pageRangeSelectorChange', selector.currentStep);
        },

        getValue: function () {
            return this.currentStep;
        },

        bindEvents: function () {
            this.widget.on('change', jQuery.proxy(this.handleChange, this.widget, this));
        },

        render: function (container, positionMethod) {
            positionMethod = (typeof positionMethod === "string") ? positionMethod : 'html';
            if (container && jQuery(container).length) {
                jQuery(container)[positionMethod](this.widget);
            } else {
                return this.widget;
            }
        }
    });
    return {
        createPageRangeSelector: function (config) {
            config = config || {};
            return new RangeSelector(config);
        },
        RangeSelector: RangeSelector
    };
});