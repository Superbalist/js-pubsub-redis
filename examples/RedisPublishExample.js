"use strict";

var redis = require('redis');
var RedisPubSubAdapter = require('../src/RedisPubSubAdapter');

let client = redis.createClient({
  host: 'redis',
  port: 6379
});

let adapter = new RedisPubSubAdapter(client);
adapter.publish('my_channel', '{"first_name":"Matthew"}');
adapter.publish('my_channel', 'Hello World');

client.quit();

