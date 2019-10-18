"use strict";

import {format} from 'date-fns'
import jaLocale from 'date-fns/locale/ja'
import {google} from 'googleapis'
import auth from 'lib/api/google/auth'

const calendar = google.calendar({
    version: 'v3',
    auth: auth(['https://www.googleapis.com/auth/calendar.readonly'])
})

/**
 * 指定された期間で帰社日を検索する
 * @param  {Date}    start 検索範囲（開始）
 * @param  {Date}    end   検索範囲（終了）
 * @return {Promise}
 */
export default async (start, end) => {
    return calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDER_ID,
    	timeMin: format(start, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { locale: jaLocale }).replace(/\+00:00/g, '+09:00'),
    	timeMax: format(end, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { locale: jaLocale }).replace(/\+00:00/g, '+09:00'),
    	q: '帰社日',
    	singleEvents: true,
        orderBy: 'startTime',
        timezone: 'UTC+09:00'
    })
    .then(res => {
        return new Date(res.data.items[0].start.date.replace(/-/g, '/'))
    })
    .catch(e => {});
}
