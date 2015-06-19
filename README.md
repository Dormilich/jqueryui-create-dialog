# jQueryUI formDialog
Create preconfigured jQueryUI dialog forms.

## Plugin options

- **language** (string) `"en"`<br>
The laguage used to translate buttons and labels.

- **autoClose** (boolean) `true`<br>
Set this option to `true` if the dialog should automatically close if the AJAX request succeeds.

- **actionLabel** (string) `"Save"`<br>
The label for the submit button.

- **success** (function)<br>
A callback to be executed when the AJAX request succeeds.

## Setting options

The options can be passed in different ways:

- changing the global default settings

```JavaScript
$.fn.formDialog.defaults.width = 400;
```

- passing via the options object on creation

```JavaScript
$('#dialog').formDialog({
    width: 400
});
```

- setting dialog options through data attributes on the element

```HTML
<div id="dialog" data-width="400" title="Dialog Form">
    <!-- ... -->
</div>
```
