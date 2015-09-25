'use strict';

var racer = require('racer');
var traverse = require('traverse');

if (!global.localStorage) {
  global.localStorage = {
    getItem: function () {},
    setItem: function () {},
    removeItem: function () {}
  };
}

if (!global.sessionStorage) {
  global.sessionStorage = {
    getItem: function () {},
    setItem: function () {},
    removeItem: function () {}
  };
}

function Local(model, type) {
  // use racer's wrapper mutator methods
  // to handle arg parsing and ensure our mutators
  // have the same signature
  this.mutators = new racer.Model();
  this.mutators._get = this._get;
  this.mutators._set = this._set;
  this.mutators.model = model;
  this.mutators.type = (type || 'local') + 'Storage';
}

Local.prototype._del = function (segments) {
  var root = segments[0];
  var path = segments.slice(1);

  if (path[0]) {
    var obj = global[this.type].getItem(root) || {};
    obj = JSON.parse(obj);
    traverse(obj).set(path, undefined);
    global[this.type].setItem(root, JSON.stringify(obj));
  } else {
    global[this.type].removeItem(root);
  }

  return this.model._del.call(this.model, segments);
};

Local.prototype._get = function (segments) {
  var root = segments[0];
  var path = segments.slice(1);
  var obj = global[this.type].getItem(root) || '{}';

  obj = JSON.parse(obj);
  var value = traverse(obj).get(path);
  if (typeof value !== 'undefined') return value;
  return this.model._get.call(this.model, segments);
};

Local.prototype._set = function (segments, value, cb) {
  var root = segments[0];
  var path = segments.slice(1);
  var obj = JSON.parse(global[this.type].getItem(root) || '{}');

  traverse(obj).set(path, value);
  global[this.type].setItem(root, JSON.stringify(obj));
  return this.model._set.call(this.model, segments, value, cb);
};

Local.prototype.get = function () {
  return this.mutators.get.apply(this.mutators, arguments);
};

Local.prototype.set = function () {
  return this.mutators.set.apply(this.mutators, arguments);
};

module.exports = function (model, type) {
  return new Local(model, type);
};
