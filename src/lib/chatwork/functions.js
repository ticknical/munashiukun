"use strict";

import crypto from 'crypto'
import { decode } from 'punycode';

/**
 * webhookのリクエストが正当なものか検証する
 * @param  {Object}  event Lambdaのeventオブジェクト
 * @return {Boolean}
 */
export function isVerificate(event) {
    const actual = crypto.createHmac(
                'sha256',
                new Buffer(process.env.CHATWORK_WEBHOOK_TOKEN, 'base64')
            )
            .update(Buffer.from(event.body))
            .digest('base64')

    return (event.headers['X-ChatWorkWebhookSignature'] === actual)
}
