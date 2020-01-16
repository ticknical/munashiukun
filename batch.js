"use strict";

import 'babel-polyfill'

import axios from 'axios'
import {IncomingWebhook} from '@slack/webhook'

import searchReturnDate from 'lib/api/google/calendar/searchReturnDate'
import {batchUpdate} from 'lib/api/google/sheets'
import fetchTechCells from 'lib/api/google/sheets/fetchTechCells'
import shareBackNumber from 'lib/api/google/sheets/shareBackNumber'
import {getForecast} from 'lib/api/livedoor/forecast'
import channelsHistory from 'lib/slack/channelsHistory'
import conversationsHistory from 'lib/slack/conversationsHistory'

import {format} from 'date-fns'
import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import fromUnixTime from 'date-fns/fromUnixTime'
import startOfDay from 'date-fns/startOfDay'
import startOfYesterday from 'date-fns/startOfYesterday'
import getUnixTime from 'date-fns/getUnixTime'
import jaLocale from 'date-fns/locale/ja'

const cheerio = require('cheerio')
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
          enddate    = addDays(new Date,7),
          returnDate = await searchReturnDate(startdate, enddate),
          diff       = getDiff(startdate.toDateString(),returnDate)

    // 帰社日1週間前の通知
    if (diff === RETURNDATE_ONE_WEEK_AGO)
    {
        webhook.send(`<!channel> ${format(returnDate, 'M/d（E）', {locale: jaLocale})}の帰社日まであと1週間です！`)
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

/**
 * #shareバックナンバー機能のエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.share = async (event, context, callback) => {
    const yesterday = startOfYesterday()

    const messages = await channelsHistory(
        process.env.SLACK_SHARE_CHANNEL_ID,
        getUnixTime(startOfDay(yesterday)),
        getUnixTime(endOfDay(yesterday))
    )

    const urls = [];
    await messages.forEach((message) => {
        const url_arr = message.text.match(
            /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/ig
        )

        if (url_arr === null) {
            return
        }

        urls.push(...url_arr)
    })

    const results = await Promise.all(
        urls.map((url) => {
            return axios.get(url)
        })
    )

    await shareBackNumber(results.map((result) => {
        const $ = cheerio.load(result.data, {
            decodeEntities: false
        })

        return [
            format(yesterday, 'yyyy/MM/dd'),
            result.config.url,
            $('title').text()
        ]
    }))
}

/**
 * 会話ログからユーザー別の質問・回答数を集計する
 * @param {Array} messages
 * @return {Object}
 */
const countTech = messages => {
    const counts = {};

    messages.forEach(message => {
        if (typeof message.subtype !== 'undefined') {
            return;
        }

        const year = format(fromUnixTime(message.ts), "yyyy");
        const month = format(fromUnixTime(message.ts), "M");

        if (typeof counts[year] === 'undefined') {
            counts[year] = {};
        }

        if (typeof counts[year][month] === 'undefined') {
            counts[year][month] = {};
        }

        if (typeof counts[year][month][message.user] === 'undefined') {
            counts[year][month][message.user] = {
                question: 0,
                answer: 0
            };
        }

        counts[year][month][message.user].question++;

        if (typeof message.reply_users === 'object') {
            message.reply_users.forEach(reply_user => {
                if (typeof counts[year][month][reply_user] === 'undefined') {
                    counts[year][month][reply_user] = {
                        question: 0,
                        answer: 0
                    };
                }
                counts[year][month][reply_user].answer++;
            })
        }
    });

    return counts;
}

/**
 * 質問・回答数の集計結果からSpreadsheets API用のデータを生成する
 * @param {Object} counts
 * @return {Promise}
 */
const buildData = async (counts) => {
    const promises = [];

    for (let year of Object.keys(counts)) {
        const ids = await fetchId(year)

        for (let month of Object.keys(counts[year])) {
            const col = 4 + (2 * (month - 1));
            const question_col = toColumnLetter(col)
            const answer_col = toColumnLetter(col + 1)

            for (let user of Object.keys(counts[year][month])) {
                const idx = ids.indexOf(user)
                if (idx === -1) {
                    continue;
                }

                promises.push(new Promise(async (resolve, reject) => {
                    const row_no = idx + 3
                    const value = await fetchTechCells([
                        `${year}年!${question_col}${row_no}`,
                        `${year}年!${answer_col}${row_no}`,
                    ]);

                    const count = counts[year][month][user]

                    resolve({
                        range: `${year}年!${question_col}${row_no}`,
                        majorDimension: "ROWS",
                        values: [
                            [
                                String(parseInt(value[0]) + count.question),
                                String(parseInt(value[1]) + count.answer)
                            ]
                        ],
                    });
                }));
            }
        }
    }

    return Promise.all(promises);
}

/**
 * techシートからSlack IDの列を引いてくる
 * @param {*} year 年
 */
const fetchId = async year => {
    return await fetchTechCells([
        `${year}年!A3:A100`
    ])
}

import { toColumnLetter } from 'excel-lettering'

/**
 * #shareバックナンバー機能のエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.tech = async (event, context, callback) => {
    const yesterday = startOfYesterday()

    const messages = await conversationsHistory(
        process.env.SLACK_TECH_CHANNEL_ID,
        getUnixTime(startOfDay(yesterday)),
        getUnixTime(endOfDay(yesterday))
    )
    const counts = countTech(messages);

    const values = await buildData(counts);
    await batchUpdate(process.env.SPREADSHEET_TECH_ID, values)
}
