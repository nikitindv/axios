'use strict'

import {isURLSearchParams} from '../utils.js'
import {forOwn, forEach, isArray, isDate, isObject} from 'aori-lodash';

function encode (val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export default function buildURL (url, params, paramsSerializer) {
  /* eslint no-param-reassign:0 */
  if (!params) {
    return url
  }

  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts = []

    forOwn(params, function serialize (val, key) {
      if (val === null || typeof val === 'undefined') {
        return
      }

      if (isArray(val)) {
        key = key + '[]'
      } else {
        val = [val]
      }

      forEach(val, function parseValue (v) {
        if (isDate(v)) {
          v = v.toISOString()
        } else if (isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(encode(key) + '=' + encode(v))
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
