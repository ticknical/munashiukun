"use strict";

import {replyMessage} from 'lib/chatwork/reply'
import Base from './Base'

/**
 * ChatWork用のベースクラス
 * 各スキルの実装はmixinでexecuteをoverrideしてください
 */
export default class ChatworkBase extends Base
{
    /**
     * constructor
     * @param  {Object}  event  webhook event
     * @param  {Object}  intent 言語解析の結果
     */
    constructor(event, intent)
    {
        super()

        this.message = event.webhook_event.body
            .replace("[To:1459323] わんこさん", "")
            .replace(/^\n/, "")
        this.roomId = event.webhook_event.room_id
        this.userId = event.webhook_event.from_account_id
        this.messageId = event.webhook_event.message_id

        this.intent = intent
	}

    /**
     * メッセージを返信する
     * 各サービスへメッセージを返信するメソッドを実装してください
     * @param  {String} message 返信するメッセージ
     * @return {Promise}
     */
    replyMsg(message)
    {
        return replyMessage(this.roomId, this.userId, this.messageId, message)
    }
}
