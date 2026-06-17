/**
 * @description Background Service Worker - 管理远程关键词同步
 * @author 14K
 */

export default defineBackground(() => {
	const REMOTE_KEYWORDS_URL =
		'https://raw.githubusercontent.com/14Kay/chrome-bili-ads-remove/main/src/config/keywords.json'
	const SYNC_INTERVAL_MINUTES = 24 * 60

	// 扩展安装/更新时
	browser.runtime.onInstalled.addListener(async (details) => {
		console.log('[bilibili-ads-remover] 扩展已安装/更新:', details.reason)

		if (details.reason === 'install') {
			await syncRemoteKeywords()
		}

		await setupAlarm()
	})

	// 扩展启动时
	browser.runtime.onStartup.addListener(async () => {
		console.log('[bilibili-ads-remover] 扩展启动')
		await setupAlarm()
	})

	// 定时任务触发
	browser.alarms.onAlarm.addListener(async (alarm) => {
		if (alarm.name === 'syncRemoteKeywords') {
			console.log('[bilibili-ads-remover] 定时同步远程关键词')
			await syncRemoteKeywords()
		}
	})

	// 监听来自 Content Script 的消息
	browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
		if (message.type === 'GET_MERGED_KEYWORDS') {
			getMergedKeywords().then(sendResponse)
			return true
		}

		if (message.type === 'SYNC_REMOTE_KEYWORDS') {
			syncRemoteKeywords().then(sendResponse)
			return true
		}
	})

	/**
	 * 设置定时同步任务
	 */
	async function setupAlarm() {
		await browser.alarms.clear('syncRemoteKeywords')

		browser.alarms.create('syncRemoteKeywords', {
			delayInMinutes: 1,
			periodInMinutes: SYNC_INTERVAL_MINUTES,
		})

		console.log('[bilibili-ads-remover] 已设置定时同步任务')
	}

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

			await storage.setItem('local:remoteKeywords', {
				keywords,
				version: data.version || '1.0.0',
				syncedAt: Date.now(),
			})

			console.log(`[bilibili-ads-remover] 远程关键词同步成功，共 ${keywords.length} 个`)
			return keywords
		} catch (error) {
			console.error('[bilibili-ads-remover] 远程关键词同步失败:', error)

			// 失败时尝试读取本地缓存
			const localData = await storage.getItem('local:remoteKeywords')
			if (localData?.keywords?.length > 0) {
				console.log('[bilibili-ads-remover] 使用本地缓存的远程关键词')
				return localData.keywords
			}

			// 如果没有本地缓存，返回空数组
			console.log('[bilibili-ads-remover] 无本地缓存，返回空列表')
			return []
		}
	}

	/**
	 * 获取合并后的关键词
	 */
	async function getMergedKeywords(): Promise<string[]> {
		const remoteData = await storage.getItem('local:remoteKeywords')
		const userKeywords = (await storage.getItem('sync:userKeywords')) || []
		const remoteEnabled = (await storage.getItem('sync:remoteKeywordsEnabled')) !== false

		const remoteKeywords = remoteEnabled ? (remoteData?.keywords || []) : []

		// 合并并去重
		return [...new Set([...remoteKeywords, ...userKeywords])]
	}
})
