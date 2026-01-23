/**
 * @description 视频详情页广告去除
 * @author 14K
 */

function removeVideoAds() {
    // 移除侧边栏广告
    const sideAds = document.querySelectorAll('.video-card-ad-small')
    sideAds.forEach(ad => {
        // ad.remove() // 移除会导致 B 站前端框架崩溃 (React/Vue hydration error)
        (ad as HTMLElement).style.display = 'none'
        console.log('[bilibili-ads-remover] Hide video side ad')
    })

    // 移除播放器下方条幅广告
    const stripAds = document.querySelectorAll('.strip-ad')
    stripAds.forEach(ad => {
        // ad.remove()
        (ad as HTMLElement).style.display = 'none'
        console.log('[bilibili-ads-remover] Hide strip ad')
    })
}

// 初始执行 (SSR 渲染，直接执行即可)
removeVideoAds()
