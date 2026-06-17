/**
 * @description 动态页广告过滤 - fetch 拦截
 * @author 14K
 */

// 动态类型常量
const DynamicType = {
	DRAW: 'DYNAMIC_TYPE_DRAW',
	WORD: 'DYNAMIC_TYPE_WORD',
	ARTICLE: 'DYNAMIC_TYPE_ARTICLE',
} as const

const MajorType = {
	OPUS: 'MAJOR_TYPE_OPUS',
} as const

const AdditionalType = {
	GOODS: 'ADDITIONAL_TYPE_GOODS',
} as const

interface DynamicItem {
	type: string
	modules?: {
		module_dynamic?: {
			desc?: { text: string }
			major?: {
				type: string
				opus?: { summary?: { text: string } }
			}
			additional?: { type: string }
		}
	}
}

export default defineContentScript({
	matches: ['*://t.bilibili.com/*', '*://space.bilibili.com/*'],
	world: 'MAIN',
	runAt: 'document_start',

	main() {
		let keywords: string[] = []
		let isKeywordsLoaded = false
		let resolveKeywords: (value?: unknown) => void

		const keywordsPromise = new Promise((resolve) => {
			resolveKeywords = resolve
		})

		window.addEventListener('getLocalData', (event: Event) => {
			keywords = (event as CustomEvent).detail
			isKeywordsLoaded = true
			if (resolveKeywords) resolveKeywords()
			console.log('[bilibili-ads-remover] 关键词已接收:', keywords)
		})

		console.log('[bilibili-ads-remover] 拦截器已初始化')

		const originalFetch = window.fetch

		window.fetch = async function (url: RequestInfo | URL, options) {
			const urlString = typeof url === 'string' ? url : url.toString()
			const urlPath = urlString.split('?')[0]

			// 匹配动态 API (包括首页动态和个人空间动态)
			if (
				urlPath === '//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all' ||
				urlPath === '//api.bilibili.com/x/polymer/web-dynamic/v1/feed/space'
			) {
				// 如果关键词还没加载，等待
				if (!isKeywordsLoaded) {
					console.log('[bilibili-ads-remover] 等待关键词加载...')
					await keywordsPromise
					console.log('[bilibili-ads-remover] 关键词已就绪，继续处理...')
				}

				return originalFetch(url, options)
					.then(async (response) => {
						if (!options || !options.method || options.method.toUpperCase() === 'GET') {
							const json = await response.json()
							const dynamicLst = json.data?.items || []

							// 过滤动态内容
							json.data.items = dynamicLst.filter((item: DynamicItem) => {
								// 处理图文、纯文字、专栏动态
								if (
									item.type === DynamicType.DRAW ||
									item.type === DynamicType.WORD ||
									item.type === DynamicType.ARTICLE
								) {
									const moduleDynamic = item.modules?.module_dynamic
									if (!moduleDynamic) return true

									const { desc, major, additional } = moduleDynamic
									const content = desc?.text || ''

									// 关键词匹配过滤
									if (content && keywords.some((keyword) => content.includes(keyword))) {
										return false
									}

									// 商品推广过滤
									if (additional?.type === AdditionalType.GOODS) {
										return false
									}

									// 图文动态内容过滤
									if (major?.type === MajorType.OPUS) {
										const opusContent = major.opus?.summary?.text
										if (opusContent && keywords.some((keyword) => opusContent.includes(keyword))) {
											return false
										}
									}
								}
								return true
							})

							return new Response(JSON.stringify(json), {
								status: response.status,
								statusText: response.statusText,
								headers: response.headers,
							})
						}

						return response
					})
					.catch((error) => {
						console.error('[bilibili-ads-remover] Fetch Error:', error)
						throw error
					})
			}

			return originalFetch(url, options)
		}
	},
})
