/* From https://github.com/SocialSisterYi/bilibili-API-collect/blob/e5fbfed42807605115c6a9b96447f6328ca263c5/docs/dynamic/dynamic_enum.md#%E5%8A%A8%E6%80%81%E4%B8%BB%E4%BD%93%E7%B1%BB%E5%9E%8B */
export enum Major {
    /* 动态失效/转发动态 */
    NONE = "MAJOR_TYPE_NONE",
    /* 图文动态 */
    OPUS = "MAJOR_TYPE_OPUS",
    /* 视频动态 */
    ARCHIVE = "MAJOR_TYPE_ARCHIVE",
    /* 剧集更新 */
    PGC = "MAJOR_TYPE_PGC",
    /* 未知 */
    COURSES = "MAJOR_TYPE_COURSES",
    /* 带图动态 */
    DRAW = "MAJOR_TYPE_DRAW",
    /* 未知 */
    ARTICLE = "MAJOR_TYPE_ARTICLE",
    /* 音频更新 */
    MUSIC = "MAJOR_TYPE_MUSIC",
    /* 一般类型 */
    COMMON = "MAJOR_TYPE_COMMON",
    /* 	直播间分享 */
    LIVE = "MAJOR_TYPE_LIVE",
    /* 未知 */
    MEDIALIST = "MAJOR_TYPE_MEDIALIST",
    APPLET = "MAJOR_TYPE_APPLET",
    SUBSCRIPTION = "MAJOR_TYPE_SUBSCRIPTION",
    /* 直播状态 */
    LIVE_RCMD = "MAJOR_TYPE_LIVE_RCMD",
    /* 合集更新 */
    UGC_SEASON = "MAJOR_TYPE_UGC_SEASON",
    SUBSCRIPTION_NEW = "MAJOR_TYPE_SUBSCRIPTION_NEW",
}
