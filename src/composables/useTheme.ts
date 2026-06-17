/**
 * @description 主题管理自定义 Hook
 * @author 14K
 */

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
	const [theme, setTheme] = useState<Theme>('light')

	useEffect(() => {
		// 从 storage 读取主题
		storage.getItem('local:theme').then((savedTheme: unknown) => {
			const initialTheme = (savedTheme as Theme | null) || 'light'
			setTheme(initialTheme)
			applyTheme(initialTheme)
		})
	}, [])

	const applyTheme = (newTheme: Theme) => {
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}

	const toggleTheme = async () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		applyTheme(newTheme)
		await storage.setItem('local:theme', newTheme)
	}

	return { theme, toggleTheme }
}
