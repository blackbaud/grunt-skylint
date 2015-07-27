# grunt-skylint

> A code analysis tool for validating components built with the Sky library.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git+https://github.com/blackbaud/grunt-skylint --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-skylint');
```

## The "skylint" task

### Overview
In your project's Gruntfile, add a section named `skylint` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  skylint: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.linterUrl
Type: `String`

Required.  The URL to the Skylint file to use to validate your code.  While the Grunt task reports on validation errors, the actual validation
logic takes place in code that is bundled with the Sky distribution.  This allows you to continue to upgrade Sky in your product and have the 
Grunt task point to the version of Sky that your product is currently on.

### Usage Examples

#### Linting all HTML files in a directory
In this example, all files with an `.html` file extension in the `src` directory will be linted.

```js
grunt.initConfig({
  skylint: {
    options: {
      linterUrl: 'http://localhost:8080/sky/dist/skylint.min.js'
    },
    files: ['src/**/*.html'],
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
