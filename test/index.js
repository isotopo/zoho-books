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
  // Skip this test to prevent  {"cause":"EXCEEDED_MAXIMUM_ALLOWED_AUTHTOKENS","result":"FALSE"} Error
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

  /*
   * Contacts Group
   */
  describe('Group contacts [test-contact]', function () {
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

    it('Should get specific contact', function (done) {
      zohobooks.api(`/contacts/${global.fixtures.contact.contact_id}`, 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.contact, 'object')
          assert.equal(val.contact.contact_id, global.fixtures.contact.contact_id)
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
  })

  /*
   * Items Group
   */
  describe('Group item [test-item]', function () {
    it('Should create an item', function (done) {
      zohobooks.api('/items', 'POST', {
        name: faker.lorem.words(2)
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          global.fixtures.item = val.item
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should create another item', function (done) {
      zohobooks.api('/items', 'POST', {
        name: faker.lorem.words(2)
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          global.fixtures.item2 = val.item
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Sales order Group
   */
  describe('Group sales order [test-salesorder]', function () {
    it('Should create a sale order', function (done) {
      zohobooks.api('/salesorders', 'POST', {
        customer_id: global.fixtures.contact.contact_id,
        line_items: [{
          item_id: global.fixtures.item.item_id,
          name: global.fixtures.item.name
        }]
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.salesorder, 'object')
          global.fixtures.salesorder = val.salesorder
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get all sales orders', function (done) {
      zohobooks.api('/salesorders', 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert(Array.isArray(val.salesorders))
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get specific sales order', function (done) {
      zohobooks.api(`/salesorders/${global.fixtures.salesorder.salesorder_id}`, 'GET')
        .then(function (val) {
          assert.equal(val.code, 0)
          assert.equal(typeof val.salesorder, 'object')
          assert.equal(val.salesorder.salesorder_id, global.fixtures.salesorder.salesorder_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should update a sales order', function (done) {
      let newLineItems = [{
        item_id: global.fixtures.item.item_id,
        name: global.fixtures.item.name
      }, {
        item_id: global.fixtures.item2.item_id,
        name: global.fixtures.item2.name
      }]
      zohobooks.api(`/salesorders/${global.fixtures.salesorder.salesorder_id}`, 'PUT', {
        line_items: newLineItems
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.salesorder, 'object')
          assert.equal(val.salesorder.line_items.length, 2)
          assert.equal(val.salesorder.line_items[0].item_id, global.fixtures.item.item_id)
          assert.equal(val.salesorder.line_items[1].item_id, global.fixtures.item2.item_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Customer payments Group
   */
  describe('Group customer payments [test-customerpayment]', function () {
    it('Should create a customer payment', function (done) {
      zohobooks.api('/customerpayments', 'POST', {
        customer_id: global.fixtures.contact.contact_id,
        date: faker.date.future().toISOString().slice(0, 10),
        amount: faker.random.number(1000)
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.payment, 'object')
          global.fixtures.customerpayment = val.payment
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get all customer payment', function (done) {
      zohobooks.api('/customerpayments', 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert(Array.isArray(val.customerpayments))
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get specific customer payment', function (done) {
      zohobooks.api(`/customerpayments/${global.fixtures.customerpayment.payment_id}`, 'GET')
        .then(function (val) {
          assert.equal(val.code, 0)
          assert.equal(typeof val.payment, 'object')
          assert.equal(val.payment.payment_id, global.fixtures.customerpayment.payment_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should update a customer payment', function (done) {
      let description = faker.lorem.words(10)
      zohobooks.api(`/customerpayments/${global.fixtures.customerpayment.payment_id}`, 'PUT', {
        description: description
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.payment, 'object')
          assert.equal(val.payment.description, description)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Invoices Group
   */
  describe('Group invoice [test-salesorder]', function () {
    it('Should create a invoice', function (done) {
      zohobooks.api('/invoices', 'POST', {
        customer_id: global.fixtures.contact.contact_id,
        line_items: [{
          item_id: global.fixtures.item.item_id,
          name: global.fixtures.item.name
        }]
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.invoice, 'object')
          global.fixtures.invoice = val.invoice
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get all invoices', function (done) {
      zohobooks.api('/invoices', 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert(Array.isArray(val.invoices))
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get specific invoice', function (done) {
      zohobooks.api(`/invoices/${global.fixtures.invoice.invoice_id}`, 'GET')
        .then(function (val) {
          assert.equal(val.code, 0)
          assert.equal(typeof val.invoice, 'object')
          assert.equal(val.invoice.invoice_id, global.fixtures.invoice.invoice_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should update an invoice', function (done) {
      let newLineItems = [{
        item_id: global.fixtures.item.item_id,
        name: global.fixtures.item.name
      }, {
        item_id: global.fixtures.item2.item_id,
        name: global.fixtures.item2.name
      }]
      zohobooks.api(`/invoices/${global.fixtures.invoice.invoice_id}`, 'PUT', {
        line_items: newLineItems
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.invoice, 'object')
          assert.equal(val.invoice.line_items.length, 2)
          assert.equal(val.invoice.line_items[0].item_id, global.fixtures.item.item_id)
          assert.equal(val.invoice.line_items[1].item_id, global.fixtures.item2.item_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Credit notes Group
   */
  describe('Group credit notes [test-creditnotes]', function () {
    it('Should create a credit note', function (done) {
      zohobooks.api('/creditnotes', 'POST', {
        customer_id: global.fixtures.contact.contact_id,
        line_items: [{
          item_id: global.fixtures.item.item_id,
          name: global.fixtures.item.name
        }]
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.creditnote, 'object')
          global.fixtures.creditnote = val.creditnote
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get all credit notes', function (done) {
      zohobooks.api('/creditnotes', 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert(Array.isArray(val.creditnotes))
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get specific credit note', function (done) {
      zohobooks.api(`/creditnotes/${global.fixtures.creditnote.creditnote_id}`, 'GET')
        .then(function (val) {
          assert.equal(val.code, 0)
          assert.equal(typeof val.creditnote, 'object')
          assert.equal(val.creditnote.creditnote_id, global.fixtures.creditnote.creditnote_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should update a credit note', function (done) {
      let newLineItems = [{
        item_id: global.fixtures.item.item_id,
        name: global.fixtures.item.name
      }, {
        item_id: global.fixtures.item2.item_id,
        name: global.fixtures.item2.name
      }]
      zohobooks.api(`/creditnotes/${global.fixtures.creditnote.creditnote_id}`, 'PUT', {
        line_items: newLineItems
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.creditnote, 'object')
          assert.equal(val.creditnote.line_items.length, 2)
          assert.equal(val.creditnote.line_items[0].item_id, global.fixtures.item.item_id)
          assert.equal(val.creditnote.line_items[1].item_id, global.fixtures.item2.item_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Vendor Group
   */
  describe('Group vendors [test-vendor]', function () {
    it('Should create a vendor', function (done) {
      zohobooks.api('/contacts', 'POST', {
        contact_name: faker.name.firstName(),
        contact_type: 'vendor'
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.contact, 'object')
          assert.equal(val.contact.contact_type, 'vendor')
          global.fixtures.vendor = val.contact
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should get specific vendor', function (done) {
      zohobooks.api(`/contacts/${global.fixtures.vendor.contact_id}`, 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.contact, 'object')
          assert.equal(val.contact.contact_type, 'vendor')
          assert.equal(val.contact.contact_id, global.fixtures.vendor.contact_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it('Should update a vendor', function (done) {
      let newName = faker.name.firstName()
      zohobooks.api(`/contacts/${global.fixtures.vendor.contact_id}`, 'PUT', {
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
  })

  /*
   * Bank Account Order Group
   */
  describe('Group bank account [test-bankaccount]', function () {
    it('Should create an bank account', function (done) {
      zohobooks.api('/bankaccounts', 'POST', {
        account_name: faker.lorem.words(10),
        account_type: 'credit_card',
        account_number: '80000009823'
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.bankaccount, 'object')
          global.fixtures.bankaccount = val.bankaccount
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Purchase Order Group
   */
  describe('Group purchase order  [test-purchaseorder]', function () {
    it.skip('Should create a purchase order ', function (done) {
      zohobooks.api('/purchaseorders', 'POST', {
        vendor_id: global.fixtures.vendor.contact_id,
        description: faker.lorem.words(10),
        line_items: [{
          item_id: global.fixtures.item.item_id,
          name: global.fixtures.item.name,
          account_id: global.fixtures.bankaccount.account_id
        }]
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.purchaseorder, 'object')
          global.fixtures.purchaseorder = val.purchaseorder
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should get all purchase orders', function (done) {
      zohobooks.api('/purchaseorders', 'GET')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert(Array.isArray(val.purchaseorders))
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should get specific purchase order', function (done) {
      zohobooks.api(`/purchaseorders/${global.fixtures.purchaseorder.purchaseorder_id}`, 'GET')
        .then(function (val) {
          assert.equal(val.code, 0)
          assert.equal(typeof val.purchaseorder, 'object')
          assert.equal(val.purchaseorder.purchaseorder_id, global.fixtures.purchaseorder.purchaseorder_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should update a purchase order', function (done) {
      let newLineItems = [{
        item_id: global.fixtures.item.item_id,
        name: global.fixtures.item.name
      }, {
        item_id: global.fixtures.item2.item_id,
        name: global.fixtures.item2.name
      }]
      zohobooks.api(`/purchaseorders/${global.fixtures.purchaseorder.purchaseorder_id}`, 'PUT', {
        line_items: newLineItems
      })
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          assert.equal(typeof val.purchaseorder, 'object')
          assert.equal(val.purchaseorder.line_items.length, 2)
          assert.equal(val.purchaseorder.line_items[0].item_id, global.fixtures.item.item_id)
          assert.equal(val.purchaseorder.line_items[1].item_id, global.fixtures.item2.item_id)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })

  /*
   * Remove Group
   */
  describe('Group remove [test-remove]', function () {
    it.skip('Should delete a bank account [test-bankaccount]', function (done) {
      zohobooks.api(`/bankaccounts/${global.fixtures.bankaccount.account_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a vendor [test-vendor]', function (done) {
      zohobooks.api(`/contacts/${global.fixtures.vendor.contact_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a purchase order [test-purchaseorder]', function (done) {
      zohobooks.api(`/purchaseorders/${global.fixtures.purchaseorder.purchaseorder_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a credit note [test-creditnotes]', function (done) {
      zohobooks.api(`/creditnotes/${global.fixtures.creditnote.creditnote_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a customer payment [test-customerpayment]', function (done) {
      zohobooks.api(`/customerpayments/${global.fixtures.customerpayment.payment_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete an invoice [test-invoice]', function (done) {
      zohobooks.api(`/invoices/${global.fixtures.invoice.invoice_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a sales order [test-salesorder]', function (done) {
      zohobooks.api(`/salesorders/${global.fixtures.salesorder.salesorder_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete an item [test-item]', function (done) {
      zohobooks.api(`/items/${global.fixtures.item.item_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete another item [test-item]', function (done) {
      zohobooks.api(`/items/${global.fixtures.item2.item_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })

    it.skip('Should delete a contact [test-contact]', function (done) {
      zohobooks.api(`/contacts/${global.fixtures.contact.contact_id}`, 'DELETE')
        .then(function (val) {
          assert(val)
          assert.equal(val.code, 0)
          done()
        })
        .catch(function (err) {
          done(err)
        })
    })
  })
})
