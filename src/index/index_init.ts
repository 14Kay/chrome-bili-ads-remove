/*
 * @Description: 首页第一次进
 * @Author: 14K
 * @Date: 2023-11-18 16:21:09
 * @LastEditTime: 2023-11-18 16:38:08
 * @LastEditors: 14K
 */

const videoList = document.body.getElementsByClassName("feed-card")
for (var i = 0; i < videoList.length; i++) {
    const parent = videoList[i].getElementsByClassName("bili-video-card__wrap")[0];
    const aElement = parent.querySelector("a");
    if (!aElement?.href.startsWith("https://www.bilibili.com/video/")) {
        const container = videoList[i].parentNode;
        if (container) {
            container.removeChild(videoList[i]);
            // 只有一个是广告视频 找到直接跳出
            break
        }
    }
}