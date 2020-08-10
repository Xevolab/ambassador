/**
 * @Author: francesco
 * @Date:   2020-08-07T13:33:42+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-10T09:44:01+02:00
 */


/**
 *  This takes the result of the url-gather package and prepares it for the user
 */

const urlMetadata = require('./../url-gather/index.js')

module.exports = (u, tags) => { return new Promise((resolve, reject) => {

  urlMetadata(u, tags).then((data) => {

    return resolve(data)
    let res = {
      request: data.request,
      mime: data.mime
    }

    if (tags.tags)
      res.tags = data.tags || null;
    if (tags.schema)
      res.schema = data.schema || null;
    if (tags.card)
      res.card = require('./lib/card')(data)

    return resolve(res)

  }).catch((e) => {
    console.log(e);
    return reject(e);
  })

})}
