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

(function (window, document, QUnit, $, sinon) {

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

    QUnit.module('global dialog options', {
        beforeEach: function () {
            this.elem = $('<div><form></form></div>');
        },
        afterEach: function () {
            this.elem.remove();
        }
    });

    QUnit.test('autoOpen: true', function (assert) {
        assert.expect(1);

        this.elem.formDialog({ autoOpen: true });
        assert.ok(this.elem.dialog("widget").is(":visible"), 'dialog should be open by default');
    });

    QUnit.test('autoOpen: false', function (assert) {
        assert.expect(1);

        this.elem.formDialog({ autoOpen: false });
        assert.notOk(this.elem.dialog("widget").is(":visible"), 'dialog should not be open by default');
    });

    QUnit.test('autoOpen: default', function (assert) {
        assert.expect(1);

        this.elem.formDialog();
        assert.notOk(this.elem.dialog("widget").is(":visible"), 'dialog should not be open by default');
    });

    QUnit.test('width', function (assert) {
        assert.expect(1);

        this.elem.formDialog({ autoOpen: true });
        assert.close(this.elem.dialog("widget").width(), 500, 1, 'default width should be 500px');
    });

    QUnit.module('plugin options');

    QUnit.test('remove', function (assert) {
        assert.expect(3);

        var num_dialogs = $('.ui-dialog').length;

        var elem = $('<div id="kill-la-kill"/>').formDialog({
            autoOpen: true,
            remove: true
        });

        assert.ok(elem.dialog('isOpen'), 'should be open');
        elem.dialog('close');
        assert.strictEqual($('#kill-la-kill').length, 0, 'should be removed');
        assert.strictEqual($('.ui-dialog').length, num_dialogs, 'should not leave a dialog');
    });

    QUnit.module('buttons', {
        beforeEach: function () {
            this.elem = $('<div><form></form></div>');
        },
        afterEach: function () {
            this.elem.remove();
        }
    });

    QUnit.test('default buttons', function (assert) {
        var btn;
        assert.expect(3);

        this.elem.formDialog();
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.length, 2, 'dialog should have 2 buttons');
        assert.equal(btn.eq(0).text(), 'Save', 'submit button should be named "Save"');
        assert.equal(btn.eq(1).text(), 'Cancel', 'abort button should be named "Cancel"');
    });

    QUnit.test('no form no buttons', function (assert) {
        var btn, elem;
        assert.expect(1);

        elem = $('<div></div>').formDialog();
        btn = elem.dialog('widget').find('.ui-dialog-buttonpane button');

        assert.strictEqual(btn.length, 0, 'should have no buttons');
        elem.remove();
    });

    QUnit.test('custom button label', function (assert) {
        var btn;
        assert.expect(1);

        this.elem.formDialog({ actionLabel: 'FizzBuzz' });
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'FizzBuzz', 'submit button should have custom label');
    });

    QUnit.test('translate button label', function (assert) {
        var btn;
        assert.expect(2);

        this.elem.formDialog({ language: 'de' });
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.eq(0).text(), 'Speichern', 'submit button label should be translated');
        assert.equal(btn.eq(1).text(), 'Abbrechen', 'abort button label should be translated');
    });

    QUnit.test('cancel button', function (assert) {
        var btn;
        assert.expect(2);

        this.elem.formDialog({ autoOpen: true });
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');

        assert.ok(this.elem.dialog('isOpen'), 'dialog should be open');
        btn.eq(1).trigger('click');
        assert.notOk(this.elem.dialog('isOpen'), 'dialog should be closed');
    });

    QUnit.test('additional buttons (object)', function (assert) {
        var btn;
        assert.expect(4);

        this.elem.formDialog({
            buttons: {
                Edit: function () {}
            }
        });
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.length, 3, 'dialog should have 3 buttons');
        assert.equal(btn.eq(0).text(), 'Edit', '1st button should be named "Edit"');
        assert.equal(btn.eq(1).text(), 'Save', '2nd button should be named "Save"');
        assert.equal(btn.eq(2).text(), 'Cancel', '3rd button should be named "Cancel"');
    });

    QUnit.test('additional buttons (array)', function (assert) {
        var btn;
        assert.expect(4);

        this.elem.formDialog({
            buttons: [{
                text: 'Edit',
                click: function () {}
            }]
        });
        btn = this.elem.dialog('widget').find('.ui-dialog-buttonpane button');
        
        assert.equal(btn.length, 3, 'dialog should have 3 buttons');
        assert.equal(btn.eq(0).text(), 'Edit', '1st button should be named "Edit"');
        assert.equal(btn.eq(1).text(), 'Save', '2nd button should be named "Save"');
        assert.equal(btn.eq(2).text(), 'Cancel', '3rd button should be named "Cancel"');
    });

    QUnit.module('self configuration', {
        beforeEach: function () {
            this.elems = $('#qunit-fixture').children();
        },
        afterEach: function () {
            this.elems.dialog('destroy');
        }
    });

    QUnit.test('individual config', function (assert) {
        var fd1 = $('#form-3');
        var fd2 = $('#form-4');
        assert.expect(9);

        this.elems.formDialog();

        //fd1.dialog('open');
        assert.equal(fd1.dialog('option', 'appendTo'), fd1.data('appendTo'), 'appendTo option should be same as attribute');
        assert.equal(fd1.dialog('widget').parent()[0], $(fd1.data('appendTo'))[0], 'container should match option');

        assert.equal(fd1.dialog('option', 'width'), fd1.data('width'), 'width option should be same as attribute');
        assert.close(fd1.dialog('widget').width(), fd1.data('width'), 1, 'width should be 400px');

        assert.equal(fd1.dialog('option', 'maxHeight'), fd1.data('maxHeight'), 'maxHeight option should be same as attribute');
        assert.equal(fd1.dialog('option', 'hide'), fd1.data('hide'), 'hide option should be same as attribute');
        fd1.dialog('close');

        fd2.dialog('open');
        assert.equal(fd2.dialog('option', 'maxWidth'), fd2.data('maxWidth'), 'maxWidth option should be same as attribute');
        assert.equal(fd2.dialog('option', 'minHeight'), fd2.data('minHeight'), 'minHeight option should be same as attribute');
        assert.equal(fd2.dialog('option', 'show'), fd2.data('show'), 'show option should be same as attribute');
        fd2.dialog('close');
    });

    QUnit.test('option precedence', function (assert) {
        var fd = $('#form-3');
        assert.expect(2);

        this.elems.formDialog({
            width: 200
        });

        assert.equal(fd.dialog('option', 'width'), 200, 'option should overwrite attribute');
        assert.close(fd.dialog('widget').width(), 200, 1, 'width should be 200px');
        fd.dialog('close');
    });

    // "save" button actions
    QUnit.module('AJAX', {
        beforeEach: function () {
            this.server = sinon.fakeServer.create();
            // success
            this.server.respondWith(/\/ajax\/success/, [200, {
                "Content-Type": "text/plain"
            }, 'success']);
            // server error
            this.server.respondWith(/\/ajax\/error\/500/, [500, {
                "Content-Type": "text/plain"
            }, 'internal server error']);
            // custom error
            this.server.respondWith(/\/ajax\/error\/404/, [404, {
                "Content-Type": "text/plain"
            }, 'this file does not exist']);
            // validation error
            this.server.respondWith(/\/ajax\/error\/400/, [400, {
                "Content-Type": "application/json"
            }, '{"error":["operation cancelled"],"form":{"test":["invalid value"]}}']);
            this.server.respondWith(/\/ajax\/form\/400/, [400, {
                "Content-Type": "application/json"
            }, '{"error":["operation cancelled"]}']);
            this.server.respondWith(/\/ajax\/input\/400/, [400, {
                "Content-Type": "application/json"
            }, '{"form":{"test":["invalid value"]}}']);
        },
        afterEach: function () {
            this.server.restore();
        }
    });

    QUnit.test('wrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-1').formDialog(function (txt) {
            assert.strictEqual(txt, 'success', 'should have success message');
            done();
        });

        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('unwrapped form', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-2').formDialog(function (txt) {
            assert.strictEqual(txt, 'success', 'should have success message');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('autoClose: true', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-2').formDialog({
            autoOpen: true,
            autoClose: true
        }, function () {
            assert.notOk(this.dialog('isOpen'), 'should have closed');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();        
    });

    QUnit.test('autoClose: false', function (assert) {
        var done = assert.async();
        assert.expect(1);

        var element = $('#form-2').formDialog({
            autoOpen: true,
            autoClose: false
        }, function () {
            assert.ok(this.dialog('isOpen'), 'should stay open');
            this.dialog('close');
            done();
        });
        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();        
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

        element.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
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
        this.server.respond();
    });

    QUnit.test('form validation error', function (assert) {
        var done = assert.async();
        assert.expect(2);

        var element = $('<form action="/ajax/form/400" method="post"><input name="test"></form>').formDialog();

        $(document).one('ajaxComplete', function () {
            var errors = element.find('ul.error');
            assert.strictEqual(errors.length, 1, 'form dialog should have 1 error note');
            assert.equal(errors.eq(0).text(), 'operation cancelled', 'error should be general');

            element.dialog('close');
            done();
        });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('input validation error', function (assert) {
        var done = assert.async();
        assert.expect(3);

        var element = $('<form action="/ajax/input/400" method="post"><input name="test"></form>').formDialog();

        $(document).one('ajaxComplete', function () {
            var errors = element.find('ul.error');
            assert.strictEqual(errors.length, 1, 'form dialog should have 1 error note');
            assert.equal(errors.eq(0).text(), 'invalid value', 'error should be specific');

            var sibling_name = errors.eq(0).next().prop('name');
            assert.equal(sibling_name, 'test', 'specific error should be before form field');

            element.dialog('close');
            done();
        });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('form data processor', function (assert) {
        var done = assert.async(),
            server = this.server,
            html = '<form action="/ajax/success" method="post"><input name="test" value="foo"></form>';
        assert.expect(5);

        var element = $(html).formDialog({
            formData: function (form) {
                assert.ok(this instanceof HTMLFormElement, 'scope should be form element');
                // 'jQuery' has been removed from the global scope
                assert.ok(form instanceof $, 'parameter should be jQuery object');
                assert.ok(form[0] instanceof HTMLFormElement, 'parameter should be jQuery form element');

                return 'test=bar';
            },
            success: function (txt) {
                assert.strictEqual(txt, 'success', 'should have success message');
                assert.strictEqual(server.requests[0].requestBody, 'test=bar', 'should have modified request body');
                done();
            }
        });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('custom error handler', function (assert) {
        var done = assert.async(),
            html = '<form action="/ajax/error/404" method="post"><input name="test" value="foo"></form>';
        assert.expect(1);

        var element = $(html).formDialog({ ajax: { statusCode: { 404: function (jqXHR) {
            assert.ok(jqXHR.responseText === 'this file does not exist', 'should receive correct message');
            done();
        } } } });

        element.dialog('open').dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

    QUnit.test('auto-reset form on submit', function (assert) {
        var form, done = assert.async();
        assert.expect(4);

        form = $('#form-5').formDialog({
            appendTo: '#qunit-fixture'
        }, function () {
            assert.equal($('#form-5-1').val(), '1', 'first field should be reset');
            assert.equal($('#form-5-2').val(), 'xxx', 'second field should be reset');
            done();
        });

        $('#form-5-1').val(20);
        assert.equal($('#form-5-1').val(), '20', 'first field should be changed');
        $('#form-5-2').val('yy');
        assert.equal($('#form-5-2').val(), 'yy', 'second field should be chenged');

        form.dialog('widget').find('.ui-dialog-buttonpane button').eq(0).trigger('click');
        this.server.respond();
    });

}(window, document, QUnit, jQuery, window.sinon));
