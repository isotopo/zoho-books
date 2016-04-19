'use strict'

const request = require('request')

/**
 * Provides a zoho connection wrapper
 */
class ZohoBooks {

  /**
   * @constructor
   * @param {Object} options - Options for connection
   * @param {String} options.authtoken - Zohobooks authtoken
   * @param {String} options.host - Host
   * @param {String} options.organization - Organization id
   */
  constructor (options) {
    this.options = typeof options !== 'object' ? {} : options
  }

  /**
   * @memberof ZohoBooks
   * @param {String} email - Email
   * @param {String} password - Password
   */
  createToken (email, password) {
    return this._request('https://accounts.zoho.com/apiauthtoken/nb/create', 'GET', {
      SCOPE: 'ZohoBooks/booksapi',
      EMAIL_ID: email,
      PASSWORD: password
    })
      .then(function (res) {
        let json = {}
        res.split('\n').forEach(function (value) {
          value = value.split('=')
          if (value.length > 1) {
            json[value[0].toLowerCase()] = value[1]
          }
        })
        if (!json.authtoken) {
          return Promise.reject(json)
        }
        this.options.authtoken = json.authtoken
        return Promise.resolve(json)
      })
      .catch(function (err) {
        return Promise.reject(err)
      })
  }

  /**
   * Wraps all request to zoho books
   * @memberof ZohoBooks
   * @param {String} url - Zoho books API path
   * @param {String} method - Http method
   * @param {Object} qs - http query
   */
  api (url, method, data) {
    let qs = {}
    url = this.options.host + url
    qs.authtoken = this.options.authtoken
    qs.JSONString = JSON.stringify(data)
    qs.organization_id = this.options.organization
    return this._request(url, method, qs)
      .then((res) => {
        return res.code === 0 ? Promise.resolve(res) : Promise.reject(res)
      })
      .catch(function (err) {
        return Promise.reject(err)
      })
  }

  /**
   * @memberof ZohoBooks
   * @private
   * @param {String} url - Complete url path
   * @param {String} method - Http method
   * @param {Object} qs - http query
   */
  _request (url, method, qs) {
    let toSend = {
      method: method,
      uri: url,
      json: true
    }
    if (qs) {
      toSend.qs = qs
    }
    return new Promise((resolve, reject) => {
      request(toSend, (error, response, body) => {
        if (error || (response.statusCode !== 201 && response.statusCode !== 200 && response.statusCode !== 204)) {
          return reject(error || body)
        }
        return resolve(body)
      })
    })
  }

}

module.exports = ZohoBooks
