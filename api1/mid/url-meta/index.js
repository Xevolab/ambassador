const axios = require('axios')
const parseHeaders = require('./lib/parse-request-headers')
const parseDom = require('./lib/parse-meta-tags')

module.exports = function (url, options) {

  return new Promise((resolve, reject) => {

    // Axios request options
    const requestOpts = {
      url: url,
      method: 'GET',
      headers: {
        'User-Agent': 'X-AMBS',
        'Accept-Language': (options.lang != 'en' ? options.lang+",en;d=0.8" : 'en')
      },
      maxContentLength: 2621440, // 2.5MB
      maxRedirects: 8,
      timeout: 1500
    }

    axios.request(requestOpts).then((response) => {

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
      if (parsedHeaders.mime.type === "html" && (options.card || options.tags || options.schema)) {
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
        else {
          console.error(err);
          return reject({errorCode: 'RES_UNRESP', retryable: true});
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(err);
        return reject({errorCode: 'GEN_ERROR', retryable: false});
      }
    })

  })
}
