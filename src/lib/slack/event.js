"use strict";

import luis           from 'lib/api/luis'
import chatbot        from 'lib/api/chatbot'

/**
 * Slackのイベント処理クラス
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
                const message = this.event.text.replace(`${this.event.trigger_word} `, "")

                this.intent = await luis(message)

                // 雑談
                if (this.intent.topScoringIntent.intent === 'None')
                {
                    resolve(this.response(await chatbot(message)))
                }

                // コマンド実行
                const skill = await this.getSkill(
                    this.intent.topScoringIntent.intent
                )

                resolve(this.response(await skill.execute()))
            }
            catch (e)
            {
                reject(e)
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
                return res.Slack
            })

        return new Skill(this.event, this.intent)
    }

    /**
     * SlackへレスポンスするObjectを整形する
     * @param {String} message
     * @return {Object}
     */
    response(message)
    {
        return {
            text: `@${this.event.user_name} ${message}`,
            link_names: 1
        }
    }
}
