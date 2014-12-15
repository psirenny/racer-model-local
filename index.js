var traverse = require('traverse');
var Storage = require('dom-storage');

if (typeof localStorage === 'undefined') {
  var localStorage = new Storage('./db.json', {strict: true});
}

module.exports = function (model) {
  var _del = model._del;
  var _get = model._get;
  var _set = model._set;

  model._get = function (segments) {
    var root = segments[0];
    var path = segments.slice(1);
    var obj = localStorage.getItem(root) || '{}';
    obj = JSON.parse(obj);
    var value = traverse(obj).get(path);
    if (value) return value;
    return _get.call(model, segments);
  };

  model._set = function (segments, value, cb) {
    var root = segments[0];
    var path = segments.slice(1);
    var obj = {};
    traverse(obj).set(path, value);
    localStorage.setItem(root, JSON.stringify(obj));
    return _set.call(model, segments, value, cb);
  };

  return model;
};
