"use strict";

import axios from 'axios'

/**
 * 指定した日付の12星座占いを取得する
 * @param  {String}  datetime
 * @return {Promise}
 */
export default (datetime) => {
    const URL    = 'http://api.jugemkey.jp/api/horoscope/free/'

    return axios.get(`${URL}${datetime}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
        })
}
