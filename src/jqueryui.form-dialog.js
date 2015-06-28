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
            var data = $.parseJSON(jqXHR.responseText);
            $.each(data.form, function (field, errors) {
                this.find('*[name="'+field+'"]:first').before(_createErrorList(errors));
            }.bind(this));
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
        if ($.isFunction(options)) {
            success = options;
        }
        if (typeof options !== 'object') { // null is ignored in $.extend()
            options = {};
        }
        var plugin  = $.fn.formDialog;
        var setting = $.extend({}, plugin.defaults);

        // extract the plugin options
        $.each(options, function (key, value) {
            if (key in setting) {
                setting[key] = value;
            }
        });

        setting.buttons = [{
            text:  plugin.translate(setting.language, setting.actionLabel),
            click: function (evt) {
                var button  = evt.target; // the 'Save' button
                var $dialog = $(this);
                var $form   = $dialog.find('form').addBack('form');
                if ($form.find(':invalid').length > 0) {
                    return false;
                }

                button.disabled = true;
                $dialog.find('ul.error').remove();

                var ajax = $.ajax($form.prop('action'), {
                    type: $form.prop('method'),
                    data: $form.serialize(),
                    context: $dialog,
                    statusCode: {
                        400: _showErrors,
                        500: function (jqXHR, textStatus, errorThrown) {
                            this.dialog('close');
                            _userAlert(plugin.translate(setting.language, 'Error'), jqXHR.responseText || errorThrown);
                        }
                    }
                }).always(function () {
                    button.disabled = false;
                });

                if (setting.autoClose) {
                    ajax.done(function () {
                        this.dialog('close');
                    });
                }

                if ($.isFunction(success)) {
                    ajax.done(success);
                }

                if ($.isFunction(setting.success)) {
                    ajax.done(setting.success);
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
                $elem = $(this);
/*
            // while extend(setting, elem.data()) works,
            // extend(elem.data(), setting) and extend(this.dataset, setting) do not, 
            // hence the workaround 
            [].map.call(this.attributes, function (attr) {
                return attr.name;
            }).filter(function (name) {
                return name.indexOf('data-') === 0;
            }).map(function (name) {
                return name.substring(5).replace(/-(\w)/, function (m, p1) {
                    return p1.toUpperCase();
                });
            }).forEach(function (option) {
                config[option] = $elem.data(option);
            });
*/
            $.map(this.dataset, function (value, key) {
                config[key] = $elem.data(key);
            });
            $elem.dialog($.extend(config, options));
        });
    };

    // global defaults
    $.fn.formDialog.defaults = {
        // dialog options:

        autoOpen: false,
        modal: true,
        width: 500,

        // plugin options:

        // The language to be used for translating buttons and labels.
        language: 'en',
        // The name to be used on the "submit" button.  
        actionLabel: 'Save',
        // Close the dialog automatically if the AJAX submit was successful.
        autoClose: true
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

    $.fn.formDialog.translate = function (language, key) {
        if (!(language in $.fn.formDialog.dictionary)) {
            return key;
        }
        var dictionary = $.fn.formDialog.dictionary[language];
        if (key in dictionary) {
            return dictionary[key];
        }
        return key;
    };
}(jQuery));
