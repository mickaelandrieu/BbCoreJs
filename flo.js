var flo = require('fb-flo'),
    path = require('path'),
    fs = require('fs');

var server = flo(
  'src/',
  {
    port: 8888,
    host: 'localhost',
    verbose: false,
    glob: [
      '**/*.js',
    ]
  },
  function resolver(filepath, callback) {
    // 1. Call into your compiler / bundler.
    // 2. Assuming that `bundle.js` is your output file, update `bundle.js`
    //    and `bundle.css` when a JS or CSS file changes.
    console.log(filepath);
    filepath = 'src/' + filepath;
    callback({
      resourceURL: 'resources/toolbar/' + filepath,
      // any string-ish value is acceptable. i.e. strings, Buffers etc.
      contents: fs.readFileSync(filepath),
      update: function(_window, _resourceURL) {
        // this function is executed in the browser, immediately after the resource has been updated with new content
        // perform additional steps here to reinitialize your application so it would take advantage of the new resource
        console.log("Resource " + _resourceURL + " has just been updated with new content");
        _window.require.undef(_resourceURL);
        _window.require.undef('tb.core');
        _window.require(['tb.core'], {});
        _window.require([_resourceURL], {});
      }
    });
  }
);