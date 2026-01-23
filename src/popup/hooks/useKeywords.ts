/**
 * @description 关键词管理自定义 Hook
 * @author 14K
 */

import { useState, useEffect, useCallback } from 'react'
import { getUserKeywords, setUserKeywords, getRemoteKeywords } from '@/utils/storage'
import defaultKeywordsConfig from '@/config/keywords.json'

interface KeywordsState {
    userKeywords: string[]
    remoteKeywords: string[]
    remoteVersion: string
    remoteSyncedAt: number | null
}

export function useKeywords() {
    const [state, setState] = useState<KeywordsState>({
        userKeywords: [],
        remoteKeywords: [],
        remoteVersion: '',
        remoteSyncedAt: null,
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

            // 并行加载用户关键词和远程关键词
            const [userKeywords, remoteData] = await Promise.all([
                getUserKeywords(),
                getRemoteKeywords(),
            ])

            // 用户关键词列表不再自动填充默认值，保持为空
            // 让"我的屏蔽"只包含用户手动添加的内容
            const finalUserKeywords = userKeywords

            // 远程关键词 Fallback 逻辑
            // 如果 storage 里没有远程数据 (可能是首次安装尚未同步完成)，先显示本地默认配置
            let finalRemoteKeywords = remoteData?.keywords || []
            let finalRemoteVersion = remoteData?.version || ''
            let finalRemoteSyncedAt = remoteData?.syncedAt || null

            if (!remoteData) {
                finalRemoteKeywords = defaultKeywordsConfig.keywords
                finalRemoteVersion = defaultKeywordsConfig.version || '1.0.0'
            }

            setState({
                userKeywords: finalUserKeywords,
                remoteKeywords: finalRemoteKeywords,
                remoteVersion: finalRemoteVersion,
                remoteSyncedAt: finalRemoteSyncedAt,
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

            // 检查是否与远程关键词重复
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

    return {
        userKeywords: state.userKeywords,
        remoteKeywords: state.remoteKeywords,
        remoteVersion: state.remoteVersion,
        remoteSyncedAt: state.remoteSyncedAt,
        loading,
        error,
        addKeyword,
        removeKeyword,
    }
}
