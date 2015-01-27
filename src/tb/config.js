/*
 * @TODO this have to be generated by the php engine
 */
define([], function () {
    'use strict';

    return {
        core: {
            ApplicationManager: {
                appPath: 'resources/toolbar/src/tb/apps',

                /*ne charge que les onglets qui se trouvent dans 'applications'*/
                active: 'main',

                route: '', // to change: App should know

                applications: {
                    main: {
                        label: 'Main',
                        config: {mainRoute: 'appMain/index'}
                    },
                    layout: {
                        label: 'Layout',
                        config: {mainRoute: 'appLayout/home'}
                    },
                    content: {
                        label: 'Edition du contenu',
                        config: {}
                    },
                    bundle: {
                        label: 'Bundle',
                        config: {mainRoute: 'bundle/index'}
                    },
                    page: {
                        label: 'Page',
                        config: {mainRoute: 'page/index'}
                    },
                    contribution: {
                        label: 'Contribution',
                        config: {mainRoute: 'contribution/index'}
                    }
                }
            }
        },

        component: {
            logger: {

            }
        },

        plugins: {
            namespace: {
                core: 'src/tb/apps/content/plugins/',
                demo: ''
            },
            "core": {
                edit: {
                    accept: ['block_demo', 'Bloc/contentset_bfm'],
                    config: {}
                },

                contentselector: {
                    accept: ['home/home_container', 'Bloc/contentset_bfm'], //handle wildcard
                    config: {
                        appendPosition: "bottom", /* default */
                        'home/home_container': {
                            accept: ['article', 'paragraph']
                        },
                        'Bloc/contentset_bfm': {
                            accept: ['article']
                        }
                    }
                },
                contenttype: {
                    accept: ['home/home_container', 'block_demo'],
                    config: {}
                }
            },
            "demo": { }
        }


    };
});