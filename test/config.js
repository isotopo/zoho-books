'use strict'

module.exports = require('rc')('zohobooks', {
  authtoken: process.env.ZOHO_BOOKS_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere',
  host: 'https://books.zoho.com/api/v3',
  organization: '000000000',
  email: 'example@example.com',
  password: 'my-password'
})
