"use strict";

import axios from 'axios'
import httpBuildQuery from 'http-build-query'

/**
 * 自然言語処理APIに通す
 * @param  {String}  msg 受信したメッセージ
 * @return {Promise}
 */
export default (msg) => {
    const URL    = 'https://eastasia.api.cognitive.microsoft.com/luis/v2.0/apps/',
          params = httpBuildQuery({
              "subscription-key": process.env.LUIS_APP_KEY,
              staging: "true",
              verbose: "true",
              timezoneOffset: 540,
              q: msg
          })

    return axios.get(`${URL}${process.env.LUIS_APP_ID}?${params}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
        })
}
