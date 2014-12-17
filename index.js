var racer = require('racer');
var traverse = require('traverse');
var Storage = require('dom-storage');

/*if (typeof localStorage === 'undefined') {
  var localStorage = new Storage('./db.json', {strict: true});
}*/

if (typeof localStorage === 'undefined') {
  localStorage = {
    getItem: function () {},
    setItem: function() {}
  };
}

function Local(model) {
  // use racer's wrapper mutator methods
  // to handle arg parsing and ensure our mutators
  // have the same signature
  this.mutators = new racer.Model();
  this.mutators._get = this._get;
  this.mutators._set = this._set;
  this.mutators.model = model;
}

Local.prototype._del = function (segments) {
  var root = segments[0];
  var path = segments.slice(1);
  if (path[0]) {
    var obj = localStorage.getItem(root) || {};
    obj = JSON.parse(obj);
    traverse(obj).set(path, undefined);
    localStorage.setItem(root, JSON.stringify(obj));
  } else {
    localStorage.removeItem(root);
  }
  return this.model._del.call(this.model, segments);
};

Local.prototype._get = function (segments) {
  var root = segments[0];
  var path = segments.slice(1);
  var obj = localStorage.getItem(root) || '{}';
  obj = JSON.parse(obj);
  var value = traverse(obj).get(path);
  if (typeof value !== 'undefined') return value;
  return this.model._get.call(this.model, segments);
};

Local.prototype._set = function (segments, value, cb) {
  var root = segments[0];
  var path = segments.slice(1);
  var obj = {};
  traverse(obj).set(path, value);
  localStorage.setItem(root, JSON.stringify(obj));
  return this.model._set.call(this.model, segments, value, cb);
};

Local.prototype.get = function () {
  return this.mutators.get.apply(this.mutators, arguments);
};

Local.prototype.set = function () {
  return this.mutators.set.apply(this.mutators, arguments);
};

module.exports = function (model) {
  return new Local(model);
};
