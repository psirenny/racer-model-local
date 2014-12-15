Racer Model Local
=================

Add local storage reads/writes to a Racer model.  
Reads check local storage for a value before accessing the model.

Installation
------------

    $ npm install racer-model-local --save

Usage
-----

    var racer = require('racer');
    var Local = require('racer-model-local');

    var model = new racer.Model();
    var local = Local(model);
    local.set('_page.foo', 'bar');

    console.log(model.get('_page.foo')); // 'bar'
    console.log(localStorage.getItem('_page.foo')); // 'bar'
