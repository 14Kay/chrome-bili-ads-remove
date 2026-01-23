/**
 * @description 首页第一次进入时，操作 DOM 删除广告视频
 * @author 14K
 */

const videoList = document.body.getElementsByClassName('feed-card')
for (let i = 0; i < videoList.length; i++) {
    const parent = videoList[i].getElementsByClassName('bili-video-card__wrap')[0]
    const aElement = parent?.querySelector('a')
    if (aElement && !aElement.href.startsWith('https://www.bilibili.com/video/')) {
        const container = videoList[i].parentNode
        if (container) {
            container.removeChild(videoList[i])
            // 只有一个是广告视频，找到直接跳出
            break
        }
    }
}
