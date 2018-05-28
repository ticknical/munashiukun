"use strict";

import LINEBase     from "../LINEBase"
import ChatWorkBase from "../ChatWorkBase"
import SlackBase    from "../SlackBase"

/**
 * おみくじの運勢と配列
 * @type {Object}
 */
const percentage = {
    "大吉": 22,
    "中吉": 7,
    "吉": 12,
    "小吉": 25,
    "凶": 14,
    "大凶": 11,
}

/**
 * おみくじ配列を生成する
 * @param  {Object} arr 運勢と割合を設定したオブジェクト
 * @return {Array}      くじ
 */
const makeKuji = (arr) => {
    let kuji = []

    for(let name in arr) {
        for (let i = 1; i <= arr[name]; i++) {
            kuji.push(name)
        }
    }

    return kuji
}

/**
 * おみくじを引く
 * @param {Base} BaseClass
 * @return {Omikuji}
 */
const Omikuji = (BaseClass) => {
    return class Omikuji extends BaseClass {
        execute()
        {
            const kuji = makeKuji(percentage)

            const returnMsg = [
                '今日の運勢は「',
                kuji[Math.floor(Math.random() * kuji.length)],
                '」です。'
            ]

            return this.replyMsg(returnMsg.join(''))
        }
    }
}

/**
 * LINE用のおみくじスキル
 */
export class LINE extends Omikuji(LINEBase)
{

}

/**
 * ChatWork用のおみくじスキル
 */
export class ChatWork extends Omikuji(ChatWorkBase)
{

}

/**
 * Slack用の帰社日の目的スキル
 */
export class Slack extends Omikuji(SlackBase)
{

}
