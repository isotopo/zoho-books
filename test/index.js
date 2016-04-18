'use strict'

const assert = require('assert')
const ZohoBooks = require('../')
const config = require('./config')

let zohobooks = new ZohoBooks(config)

describe('Zohobooks unit test', function () {
  it('Should be an instance of ZohoBooks', function () {
    assert(zohobooks instanceof ZohoBooks)
  })
  it('zohobooks intances options should be equal to config', function () {
    assert.deepEqual(zohobooks.options, config)
  })
})

describe('Zohobooks service test', function () {
  it('Should get a token', function (done) {
    zohobooks.createToken(config.email, config.password)
      .then(function(val){
        assert(val.authtoken)
        done()
      })
      .catch(function(err){
        done(err)
      })
  })
})
