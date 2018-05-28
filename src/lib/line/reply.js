"use strict";

const LINE = require('@line/bot-sdk')

/**
 * メッセージを返信する
 * @param  {String} replyToken 応答トークン
 * @param  {String} message    返信するメッセージ
 * @return {Promise}
 */
export function replyMessage (replyToken, message)
{
    const client = new LINE.Client({
        channelAccessToken: process.env.LINE_ACCESS_TOKEN,
        channelSecret: process.env.LINE_CHANNEL_SECRET
    })

    return client.replyMessage(replyToken, {
        type: 'text',
        text: message
    })
}
