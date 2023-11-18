/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-14 17:48:13
 * @LastEditTime: 2023-11-18 16:03:55
 * @LastEditors: 14K
 */

const scriptNode = document.createElement('script');
scriptNode.src = chrome.runtime.getURL('js/index_injected.js');
document.documentElement.appendChild(scriptNode);