/*jshint node: true */

(function () {
    'use strict';

    var grunt = require('grunt');

    /*
      ======== A Handy Little Nodeunit Reference ========
      https://github.com/caolan/nodeunit

      Test methods:
        test.expect(numAssertions)
        test.done()
      Test assertions:
        test.ok(value, [message])
        test.equal(actual, expected, [message])
        test.notEqual(actual, expected, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
    */

    exports.skylint = {
        setUp: function (done) {
            // setup here if necessary
            grunt.file.delete('tmp/*.*');
            done();
        },

        writesHostFile: function (test) {
            test.expect(3);
            
            grunt.util.spawn({
                grunt: true,
                args: ['skylint:test']
            }, function (err, result) {
                var contents;
                
                test.ok(grunt.file.exists('tmp/host.html'), true, 'The host HTML file should have been written to tmp folder.');
                
                contents = grunt.file.read('tmp/host.html') || '';
                
                test.notEqual(contents, '', 'The host HTML file should have valid contents.');
                
                test.equal(contents.indexOf('<!--#SKYLINT_HTML-->'), -1, 'The host HTML file\'s HTML placeholder should be replaced with the downloaded script.');
            
                test.done();
            });
        },

        findsErrors: function (test) {
            test.expect(1);
            
            grunt.util.spawn({
                grunt: true,
                args: ['skylint:test']
            }, function (err, result) {
                result = result.toString();
                
                test.notEqual(result.indexOf('7 error(s) were found in "test/fixtures/test.html"'), -1, 'Errors should be found.');
                
                test.done();
            });
        }
    };
}());