"use strict";

import {WebClient} from '@slack/web-api'

/**
 * チャンネルから指定した期間の会話ログを検索する
 * @param  {Object}  post Slackのpostオブジェクト
 * @return {Boolean}
 */
export default (channel, oldest = null, latest = null, cursor = null) => {
    const web = new WebClient(process.env.SLACK_ACCESS_TOKEN)

    return web.conversations.history({
        channel,
        cursor,
        oldest,
        latest
    })
    .then((res) => {
        return res.messages
    })
}
