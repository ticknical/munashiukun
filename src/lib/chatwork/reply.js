"use strict";

const chatwork = require('chatwork-client')

/**
 * メッセージを返信する
 * @param  {int} roomId 返信するルームID
 * @param  {int} userId 返信するユーザーID
 * @param  {int} messageId 返信するメッセージID
 * @param  {String} message    返信するメッセージ
 * @return {Promise}
 */
export function replyMessage(roomId, userId, messageId, message)
{
    // initialize.
    chatwork.init({
        chatworkToken: process.env.CHATWORK_API_TOKEN,
        roomId: roomId,
        msg: [
            `[rp aid=${userId} to=${roomId}-${messageId}]`,
            message
        ].join('\n')
    });

    // post massage.
    // postRoomMessages return Promse Object.
    return chatwork.postRoomMessages()
}
