'use strict';

let Utils = require('@superbalist/js-pubsub').Utils;

/**
 * @callback subscriberCallback
 * @param {*} message - The message payload received
 */

/**
 * RedisPubSubAdapter Class
 *
 * @implements {module:@superbalist/js-pubsub.PubSubAdapterInterface}
 * @example
 * let redis = require('redis');
 * let RedisPubSubAdapter = require('@superbalist/js-pubsub-redis');
 *
 * // create adapter
 * let client = redis.createClient({
 *   host: 'redis',
 *   port: 6379,
 * });
 *
 * let adapter = new RedisPubSubAdapter(client);
 */
class RedisPubSubAdapter {
  /**
   *
   * @param {RedisClient} client
   */
  constructor(client) {
    /**
     * @type {RedisClient}
     */
    this.client = client;
  }

  /**
   * Subscribe a handler to a channel.
   *
   * @param {string} channel
   * @param {subscriberCallback} handler - The callback to run when a message is received
   * @example
   * adapter.subscribe('my_channel', (message) => {
   *   console.log(message);
   * });
   */
  subscribe(channel, handler) {
    this.client.on('message', (c, message) => {
      if (c === channel) {
        handler(Utils.unserializeMessagePayload(message));
      }
    });

    this.client.subscribe(channel);
  }

  /**
   * Publish a message to a channel.
   *
   * @param {string} channel
   * @param {*} message - The message payload
   * @example
   * // publish a string
   * adapter.publish('my_channel', 'Hello World');
   *
   * // publish an object
   * adapter.publish('my_channel', {
   *   'id': 1234,
   *   'first_name': 'Matthew',
   * });
   */
  publish(channel, message) {
    this.client.publish(channel, Utils.serializeMessagePayload(message));
  }

  /**
   * Publish multiple messages to a channel.
   *
   * @param {string} channel
   * @param {*[]} messages
   * @example
   * let messages = [
   *   'message 1',
   *   'message 2',
   * ];
   * adapter.publishBatch('my_channel', messages);
   */
  publishBatch(channel, messages) {
    for (let message of messages) {
      this.publish(channel, message);
    }
  }
}

module.exports = RedisPubSubAdapter;

