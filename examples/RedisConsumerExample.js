'use strict';

let redis = require('redis');
let RedisPubSubAdapter = require('../lib/RedisPubSubAdapter');

let client = redis.createClient({
  host: 'redis',
  port: 6379,
});

let adapter = new RedisPubSubAdapter(client);
adapter.subscribe('my_channel', (message) => {
  console.log(message);
  console.log(typeof message);
});

