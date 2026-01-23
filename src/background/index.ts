/**
 * @description Background Service Worker - 管理远程关键词同步
 * @author 14K
 */

// GitHub Raw 地址
const REMOTE_KEYWORDS_URL =
    'https://raw.githubusercontent.com/14Kay/chrome-bili-ads-remove/main/src/config/keywords.json'

// 同步间隔 (24小时)
const SYNC_INTERVAL_MINUTES = 24 * 60

// 初始化：扩展安装/更新时
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('[bilibili-ads-remover] 扩展已安装/更新:', details.reason)

    // 首次安装时立即同步远程关键词
    if (details.reason === 'install') {
        await syncRemoteKeywords()
    }

    // 设置定时同步任务
    await setupAlarm()
})

// 扩展启动时
chrome.runtime.onStartup.addListener(async () => {
    console.log('[bilibili-ads-remover] 扩展启动')
    await setupAlarm()
})

// 定时任务触发
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'syncRemoteKeywords') {
        console.log('[bilibili-ads-remover] 定时同步远程关键词')
        await syncRemoteKeywords()
    }
})

/**
 * 设置定时同步任务
 */
async function setupAlarm() {
    // 清除旧的 alarm
    await chrome.alarms.clear('syncRemoteKeywords')

    // 创建新的 alarm
    chrome.alarms.create('syncRemoteKeywords', {
        delayInMinutes: 1, // 1分钟后首次执行
        periodInMinutes: SYNC_INTERVAL_MINUTES, // 之后每24小时执行
    })

    console.log('[bilibili-ads-remover] 已设置定时同步任务')
}

import defaultKeywordsConfig from '../config/keywords.json'

/**
 * 从 GitHub 同步远程关键词
 */
async function syncRemoteKeywords() {
    try {
        console.log('[bilibili-ads-remover] 正在拉取远程关键词...')

        const response = await fetch(REMOTE_KEYWORDS_URL)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const keywords = data.keywords || []

        // 保存到本地存储
        await chrome.storage.local.set({
            remoteKeywords: {
                keywords,
                version: data.version || '1.0.0',
                syncedAt: Date.now(),
            },
        })

        console.log(`[bilibili-ads-remover] 远程关键词同步成功，共 ${keywords.length} 个`)
        return keywords
    } catch (error) {
        console.error('[bilibili-ads-remover] 远程关键词同步失败:', error)

        // 失败时尝试读取本地缓存
        const localData = await chrome.storage.local.get(['remoteKeywords'])
        if (localData.remoteKeywords && localData.remoteKeywords.keywords && localData.remoteKeywords.keywords.length > 0) {
            console.log('[bilibili-ads-remover] 使用本地缓存的远程关键词')
            return localData.remoteKeywords.keywords
        }

        // 如果没有本地缓存，使用默认配置
        console.log('[bilibili-ads-remover] 无本地缓存，使用默认关键词列表')
        const defaultKeywords = defaultKeywordsConfig.keywords || []

        // 保存默认配置到 storage，避免下次还为空
        await chrome.storage.local.set({
            remoteKeywords: {
                keywords: defaultKeywords,
                version: defaultKeywordsConfig.version || '1.0.0',
                syncedAt: Date.now(), // 标记为当前时间，虽然是默认值
            },
        })

        return defaultKeywords
    }
}

// 监听来自 Content Script 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_MERGED_KEYWORDS') {
        getMergedKeywords().then(sendResponse)
        return true // 保持消息通道开启
    }

    if (message.type === 'SYNC_REMOTE_KEYWORDS') {
        syncRemoteKeywords().then(sendResponse)
        return true
    }
})

/**
 * 获取合并后的关键词
 */
async function getMergedKeywords(): Promise<string[]> {
    const result = await chrome.storage.local.get(['remoteKeywords'])
    const syncResult = await chrome.storage.sync.get(['userKeywords'])

    const remoteKeywords = result.remoteKeywords?.keywords || []
    const userKeywords = syncResult.userKeywords || []

    // 合并并去重
    const mergedSet = new Set([...remoteKeywords, ...userKeywords])
    return Array.from(mergedSet)
}
