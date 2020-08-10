const cheerio = require('cheerio')

const mapHeaders = require('./map')
const tagsMapping = {
  basic: {
    'content-length': ["content-length", null],
    'content-type': ["content-type", null],
    'content-language': ["content-language", null]
  },
}

module.exports = function (res) {

  var r = {
    request: {
      /*initialUri: res.config.url,*/
      uri: res.res.responseUrl,
      source: res.res.responseUrl.split('://')[1].split('/')[0].split('.').slice(-2).join("."),
      redirected: res._redirectable._isRedirect || false
    },
    headers: mapHeaders(res.res.headers, tagsMapping).basic
  }

  // If redirected --> How many times?
  if (r.request.redirected)
    r.request.redirectsCount = res._redirectable._redirectCount;

  // Parse MIME type
  if (typeof r.headers["content-type"] === "string")
    r.mime = require('./mime')(r.headers["content-type"])

  return r;
}
