/**
 * @description 关键词管理自定义 Hook
 * @author 14K
 */

import { useState, useEffect, useCallback } from 'react'
import {
	getUserKeywords,
	setUserKeywords,
	getRemoteKeywords,
	getRemoteKeywordsEnabled,
	setRemoteKeywordsEnabled,
} from '@/composables/useStorage'

interface KeywordsState {
	userKeywords: string[]
	remoteKeywords: string[]
	remoteVersion: string
	remoteSyncedAt: number | null
	remoteEnabled: boolean
}

export function useKeywords() {
	const [state, setState] = useState<KeywordsState>({
		userKeywords: [],
		remoteKeywords: [],
		remoteVersion: '',
		remoteSyncedAt: null,
		remoteEnabled: true,
	})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// 初始化加载关键词
	useEffect(() => {
		loadKeywords()
	}, [])

	const loadKeywords = async () => {
		try {
			setLoading(true)

			// 并行加载用户关键词、远程关键词和云端规则启用状态
			const [userKeywords, remoteData, remoteEnabled] = await Promise.all([
				getUserKeywords(),
				getRemoteKeywords(),
				getRemoteKeywordsEnabled(),
			])

			setState({
				userKeywords,
				remoteKeywords: remoteData?.keywords || [],
				remoteVersion: remoteData?.version || '1.0.0',
				remoteSyncedAt: remoteData?.syncedAt || null,
				remoteEnabled,
			})
		} catch (err) {
			setError('加载关键词失败')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	// 添加用户关键词
	const addKeyword = useCallback(
		async (keyword: string): Promise<{ success: boolean; message: string }> => {
			const trimmed = keyword.trim()

			if (!trimmed) {
				return { success: false, message: '关键词不能为空' }
			}

			if (state.userKeywords.includes(trimmed)) {
				return { success: false, message: '关键词已存在' }
			}

			if (state.remoteKeywords.includes(trimmed)) {
				return { success: false, message: '该关键词已在远程列表中' }
			}

			const newKeywords = [...state.userKeywords, trimmed]
			await setUserKeywords(newKeywords)
			setState((prev) => ({ ...prev, userKeywords: newKeywords }))
			return { success: true, message: '添加成功' }
		},
		[state.userKeywords, state.remoteKeywords]
	)

	// 删除用户关键词
	const removeKeyword = useCallback(
		async (keyword: string) => {
			const newKeywords = state.userKeywords.filter((k) => k !== keyword)
			await setUserKeywords(newKeywords)
			setState((prev) => ({ ...prev, userKeywords: newKeywords }))
		},
		[state.userKeywords]
	)

	// 切换云端规则启用状态
	const toggleRemoteEnabled = useCallback(async () => {
		const newEnabled = !state.remoteEnabled
		await setRemoteKeywordsEnabled(newEnabled)
		setState((prev) => ({ ...prev, remoteEnabled: newEnabled }))
	}, [state.remoteEnabled])

	return {
		userKeywords: state.userKeywords,
		remoteKeywords: state.remoteKeywords,
		remoteVersion: state.remoteVersion,
		remoteSyncedAt: state.remoteSyncedAt,
		remoteEnabled: state.remoteEnabled,
		loading,
		error,
		addKeyword,
		removeKeyword,
		toggleRemoteEnabled,
	}
}
