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
define(['component!formbuilder'], function (formbuilder) {
    'use strict';

    var configure = function (view) {

        return {
            elements: {
                firstname: {
                    type: 'text',
                    label: 'first_name',
                    placeholder: 'John',
                    value: view.user.getObject().firstname
                },
                lastname: {
                    type: 'text',
                    label: 'last_name',
                    placeholder: 'Doe',
                    value: view.user.getObject().lastname
                },
                email: {
                    type: 'text',
                    label: 'email',
                    placeholder: 'john.doe@unknown.com',
                    value: view.user.getObject().email
                },
                login: {
                    type: 'text',
                    label: 'login',
                    placeholder: 'john.doe',
                    value: view.user.getObject().login
                },
                activated: {
                    type: 'checkbox',
                    options: {
                        activated: 'activated'
                    }
                }
            },

            onSubmit: function (data) {
                data.activated = (data.activated === 'activated');
                view.user.populate(data);
                view.user.getObject().generate_password = true;
                view.dfd.resolve(view.user);
            },

            onValidate: function (form, data) {
                if (!data.hasOwnProperty('login') || data.login.trim().length === 0) {
                    form.addError('login', 'login is required');
                }
                if (!data.hasOwnProperty('email') || data.email.trim().length === 0) {
                    form.addError('email', 'email is required');
                } else {
                    if (!/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,6}$/i.test(data.email.trim())) {
                        form.addError('email', 'email is invalid');
                    }
                }
            }
        };
    };

    return {
        construct: function (view, errors) {
            var config = configure(view),
                form,
                key;

            if (undefined !== errors) {
                for (key in errors) {
                    if (errors.hasOwnProperty(key) &&
                            config.elements.hasOwnProperty(key)) {
                        config.elements[key].error = errors[key];
                    }
                }
            }

            form = formbuilder.renderForm(config);

            form.done(function (tpl) {
                view.popin.setContent(tpl);
            });
        }
    };
});
