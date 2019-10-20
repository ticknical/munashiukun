"use strict";

import {google} from 'googleapis'
import auth from 'lib/api/google/auth'

const sheets = google.sheets({
    version: 'v4',
    auth: auth(['https://www.googleapis.com/auth/spreadsheets'])
})

/**
 * shareのログを書き込む
 * @param  {Array}   values
 * @return {Promise}
 */
export default async (values) => {
    return sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_SHARE_ID,
        range: 'A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values
        },
    })
    .then((res) => {})
}
