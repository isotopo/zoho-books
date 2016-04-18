'use strict'

const assert = require('assert')
const faker = require('faker')
const ZohoBooks = require('../')
const config = require('./config')

let zohobooks = new ZohoBooks(config)

describe('Zohobooks unit test', function () {
  it('Should be an instance of ZohoBooks', function () {
    assert(zohobooks instanceof ZohoBooks)
  })
  it.skip('zohobooks intances options should be equal to config', function () {
    assert.deepEqual(zohobooks.options, config)
  })
})

describe('Zohobooks service test', function () {
  it.skip('Should get a token', function (done) {
    zohobooks.createToken(config.email, config.password)
      .then(function (val) {
        assert(val.authtoken)
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })

  it('Should save an organization', function (done) {
    zohobooks.api('/organizations', 'POST', {
      name: faker.lorem.words(2),
      currency_code: 'MXN',
      time_zone: 'America/Mexico_City',
      address: {
        country: 'Mexico'
      }
    })
      .then(function (val) {
        assert(val)
        assert.equal(val.code, 0)
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })

  it('Should get all contacts', function (done) {
    zohobooks.api('/contacts', 'GET')
      .then(function (val) {
        assert(val)
        assert.equal(val.code, 0)
        assert(Array.isArray(val.contacts))
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })

  it('Should create a contact', function (done) {
    zohobooks.api('/contacts', 'POST', {
      contact_name: faker.name.firstName()
    })
      .then(function (val) {
        assert(val)
        assert.equal(val.code, 0)
        assert.equal(typeof val.contact, 'object')
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })

  it.skip('Should get all contacts', function (done) {
    zohobooks.api('/contacts', 'GET')
      .then(function (val) {
        assert(val)
        assert.equal(val.code, 0)
        assert(Array.isArray(val.contacts))
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })
})
