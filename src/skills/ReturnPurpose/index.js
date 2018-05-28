"use strict";

import LINEBase     from "../LINEBase"
import ChatWorkBase from "../ChatWorkBase"
import SlackBase    from "../SlackBase"

const eol = require('eol')

/**
 * 帰社日の目的のカンペ
 * @type {String[]}
 */
const RETURN_PURPOSE = [
    '【帰社日の目的】',
    '今後も選ばれ続けるビジネスパーソンになるために',
    'SESだし仕事なくなるよね'
]

/**
 * 社名の由来のカンペ
 * @type {String[]}
 */
const COMPANY_NAME_ORIGIN = [
    '【社名の由来】',
    '一燈照隅万燈照国　天台宗 最澄',
    '一人ひとりが与えられた環境で役割を全うすることで組織は成り立っている'
]

/**
 * 企業理念のカンペ
 * @type {String[]}
 */
const CORPORATE_PHILOSOPHY = [
    '【企業理念】',
    'より遠くに向かって歩み始めるために歩み続けるために',
    '長くエンジニアとして働いてもらうサポートをする会社',
]

/**
 * 経営理念のカンペ
 * @type {String[]}
 */
const MANAGEMENT_PHILOSOPHY = [
    '【経営理念】',
    '己を空しうする',
    '目の前の人に全力で尽くす',
    '☆他の人に奉仕しなさい（貢献をしなさい）'
]

/**
 * 人材理念のカンペ
 * @type {String[]}
 */
const HUMAN_RESOURCES_PHILOSOPHY = [
    '【人材理念】',
    '仁徳・義徳・礼徳',
    '慈（いつく）しみの心をもって他人に無償で尽くしましょう',
    '人を裏切らない',
    '丁寧な言葉遣いを使うこと',
    '　他の徳',
    '　　・智徳',
    '　　　勉強しましょう',
    '　　・信徳',
    '　　　人としての魅力',
    '　　　他の徳を高めると信徳が高まる',
]

/**
 * カンペの全体版を作る
 * @return {String[]}
 */
const ALL = () => {
    let all = []

    Array.prototype.push.apply(all, RETURN_PURPOSE);
    all.push('')
    Array.prototype.push.apply(all, COMPANY_NAME_ORIGIN)
    all.push('')
    Array.prototype.push.apply(all, CORPORATE_PHILOSOPHY)
    all.push('')
    Array.prototype.push.apply(all, MANAGEMENT_PHILOSOPHY)
    all.push('')
    Array.prototype.push.apply(all, HUMAN_RESOURCES_PHILOSOPHY)

    return all
}

/**
 * 帰社日のカンペを出す
 * @param {Base} BaseClass
 * @return {ReturnPurpose}
 */
const ReturnPurpose = (BaseClass) => {
    return class ReturnPurpose extends BaseClass {
        execute()
        {
            if (this.intent.entities.length === 0) {
                return this.replyMsg(ALL().join(eol.auto))
            }

            switch (this.intent.entities[0].entity.replace(/ /g, "")) {
                case '帰社日の目的':
                case '社内研修の目的':
                    return this.replyMsg(RETURN_PURPOSE.join(eol.auto))
                    break;
                case '一燈の社名の由来':
                case '社名の由来':
                    return this.replyMsg(COMPANY_NAME_ORIGIN.join(eol.auto))
                    break;
                case '一燈の企業理念':
                case '企業理念':
                    return this.replyMsg(CORPORATE_PHILOSOPHY.join(eol.auto))
                    break;
                case '一燈の経営理念':
                case '経営理念':
                    return this.replyMsg(MANAGEMENT_PHILOSOPHY.join(eol.auto))
                    break;
                case '一燈の人材理念':
                case '人材理念':
                    return this.replyMsg(HUMAN_RESOURCES_PHILOSOPHY.join(eol.auto))
                    break;
                default:
                    return this.replyMsg('何が聞きたいのかはっきりしませんでした')
                    break;
            }
        }
    }
}

/**
 * LINE用の帰社日の目的スキル
 */
export class LINE extends ReturnPurpose(LINEBase)
{

}

/**
 * ChatWork用の帰社日の目的スキル
 */
export class ChatWork extends ReturnPurpose(ChatWorkBase)
{

}

/**
 * Slack用の帰社日の目的スキル
 */
export class Slack extends ReturnPurpose(SlackBase)
{

}
