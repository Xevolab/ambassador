/**
 * @Author: francesco
 * @Date:   2020-08-07T13:33:42+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-10T11:59:46+02:00
 */


/**
 *  This takes the result of the url-gather package and prepares it for the user
 */

const gather = require('./../url-gather/index.js')

module.exports = (u, params) => { return new Promise((resolve, reject) => {

  gather(u, params).then((data) => {

    let res = {
      raw: data
    }

    //res.card = require('./lib/card')(data)

    return resolve(res)

  }).catch((e) => {
    console.log(e);
    return reject(e);
  })

})}
