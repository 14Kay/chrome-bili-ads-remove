/**
 * @description 首页 Content Script 入口
 * @author 14K
 */

// 注入 fetch 拦截脚本
const scriptNode = document.createElement('script')
scriptNode.src = chrome.runtime.getURL('src/content/injected/index.ts')
document.documentElement.appendChild(scriptNode)
