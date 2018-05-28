"use strict";

import LINEBase     from "../LINEBase"
import ChatWorkBase from "../ChatWorkBase"
import SlackBase    from "../SlackBase"

import {format} from 'date-fns'
import jaLocale from 'date-fns/locale/ja'
import lastDayOfMonth from 'date-fns/last_day_of_month'

import searchReturnDate from 'lib/api/google-calender/searchReturnDate'

/**
 * 次回の帰社日を検索する
 * @return {Promise} [description]
 */
const searchNext = () => {
    let startdate = new Date()

    let enddate = new Date()
        enddate.setMonth(enddate.getMonth()+1)

    return searchReturnDate(startdate, enddate)
}

/**
 * 今月の帰社日を検索する
 * @return {Promise} [description]
 */
const searchThisMonth = () => {
    let startdate = new Date()
        startdate.setDate(1)

    let enddate = lastDayOfMonth(startdate)

    return searchReturnDate(startdate, enddate)
}

/**
 * 来月の帰社日を検索する
 * @return {Promise} [description]
 */
const searchNextMonth = () => {
    let startdate = new Date()
        startdate.setDate(1)
        startdate.setMonth(startdate.getMonth()+1)

    let enddate = lastDayOfMonth(startdate)

    return searchReturnDate(startdate, enddate)
}

/**
 * 指定された月の帰社日を検索する
 * @param  {Int} month 検索する月
 * @return {Promise}   [description]
 */
const searchMonth = month => {
    let startdate = new Date()
        startdate.setDate(1)
        startdate.setMonth(month-1)

    let enddate = lastDayOfMonth(startdate)

    return searchReturnDate(startdate, enddate)
}

/**
 * 帰社日の日程を出す
 * @param {Base} BaseClass
 * @return {ReturnDate}
 */
const ReturnDate = (BaseClass) => {
    return class ReturnDate extends BaseClass {
        async execute()
        {
            let returnDate = null

            switch (this.intent.entities[0].entity)
            {
                case '次回':
                case '次':
                    returnDate = await searchNext()
                    break;
                case '今月':
                    returnDate = await searchThisMonth()
                    break;
                case '来月':
                    returnDate = await searchNextMonth()
                    break;
                default:
                    returnDate = await searchMonth(
                        parseInt(this.intent.entities[0].entity.replace(/ /g, ''))
                    )
            }

            if (returnDate !== null)
            {
                return this.replyMsg(`${format(returnDate, 'M/D（dd）', { locale: jaLocale })}です！`)
            }

            return this.replyMsg('帰社日の日付が取得できませんでした...')
        }
    }
}

/**
 * LINE用の帰社日確認スキル
 */
export class LINE extends ReturnDate(LINEBase)
{

}

/**
 * ChatWork用の帰社日確認スキル
 */
export class ChatWork extends ReturnDate(ChatWorkBase)
{

}

/**
 * Slack用の帰社日の目的スキル
 */
export class Slack extends ReturnDate(SlackBase)
{

}
