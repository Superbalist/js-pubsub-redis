# @superbalist/js-pubsub-redis

A Redis adapter for the [js-pubsub](https://github.com/Superbalist/js-pubsub) package.

[![Author](http://img.shields.io/badge/author-@superbalist-blue.svg?style=flat-square)](https://twitter.com/superbalist)
[![Build Status](https://img.shields.io/travis/Superbalist/js-pubsub-redis/master.svg?style=flat-square)](https://travis-ci.org/Superbalist/js-pubsub-redis)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@superbalist/js-pubsub-redis.svg)](https://www.npmjs.com/package/@superbalist/js-pubsub-redis)
[![NPM Downloads](https://img.shields.io/npm/dt/@superbalist/js-pubsub-redis.svg)](https://www.npmjs.com/package/@superbalist/js-pubsub-redis)


## Installation

```bash
npm install @superbalist/js-pubsub-redis
```
    
## Usage

```node
'use strict';

let redis = require('redis');
let RedisPubSubAdapter = require('@superbalist/js-pubsub-redis');

let client = redis.createClient({
  host: 'redis',
  port: 6379
});

let adapter = new RedisPubSubAdapter(client);

// consume messages
// note: this is a blocking call
adapter.subscribe('my_channel', (message) => {
  console.log(message);
  console.log(typeof message);
});

// publish messages
adapter.publish('my_channel', {first_name: 'Matthew'});
adapter.publish('my_channel', 'Hello World');

// publish multiple messages
let messages = [
  'message 1',
  'message 2',
];
adapter.publishBatch('my_channel', messages);
```

## Examples

The library comes with [examples](examples) for the adapter and a [Dockerfile](Dockerfile) for
running the example scripts.

Run `make up`.

You will start at a `bash` prompt in the `/usr/src/app` directory.

If you need another shell to publish a message to a blocking consumer, you can run `docker-compose run js-pubsub-redis /bin/bash`

To run the examples:
```bash
$ node examples/RedisConsumerExample.js
$ node examples/RedisPublishExample.js (in a separate shell)
```
