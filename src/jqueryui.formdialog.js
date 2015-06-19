(function ($) {
    function _userAlert(title, text)
    {
        $('<div/>').append(
            $('<pre/>').html(text)
        ).dialog({
            title: title,
            close: function () {
                $(this).closest('.ui-dialog').remove();
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
            console.log(e.message);
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
     * @param (object) options [optional] jQueryUI dialog options / plugin options
     * @param (function) success [optional] jQuery AJAX success handler
     * @return jQuery
     */
    $.fn.createDialog = function (options, success) {
        if (typeof options === 'function') {
            success = options;
        }
        if (typeof options !== 'object') { // null is ignored in $.extend()
            options = {};
        }
        var plugin  = $.fn.createDialog;
        var setting = $.extend({}, plugin.defaults, options);

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

                if (typeof success === 'function') {
                    ajax.done(success);
                }

                if (typeof setting.success === 'function') {
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
            var $elem    = $(this);
            var autoconf = $elem.data();
            if (autoconf) {
                $elem.dialog($.extend({}, setting, autoconf));
            }
            else {
                $elem.dialog(setting);
            }
        });
    };

    // global defaults
    $.fn.createDialog.defaults = {
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

    $.fn.createDialog.dictionary = {
        de: {
            Cancel: 'Abbrechen',
            Delete: 'Löschen',
            Edit:   'Bearbeiten',
            Error:  'Fehler',
            Save:   'Speichern'
        }
    };

    $.fn.createDialog.translate = function (language, key) {
        if (!(language in $.fn.createDialog.dictionary)) {
            return key;
        }
        var dictionary = $.fn.createDialog.dictionary[language];
        if (key in dictionary) {
            return dictionary[key];
        }
        return key;
    };
}(jQuery));
