'use strict';

let Utils = require('@superbalist/js-pubsub').Utils;
let bluebird = require('bluebird');

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
    if (typeof client.publishAsync !== 'function') {
      client = bluebird.promisifyAll(client);
    }
    this.client = client;
  }

  /**
   * Subscribe a handler to a channel.
   *
   * @param {string} channel
   * @param {subscriberCallback} handler - The callback to run when a message is received
   * @return {Promise<*>}
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
   * @return {Promise<*>}
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
      return this.client.publishAsync(channel, Utils.serializeMessagePayload(message));
  }

  /**
   * Publish multiple messages to a channel.
   *
   * @param {string} channel
   * @param {*[]} messages
   * @return {Promise<*>}
   * @example
   * let messages = [
   *   'message 1',
   *   'message 2',
   * ];
   * adapter.publishBatch('my_channel', messages);
   */
  publishBatch(channel, messages) {
    let promises = [];

    for (let message of messages) {
      promises.push(this.publish(channel, message));
    }

    return Promise.all(promises);
  }
}

module.exports = RedisPubSubAdapter;

