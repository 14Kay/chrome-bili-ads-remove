/**
 * @description 动态页广告过滤 - fetch 拦截
 * @author 14K
 * @note 此脚本注入到页面主世界，不能使用 ES Modules
 */

// 动态类型常量 (内联定义，避免模块导入)
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

// 接收关键词列表
let keywords: string[] = []
let isKeywordsLoaded = false
let resolveKeywords: (value?: unknown) => void

const keywordsPromise = new Promise((resolve) => {
    resolveKeywords = resolve
})

window.addEventListener('getLocalData', function (event: Event) {
    keywords = (event as CustomEvent).detail
    isKeywordsLoaded = true
    if (resolveKeywords) resolveKeywords()
    console.log('[bilibili-ads-remover] Keywords received:', keywords)
})

console.log('[bilibili-ads-remover] Interceptor initialized')

const originalFetch = window.fetch

window.fetch = async function (url: RequestInfo | URL, options) {
    const urlString = typeof url === 'string' ? url : url.toString()

    // 匹配动态 API
    if (urlString.split('?')[0] === '//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all') {
        // 如果关键词还没加载，等待
        if (!isKeywordsLoaded) {
            console.log('[bilibili-ads-remover] Waiting for keywords...')
            await keywordsPromise
            console.log('[bilibili-ads-remover] Keywords ready, proceeding...')
        }

        return originalFetch(url, options)
            .then(async (response) => {
                if (!options || !options.method || options.method.toUpperCase() === 'GET') {
                    // 修改返回内容
                    const dynamicResponse = await response.text()
                    const dynamic = JSON.parse(dynamicResponse)
                    const dynamicLst = dynamic.data?.items || []

                    // 过滤动态内容
                    dynamic.data.items = dynamicLst.filter((item: DynamicItem) => {
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

                    // 创建包含修改后内容的新响应对象
                    const modifiedResponse = new Response(JSON.stringify(dynamic), {
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
    return originalFetch(url, options)
}

// 动态项类型定义
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
