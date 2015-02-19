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
require.config({
    baseUrl: 'resources/toolbar/',
    catchError: true,
    paths: {
        'tb.core': 'src/tb/main',
        'component': 'src/tb/component/component',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'jqueryui': 'bower_components/jquery-ui/jquery-ui.min',
        'jsclass' : 'node_modules/jsclass/min/core',
        'underscore': 'bower_components/underscore/underscore-min',
        'nunjucks': 'bower_components/nunjucks/browser/nunjucks.min',
        'BackBone': 'bower_components/backbone/backbone',
        'text': 'bower_components/requirejs-text/text',
        'moment': 'bower_components/moment/moment',
        'URIjs': 'bower_components/uri.js/src',
        'datetimepicker': 'bower_components/datetimepicker/jquery.datetimepicker',
        'jquery-layout' : 'bower_components/jquery.layout/dist/jquery.layout-latest.min',
        'jqLayout': 'bower_components/jquery.layout/dist/jquery.layout-latest.min',
        'lib.jqtree': 'bower_components/jqtree/tree.jquery',
        'jssimplepagination': 'bower_components/jssimplepagination/jquery.simplePagination',
        'bootstrapjs': 'bower_components/bootstrap/dist/js/bootstrap.min',
        'ckeeditor' : 'bower_components/ckeeditor/ckeditor'
    },
    'shim': {
        underscore: {
            exports: '_'
        },
        BackBone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        bootstrapjs: {
            deps: ['jquery']
        },
        'jquery-layout': {
            deps: ['jquery']
        }
    },
    deps: ['src/tb/init'],
    callback: function (init) {
        'use strict';
        init.listen();
    }
});
