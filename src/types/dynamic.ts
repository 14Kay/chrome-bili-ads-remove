/*
 * @Description: 
 * @Author: 14K
 * @Date: 2024-11-12 16:19:14
 * @LastEditTime: 2024-11-12 16:24:37
 * @LastEditors: 14K
 */

export enum Dynamic {
    /* 无效动态 */
    NONE = "DYNAMIC_TYPE_NONE",
    /* 动态转发 */
    FORWARD = "DYNAMIC_TYPE_FORWARD",
    /* 投稿视频 */
    AV = "DYNAMIC_TYPE_AV",
    /* 剧集（番剧、电影、纪录片） */
    PGC = "DYNAMIC_TYPE_PGC",
    COURSES = "DYNAMIC_TYPE_COURSES",
    /* 纯文字动态 */
    WORD = "DYNAMIC_TYPE_WORD",
    /* 带图动态 */
    DRAW = "DYNAMIC_TYPE_DRAW",
    /* 投稿专栏 */
    ARTICLE = "DYNAMIC_TYPE_ARTICLE",
    /* 音乐 */
    MUSIC = "DYNAMIC_TYPE_MUSIC",
    /* 装扮 剧集点评 普通分享 */
    COMMON_SQUARE = "DYNAMIC_TYPE_COMMON_SQUARE",
    COMMON_VERTICAL = "DYNAMIC_TYPE_COMMON_VERTICAL",
    /* 直播间分享 */
    LIVE = "DYNAMIC_TYPE_LIVE",
    /* 收藏夹 */
    MEDIALIST = "DYNAMIC_TYPE_MEDIALIST",
    /* 课程 */
    COURSES_SEASON = "DYNAMIC_TYPE_COURSES_SEASON",
    COURSES_BATCH = "DYNAMIC_TYPE_COURSES_BATCH",
    AD = "DYNAMIC_TYPE_AD",
    APPLET = "DYNAMIC_TYPE_APPLET",
    SUBSCRIPTION = "DYNAMIC_TYPE_SUBSCRIPTION",
    /* 直播开播 */
    LIVE_RCMD = "DYNAMIC_TYPE_LIVE_RCMD",
    BANNER = "DYNAMIC_TYPE_BANNER",
    /* 合集更新 */
    UGC_SEASON = "DYNAMIC_TYPE_UGC_SEASON",
    SUBSCRIPTION_NEW = "DYNAMIC_TYPE_SUBSCRIPTION_NEW",
}