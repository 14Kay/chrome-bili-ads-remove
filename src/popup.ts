/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-13 20:52:03
 * @LastEditTime: 2023-11-13 22:13:25
 * @LastEditors: 14K
 */

import { setKeywords } from "./index"
chrome.storage.sync.get(['keywords'], result => {
    const keywords = result.keywords || []
    renderKeywords(keywords)
})

function renderKeywords(keywords: string[]) {
    const keywordsContainer = document.getElementById('keywords-container')
    if (keywordsContainer) {
        keywordsContainer.innerHTML = '';
        for (let i = 0; i < keywords.length; i++) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${keywords[i]}<span>×</span>`;
            const closeBtn = listItem.querySelector('span');
            if (!closeBtn) continue;
            closeBtn.addEventListener('click', async () => {
                keywords.splice(i, 1)
                await setKeywords(keywords)
                if (listItem.parentNode)
                    listItem.parentNode.removeChild(listItem);
            });
            keywordsContainer.appendChild(listItem);
        }
    }
}

const addBtn = document.getElementById('add');

addBtn?.addEventListener('click', () => {
    const input = document.getElementById('keyword') as HTMLInputElement;
    if (input.value) {
        chrome.storage.sync.get(['keywords'], async result => {
            const keywords = result.keywords || []
            if (keywords.includes(input.value)) {
                return renderResult(false)
            }
            renderResult()
            keywords.push(input.value)
            await setKeywords(keywords)
            renderKeywords(keywords)
            input.value = "";
        })
    }
})

function renderResult(success: boolean = true) {
    const parent = document.getElementById('add-container')
    if (!parent) return
    const result = document.createElement('span')
    result.className = success ? 'success' : "err"
    result.innerHTML = success ? '添加成功' : '添加失败, 关键词已存在'
    parent.appendChild(result)
    setTimeout(() => {
        parent.removeChild(result)
    }, 2500);
}