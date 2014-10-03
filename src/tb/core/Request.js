define('tb.core.Request', ['jsclass'], function () {
    'use strict';

    /**
     * Request object
     */
    var Request = new JS.Class({

        initialize: function () {
            /**
             * Uri of request
             * @type {String}
             */
            this.url = '';
            /**
             * Method of request
             * @type {String}
             */
            this.method = 'GET';
            /**
             * Data of request
             * @type {Mixed}
             */
            this.datas = null;
            /**
             * Headers of request
             * @type {Object}
             */
            this.headers = {
                'Content-Type': 'application/x-www-form-uriencoded'
            };

        },

        /**
         * Set url of request
         * @param {String} url
         * @returns {Object} Request
         */
        setUrl: function (url) {
            this.url = url;

            return this;
        },
        /**
         * Set the method of request
         * @param {String} method
         * @returns {Object} Request
         */
        setMethod: function (method) {
            this.method = method.toUpperCase();

            return this;
        },
        /**
         * @param {Mixed} data
         * @returns {Object} Request
         */
        setDatas: function (datas) {
            this.datas = datas;

            return this;
        },
        /**
         * Set all headers in request
         * @param {Object} headers
         * @returns {Object} Request
         */
        setHeaders: function (headers) {
            this.headers = headers;

            return this;
        },
        /**
         * Set one header with name and value
         * @param {String} name
         * @param {String} value
         * @returns {Object} Request
         */
        addHeader: function (name, value) {
            this.headers[name] = value;

            return this;
        },
        /**
         * Set content type of request
         * @param {String} contentType
         * @returns {Object} Request
         */
        setContentType: function (contentType) {
            this.addHeader('Content-Type', contentType);
            return this;
        },
        /**
         * Get the url with query params
         * @returns {String} url builded
         */
        getUrl: function () {
            return this.url;
        },
        /**
         * Get the content type of request
         * @returns {String}
         */
        getContentType: function () {
            return this.headers['Content-Type'];
        },
        /**
         * GEt the method of request
         * @returns {String}
         */
        getMethod: function () {
            return this.method;
        },
        /**
         * Get the data of request
         * @returns {Mixed}
         */
        getDatas: function () {
            return this.datas;
        },
        /**
         * Get header by key
         * @param {String} key
         * @returns {Object|null}
         */
        getHeader: function (key) {
            return this.headers[key] || null;
        },
        /**
         * Get the headers of request
         * @returns {Object}
         */
        getHeaders: function () {
            return this.headers;
        }
    });

    return Request;
});