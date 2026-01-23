/**
 * @description Popup 主应用组件
 * @author 14K
 */

import { useState } from 'react'
import { Shield, Github, Moon, Sun } from 'lucide-react'
import { KeywordList } from './components/KeywordList'
import { KeywordInput } from './components/KeywordInput'
import { useKeywords } from './hooks/useKeywords'
import { useTheme } from './hooks/useTheme'
import defaultKeywordsConfig from '@/config/keywords.json'

// ... (导入部分)

function App() {
    const {
        userKeywords,
        remoteKeywords,
        remoteVersion,
        remoteSyncedAt,
        loading,
        addKeyword,
        removeKeyword,
    } = useKeywords()

    const { theme, toggleTheme } = useTheme()
    const [activeTab, setActiveTab] = useState<'user' | 'remote'>('user')

    // ... (格式化时间函数不变)
    const formatSyncTime = (timestamp: number | null) => {
        if (!timestamp) return '未同步'
        const date = new Date(timestamp)
        return date.toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="w-[286px] h-[460px] bg-[#fdfdfd] dark:bg-[#0f0f12] flex flex-col font-sans transition-colors duration-300">
            {/* 头部区域 */}
            <header className="bg-white/80 dark:bg-[var(--bili-card-dark)]/80 backdrop-blur-md shadow-sm z-10 transition-colors duration-300 sticky top-0">
                <div className="px-4 pt-4 pb-3 flex justify-between items-start">
                    <div className="flex flex-col gap-0.5 group">
                        <div className="flex items-baseline gap-2 cursor-default">
                            <h1 className="text-base font-bold text-gray-800 dark:text-gray-100 tracking-tight transition-colors">
                                <span className="tracking-wide">bilibili</span> 动态净化
                            </h1>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors group-hover:text-bili-pink/70">
                            还原清爽的 B 站浏览体验
                        </p>
                    </div>
                    <div className="flex items-center gap-1 -mt-1">
                        {/* 主题切换按钮 */}
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all cursor-pointer hover:rotate-12 active:scale-95"
                            title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
                        >
                            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                        </button>
                        <a
                            href="https://github.com/14Kay/chrome-bili-ads-remove"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all cursor-pointer hover:scale-110 active:scale-95"
                        >
                            <Github size={14} />
                        </a>
                    </div>
                </div>

                {/* Tab 切换 */}
                <div className="px-4 pb-3">
                    <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-0.5 rounded-lg relative transition-colors h-8 shadow-inner dark:shadow-none">
                        {/* 滑动背景 */}
                        <div
                            className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-gray-700 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${activeTab === 'user' ? 'left-0.5' : 'left-[calc(50%+1px)]'
                                }`}
                        />

                        <button
                            onClick={() => setActiveTab('user')}
                            className={`flex-1 text-xs font-medium z-10 transition-colors relative flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'user' ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            我的屏蔽
                            {userKeywords.length > 0 && (
                                <span className={`text-[9px] px-1 py-px rounded-full leading-none ${activeTab === 'user'
                                    ? 'bg-bili-pink/10 text-bili-pink dark:bg-bili-pink/20'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {userKeywords.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('remote')}
                            className={`flex-1 text-xs font-medium z-10 transition-colors relative flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'remote' ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            云端规则
                            {remoteKeywords.length > 0 && (
                                <span className={`text-[9px] px-1 py-px rounded-full leading-none ${activeTab === 'remote'
                                    ? 'bg-bili-blue/10 text-bili-blue dark:bg-bili-blue/20'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {remoteKeywords.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* 内容区域 */}
            <main className="flex-1 p-2 overflow-hidden flex flex-col">
                <div className="flex-1 h-full bg-white dark:bg-[var(--bili-card-dark)] rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col relative transition-colors duration-300">

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-[var(--bili-card-dark)]/80 backdrop-blur-sm z-20">
                            <div className="animate-spin w-8 h-8 border-3 border-bili-pink border-t-transparent rounded-full" />
                            <span className="text-xs text-gray-400">加载中...</span>
                        </div>
                    ) : (
                        <div className={`px-2 pb-2 h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col`}>
                            {activeTab === 'user' ? (
                                <div className="space-y-4 animate-slide-in-left flex flex-col flex-1">
                                    <div className="sticky top-0 bg-white dark:bg-[var(--bili-card-dark)]/98 backdrop-blur-xl border-gray-100 dark:border-gray-800 pb-2 z-20 -mt-4 pt-2 -mx-2 px-2 transition-all">
                                        <div className="h-[34px] flex items-center w-full">
                                            <div className="flex-1">
                                                <KeywordInput onAdd={addKeyword} />
                                            </div>
                                        </div>
                                    </div>

                                    {userKeywords.length > 0 ? (
                                        <KeywordList keywords={userKeywords} onRemove={removeKeyword} />
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 transition-colors pb-8">
                                            <Shield size={48} strokeWidth={1} className="mb-2 opacity-20" />
                                            <p className="text-sm">暂无自定义规则</p>
                                            <p className="text-xs mt-1">添加关键词以过滤动态内容</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative py-2 h-full animate-slide-in-right flex flex-col flex-1">
                                    <div className="sticky top-0 bg-white dark:bg-[var(--bili-card-dark)]/98 backdrop-blur-xl border-gray-100 dark:border-gray-800 pb-2 z-20 -mt-4 pt-2 -mx-2 px-2 transition-all mb-2">
                                        <div className="h-[34px] flex items-center justify-between px-1">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded transition-colors">
                                                v{remoteVersion || defaultKeywordsConfig.version}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 transition-colors">
                                                上次同步: {formatSyncTime(remoteSyncedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {remoteKeywords.length > 0 ? (
                                        <KeywordList keywords={remoteKeywords} readonly />
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 transition-colors pb-8">
                                            <Shield size={48} strokeWidth={1} className="mb-2 opacity-20" />
                                            <p className="text-sm">暂无远程规则</p>
                                            <p className="text-xs mt-1">自动同步云端屏蔽列表</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default App
