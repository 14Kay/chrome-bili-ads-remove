/**
 * @description 视频详情页广告移除
 * @author 14K
 */

export default defineContentScript({
	matches: ['*://www.bilibili.com/video/*'],
	runAt: 'document_end',

	main() {
		// 移除侧边栏广告
		const sideAds = document.querySelectorAll('.video-card-ad-small')
		sideAds.forEach((ad) => {
			;(ad as HTMLElement).style.display = 'none'
			console.log('[bilibili-ads-remover] 隐藏视频侧边栏广告')
		})

		// 移除播放器下方条幅广告
		const stripAds = document.querySelectorAll('.strip-ad')
		stripAds.forEach((ad) => {
			;(ad as HTMLElement).style.display = 'none'
			console.log('[bilibili-ads-remover] 隐藏条幅广告')
		})
	},
})
