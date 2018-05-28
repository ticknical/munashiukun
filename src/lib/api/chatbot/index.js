"use strict";

import axios from 'axios'

/**
 * 会話APIを叩いて返答を取得する
 * @param  {String} message 受信したメッセージ
 * @return {Promise}        返答
 */
export default (message) => {
    return axios
        .post(
            'https://chatbot-api.userlocal.jp/api/chat',
            {
                key: process.env.CHATBOT_APIKEY,
                message: message
            },
            {
                responseType: 'json'
            }
        )
        .then(res => {
            return res.data.result
        })
}
