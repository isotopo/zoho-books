'use strict'

module.exports = require('rc')('zohobooks', {
  authtoken: process.env.ZOHO_BOOKS_TOKEN || 'YouCanPutYourZohoInvoiceTokenHere',
  host: process.env.ZOHO_BOOKS_HOST || 'https://books.zoho.com/api/v3',
  organization: process.env.ZOHO_BOOKS_ORG || '000000000',
  email: process.env.ZOHO_BOOKS_EMAIL || 'example@example.com',
  password: process.env.ZOHO_BOOKS_PASSWORD || 'my-password'
})
