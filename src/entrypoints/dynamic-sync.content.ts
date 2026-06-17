/**
 * @description 动态页关键词同步 - Isolated World
 * @author 14K
 */

export default defineContentScript({
	matches: ['*://t.bilibili.com/*', '*://space.bilibili.com/*'],
	runAt: 'document_start',

	async main() {
		// 获取合并后的关键词
		const keywords = await browser.runtime.sendMessage({ type: 'GET_MERGED_KEYWORDS' })

		// 发送给 Main World 的拦截脚本
		window.dispatchEvent(new CustomEvent('getLocalData', { detail: keywords }))
	},
})
