"use strict";

/**
 * 各種スキルのベースクラス
 */
export default class Base
{
    /**
     * スキルを実行する
     * 各スキルを実行するメソッドを実装してください
     * @return {Error} 未実装の場合は例外が投げられる
     */
    execute()
    {
        throw new Error('未実装です！')
    }

    /**
     * メッセージを返信する
     * 各サービスへメッセージを返信するメソッドを実装してください
     * @param  {String} message 返信するメッセージ
     * @return {Promise}
     */
    replyMsg(message)
    {
        throw new Error('未実装です！')
    }
}
