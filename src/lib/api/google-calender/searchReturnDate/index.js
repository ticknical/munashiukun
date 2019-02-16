"use strict";

import {format} from 'date-fns'
import jaLocale from 'date-fns/locale/ja'
import GoogleCalenderAPI from 'node-google-calendar'

/**
 * Googleのサービスアカウント情報
 */
const SERVICE_ACCOUNT = JSON.parse(
    new Buffer(process.env.GOOGLE_SERVICE_ACCOUNT,'base64').toString()
)

const GoogleCalendar = new GoogleCalenderAPI({
    key: SERVICE_ACCOUNT.private_key.replace(/\\n/g, "\n"),
    serviceAcctId: SERVICE_ACCOUNT.client_email,
    calendarId: process.env.GOOGLE_CALENDER_ID,
    timezone: 'UTC+09:00'
})

/**
 * 自然言語処理APIに通す
 * @param  {Date}    start 検索範囲（開始）
 * @param  {Date}    end   検索範囲（終了）
 * @return {Promise}
 */
export default (start, end) => {
    return GoogleCalendar.Events.list(process.env.GOOGLE_CALENDER_ID, {
    	timeMin: format(start, null, { locale: jaLocale }).replace(/\+00:00/g, '+09:00'),
    	timeMax: format(end, null, { locale: jaLocale }).replace(/\+00:00/g, '+09:00'),
    	q: '帰社日',
    	singleEvents: true,
    	orderBy: 'startTime'
    })
    .then(res => {
        return new Date(res[0].start.date.replace(/-/g, '/'))
    })
    .catch(e => {

    });
}
