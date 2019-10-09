"use strict";

import { WebClient } from '@slack/web-api'

/**
 * メッセージを返信する
 * @param  {String} channel channel
 * @param  {String} message 返信するメッセージ
 * @return {Promise}
 */
export function postMessage (channel, message)
{
    const web = new WebClient(process.env.SLACK_ACCESS_TOKEN)

    return web.chat.postMessage({
        channel: channel,
        text: message
    })
}
