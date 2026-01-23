/**
 * @description 首页广告过滤 - fetch 拦截
 * @author 14K
 * @note 此脚本注入到页面主世界，不能使用 ES Modules
 */

const original_fetch = window.fetch

window.fetch = async function (url: URL | RequestInfo, options) {
    if (typeof url === 'string') {
        // 匹配推荐 API
        if (/^\/\/api\.bilibili\.com\/.*\/rcmd$/.test(url.split('?')[0])) {
            return original_fetch(url, options)
                .then(async (response) => {
                    if (!options || !options.method || options.method.toUpperCase() === 'GET') {
                        // 修改返回内容
                        const recommendResponse = await response.text()
                        const recommend = JSON.parse(recommendResponse)
                        const recommendLst = recommend.data?.item || []

                        // 过滤广告内容
                        recommend.data.item = recommendLst.filter((item: { goto: string }) => {
                            return item.goto !== 'ad'
                        })

                        // 创建包含修改后内容的新响应对象
                        const modifiedResponse = new Response(JSON.stringify(recommend), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers,
                        })
                        return modifiedResponse
                    }

                    return response
                })
                .catch((error) => {
                    console.error('[bilibili-ads-remover] Fetch Error:', error)
                    throw error
                })
        }
    }
    return original_fetch(url, options)
}
