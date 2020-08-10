/**
 * @Author: francesco
 * @Date:   2020-08-07T13:33:42+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-10T16:35:02+02:00
 */


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

  var r = mapHeaders(res, tagsMapping).basic
  
  // Parse MIME type
  if (typeof r["content-type"] === "string")
    r.mime = require('./mime')(r["content-type"])

  return r;
}
