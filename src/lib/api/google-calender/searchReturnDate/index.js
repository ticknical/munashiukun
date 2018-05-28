"use strict";

import {format} from 'date-fns'
import jaLocale from 'date-fns/locale/ja'
import GoogleCalenderAPI from 'node-google-calendar'

const GoogleCalendar = new GoogleCalenderAPI({
    key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n"),
    serviceAcctId: process.env.GOOGLE_SERVICE_ACCOUNT_ID,
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
