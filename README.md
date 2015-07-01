# Form Dialog

Create preconfigured jQueryUI dialog forms.

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

**success** a function executed when the AJAX request returns successfully. It takes the same parameters as the jQuery AJAX success handler. The scope of the function is the dialog element.

**options** can be any jQueryUI Dialog option.

Additionally, there are plugin specific options:

- _language_ (string) `"en"`, a language abbreviation to translate buttons and labels. See Translating Labels
- _actionLabel_ (string) `"Save"`, the label for the submit button
- _autoClose_ (boolean) `true`, set to `true` if the dialog should be automatically closed if the AJAX request returns successfully
- _formData_ (function), a function that converts the form data into a data type (usually an URL encoded string or plain object) that `jQuery.ajax()` can handle. The scope of the function is the DOM form element, the jQuery form element is passed as only parameter. It must return the data for the AJAX request.
- _success_ (function), additional function or alternative to the **success** parameter. To be executed when the AJAX request returns successfully. The scope of the function is the dialog element.

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

By setting the _language_ appropriately option you can now translate the labels to the desired language.

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
