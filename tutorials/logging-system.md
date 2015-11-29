## Logging system
### Introduction
Orion provides its own logging system based on [Bunyan](https://github.com/trentm/node-bunyan).
Isomorphic, it allows you to use the same API wether you want to log information
on the client side or on the server side.

### Simple use
Though we recommend creating your own logger to discriminate your logs from the
one of Orion, you can easily use the default logger just like the [Console API](https://developer.chrome.com/devtools/docs/console-api):

* **trace**: Use it for tracking intermediary state information.
  ```js
  orion.log.trace('Simple trace level message', {value: true}, false);
  ```
* **debug**: Use it for debugging.
  ```js
  orion.log.debug('Simple debug level message', {value: true}, false);
  ```
* **info**: Use it for tracking relevant state or status information.
  ```js
  orion.log.info('Simple info level message', {value: true}, false);
  ```
* **warn**: Use it for warning when something goes wrong but is still properly managed by your application.
  ```js
  orion.log.warn('Simple warning level message', {value: true}, false);
  ```
* **error**: Use it for errors when something goes wrong and you've no certainty that you can keep a proper application behavior.
  ```js
  orion.log.error('Simple error level message', {value: true}, false);
  ```
* **fatal**: Use it for fatal errors when the situation cannot be recovered with a full reboot.
  ```js
  orion.log.fatal('Simple fatal level message', {value: true}, false);
  ```

### Setting the appropriate log level
You can remove set the log level using [Bunyan](https://github.com/trentm/node-bunyan)'s API. Here are some useful commands:
#### Remove all logs on Orion's default logger
```js
orion.log.level('none');
```
#### Set level for the Orion's default logger
```js
// For debug level and above
orion.log.level('debug');
...
// For info level and above
orion.log.level('info');
...
// For fatal only level
orion.log.level('fatal');
```

### Create your own logger
We recommend that you create your own logging system to discriminate your logs
from the ones of Orion so that it gets easier for you to check wether the issue
is within your application or caused by a misuse or an issue of Orion.

Within you application, just create a Javascript file that it sufficiently
prioritized so that you logger is available as soon as possible (see [Meteor's File Load Order](http://docs.meteor.com/#/full/structuringyourapp)).
A file named `lib/utils/priority/_logger.js` should be sufficiently prioritized.

As well as a default logger, Orion provides its default log formatter `orion.logFormatter` that you can
rely on for a simple logging strategy. Here's how to create your logger with the
default formatter and a default log level set on **info**:
```js
// Client and server side
myAppLog = new bunyan.createLogger({
  name: 'myApp',
  stream: orion.logFormatter,
  level: 'info'
});
```

Now wether you are client side or server side, you can use your logger like so:
```js
myAppLog.info('Simple info level message', myVar, 'any text', anyOtherObjectOrVar);
myAppLog.warn('Simple warning level message', myVar, 'any text', anyOtherObjectOrVar);
myAppLog.error('Simple error level message', myVar, 'any text', anyOtherObjectOrVar);
...
```

### Create you own formatter
Log formatter are the real power of [Bunyan](https://github.com/trentm/node-bunyan).
This is where you can implement all your logging strategies like:

* Sending your server's logs to a [logstash](https://www.elastic.co/products/logstash) server.
* Send an email when a specific log level has been executed.
* Sending your client's logs and your server's logs to a SaaS
  (ex. [Loggly](https://www.loggly.com/), [LogEntries](https://logentries.com), ...).
* Enabling logging strategy for a specific connected customer so that you can
  see what's this user has done within your application.
* ...

While being completely isomorphic in its API, the log formatter has to be written
differently depending on its execution context, client or server side as we depict
it afterwards. Both implementation must leverage the power of [Node's Stream](https://nodejs.org/api/stream.html).

> Thanks to [Browserify](http://browserify.org/) and [Cosmo's meteor package for browserify](https://github.com/elidoran/cosmos-browserify),
  the [Node's Stream](https://nodejs.org/api/stream.html) is available on client side making it isomorphic as well.

#### Client side log formatter
For this part, we are simply using the basic [Console API](https://developer.chrome.com/devtools/docs/console-api)
along with some colored styles thanks to [Log with style](https://www.npmjs.com/package/log-with-style)
which is also exposed by Orion.

On client side, Orion's log system exposes the following API:

* `bunyan`: [Bunyan](https://github.com/trentm/node-bunyan).
* `process`: [Browserified Node's process](https://www.npmjs.com/package/process).
* `WritableStream`: [Browserified Node's WritableStream](https://nodejs.org/api/stream.html#stream_class_stream_writable).
* `inherits`: [Browserified Node utils's inherits](https://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor).
* `logStyle`: [Log with style](https://www.npmjs.com/package/log-with-style) a simple set of colors and styles for [Console API](https://developer.chrome.com/devtools/docs/console-api).

One of the major advantage of using [Bunyan](https://github.com/trentm/node-bunyan)
is that all log informations are treated as streams of JSON objects. In this
formatter example we are using this capabilities to pick the appropriate value
that we want to display in your DevTools console.

```js
if (Meteor.isClient) {
  inherits(BrowserStdout, WritableStream);

  function BrowserStdout() {
    if (!(this instanceof BrowserStdout)) {
      return new BrowserStdout();
    }
    WritableStream.call(this);
  }

  BrowserStdout.prototype._write = function(chunks, encoding, cb) {
    var output = JSON.parse(chunks.toString ? chunks.toString() : chunks);
    var color = '[c="color: green"]';
    var level = 'INFO';
    if (output.level > 40) {
      color = '[c="color: red"]';
      if (output.level === 60) {
        level = 'FATAL';
      } else {
        level = 'ERROR';
      }
    } else if (output.level === 40) {
      color = '[c="color: orange"]';
      level = 'WARNING';
    } else if (output.level === 20) {
      level = 'DEBUG';
    } else if (output.level === 10) {
      level = 'TRACE';
    }
    logStyle(color + level + '[c] ' + '[c="color: blue"]' + output.name + '[c] ' + output.msg);
    process.nextTick(cb);
  };

  myLogFormatter = BrowserStdout();
}
```
Now we have our custom log formatter client side named `myLogFormatter`.

#### Server side log formatter
For this part, we are using an already made formatter available in the NPM registry: [Bunyan Format](https://www.npmjs.com/package/bunyan-format).

On server side, Orion's log system exposes the following API:

* `bunyan`: [Bunyan](https://github.com/trentm/node-bunyan).
* `bunyanFormat`: [Bunyan Format](https://www.npmjs.com/package/bunyan-format).

```js
if (Meteor.isServer) {
  myLogFormatter = bunyanFormat({outputMode: 'short', color: true});
}
```

Super easy. Of course, you can go pretty far using [Node's Stream](https://nodejs.org/api/stream.html)
and implement every use cases that would suit your logging strategies.

#### Using our custom formatter
Now that we have implemented our custom logger with the same name on the client
side as well as the server side, we can go back to isomorphic Javascript and
customize our logger with our shared `myLogFormatter`:

```js
// Client and server side
myAppLog = new bunyan.createLogger({
  name: 'myApp',
  stream: myLogFormatter
});
```

### Links
* Inspired from [Ongoworks's Bunyan](https://github.com/ongoworks/meteor-bunyan)
* [Bunyan](https://github.com/trentm/node-bunyan)
* [Bunyan Format](https://www.npmjs.com/package/bunyan-format)
* [Comparison between Winston and Bunyan](https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/)
* [Log with style](https://www.npmjs.com/package/log-with-style)
* [Node's Stream](https://nodejs.org/api/stream.html)
* [Handbook for Node's Stream](https://github.com/substack/stream-handbook)
