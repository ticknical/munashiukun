"use strict";

import {google} from 'googleapis'
import auth from 'lib/api/google/auth'

const sheets = google.sheets({
    version: 'v4',
    auth: auth(['https://www.googleapis.com/auth/spreadsheets'])
})

/**
 * spreadsheet API batchUpdate
 * @param {String} spreadsheetId 
 * @param {Object} data 
 */
export function batchUpdate (spreadsheetId, data = []) {
    return sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
            valueInputOption: "USER_ENTERED",
            data: data,
        }
    })
}