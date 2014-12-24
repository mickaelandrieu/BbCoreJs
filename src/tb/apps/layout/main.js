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
    paths: {
        "layout.routes": "src/tb/apps/layout/routes",
        "layout.main.controller": "src/tb/apps/layout/controllers/main.controller",
        "layout.test.controller": "src/tb/apps/layout/controllers/test.controller",
        "layout.test.manager": "src/tb/apps/layout/managers/test.manager",
        "layout/tpl/home": "src/tb/apps/layout/templates/home.tpl"
    }
});
define("app.layout", ["require", "tb.core", 'datetimepicker'], function (require) {
    'use strict';
    var bbCore = require("tb.core");
    bbCore.ApplicationManager.registerApplication("layout", {
        config: {
            root: "route"
        },

        onInit: function () {
            console.log(" LayoutApplication is initialized ");
        },

        onStart: function () {
            console.log(" layout Application [layout] onStart ...");
        },

        onStop: function () {
            console.log("layout onStop is called ...");
        },

        onError: function () {
            console.log("layout onError...");
        }
    });
});
