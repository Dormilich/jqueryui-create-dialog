(function($, window) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

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

    QUnit.module('formDialog: basics', {
        // This will run before each test in this module.
        setup: function() {
            this.elems = $('#qunit-fixture').children();
        }
    });

    QUnit.test('is chainable', function (assert) {
        assert.expect(1);
        // Not a bad test to run on collection methods.
        assert.strictEqual(this.elems.formDialog(), this.elems, 'should be chainable');
    });

    QUnit.module('formDialog: buttons');

    QUnit.test('button properties', function (assert) {
        assert.expect(3);

        var element = $('<div></div>').formDialog(),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.length, 2, 'number of buttons');
        assert.equal(btn.eq(0).text(), 'Save', 'text of save button');
        assert.equal(btn.eq(1).text(), 'Cancel', 'text of cancel button');
    });

    QUnit.test('button label', function (assert) {
        assert.expect(1);

        var element = $('<div></div>').formDialog({ actionLabel: 'FizzBuzz' }),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'FizzBuzz', 'custom text of save button');
    });

    QUnit.test('translate label', function (assert) {
        assert.expect(2);

        var element = $('<div></div>').formDialog({ language: 'de' }),
            btn = element.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'Speichern', 'translated text of save button');
        assert.equal(btn.eq(1).text(), 'Abbrechen', 'translated text of cancel button');
    });

    QUnit.module('formDialog: AJAX');

    QUnit.test('wrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-wrapped').formDialog(function (text) {
            assert.equal(text, 'success', 'successful response');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    QUnit.test('unwrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-self').formDialog(function (text) {
            assert.equal(text, 'success', 'successful response');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    QUnit.test('server error', function (assert) {
        var done = assert.async();
        assert.expect(4);

        var element = $('#form-500').formDialog();

        $(window.document).ajaxComplete(function () {
            var popup = $('.ui-dialog pre');
            assert.strictEqual(element.dialog('isOpen'), false, 'form dialog closed');
            assert.strictEqual(popup.length, 1, 'error popup created');
            assert.strictEqual(popup.text(), 'internal server error', 'using correct error message');

            popup.dialog('close');
            assert.strictEqual($('pre').length, 0, 'error popup removed');

            done();
        });

        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
    });

    //$.mockjax.clear();

}(jQuery, window));
