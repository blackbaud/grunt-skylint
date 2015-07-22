/* jshint node: true */

/*
 * grunt-skylint
 * https://github.com/paulcr/grunt-skylint
 *
 * Copyright (c) 2015 Paul Crowder
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
    'use strict';
    
    var asset,
        errorCount = 0,
        path = require('path'),
        phantomjs = require('grunt-lib-phantomjs').init(grunt),
        q = require('q'),
        request = require('request');
    
    function downloadFile(url) {
        var deferred = q.defer();
        
        grunt.verbose.writeln('Downloading file "' + url + '"...');
        
        request(url, function (error, response, body) {
            if (error) {
                grunt.verbose.writeln('Failed to download file "' + url + '".');
                deferred.reject(error);
            } else {
                grunt.verbose.writeln('File "' + url + '" downloaded successfully.');
                deferred.resolve(body);
            }
        });
        
        return deferred.promise;
    }
    
    function downloadFiles(linterUrl) {
        return q.all([
            downloadFile('https://code.jquery.com/jquery-2.1.4.min.js'),
            downloadFile(linterUrl)
        ]);
    }
    
    asset = path.join.bind(null, __dirname, '..');
          
    phantomjs.on('skylint.ok', function (msg) {
        grunt.log.writeln(msg);
    });
    
    phantomjs.on('skylint.log', function (msg) {
        grunt.log.writeln(msg);
    });

    phantomjs.on('skylint.error', function (msg) {
        errorCount++;
        grunt.log.error(msg);
    });

    phantomjs.on('skylint.done', function () {
        phantomjs.halt();
    });
    
    // Built-in error handlers.
    phantomjs.on('fail.load', function (url) {
        phantomjs.halt();
        grunt.warn('PhantomJS unable to load URL.');
    });

    phantomjs.on('fail.timeout', function () {
        phantomjs.halt();
        grunt.warn('PhantomJS timed out.');
    });
    
    grunt.registerMultiTask('skylint', 'A code analysis tool for validating components built with the Sky library.', function () {
        var contents = [],
            done = this.async(),
            files = this.filesSrc,
            hostHtml = grunt.file.read(asset('assets/host.html')),
            options = this.options();
        
        if (!options.linterUrl) {
            grunt.log.error('You must specify a URL to a valid linter file.');
            done(false);
            return;
        }
        
        downloadFiles(options.linterUrl).then(function (js) {
            var version = grunt.file.readJSON(asset('package.json')).version;
            
            grunt.verbose.writeln('Dependent files downloaded.  Injecting script into host HTML...');
            
            hostHtml = hostHtml.replace(
                '//SCRIPT', 
                'var GRUNT_PKG_VERSION = \'' + version + '\';\n' + js.join('\n')
            );

            grunt.verbose.writeln('Reading files to lint...');
            
            files.forEach(function (filepath) {
                if (grunt.file.exists(filepath)) {
                    grunt.verbose.writeln('Adding file "' + filepath + '" to files to lint...');
                    contents.push('<div class="thing-to-test" data-path="' + filepath + '">', grunt.file.read(filepath), '</div>');
                } else {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                }
            });

            hostHtml = hostHtml.replace(/<!--HTML-->/gi, contents.join('\n'));

            grunt.verbose.writeln('Writing files to lint to tmp file...');
            
            grunt.file.write(asset('tmp/host.html'), hostHtml);

            grunt.verbose.writeln('Launching PhantomJS to lint files...');
            
            phantomjs.spawn(asset('tmp/host.html'), {
                done: function (err) {
                    if (err) {
                        grunt.verbose.writeln('Error occurred linting files.  ' + err);
                    }
                    
                    done(err || errorCount === 0);
                }
            });
        }, function (err) {
            grunt.log.error('Error occurred linting files.  ' + err);
            done(false);
        });
    });
};
