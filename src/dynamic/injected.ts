/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-13 20:35:50
 * @LastEditTime: 2024-01-10 18:44:23
 * @LastEditors: 14K
 */
let keywords: string[] = []
window.addEventListener("getLocalData", function(event: any) {
    keywords = event.detail;
});
const originalFetch = window.fetch;
window.fetch = async function (url: any, options) {
    if (url.split("?")[0] == "//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all") {
        return originalFetch(url, options)
            .then(async (response) => {
                if (options && options.method && options.method.toUpperCase() === 'GET') {

                    // 修改返回内容
                    const dynamicResponse = await response.text()
                    const dynamic = JSON.parse(dynamicResponse)
                    const dynamicLst = dynamic.data.items
                    dynamic.data.items = dynamicLst.filter((item: any) => {
                        if(item.type == "DYNAMIC_TYPE_DRAW" || item.type == "DYNAMIC_TYPE_WORD"){
                            if(item.modules.module_dynamic.desc){
                                const content = item.modules.module_dynamic.desc.text || ""
                                return !keywords.some((item) => content.includes(item))
                            }

                            if(item.modules.module_dynamic.additional){
                                return false
                            }
                            
                            if(item.modules.module_dynamic.major && item.modules.module_dynamic.major.opus){
                                const content = item.modules.module_dynamic.major.opus.summary.text || ""
                                return !keywords.some((item) => content.includes(item))
                            }
                        }
                        return true
                    })
                    
                    // 创建包含修改后内容的新响应对象
                    const modifiedResponse = new Response(JSON.stringify(dynamic), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers,
                    });
                    return Promise.resolve(modifiedResponse);
                }

                return Promise.resolve(response);
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                return Promise.reject(error);
            });
    }
    return originalFetch(url, options)
};
