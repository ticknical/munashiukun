"use strict";

import 'babel-polyfill'

import {IncomingWebhook} from '@slack/client'

import searchReturnDate from 'lib/api/google-calender/searchReturnDate'
import {getForecast} from 'lib/api/livedoor/forecast'
import {format} from 'date-fns'
import jaLocale from 'date-fns/locale/ja'

const eol = require('eol')

/**
 * 2つの日付の間の差分を求める
 * @param {String} date1Str
 * @param {String} date2Str
 * @return {Int} 差分の日数
 */
const getDiff = (date1Str, date2Str) => {
	const date1 = new Date(date1Str),
          date2 = new Date(date2Str)

    // getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
    const msDiff = date2.getTime() - date1.getTime()

	// 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
	return Math.floor(msDiff / (1000 * 60 * 60 *24))
}

/**
 * 帰社日通知機能のエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.returndate = async (event, context, callback) => {
    const webhook = new IncomingWebhook(process.env.SLACK_GENERAL_WEBHOOK_URL)
    const RETURNDATE_ONE_WEEK_AGO = 7
    const RETURNDATE_ONE_DAY_AGO = 1

    const startdate  = new Date(),
          enddate    = new Date().setDate(new Date().getDate()+7),
          returnDate = await searchReturnDate(startdate, enddate),
          diff       = getDiff(startdate.toDateString(),returnDate)

    // 帰社日1週間前の通知
    if (diff === RETURNDATE_ONE_WEEK_AGO)
    {
        webhook.send(`<!channel> ${format(returnDate, 'M/D（dd）', {locale: jaLocale})}の帰社日まであと1週間です！`)
        callback(null, "webhook end.")
        return;
    }

    // 帰社日前日の通知
    if (diff === RETURNDATE_ONE_DAY_AGO)
    {
        const forecast = await getForecast('130010')

        webhook.send([
            '<!channel> 明日は帰社日です！',
            `明日の天気予報は${forecast[1].telop}です。`
        ].join(eol.auto))

        callback(null, "webhook end.")
        return
    }

    callback(null, "webhook end.")
    return
}
