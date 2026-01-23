/**
 * @description 动态页 Content Script 入口
 * @author 14K
 */

import { getMergedKeywords } from '@/utils/storage'
// 仅负责关键词同步 (在 Isolated World 运行)
function syncKeywords() {
    getMergedKeywords().then((keywords) => {
        // 发送给 Main World 的拦截脚本
        window.dispatchEvent(new CustomEvent('getLocalData', { detail: keywords }))
    })
}

syncKeywords()
