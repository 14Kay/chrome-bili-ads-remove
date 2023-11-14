/*
 * @Description: 
 * @Author: 14K
 * @Date: 2023-11-14 17:07:44
 * @LastEditTime: 2023-11-14 18:03:28
 * @LastEditors: 14K
 */

const original_fetch = window.fetch;
window.fetch = async function (url: any, options) {
    if (url.split("?")[0] == "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd") {
        return original_fetch(url, options)
            .then(async (response) => {
                if (options && options.method && options.method.toUpperCase() === 'GET') {
                    // 修改返回内容
                    const recommendResponse = await response.text()
                    const recommend = JSON.parse(recommendResponse)
                    const recommendLst = recommend.data.item
                    recommend.data.item = recommendLst.filter((item: any) => {
                        return item.goto != "ad"
                    })
                    // 创建包含修改后内容的新响应对象
                    const modifiedResponse = new Response(JSON.stringify(recommend), {
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
    return original_fetch(url, options)
};
