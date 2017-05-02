"use strict";

var Utils = require('@superbalist/js-pubsub').Utils;

class RedisPubSubAdapter {
  constructor(client) {
    this.client = client;
  }

  subscribe(channel, handler) {
    this.client.on('message', (channel, message) => {
      handler(Utils.unserializeMessagePayload(message));
    });

    this.client.subscribe(channel);
  }

  publish(channel, message) {
    this.client.publish(channel, message);
  }
}

module.exports = RedisPubSubAdapter;

