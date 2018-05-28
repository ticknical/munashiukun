"use strict";

import axios from 'axios'

/**
 * 天気情報を取得する
 * @param  {string} code 1次細分コード
 * @return {Promise}        返答
 */
export function getForecast(code) {
    return axios
        .get(
            `http://weather.livedoor.com/forecast/webservice/json/v1?city=${code}`,
            {
                responseType: 'json'
            }
        )
        .then(res => {
            return res.data.forecasts
        })
}
