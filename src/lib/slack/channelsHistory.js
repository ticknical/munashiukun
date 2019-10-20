"use strict";

import {WebClient} from '@slack/web-api'

/**
 * 指定した期間のチャンネルログを検索する
 * @param  {Object}  post Slackのpostオブジェクト
 * @return {Boolean}
 */
export default (channel, oldest, latest) => {
    const web = new WebClient(process.env.SLACK_ACCESS_TOKEN)

    return web.channels.history({
        channel,
        oldest,
        latest
    })
    .then((res) => {
        return res.messages
    })
}
