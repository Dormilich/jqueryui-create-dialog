# Form Dialog

Create preconfigured jQueryUI dialog forms. If the dialog element is/contains a form element, this plugin will create a close button (named "Cancel") and a submit button (named "Save" by default) that will collect the data from the form and send them to the URL given by the form’s _action_ attribute (the browser will resolve the (not) given value into a full absolute URL) using the form’s _method_ value as transfer method (the browser’s default is GET). 

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Dormilich/jqueryui-form-dialog/master/dist/form-dialog.min.js
[max]: https://raw.github.com/Dormilich/jqueryui-form-dialog/master/dist/form-dialog.js

In your web page:

```html
<script src="jquery.min.js"></script>
<script src="jquery-ui.min.js"></script>
<script src="dist/jqueryui.form-dialog.min.js"></script>
```

## Documentation

    (jQuery) .formDialog( [ (object) options ], [ (function) success ] )

**success**: a function executed when the AJAX request returns successfully. It takes the same parameters as the jQuery AJAX success handler. The scope of the function is the dialog element.

**options**: can be any jQueryUI Dialog option. Some of them have different default values to the Dialog widget:

- _autoOpen_ `false`
- _width_ `500`

Additionally, there are plugin specific options:

- _language_ (string) `"en"`, a language abbreviation to translate buttons and labels. See Translating Labels
- _actionLabel_ (string) `"Save"`, the label for the submit button
- _autoClose_ (boolean) `true`, set to `true` if the dialog should be automatically closed if the AJAX request returns successfully
- _formData_ (function), a function that converts the form data into a data type (usually an URL encoded string or plain object) that `jQuery.ajax()` can handle. The scope of the function is the DOM form element, the jQuery form element is passed as only parameter. It must return the data for the AJAX request.
- _success_ (function), additional function or alternative to the **success** parameter. To be executed when the AJAX request returns successfully. The scope of the function is the dialog element.
- _remove_ (boolean) `false`, if set to `true` it will completely remove the dialog when it is closed. This option may be useful if the dialog’s content is loaded through AJAX and would otherwise accumulate in the DOM. If the Dialog option `close` is already set, this option is ignored.

## Translating Labels

The plugin contains a simple translation lookup that maps the labels to several languages. Currently there is only the translation for German built-in. The dictionaries are stored in `jQuery.fn.formDialog.dictionary`. To add/replace a dictionary define:

```javascript
$.fn.formDialog.<language> = {
    Save: <translation>,
    Cancel: <translation>,
    Error: <translation>
};
```

If you use (a) different _actionLabel_, you’ll have to add that as well. If you use a label or a language that is not present in the dictionary, it will be returned unchanged.

By setting the _language_ option appropriately you can now translate the labels to the desired language.

## Error Handling

Not every AJAX call is successful. Sometimes the user data are invalid, sometimes the server goes bonkers. For those cases there are two error handlers built-in.

### Validation Errors

These errors happen when something is wrong with the supplied user data. 

For the validation error handler to kick in successfully, send an **HTTP 400** Status Code and a **JSON encoded object** according to

```json
{
	"error": [
		"general form error #1",
		"general form error #2"
	],
	"form": {
		"field_name_1": [
			"form field 1 error #1"
		],
		"field_name_2": [
			"form field 2 error #1",
			"form field 2 error #2"
		]
	}
}
```
Both the "error" and the "form" keys are optional. If there are messages defined for the "error" key, the plugin will put an unordered list of all the messages right at the beginning of the form. The messages under the "form" key will be put before the first form element of the same name as the form field key. Even if there is only one error message per key, wrap it into an array.

### Server Errors

If there occurred a problem on the server that does not relate to the user data, send an **HTTP 500** Status Code and a **plain text error message**. The plugin will close the current dialog and open a separate dialog containing the error message.

## Examples

Setting up a comment popup that saves the comment through a REST API when you hit the 'Save' button.
```html
<form action="/api/endpoint" method="post" id="api-call" title="Your comment">
	<textarea name="comment"></textarea>
</form>
```
```javascript
$('#api-call').formDialog(function () {
	alert('Comment saved.');
});

$('#some-button').on('click', function (evt) {
	$('#api-call').dialog('open');
});
```

Alternatively, you can fetch the form element via AJAX.
```javascript
$.get('/path/to/dialog.inc.html', function (html) {
	$(html).formDialog({ 
		autoOpen: true,
		remove: true
	}, function () {
		alert('Comment saved');
	});
})
```

Defining dialog/plugin options.
```javascript
$('#dialog').formDialog({
    width: 600,      // Dialog option
    language: 'de'   // Plugin option
});
```

Defining dialog options in the dialog element.
```html
<form action="/api/endpoint" method="post" data-width="420" data-max-height="700" data-show="true">
	<textarea name="comment"></textarea>
</form>
```
Through appropriate data attributes you can pre-set any jQueryUI Dialog option that accepts a primitive value (strings, numbers, booleans). Be aware however that this will be overridden by any option you pass into the plugin.

## Notes

### Default form actions

You might add `onsubmit="return false;"` to avoid accidentally submitting the form when pressing the enter key.

### URL notations

Given that the page in question is `https://example.com/foo/index.html`, then browsers will resolve the following URL notations automatically.

- `some/script.php` => `https://example.com/foo/some/script.php`
- `/some/script.php` => `https://example.com/some/script.php`
- `//some/script.php` => `https://some/script.php`
