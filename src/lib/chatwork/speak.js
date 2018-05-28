"use strict";

const chatwork = require('chatwork-client')

/**
 * 指定したルームのユーザー全員にメッセージを送信する
 * @param  {int} roomId 返信するルームID
 * @param  {String} message 返信するメッセージ
 * @return {Promise}
 */
export function toAll(roomId, message)
{
    // initialize.
    chatwork.init({
        chatworkToken: process.env.CHATWORK_API_TOKEN,
        roomId: roomId,
        msg: [
            `[toall]`,
            message
        ].join('\n')
    });

    // post massage.
    // postRoomMessages return Promse Object.
    return chatwork.postRoomMessages()
}
