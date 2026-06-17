/**
 * @description 首页 DOM 广告移除
 * @author 14K
 */

export default defineContentScript({
	matches: ['*://www.bilibili.com/', '*://www.bilibili.com/?*'],
	runAt: 'document_end',

	main() {
		const videoList = document.querySelectorAll('.feed-card')

		videoList.forEach((card) => {
			const parent = card.querySelector('.bili-video-card__wrap')
			if (!parent) return

			const aElement = parent.querySelector('a')
			// 检查链接：如果是广告，链接通常不是 /video/ 开头
			if (aElement && !aElement.href.startsWith('https://www.bilibili.com/video/')) {
				card.remove()
				console.log('[bilibili-ads-remover] 移除首页 DOM 广告')
			}
		})
	},
})
