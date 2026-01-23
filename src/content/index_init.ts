/**
 * @description 首页第一次进入时，操作 DOM 删除广告视频
 * @author 14K
 */

const videoList = document.querySelectorAll('.feed-card')
videoList.forEach((card) => {
    const parent = card.querySelector('.bili-video-card__wrap')
    if (!parent) return

    const aElement = parent.querySelector('a')
    // 检查链接：如果是广告，链接通常不是 /video/ 开头 (可能是 /cm/ 或跳转链接)
    // 注意：这里保留原有逻辑，但要注意可能会误伤直播或专栏。
    // 原有逻辑比较激进，假设 Feed 流里除了视频就是广告。
    if (aElement && !aElement.href.startsWith('https://www.bilibili.com/video/')) {
        card.remove()
        console.log('[bilibili-ads-remover] Auto remove feed ad (DOM)')
    }
})
