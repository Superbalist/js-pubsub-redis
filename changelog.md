# Changelog

## 3.0.0 - 2017-07-18

* Change publish and publishBatch methods to return a promise

## 2.0.0 - 2017-05-17

* Bump up @superbalist/js-pubsub to ^2.0.0
* Add new publishBatch method to RedisPubSubAdapter

## 1.0.3 - 2017-05-16

* Fix to bug where all subscribers on same client receive all messages, regardless of the channel

## 1.0.2 - 2017-05-15

* Serialize message payload upon publishing

## 1.0.1 - 2017-05-09

* Transpile ES6 -> ES5 at build time

## 1.0.0 - 2017-05-08

* Switch to ESLint & Google Javascript Style Guide
* Add JSDoc documentation
* Add unit tests

## 0.0.1 - 2017-05-02

* Initial release
