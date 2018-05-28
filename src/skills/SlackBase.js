"use strict";

import Base from './Base'

/**
 * Slack用のベーススキル
 * 各スキルの実装はmixinでexecuteをoverrideしてください
 */
export default class SlackBase extends Base
{
    /**
     * constructor
     * @param  {Object}  event  webhook event
     * @param  {Object}  intent 言語解析の結果
     */
    constructor(event, intent)
    {
        super()

        this.message = event.text.replace(`${event.trigger_word} `, "")
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
        return message
    }
}
