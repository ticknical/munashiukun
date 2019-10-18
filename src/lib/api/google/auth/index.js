"use strict";

import {google} from 'googleapis'

const SERVICE_ACCOUNT = JSON.parse(
    new Buffer(process.env.GOOGLE_SERVICE_ACCOUNT, 'base64').toString()
)

export default (scopes = []) => {
    return new google.auth.JWT(
        SERVICE_ACCOUNT.client_email,
        null,
        SERVICE_ACCOUNT.private_key,
        scopes,
        null
    )
}
