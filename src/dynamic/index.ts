/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-13 20:27:42
 * @LastEditTime: 2024-11-12 15:38:50
 * @LastEditors: 14K
 */
export function setKeywords(keywords: string[]) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({
            keywords
        }, () => {
            resolve("");
        })
    });
}
chrome.storage.sync.get(['keywords'], async result => {
    const defaultKeywords = [
        '全网zui低',
        '长按Fu制',
        '长按copy',
        '券后价格',
        '全网最低',
        '百亿补贴',
        '长按复制',
        '手机京东',
        '优惠券',
        '拼多多',
        '按摩仪',
        '手淘',
        '领券',
        '推广',
        '淘宝',
        '热卖',
        '满减',
        '清仓',
        '下单'
    ]
    if (!result.keywords) {
        await setKeywords(defaultKeywords)
    }
    const newestKeywords = result.keywords || defaultKeywords
    const scriptNode = document.createElement('script');
    scriptNode.src = chrome.runtime.getURL('js/dynamic_injected.js');
    document.documentElement.appendChild(scriptNode);
    scriptNode.onload = function () {
        window.dispatchEvent(new CustomEvent("getLocalData", { detail: newestKeywords }));
    }
})
