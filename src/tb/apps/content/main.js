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

        //Controllers
        'content.main.controller': 'src/tb/apps/content/controllers/main.controller',

        //Routing
        'content.routes': 'src/tb/apps/content/routes',

        //Repositories
        'content.repository': 'src/tb/apps/content/repository/content.repository',

        //Components
        'content.manager': 'src/tb/apps/content/components/ContentManager',
        'definition.manager': 'src/tb/apps/content/components/DefinitionManager',
        'content.container': 'src/tb/apps/content/components/ContentContainer',
        'content.breadcrumb': 'src/tb/apps/content/components/Breadcrumb',
        'content.pluginmanager': 'src/tb/apps/content/components/PluginManager',

        //Models
        'content.models.AbstractContent': 'src/tb/apps/content/models/AbstractContent',
        'content.models.Content': 'src/tb/apps/content/models/Content',
        'content.models.ContentSet': 'src/tb/apps/content/models/ContentSet',

        //Templates
        'content-templates': 'src/tb/apps/content/templates/',
        'content/tpl/button': 'src/tb/apps/content/templates/button.twig',
        'content/tpl/content_breadcrumb': 'src/tb/apps/content/templates/content-breadcrumb.twig',
        'content/tpl/contribution/index': 'src/tb/apps/content/templates/contribution.index.twig',
        'content/tpl/carousel_blocks': 'src/tb/apps/content/templates/carousel-blocks.twig',
        'content/tpl/palette_blocks': 'src/tb/apps/content/templates/palette-blocks.twig',

        //Views
        'content.view.contribution.index': 'src/tb/apps/content/views/content.view.contribution.index'
    }
});

define('app.content', ['tb.core', 'content.pluginmanager'], function (Core, PluginManager) {

    'use strict';

    Core.ApplicationManager.registerApplication("content", {

        onInit: function () {
            PluginManager.getInstance().watchContents();
        },

        onStart: function () {
            alert("onEnable");
        },

        onStop: function () {
            alert("onDisable");
        }


    });
});

