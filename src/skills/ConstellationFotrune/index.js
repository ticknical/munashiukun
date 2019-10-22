"use strict";

import LINEBase     from "../LINEBase"
import ChatWorkBase from "../ChatWorkBase"
import SlackBase    from "../SlackBase"
import {format} from 'date-fns'
import fortune from 'lib/api/web-ad-fotrune'

const eol = require('eol')

/**
 * 五段階評価の星を生成する
 * @param {Int} point
 */
const star = (point) => {
    const MAX = 5;
    let stars = [];

    for (let i = 0; i < point; i++) {
        stars.push('★')
    }

    if (point !== MAX) {
        for (let j = 0; j < MAX - point; j++) {
            stars.push('☆')
        }
    }

    return stars.join('')
}

/**
 * 12星座占いを実行する
 * @param {Base} BaseClass
 * @return {ConstellationFotrune}
 */
const ConstellationFotrune = (BaseClass) => {
    return class ConstellationFotrune extends BaseClass {
        async execute()
        {
            const today = format(new Date(), 'yyyy/MM/dd')
            const resultall = await fortune(today)
            const constellation= this.intent.entities[0].entity.replace(/ /g, "")

            let result;

            switch (constellation) {
                case '牡羊座':
                case 'おひつじ座':
                    result = resultall['horoscope'][today][0]
                    break;
                case '牡牛座':
                case 'おうし座':
                    result = resultall['horoscope'][today][1]
                    break;
                case '双子座':
                case 'ふたご座':
                    result = resultall['horoscope'][today][2]
                    break;
                case '蟹座':
                case 'かに座':
                    result = resultall['horoscope'][today][3]
                    break;
                case '獅子座':
                case 'しし座':
                    result = resultall['horoscope'][today][4]
                    break;
                case '乙女座':
                case 'おとめ座':
                    result = resultall['horoscope'][today][5]
                    break;
                case '天秤座':
                case 'てんびん座':
                    result = resultall['horoscope'][today][6]
                    break;
                case '蠍座':
                case 'さそり座':
                    result = resultall['horoscope'][today][7]
                    break;
                case '射手座':
                case 'いて座':
                    result = resultall['horoscope'][today][8]
                    break;
                case '山羊座':
                case 'やぎ座':
                    result = resultall['horoscope'][today][9]
                    break;
                case '水瓶座':
                case 'みずがめ座':
                    result = resultall['horoscope'][today][10]
                    break;
                case '魚座':
                case 'うお座':
                    result = resultall['horoscope'][today][11]
                    break;
                default:
                    return this.replyMsg('どの星座か分かりませんでした...')
            }

            return this.replyMsg([
                `今日の${constellation}のあなたは${result.content}`,
                '',
                `金運：${star(result.money)}`,
                `仕事運：${star(result.job)}`,
                `恋愛運：${star(result.love)}`,
                `総合運：${star(result.total)}`,
                `ラッキーアイテム：${result.item}`,
                `ラッキーカラー：${result.color}`,
                '',
                'Powered by',
                'http://jugemkey.jp/api/waf/api_free.php',
                'http://www.tarim.co.jp/'
            ].join(eol.auto))
        }
    }
}

/**
 * LINE用の帰社日の目的スキル
 */
export class LINE extends ConstellationFotrune(LINEBase)
{

}

/**
 * ChatWork用の帰社日の目的スキル
 */
export class ChatWork extends ConstellationFotrune(ChatWorkBase)
{

}

/**
 * Slack用の帰社日の目的スキル
 */
export class Slack extends ConstellationFotrune(SlackBase)
{

}
