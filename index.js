"use strict";

import 'babel-polyfill'

import {isVerificate as isLineVerificate} from 'lib/line/functions'
import LINEEvent from 'lib/line/event'

import {isVerificate as isCWVerificate} from 'lib/chatwork/functions'
import ChatWorkEvent from 'lib/chatwork/event'

import SlackEvent from 'lib/slack/event'

import alexa from 'alexa-sdk'

/**
 * LINE版むなしうくんのエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.line = async (event, context, callback) => {
    const e = JSON.parse(event.body)

    // LINE以外からリクエストされた場合
    if (!isLineVerificate(event))
    {
        context.callbackWaitsForEmptyEventLoop = false
        callback(new Error("Signature is invalidate!"))
    }

    e.events.forEach(event => {
        new LINEEvent(event).process()
    })

    callback(null, "webhook end.")
}

/**
 * ChatWork版むなしうくんのエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.chatwork = async (event, context, callback) => {
    const e = JSON.parse(event.body)

    // ChatWork以外からリクエストされた場合
    if (!isCWVerificate(event))
    {
        context.callbackWaitsForEmptyEventLoop = false
        callback(new Error("Signature is invalidate!"))
    }

    new ChatWorkEvent(e).process()

    callback(null, "webhook end.")
}

/**
 * Slack版むなしうくんのエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.slack = async (event, context, callback) => {
    const e = event.body

    if (e.type === 'url_verification')
    {
        context.callbackWaitsForEmptyEventLoop = false
        callback(null, {
            statusCode: 200,
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "challenge": e.challenge
            })
        })
        return;
    }

    // eventを処理する
    await new SlackEvent(e).process()

    callback(null, {
        statusCode: 200,
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "result": true
        })
    })
}

/**
 * @const 言語ごとのメッセージ
 * @type {Object}
 */
const languageStrings = {
    "ja": {
        translation: {
            HELP_MESSAGE: "株式会社一燈の公式ゆるキャラ、むなしうくんです。そのうちいろんなことができるようになる予定だよ。",
            STOP_MESSAGE: "スキルを終了します。",
            IMPREMENTING: "現在実装中です。中の人が頑張ってるので、もう少し待っててね。"
        },
    },
};

/**
 * @const Alexaスキルの処理
 * @type {Object}
 */
const handlers = {
    // 起動時の処理
    "LaunchRequest": function () {
        this.emit("AMAZON.HelpIntent");
    },
    // 「ヘルプ」とか言ったときの処理
    "AMAZON.HelpIntent": function () {
        this.emit(":tell", this.t("HELP_MESSAGE"));
    },
    // 「キャンセル」とか言ったときの処理
    "AMAZON.CancelIntent": function () {
        this.emit("AMAZON.StopIntent");
    },
    // 「ストップ」とか言ったときの処理
    "AMAZON.StopIntent": function () {
        this.emit(":tell", this.t("STOP_MESSAGE"));
    },
    // 帰社日日程確認
    "ReturnDateIntent": function () {
        this.emit(":tell", this.t('IMPREMENTING'));
    },
};

/**
 * Alexa版むなしうくんのエンドポイント
 * @param  {Object}   event    リクエスト情報の格納されたオブジェクト
 * @param  {Object}   context  ランタイム情報の格納されたオブジェクト
 * @param  {Function} callback callback
 */
module.exports.alexa = async (event, context, callback) => {
    const alexaHandler = alexa.handler(event, context, callback);

    alexaHandler.appId     = process.env.ALEXA_SKILL_ID;
    alexaHandler.resources = languageStrings;

    alexaHandler.registerHandlers(handlers);
    alexaHandler.execute();
}
