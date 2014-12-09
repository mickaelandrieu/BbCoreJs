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

define(['jquery'], function (jQuery) {

    'use strict';

    var init = {

        toolBarDisplayed: false,

        listen: function () {
            jQuery(document).bind('keyup', jQuery.proxy(this.manageAccess, this));
        },

        manageAccess: function (event) {
            if (!this.toolBarDisplayed) {
                if (!event.altKey || !event.ctrlKey || 66 !== event.keyCode) {
                    return;
                }
                this.load(false);
            }
        },

        load: function (already_connected) {
            var self = this;
            require(['tb.core', 'src/tb/config'], function (Core, config) {

                Core.set('is_connected', false);

                var router = null;

                Core.ApplicationManager.on('routesLoaded', function () {
                    /*cf http://backbonejs.org/#Router for available options */
                    router = Core.RouteManager.initRouter({silent: true});
                });

                Core.ApplicationManager.on('appIsReady', function (app) {
                    router.navigate(app.getMainRoute());
                });

                if (true === already_connected) {
                    Core.initConfig(config);
                } else {
                    Core.Mediator.subscribe('onSuccessLogin', function () {
                        self.toolBarDisplayed = true;
                        /*
                         * @TODO: Load config by a rest when user connected
                         */
                        Core.initConfig(config);
                    });

                    Core.authentication.showForm();
                }

            }, this.onError);
        },

        onError: function (error) {
            console.log(error);
        }
    };
    return init;
});