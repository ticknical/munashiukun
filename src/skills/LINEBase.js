"use strict";

import {replyMessage} from 'lib/line/reply'
import Base from './Base'

/**
 * LINE用のベーススキル
 * 各スキルの実装はmixinでexecuteをoverrideしてください
 */
export default class LINEBase extends Base
{
    /**
     * constructor
     * @param  {Object}  event  webhook event
     * @param  {Object}  intent 言語解析の結果
     */
    constructor(event, intent)
    {
        super()

        this.token   = event.replyToken
        this.message = event.message.text
        this.intent  = intent
	}

    /**
     * メッセージを返信する
     * 各サービスへメッセージを返信するメソッドを実装してください
     * @param  {String} message 返信するメッセージ
     * @return {Promise}
     */
    replyMsg(message)
    {
        return replyMessage(this.token, message)
    }
}
