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

  module('formDialog: basics', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.formDialog(), this.elems, 'should be chainable');
  });

  module('formDialog: buttons');

  test('button properties', function () {
    expect(3);

    var element = $('<div></div>').formDialog(),
        btn = element.dialog('widget').find('.ui-dialog-buttonpane button');

    equal(btn.length, 2, 'number of buttons');
    equal(btn.eq(0).text(), 'Save');
    equal(btn.eq(1).text(), 'Cancel');
  });

}(jQuery));
