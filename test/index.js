var lib = require('..');
var racer = require('racer');
var should = require('chai').should();
var Storage = require('dom-storage');
var localStorage = new Storage('./db.json', {strict: true});

describe('racer-model-local', function () {

  it('should be a function', function () {
    lib.should.be.a.Function;
  });

  it('should return a Model', function () {
    var model = new racer.Model();
    lib(model).should.be.an.instanceOf(racer.Model);
  });

  describe.skip('SET', function () {
    it('should write to the model', function () {
      var model = new racer.Model();
      var local = lib(model);
      local.set('_page.foo', 'bar');
      local.data.should.have.property('_page');
      local.data._page.should.have.property('foo');
      local.data._page.foo.should.equal('bar');
    });

    it('should write to local storage', function () {
      var model = new racer.Model();
      var local = lib(model);
      local.set('_page.foo', 'bar');
      var obj = localStorage.getItem('_page');
      obj.should.be.a('string');
      obj = JSON.parse(obj);
      obj.should.have.property('foo');
      obj.foo.should.equal('bar');
    });
  });

  describe('GET', function () {
    it('should read from the model', function () {
      var model = new racer.Model();
      var local = lib(model);
      model.set('_page.foo', 'bar');
      local.get('_page').should.be.an('object');
      local.get('_page').foo.should.equal('bar');
      local.get('_page.foo').should.equal('bar');
    });

    it('should read from local storage', function () {
      var model = new racer.Model();
      var local = lib(model);
      var obj = JSON.stringify({foo: 'bar'});
      localStorage.setItem('_page', obj);
      local.get('_page').should.be.an('object');
      local.get('_page').foo.should.equal('bar');
      local.get('_page.foo').should.equal('bar');
    });
  });
});
