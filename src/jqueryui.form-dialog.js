(function ($) {
    function _userAlert(title, text)
    {
        $('<pre/>').text(text).dialog({
            title: title,
            close: function () {
                $(this).dialog('destroy').remove();
            }
        });
    }

    // jQuery AJAX error handler
    function _showErrors(jqXHR)
    {
        try {
            var data = jqXHR.responseJSON;
            if (data.form) {
                $.each(data.form, function (field, errors) {
                    this.find('*[name="'+field+'"]:first').before(_createErrorList(errors));
                }.bind(this));
            }
            if (data.error) {
                this.find('form').addBack('form').prepend(_createErrorList([data.error]));
            }
        }
        catch (e) {
            // e.g. simple or empty strings
            window.console.log(e.message);
        }
    }

    function _createErrorList(errors)
    {
        var $ul = $('<ul class="error"/>');
        var $li = $('<li/>');
        $.each(errors, function (index, error) {
            $li.clone().text(error).appendTo($ul);
        });
        return $ul;
    }

    /**
     * Create a jQueryUI dialog from the element. The AJAX URL, data, and method 
     * are read from the contained form.
     *
     * Precedence of options: default < attribute < option
     * 
     * @param (object) options [optional] jQueryUI dialog options / plugin options
     * @param (function) success [optional] jQuery AJAX success handler
     * @return jQuery
     */
    $.fn.formDialog = function (options, success) {
        var plugin, setting, buttons;

        if ($.isFunction(options)) {
            success = options;
        }
        if (typeof options !== 'object') { // null is ignored in $.extend()
            options = {};
        }

        plugin  = $.fn.formDialog;
        setting = $.extend({}, plugin.defaults);

        // extract only the plugin options
        // otherwise there are problems with the auto-config
        $.each(options, function (key, value) {
            if (key in setting) {
                setting[key] = value;
            }
        });

        // safeguard for .buttonise()
        if (!('buttons' in options)) {
            options.buttons = [];
        }

        if (!$.isFunction(setting.formData)) {
            setting.formData = plugin.formalise;
        }

        if (!('close' in options) && options.remove) {
            options.close = function () {
                $(this).dialog('destroy').remove();
            };
        }

        buttons = [{
            text:  plugin.translate(setting.language, setting.actionLabel),
            click: function (evt) {
                var button  = evt.target, // the 'Save' button
                    $dialog = $(this),
                    $form   = plugin.getForm($dialog),
                    ajax;

                if ($form.find(':invalid').length > 0) {
                    return false;
                }

                button.disabled = true;
                $dialog.find('ul.error').remove();

                ajax = $.ajax($form.prop('action'), {
                    type: $form.prop('method'),
                    data: setting.formData.call($form[0], $form),
                    context: $dialog,
                    statusCode: setting.http
                }).always(function () {
                    button.disabled = false;
                }).fail(function (jqXHR) {
                    if (jqXHR.status in setting.http) {
                        return;
                    }
                    this.dialog('close');
                    if (jqXHR.responseText) {
                        _userAlert(plugin.translate(setting.language, 'Error'), jqXHR.responseText);
                    }
                });

                if (setting.autoClose) {
                    ajax.done(function () {
                        this.dialog('close');
                    });
                }

                if ($.isFunction(setting.success)) {
                    ajax.done(setting.success);
                }

                if ($.isFunction(success)) {
                    ajax.done(success);
                }

                if (setting.formReset) {
                    ajax.done(function () {
                        $form[0].reset();
                    });
                }
            }
        }, {
            text:  plugin.translate(setting.language, 'Cancel'),
            click: function () {
                $(this).dialog('close');
            }
        }];

        return this.each(function () {
            var config = $.extend({}, setting),
                $elem  = $(this);

            $.each(this.dataset, function (key) {
                config[key] = $elem.data(key);
            });

            $.extend(config, options);

            if (plugin.getForm($elem).length > 0) {
                config.buttons = $.merge(plugin.buttonise(options.buttons), buttons);
            }

            $elem.dialog(config);
        });
    };

    /**
     * Transform the form’s data into a jQuery AJAX compatible format 
     * (see 'data' option in $.ajax). Defaults to jQuery’s serialize().
     *
     * @param (jQuery) $form jQuery object of the form element.
     * @scope (HTMLElement) DOM form element.
     * @return (string|object|array) jQuery AJAX compatible form data.
     */
    $.fn.formDialog.formalise = function ($form) {
        return $form.serialize();
    };

    $.fn.formDialog.buttonise = function (buttons) {
        return $.map(buttons, function (props, name) {
            return $.isFunction(props) ? {
                click: props,
                text: name
            } : props;
        });
    };

    $.fn.formDialog.getForm   = function ($elem) {
        return $elem.find('form').addBack('form').eq(0);
    };

    $.fn.formDialog.translate = function (language, key) {
        var dictionary = $.fn.formDialog.dictionary;

        if (!(language in dictionary)) {
            return key;
        }
        if (key in dictionary[language]) {
            return dictionary[language][key];
        }
        return key;
    };

    $.fn.formDialog.dictionary = {
        de: {
            Cancel: 'Abbrechen',
            Delete: 'Löschen',
            Edit:   'Bearbeiten',
            Error:  'Fehler',
            Save:   'Speichern'
        }
    };

    $.fn.formDialog.defaults = {
        // modified dialog options:

        autoOpen: false,
        width: 500,

        // plugin options:

        // The language to be used for translating buttons and labels.
        language: 'en',
        // The name to be used on the "submit" button.  
        actionLabel: 'Save',
        // Close the dialog automatically if the AJAX submit was successful.
        autoClose: true,
        // form data processing function
        formData: $.fn.formDialog.formalise,
        // reset form after successful submission
        formReset: true,
        // alternate/additional success function
        success: null,
        // remove dialog after close
        remove: false,
        // default error handler
        http: {
            400: _showErrors
        }
    };

}(jQuery));
