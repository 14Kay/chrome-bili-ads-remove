/**
 * @description 主题管理 Hook
 * @author 14K
 */

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        // 从 storage 初始化主题
        chrome.storage.local.get(['theme'], (result) => {
            // 默认跟随系统，如果没有设置过
            if (!result.theme) {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                setTheme(systemDark ? 'dark' : 'light')
            } else {
                setTheme(result.theme)
            }
        })
    }, [])

    useEffect(() => {
        // 应用主题到 document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        // 保存设置
        chrome.storage.local.set({ theme })
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return { theme, toggleTheme }
}
