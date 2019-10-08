"use strict";

import Base from './Base'
import { postMessage } from 'lib/slack/reply'

/**
 * Slack用のベーススキル
 * 各スキルの実装はmixinでexecuteをoverrideしてください
 */
export default class SlackBase extends Base
{
    /**
     * constructor
     * @param  {Object}  event   webhook event
     * @param  {String}  message message
     * @param  {Object}  intent  言語解析の結果
     */
    constructor(event, message, intent)
    {
        super()

        this.event   = event
        this.message = message
        this.intent  = intent
	}

    /**
     * メッセージを返信する
     * 各サービスへメッセージを返信するメソッドを実装してください
     * SlackはWebhookへのレスポンスで返信するのでそのまま返却する
     * @param  {String} message 返信するメッセージ
     * @return {Promise}
     */
    replyMsg(message)
    {
        return postMessage(
            this.event.event.channel,
            `<@${this.event.event.user}> ${message}`
        )
    }
}
