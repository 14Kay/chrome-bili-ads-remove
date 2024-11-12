/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-14 17:48:13
 * @LastEditTime: 2024-11-12 15:40:45
 * @LastEditors: 14K
 */
const scriptNode = document.createElement('script');
scriptNode.src = chrome.runtime.getURL('js/index_injected.js');
document.documentElement.appendChild(scriptNode);
