/**
 * @Author: francesco
 * @Date:   2020-06-15T23:51:25+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-10T09:54:16+02:00
 */

/**
 *   The url-gather actually calles the website and parses the return
 **/

const Nightmare = require('nightmare')
const nm = Nightmare({
  webPreferences: {
    images: false
  },
  width: 1024,
  height: 768,
  titleBarStyle: "hidden",
  show: true
})

const parseHeaders = require('./lib/parse-request-headers')
const parseDom = require('./lib/parse-meta-tags')

module.exports = function (url, options) {

  return new Promise((resolve, reject) => {

    let r = nm.goto(url, {
      'User-Agent': 'X-AMBS',
      'Accept-Language': (options.lang != 'en' ? options.lang+",en;d=0.8" : 'en')
    }).wait(240).screenshot().then((r) => {
      nm.end().then(() => {
        resolve(r)
        console.log("there");
      })

    })


    // Axios request options
    const nmOpt = {
      url: url,
      method: 'GET',
      maxContentLength: 2621440, // 2.5MB
      maxRedirects: 8,
      timeout: 1500
    }

    /*axios.request(requestOpts).then((response) => {
      if (!response) {
        return reject({errorCode: 'RES_EMPTY', retryable: true});
      }

      // look at headers
      try {
        var parsedHeaders = parseHeaders(response.request)
      } catch (e) {
        return reject({errorCode: 'GEN_HEAD_ERROR', retryable: true});
      }

      // No mime found --> No need to try to parse DOM
      if (parsedHeaders.mime === undefined)
        return reject({errorCode: 'GEN_DOM_ERROR', retryable: false});

      var parsedDom = {};
      // Parse TAGS only if HTML mime found and required
      if (parsedHeaders.mime.type === "html") {
        try {
          parsedDom = parseDom(response.data);
        } catch (e) {
          console.error("GEN_DOM_ERROR", e);
          return reject({errorCode: 'GEN_DOM_ERROR', retryable: false});
        }
      }

      return resolve({...parsedHeaders, ...parsedDom});

    }).catch((err) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return reject({errorCode: 'INV_STS_CODE', retryable: true});
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js

        if (err.message === "maxContentLength size of 2621440 exceeded") {
          try {
            return resolve(parseHeaders(err.request))
          } catch (e) {
            console.error("maxContentLength but try-catch triggered", e);
            return reject({errorCode: 'GEN_ERROR', retryable: false});
          }
        }
        else if (err.code === "ENOTFOUND") {
          console.error(err.code);
          return reject({errorCode: 'RES_NOT_FOUND', retryable: false});
        }
        else if (err.code === "ECONNABORTED") {
          console.error(err.code);
          return reject({errorCode: 'RES_CONN_ABORTED', retryable: false});
        }
        else {
          console.error(err.code);
          return reject({errorCode: 'GEN_ERROR', retryable: false});
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(err);
        return reject({errorCode: 'GEN_ERROR', retryable: false});
      }
    })*/

  })
}
