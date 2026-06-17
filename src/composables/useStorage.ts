/**
 * @description Storage 工具函数
 * @author 14K
 */

/**
 * 获取用户自定义关键词列表
 */
export async function getUserKeywords(): Promise<string[]> {
	return (await storage.getItem('sync:userKeywords')) || []
}

/**
 * 保存用户自定义关键词列表
 */
export async function setUserKeywords(keywords: string[]): Promise<void> {
	await storage.setItem('sync:userKeywords', keywords)
}

/**
 * 获取远程关键词
 */
export async function getRemoteKeywords(): Promise<{
	keywords: string[]
	version: string
	syncedAt: number
} | null> {
	return await storage.getItem('local:remoteKeywords')
}

/**
 * 获取云端规则启用状态
 */
export async function getRemoteKeywordsEnabled(): Promise<boolean> {
	const enabled = await storage.getItem('sync:remoteKeywordsEnabled')
	return enabled !== false
}

/**
 * 设置云端规则启用状态
 */
export async function setRemoteKeywordsEnabled(enabled: boolean): Promise<void> {
	await storage.setItem('sync:remoteKeywordsEnabled', enabled)
}

/**
 * 获取合并后的关键词 (通过消息请求 Background)
 */
export async function getMergedKeywords(): Promise<string[]> {
	return await browser.runtime.sendMessage({ type: 'GET_MERGED_KEYWORDS' })
}

/**
 * 触发远程关键词同步
 */
export async function syncRemoteKeywords(): Promise<string[]> {
	return await browser.runtime.sendMessage({ type: 'SYNC_REMOTE_KEYWORDS' })
}
