'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let redis = require('redis');
let RedisPubSubAdapter = require('../lib/RedisPubSubAdapter');

describe('RedisPubSubAdapter', () => {
  describe('construct instance', () => {
    it('should set the client property', () => {
      let client = sinon.createStubInstance(redis.RedisClient);
      let adapter = new RedisPubSubAdapter(client);
      expect(adapter.client).to.equal(client);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to messages on the channel', () => {
      let client = sinon.createStubInstance(redis.RedisClient);

      client.on = sinon.stub();
      client.subscribe = sinon.stub();

      let adapter = new RedisPubSubAdapter(client);

      let handler = sinon.spy();

      adapter.subscribe('my_channel', handler);

      sinon.assert.calledOnce(client.subscribe);
      sinon.assert.calledWith(client.subscribe, 'my_channel');

      sinon.assert.calledOnce(client.on);
      sinon.assert.calledWith(client.on, 'message');
    });

    it('should pass the message to the handler when a message is received', () => {
      let client = sinon.createStubInstance(redis.RedisClient);

      client.on = sinon.stub();
      client.subscribe = sinon.stub();

      let adapter = new RedisPubSubAdapter(client);

      let handler = sinon.spy();

      adapter.subscribe('my_channel', handler);

      client.on.yield('my_channel', '"Hello World!"');

      sinon.assert.calledOnce(handler);
      sinon.assert.calledWith(handler, 'Hello World!');
    });

    it('should pass an unserialized message to the handler when a message is received', () => {
      let client = sinon.createStubInstance(redis.RedisClient);

      client.on = sinon.stub();
      client.subscribe = sinon.stub();

      let adapter = new RedisPubSubAdapter(client);

      let handler = sinon.spy();

      adapter.subscribe('my_channel', handler);

      client.on.yield('my_channel', '"Hello World!"');
      client.on.yield('my_channel', '{"hello":"world"}');

      sinon.assert.calledTwice(handler);

      sinon.assert.calledWith(handler, 'Hello World!');
      sinon.assert.calledWith(handler, {hello: 'world'});
    });
  });

  describe('publish', () => {
    it('should publish the message to a channel', () => {
      let client = sinon.createStubInstance(redis.RedisClient);

      client.publishAsync = sinon.stub();
      client.publishAsync.onCall(0)
        .returns('result1');
      client.publishAsync.onCall(1)
        .returns('result2');

      let adapter = new RedisPubSubAdapter(client);

      let promises = [];

      promises.push(adapter.publish('my_channel', 'Hello World!'));
      promises.push(adapter.publish('another_channel', {hello: 'world'}));

      return Promise.all(promises).then((results) => {
        sinon.assert.calledTwice(client.publishAsync);
        sinon.assert.calledWith(client.publishAsync, 'my_channel', '"Hello World!"');
        sinon.assert.calledWith(client.publishAsync, 'another_channel', '{"hello":"world"}');

        expect(results).to.deep.equal(['result1', 'result2']);
      });
    });
  });

  describe('publishBatch', () => {
    it('should publish multiple messages to a channel', () => {
      let client = sinon.createStubInstance(redis.RedisClient);

      client.publishAsync = sinon.stub()
      client.publishAsync.onCall(0)
        .returns('result1');
      client.publishAsync.onCall(1)
        .returns('result2');

      let adapter = new RedisPubSubAdapter(client);

      let messages = [
        'message 1',
        'message 2',
      ];
      return adapter.publishBatch('my_channel', messages).then((results) => {
        sinon.assert.calledTwice(client.publishAsync);
        sinon.assert.calledWith(client.publishAsync, 'my_channel', '"message 1"');
        sinon.assert.calledWith(client.publishAsync, 'my_channel', '"message 2"');

        expect(results).to.deep.equal(['result1', 'result2']);
      });
    });
  });
});
