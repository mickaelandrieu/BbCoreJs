define('tb.core.Logger', ['moment', 'tb.core.Api', 'jsclass'], function (moment) {
    'use strict';

    /**
     * Logger is the base class for all BackBee toolbar logs
     */
    var LogLevels = {
            emergency: 1,
            alert: 2,
            critical: 3,
            error: 4,
            warning: 5,
            notice: 6,
            info: 7,
            debug: 8
        },

        Logger = new JS.Class({

            logs: [],

            initialise: function (minLevel, mode) {
                this.devmode = !(mode === 'production' || mode === null);
                this.minimalLevel = minLevel || 4;
            },

            pushLog: function (log) {
                api = require('tb.core.Api');

                if (undefined === api.get('logs')) {
                    api.register('logs', []);
                }

                api.get('logs').push(log);
            },

            consoleLog: function (level, message) {
                if (level < 5) {
                    console.error(message);
                } else if (level === 5) {
                    console.warn(message);
                } else if (level === 6) {
                    console.log(message);
                } else if (level === 7) {
                    console.info(message);
                } else {
                    console.debug(message);
                }
            },

            buildLog: function (logLevel, level, message, context) {
                var log = {
                    level: logLevel,
                    time: moment(),
                    name: level,
                    message: message,
                    context: context
                };
                this.pushLog(log);
            },

            log: function (level, message, context) {
                var logLevel = 9;
                if (LogLevels.hasOwnProperty(level)) {
                    logLevel = LogLevels[level];
                } else if (parseInt(level, 10) !== 0) {
                    logLevel = parseInt(level, 10);
                }

                if (this.devmode && console) {
                    this.consoleLog(level, message);
                }

                if (logLevel <= this.minimalLevel) {
                    this.buildLog(logLevel, level, message, context);
                }
            }
        }),

        logger = new Logger();


    /**
     * Describes the logger instance
     *
     * See https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md
     * for the full interface specification.
     */
    return {
        /**
         * System is unusable.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        emergency: function (message, context) {
            logger.log('emergency', message, context);
        },

        /**
         * Action must be taken immediately.
         *
         * Example: Entire website down, database unavailable, etc. This should
         * trigger the SMS alerts and wake you up.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        alert: function (message, context) {
            logger.log('alert', message, context);
        },

        /**
         * Critical conditions.
         *
         * Example: Application component unavailable, unexpected exception.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        critical: function (message, context) {
            logger.log('critical', message, context);
        },

        /**
         * Runtime errors that do not require immediate action but should typically
         * be logged and monitored.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        error: function (message, context) {
            logger.log('error', message, context);
        },

        /**
         * Exceptional occurrences that are not errors.
         *
         * Example: Use of deprecated APIs, poor use of an API, undesirable things
         * that are not necessarily wrong.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        warning: function (message, context) {
            logger.log('warning', message, context);
        },

        /**
         * Normal but significant events.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        notice: function (message, context) {
            logger.log('notice', message, context);
        },

        /**
         * Interesting events.
         *
         * Example: User logs in, SQL logs.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        info: function (message, context) {
            logger.log('info', message, context);
        },

        /**
         * Detailed debug information.
         *
         * @param string $message
         * @param array $context
         * @return null
         */
        debug: function (message, context) {
            logger.log('debug', message, context);
        },

        /**
         * Logs with an arbitrary level.
         *
         * @param mixed $level
         * @param string $message
         * @param array $context
         * @return null
         */
        log: function (level, message, context) {
            logger.log(level, message, context);
        }
    };
});
