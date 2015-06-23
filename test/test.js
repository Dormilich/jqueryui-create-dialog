(function($) {
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

}(jQuery));
