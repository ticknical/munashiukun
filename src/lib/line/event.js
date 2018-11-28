"use strict";

import luis           from 'lib/api/luis'
import chatbot        from 'lib/api/chatbot'
import {replyMessage} from 'lib/line/reply'

/**
 * LINEのイベント処理クラス
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
        return new Promise((resolve, reject) => {
            try
            {
                if (this.isType('message'))
                {
                    this.processMessage()
                    resolve()
                }
            }
            catch (e)
            {
                reject()
            }
        })
    }

    /**
     * messageイベントの処理を実行する
     * @return {Promise}
     */
    async processMessage()
    {
        this.intent = await luis(this.event.message.text)

        // 雑談
        if (this.intent.topScoringIntent.intent === 'None')
        {
            replyMessage(this.event.replyToken, await chatbot(this.event.message.text))
        }

        // コマンド実行
        if (this.intent.topScoringIntent.intent !== 'None')
        {
            const skill = await this.getSkill(
                this.intent.topScoringIntent.intent
            )
            skill.execute()
        }
    }

    /**
     * 指定されたイベントタイプか判定する
     * @param  {String}  type
     * @return {Boolean}
     */
    isType(type)
    {
        return (this.event.type === type)
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
                return res.LINE
            })
            .catch(err => {
                replyMessage(this.event.replyToken, '指定されたスキルが見つかりませんでした...')
            })

        return new Skill(this.event, this.intent)
    }
}
