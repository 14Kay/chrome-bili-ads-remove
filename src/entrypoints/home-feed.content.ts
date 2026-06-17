/**
 * @description 首页推荐流 - fetch 拦截广告
 * @author 14K
 */

export default defineContentScript({
	matches: ['*://www.bilibili.com/', '*://www.bilibili.com/?*'],
	world: 'MAIN',
	runAt: 'document_start',

	main() {
		const originalFetch = window.fetch

		window.fetch = async function (url: URL | RequestInfo, options) {
			const urlString = typeof url === 'string' ? url : url.toString()

			// 匹配推荐 API
			if (/^\/\/api\.bilibili\.com\/.*\/rcmd$/.test(urlString.split('?')[0])) {
				return originalFetch(url, options)
					.then(async (response) => {
						if (!options || !options.method || options.method.toUpperCase() === 'GET') {
							const json = await response.json()

							// 过滤广告内容
							if (json.data?.item) {
								json.data.item = json.data.item.filter((item: { goto: string }) => item.goto !== 'ad')
							}

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
