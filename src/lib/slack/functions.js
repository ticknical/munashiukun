"use strict";

import crypto from 'crypto'

/**
 * webhookのリクエストが正当なものか検証する
 * @param  {Object}  post Slackのpostオブジェクト
 * @return {Boolean}
 */
export function isVerificate(post) {
    return (process.env.SLACK_TOKEN === post.token)
}
