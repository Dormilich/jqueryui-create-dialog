/*
======== A Handy Little QUnit Reference ========
  http://api.qunitjs.com/

  Test methods:
    module(name, {[beforeEach][, afterEach]})
    test(name, callback)
  Test assertions:
    expect(numberOfAssertions)
    async()
    ok(value, [message])
    notOk(value, [message])
    equal(actual, expected, [message])
    notEqual(actual, expected, [message])
    deepEqual(actual, expected, [message])
    notDeepEqual(actual, expected, [message])
    strictEqual(actual, expected, [message])
    notStrictEqual(actual, expected, [message])
    throws(block, [expected], [message])
*/

(function (window, document, QUnit, $) {

    QUnit.begin(function () {
        $.mockjax({
            url: /\/ajax\/success$/,
            responseTime: 50,
            responseText: 'success'
        });
        $.mockjax({
            url: /\/ajax\/error\/400$/,
            status: 400,
            responseTime: 50,
            responseText: {
                error: ['operation cancelled'],
                form: {
                    test: ['invalid value']
                }
            }
        });
        $.mockjax({
            url: /\/ajax\/error\/500$/,
            status: 500,
            responseTime: 50,
            responseText: 'internal server error'
        });
    });

    QUnit.done(function () {
        $.mockjax.clear();
    });

    QUnit.module('basics', {
        beforeEach: function() {
            this.elems = $('#qunit-fixture').children();
        }
    });

    QUnit.test('is chainable', function (assert) {
        assert.expect(1);
        // Not a bad test to run on collection methods.
        assert.strictEqual(this.elems.formDialog(), this.elems, 'should be chainable');
    });

    QUnit.module('buttons');

    QUnit.test('button properties', function (assert) {
        assert.expect(3);

        var element = $('<div></div>').formDialog(),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.length, 2, 'dialog should have 2 buttons');
        assert.equal(btn.eq(0).text(), 'Save', 'submit button should be named "Save"');
        assert.equal(btn.eq(1).text(), 'Cancel', 'abort button should be named "Cancel"');
    });

    QUnit.test('custom button label', function (assert) {
        assert.expect(1);

        var element = $('<div></div>').formDialog({ actionLabel: 'FizzBuzz' }),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'FizzBuzz', 'submit button should have custom label');
    });

    QUnit.test('translate button label', function (assert) {
        assert.expect(2);

        var element = $('<div></div>').formDialog({ language: 'de' }),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'Speichern', 'submit button label should be translated');
        assert.equal(btn.eq(1).text(), 'Abbrechen', 'abort button label should be translated');
    });

    QUnit.test('cancel button', function (assert) {
        assert.expect(2);

        var element = $('<div></div>').formDialog({ autoOpen: true }),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');

        assert.ok(element.dialog('isOpen'), 'dialog should be open');
        btn.eq(1).trigger('click');
        assert.notOk(element.dialog('isOpen'), 'dialog should be closed');
    });

    QUnit.module('global dialog options');

    QUnit.test('autoOpen', function (assert) {
        var element;
        assert.expect(2);

        element = $('<div></div>').formDialog();
        assert.notOk(element.dialog("widget").is(":visible"), 'dialog should not be open by default');
        element.remove();

        element = $('<div></div>').formDialog({ autoOpen: true });
        assert.ok(element.dialog("widget").is(":visible"), 'dialog should be open by default');
        element.remove();
    });

    QUnit.test('width', function (assert) {
        assert.expect(1);

        var element = $('<div></div>').formDialog({ autoOpen: true });
        // this may need tweaking as there should be a 1px deviation allowed
        assert.strictEqual(element.dialog("widget").width(), 500, 'default width should be 500px');
        element.remove();
    });

    // "save" button actions
    QUnit.module('AJAX');

    QUnit.test('wrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-1').formDialog(function (text) {
            assert.equal(text, 'success', 'should have a success message');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    QUnit.test('unwrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-2').formDialog(function (text) {
            assert.equal(text, 'success', 'should have a success message');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    QUnit.test('server error', function (assert) {

        var done = assert.async();
        assert.expect(4);

        var element = $('<form action="/ajax/error/500" method="post"></form>').formDialog();

        $(document).one('ajaxComplete', function () {
            var popup = $('.ui-dialog pre');
            assert.strictEqual(element.dialog('isOpen'), false, 'form dialog should be closed');
            assert.strictEqual(popup.length, 1, 'error popup should be created');
            assert.strictEqual(popup.text(), 'internal server error', 'should be using correct error message');

            popup.dialog('close');
            assert.strictEqual($('pre').length, 0, 'error popup should be removed');

            done();
        });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    QUnit.test('validation error', function (assert) {
        var done = assert.async();
        assert.expect(6);

        var element = $('<form action="/ajax/error/400" method="post"><input name="test"></form>').formDialog();

        $(document).one('ajaxComplete', function () {
            var popup = $('.ui-dialog pre');
            assert.strictEqual(popup.length, 0, 'there should be no error popup');
            assert.strictEqual(element.dialog('isOpen'), true, 'form dialog should be open');

            var errors = element.find('ul.error');
            assert.strictEqual(errors.length, 2, 'form dialog should have 2 error notes');

            assert.equal(errors.eq(0).text(), 'operation cancelled', '1st error should be general');
            assert.equal(errors.eq(1).text(), 'invalid value', '2nd error should be specific');

            var sibling_name = errors.eq(1).next().prop('name');
            assert.equal(sibling_name, 'test', 'specific error should be before form field');

            element.dialog('close');

            done();
        });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

}(window, document, QUnit, jQuery));
