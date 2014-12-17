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
require.config({
    baseUrl: 'resources/',
    catchError: true,
    urlArgs: 'cb=' + Math.random(),
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jqueryui': 'lib/jquery-ui/jquery-ui',
        'jsclass' : 'node_modules/jsclass/min/core',
        'underscore': 'lib/underscore/underscore',
        'handlebars': 'lib/handlebars/handlebars',
        'tb.core': 'src/tb/main',
        'component': 'src/tb/component/component',
        'BackBone': 'lib/backbone/backbone',
        'nunjucks': 'lib/nunjucks/nunjucks.min',
        'moment': 'lib/moment/moment',
        'text': 'lib/requirejs-text/text',
        'bootstrapjs': 'lib/bootstrap/bootstrap',
        'URIjs': 'lib/uri.js',
        'datetimepicker': 'lib/datetimepicker/jquery.datetimepicker',
        "jquery-layout" : 'lib/jquery.layout/jquery.layout-latest'
    },
    'shim': {
        underscore: {
            exports: '_'
        },
        BackBone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        Bootstrap: {
            deps: ['jquery']
        },
        "jquery-layout": {
            deps: ['jquery']
        }

    }
});
