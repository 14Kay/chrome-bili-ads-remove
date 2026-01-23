/**
 * @description Chrome Storage API 封装
 * @author 14K
 */

/**
 * 获取用户自定义关键词列表
 */
export async function getUserKeywords(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['userKeywords'], (result) => {
            resolve(result.userKeywords || [])
        })
    })
}

/**
 * 保存用户自定义关键词列表
 */
export async function setUserKeywords(keywords: string[]): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ userKeywords: keywords }, () => {
            resolve()
        })
    })
}

/**
 * 获取远程关键词 (从 Background 同步的缓存)
 */
export async function getRemoteKeywords(): Promise<{
    keywords: string[]
    version: string
    syncedAt: number
} | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['remoteKeywords'], (result) => {
            resolve(result.remoteKeywords || null)
        })
    })
}

/**
 * 获取合并后的关键词 (通过消息请求 Background)
 */
export async function getMergedKeywords(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_MERGED_KEYWORDS' }, (response) => {
            resolve(response || [])
        })
    })
}

/**
 * 触发远程关键词同步
 */
export async function syncRemoteKeywords(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'SYNC_REMOTE_KEYWORDS' }, (response) => {
            resolve(response || [])
        })
    })
}

// 兼容旧版 API (已废弃，保留向后兼容)
export const getStoredKeywords = getUserKeywords
export const setStoredKeywords = setUserKeywords
