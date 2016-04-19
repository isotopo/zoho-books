'use strict'

const assert = require('assert')
const faker = require('faker')
const ZohoBooks = require('../')
const config = require('./config')

let zohobooks = new ZohoBooks(config)
global.fixtures = {}

describe('Zohobooks unit test', function () {
  it('Should be an instance of ZohoBooks', function () {
    assert(zohobooks instanceof ZohoBooks)
  })
  it('Zohobooks should have this properties', function () {
    assert.equal(typeof zohobooks.options, 'object')
    assert.equal(typeof zohobooks.options.authtoken, 'string')
    assert.equal(typeof zohobooks.options.host, 'string')
    assert.equal(typeof zohobooks.options.organization, 'string')
    assert.equal(zohobooks.options.authtoken, config.authtoken)
    assert.equal(zohobooks.options.host, config.host)
    assert.equal(zohobooks.options.organization, config.organization)
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
        global.fixtures.contact = val.contact
        done()
      })
      .catch(function (err) {
        done(err)
      })
  })

  it('Should update a contact', function (done) {
    let newName = faker.name.firstName()
    zohobooks.api(`/contacts/${global.fixtures.contact.contact_id}`, 'PUT', {
        contact_name: newName
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

  it('Should delete a contact', function (done) {
    let newName = faker.name.firstName()
    zohobooks.api(`/contacts/${global.fixtures.contact.contact_id}`, 'DELETE', {
        contact_name: newName
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
})
