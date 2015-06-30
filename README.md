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
_(Coming soon)_

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
