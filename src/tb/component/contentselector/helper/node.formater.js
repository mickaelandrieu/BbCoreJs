define(['tb.core.Api', 'jquery'], function (Api, jquery) {
    'use strict';
    var formaterMap = {
        category: 'formatCategory',
        contenttype: 'formatContentType'
    },
        NodeFormater = {
            formatSubcontents: function (contents) {
                var result = [],
                    data = contents || [];
                /*jslint unparam: true*/
                jquery.each(data, function (i, content) {
                    if (content.hasOwnProperty("label") && typeof content.label === "string") {
                        content.isACategory = false;
                        content.no = i + 1;
                        result.push(content);
                    }
                });
                return result;
            },

            format: function (type, data) {
                var formater = formaterMap[type],
                    contents = data || {};
                if (typeof this[formater] !== "function") {
                    Api.exception('NodeFormaterException', 12201, 'format: formater ' + formater + 'doesn\'t exist');
                }
                return this[formater](contents);
            },

            formatCategory: function (data) {
                var self = this,
                    contents = data || {},
                    root = {
                        label: "Category",
                        children: [],
                        isRoot: true
                    },
                    result = [];
                jquery.each(contents, function (i, category) {
                    category.label = category.name;
                    category.isACategory = true;
                    category.no = i + 1;
                    category.children = self.formatSubcontents(category.contents);
                    root.children.push(category);
                });
                result.push(root);
                return result;
            },

            formatContentType: function (data) {
                var result = [],
                    root = {
                        label: "Contents",
                        children: [],
                        isRoot: true
                    };
                jquery.each(data, function (i, content) {
                    root.children.push({
                        label: content,
                        type: content,
                        no: i + 1,
                        isACategory: false
                    });
                });
                result.push(root);
                return result;
            }
        };
    return {
        format: jquery.proxy(NodeFormater.format, NodeFormater)
    };
});