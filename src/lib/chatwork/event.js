"use strict";

import luis           from 'lib/api/luis'
import chatbot        from 'lib/api/chatbot'
import {replyMessage} from 'lib/chatwork/reply'

/**
 * ChatWorkのイベント処理クラス
 */
export default class Event
{
    /**
     * constructor
     * @param  {Object} event webhookで渡されたeventオブジェクト
     */
    constructor(event)
    {
		this.event  = event
        this.intent = null
	}

    /**
     * イベントの処理を実行する
     * @return {Promise}
     */
    process()
    {
        return new Promise(async (resolve, reject) => {
            try
            {
                const message = this.event.webhook_event.body
                    .replace("[To:1459323] わんこさん", "")
                    .replace(/^\n/, "")

                this.intent = await luis(message)

                // 雑談
                if (this.intent.topScoringIntent.intent === 'None')
                {
                    replyMessage(
                        this.event.webhook_event.room_id,
                        this.event.webhook_event.from_account_id,
                        this.event.webhook_event.message_id,
                        await chatbot(message)
                    )
                }

                // コマンド実行
                if (this.intent.topScoringIntent.intent !== 'None')
                {
                    const skill = await this.getSkill(
                        this.intent.topScoringIntent.intent
                    )
                    skill.execute()
                }

                resolve()
            }
            catch (e)
            {
                reject()
            }
        })
    }

    /**
     * 行するスキルのインスタンスを取得する
     * @param  {String}    取得するスキル名
     * @return {Base} スキルインスタンス
     */
    async getSkill(name)
    {
        const Skill = await import(`skills/${name}`)
            .then(res => {
                return res.ChatWork
            })

        return new Skill(this.event, this.intent)
    }
}
