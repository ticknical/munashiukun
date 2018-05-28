"use strict";

import crypto from 'crypto'

/**
 * webhookのリクエストが正当なものか検証する
 * @param  {Object}  event Lambdaのeventオブジェクト
 * @return {Boolean}
 */
export function isVerificate(event) {
    const actual = crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET)
            .update(Buffer.from(event.body))
            .digest('base64')

    return (event.headers['X-Line-Signature'] === actual)
}
