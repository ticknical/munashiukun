"use strict";

import luis            from 'lib/api/luis'
import chatbot         from 'lib/api/chatbot'
import { postMessage } from 'lib/slack/reply'

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
                const message = this.event.event.text.replace(
                    `<@${this.event.authed_users[0]}> `,
                    ""
                )

                this.intent = await luis(message)

                // 雑談
                if (this.intent.topScoringIntent.intent === 'None')
                {
                    postMessage(
                        this.event.event.channel,
                        `<@${this.event.event.user}> ${await chatbot(message)}`
                    )

                    resolve()
                    return
                }

                // コマンド実行
                const skill = await this.getSkill(
                    this.intent.topScoringIntent.intent,
                    message
                )

                await skill.execute()

                resolve()
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
    async getSkill(name, message)
    {
        const Skill = await import(`skills/${name}`)
            .then(res => {
                return res.Slack
            })
            .catch(err => {
                postMessage(
                    this.event.event.channel,
                    `<@${this.event.event.user}> 指定されたスキルが見つかりませんでした...`
                )
            })

        return new Skill(this.event, message, this.intent)
    }
}
