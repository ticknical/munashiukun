"use strict";

import {google} from 'googleapis'
import auth from 'lib/api/google/auth'

const sheets = google.sheets({
    version: 'v4',
    auth: auth(['https://www.googleapis.com/auth/spreadsheets'])
})

/**
 * techのシートから現状の質問数・回答数を取得してくる
 * @param  {Array}   ranges
 * @return {Array}
 */
export default async (ranges = []) => {
    const results = await sheets.spreadsheets.get({
        spreadsheetId: process.env.SPREADSHEET_TECH_ID,
        ranges,
        includeGridData: true
    })

    const values = []
    results.data.sheets.forEach(sheet => {
        sheet.data.forEach(datum => {
            datum.rowData.forEach(row => {
                row.values.forEach(value => {
                    values.push(value.formattedValue)
                })
            })
        })
    })

    return values
}