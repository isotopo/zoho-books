# Zoho-books

Node.js zoho books helper library

[![npm version](https://badge.fury.io/js/zoho.svg)](http://badge.fury.io/js/zoho)
[![Build Status](https://travis-ci.org/4yopping/zoho.svg)](https://travis-ci.org/4yopping/zoho)
[![Join the chat at https://gitter.im/4yopping/zoho](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/4yopping/zoho?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Inline docs](http://inch-ci.org/github/4yopping/zoho.svg?branch=master)](http://inch-ci.org/github/4yopping/zoho)
![Dependencies](https://david-dm.org/4yopping/zoho.svg)

## Installation

```bash
$ npm install zoho-books
```

## Getting started

Initialize `zoho`

```js
const ZohoBooks = require('zoho-books');
let zohoBooks = new ZohoBooks({
  authtoken: 'YourZohoBooksAuthtokenHere',
  host: 'https://books.zoho.com/api/v3',
  organization: '000000000',
})
```

## Methods

All methods returns a promise

### Api method

Send a request to API zoho-books using host attribute

```js
zohoBooks.api('/contacts', 'POST', {
    contact_name: 'Juan Pérez'
}).then().catch()
```

### Create Token method

Request to https://accounts.zoho.com/apiauthtoken/create, returns token for zoho-books
using user email and password

```js
let auth = yield zohoBooks.createToken('your@email.com', 'YourPassword3000')
// auth = {authtoken: "YourZohoBooksAuthtokenHere"}
```
**Warning be careful with this method zoho limits requests to this endpoint**


### Create Organization method

If you requires create a new organization you should use the method `createOrganization`
instead `api('/organization', 'POST')`

```js
let org = yield zohoBooks.createOrganization({

})
```
**Warning be careful with this method zoho limits requests to this endpoint**

## License

The MIT License (MIT)

Copyright (c) 2015 Sergio Morlán Páramo, FuturE and all the related trademarks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
