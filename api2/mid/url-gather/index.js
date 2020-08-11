/**
 * @Author: francesco
 * @Date:   2020-06-15T23:51:25+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-11T11:39:32+02:00
 */

/**
 *   The url-gather actually calles the website and parses the return
 **/

const Puppeteer = require('puppeteer');

const parseHeaders = require('./lib/parse-request-headers')
const parseDom = require('./lib/parse-meta-tags')

module.exports = function (url, params) {

  return new Promise(async (resolve, reject) => {

    // Starting a new Puppeteer browser and page
    const browser = await Puppeteer.launch({ args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas'
    ] , headless: false});
    const page = await browser.newPage();

    // Setting base options
    await page.setRequestInterception(true);
    await page.setExtraHTTPHeaders({
      'Accept-Language': (params.lang != 'en' ? params.lang+",en;d=0.8" : 'en')
    });
    await page.setUserAgent("X-AMB/2.0 (+http://ambassador.xevolab.com/bots.html)");

    let target = url;
    let reqData = {
      requestMetrics: {},
      headers: null
    }

    // Analizing request types
    // Images, fonts and stylesheets are disabled to save time as they are not
    // influential in analizing the final page
    page.on('request', (req) => {
      let type = req.resourceType();
      reqData.requestMetrics[type] = (reqData.requestMetrics[type] === undefined ? 1 : reqData.requestMetrics[type] + 1)

      if (type === 'image' || type === "font" || type === "stylesheet")
        req.abort();
      else
        req.continue();
    });

    // Visiting the provided site
    let req = null;
    try {
      req = await page.goto(url, { waitUntil: 'networkidle2' });
    } catch (e) {
      console.error(e);
      return reject({errorCode: 'RES_CONN_ABORTED', retryable: false});
    }

    // Only 2xx request will be processed
    if (!req.ok())
      return reject({errorCode: 'INV_STS_CODE', retryable: true});

    // Try to parse headers
    try {
      reqData.headers = parseHeaders(req.headers())
    } catch (e) {
      console.error('GEN_HEAD_ERROR ', e);
      return reject({errorCode: 'GEN_HEAD_ERROR', retryable: true});
    }

    // Request information
    reqData.request = {
      uri: page.url(),
      source: page.url().split('://')[1].split('/')[0].split('.').slice(-2).join("."),
      status: req.status()
    }

    // Connection security
    reqData.security = {_raw: req.securityDetails()}
    reqData.security = {secure: (reqData.security._raw !== null), issuer: (reqData.security._raw !== null ? reqData.security._raw._issuer : null)}

    // Parse the DOM
    if (reqData.headers.mime.type === "html") {
      try {
        reqData.dom = parseDom(await page.content());
      } catch (e) {
        console.error("GEN_DOM_ERROR", e);
        return reject({errorCode: 'GEN_DOM_ERROR', retryable: false});
      }
    }

    if (params.screenshot) {
      let scr = await page.screenshot({
        type: "jpeg",
        quality: 75
      });
    }

    await browser.close()
    return resolve(reqData)


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


      // No mime found --> No need to try to parse DOM
      if (parsedHeaders.mime === undefined)
        return reject({errorCode: 'GEN_DOM_ERROR', retryable: false});

      var parsedDom = {};
      // Parse TAGS only if HTML mime found and required


      return resolve({...parsedHeaders, ...parsedDom});

    }).catch((err) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

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
