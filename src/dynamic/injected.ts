/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-13 20:35:50
 * @LastEditTime: 2024-11-12 16:39:24
 * @LastEditors: 14K
 */
import { Major } from "../types/major";
import { Dynamic } from "../types/dynamic";
import { Additional } from "../types/additional";

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
                        if(item.type == Dynamic.DRAW || item.type == Dynamic.WORD || item.type == Dynamic.ARTICLE){
                            const { desc, major, additional } = item.modules.module_dynamic
                            const content = desc?.text || "";
                            if (content) {
                                return !keywords.some(keyword => content.includes(keyword));
                            }
  
                            if(additional?.type == Additional.GOODS){
                                return false
                            }
                            
                            if(major?.type == Major.OPUS){
                                const content = major.opus?.summary?.text;
                                return content && !keywords.some(keyword => content.includes(keyword));
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
