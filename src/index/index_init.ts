/*
 * @Description: 首页第一次进(首页默认是SSR渲染的)入时，操作DOM删除广告视频
 * @Author: 14K
 * @Date: 2023-11-18 16:21:09
 * @LastEditTime: 2024-11-22 10:52:00
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

const adCardObserver = new MutationObserver(function (mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    // 如果新增的节点或其子节点包含 class 为 adcard-content，删除该节点
                    if (element.classList.contains('adcard-content')) {
                        element.remove();
                        adCardObserver.disconnect(); 
                    } else {
                        // 如果子节点包含目标 class，则删除
                        const adCard = element.querySelector('.adcard-content');
                        if (adCard) {
                            adCard.remove();
                            adCardObserver.disconnect(); 
                        }
                    }
                }
            });
        }
    });
})
adCardObserver.observe(document.querySelector('.bili-feed4')!, { childList: true, subtree: true, attributes: false, })
