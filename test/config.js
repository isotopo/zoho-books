'use strict'

module.exports = require('rc')('zohobooks', {
  authtoken: process.env.ZOHO_BOOKS_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere',
  host: 'https://www.zoho.com/books/api/v3',
  email: 'example@example.com',
  password: 'my-password'
})
