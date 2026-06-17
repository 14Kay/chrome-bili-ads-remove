/**
 * @description Popup 主应用组件
 * @author 14K
 */

import { useState } from 'react'
import { Shield, Github, Moon, Sun } from 'lucide-react'
import { KeywordList } from '@/components/KeywordList'
import { KeywordInput } from '@/components/KeywordInput'
import { useKeywords } from '@/composables/useKeywords'
import { useTheme } from '@/composables/useTheme'
import './style.css'

function App() {
	const {
		userKeywords,
		remoteKeywords,
		remoteVersion,
		remoteSyncedAt,
		remoteEnabled,
		loading,
		addKeyword,
		removeKeyword,
		toggleRemoteEnabled,
	} = useKeywords()

	const { theme, toggleTheme } = useTheme()
	const [activeTab, setActiveTab] = useState<'user' | 'remote'>('user')

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
		<div className="w-[286px] h-[460px] bg-[#f5f5f5] dark:bg-[#0f0f12] flex flex-col font-sans transition-colors duration-300">
			{/* 头部区域 */}
			<header className="bg-white dark:bg-[var(--bili-card-dark)] border-b border-gray-200/60 dark:border-gray-800/60 z-10 transition-colors duration-300">
				<div className="px-4 pt-3 pb-2.5 flex justify-between items-center">
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-md bg-gradient-to-br from-bili-pink/10 to-bili-pink/5 flex items-center justify-center">
							<img src="/icons/32.png" alt="bilibili 动态净化" className="w-5 h-5" />
						</div>
						<p className="text-[10px] text-gray-500 dark:text-gray-400 transition-colors leading-tight">
							还原清爽的 B 站浏览体验
						</p>
					</div>
					<div className="flex items-center gap-0.5">
						{/* 主题切换按钮 */}
						<button
							onClick={toggleTheme}
							className="p-1.5 text-gray-400 hover:text-bili-pink dark:text-gray-500 dark:hover:text-bili-pink rounded-md transition-all cursor-pointer hover:rotate-12 active:scale-95"
							title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
						>
							{theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
						</button>
						<a
							href="https://github.com/14Kay/chrome-bili-ads-remove"
							target="_blank"
							rel="noreferrer"
							className="p-1.5 text-gray-400 hover:text-bili-pink dark:text-gray-500 dark:hover:text-bili-pink rounded-md transition-all cursor-pointer hover:scale-110 active:scale-95"
						>
							<Github size={14} />
						</a>
					</div>
				</div>

				{/* Tab 切换 */}
				<div className="px-4 pb-2.5">
					<div className="flex bg-gray-200/60 dark:bg-gray-800/80 p-0.5 rounded-md relative transition-colors h-7">
						{/* 滑动背景 */}
						<div
							className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-gray-700 rounded transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
								activeTab === 'user' ? 'left-0.5' : 'left-[calc(50%+1px)]'
							}`}
						/>

						<button
							onClick={() => setActiveTab('user')}
							className={`flex-1 text-[11px] font-medium z-10 transition-colors relative flex items-center justify-center gap-1 cursor-pointer ${
								activeTab === 'user'
									? 'text-gray-800 dark:text-gray-100'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
							}`}
						>
							我的屏蔽
							{userKeywords.length > 0 && (
								<span
									className={`text-[9px] px-1 py-0.5 rounded-full leading-none font-medium ${
										activeTab === 'user'
											? 'bg-bili-pink/10 text-bili-pink dark:bg-bili-pink/20'
											: 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
									}`}
								>
									{userKeywords.length}
								</span>
							)}
						</button>
						<button
							onClick={() => setActiveTab('remote')}
							className={`flex-1 text-[11px] font-medium z-10 transition-colors relative flex items-center justify-center gap-1 cursor-pointer ${
								activeTab === 'remote'
									? 'text-gray-800 dark:text-gray-100'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
							}`}
						>
							云端规则
							{remoteKeywords.length > 0 && (
								<span
									className={`text-[9px] px-1 py-0.5 rounded-full leading-none font-medium ${
										activeTab === 'remote'
											? 'bg-bili-pink/10 text-bili-pink dark:bg-bili-pink/20'
											: 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
									}`}
								>
									{remoteKeywords.length}
								</span>
							)}
						</button>
					</div>
				</div>
			</header>

			{/* 内容区域 */}
			<main className="flex-1 p-1.5 overflow-hidden flex flex-col">
				<div className="flex-1 h-full bg-white dark:bg-[var(--bili-card-dark)] rounded-lg border border-gray-200/60 dark:border-gray-800/60 overflow-hidden flex flex-col relative transition-colors duration-300">
					{loading ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-[var(--bili-card-dark)]/80 backdrop-blur-sm z-20">
							<div className="animate-spin w-8 h-8 border-3 border-bili-pink border-t-transparent rounded-full" />
							<span className="text-xs text-gray-400">加载中...</span>
						</div>
					) : (
						<div
							key={activeTab}
							className={`px-2 pb-2 h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col ${
								activeTab === 'user' ? 'animate-slide-in-left' : 'animate-slide-in-right'
							}`}
						>
							{activeTab === 'user' ? (
								<div className="space-y-4 flex flex-col flex-1">
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
										<div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 transition-colors pb-8">
											<Shield size={44} strokeWidth={1.5} className="mb-2.5 opacity-30" />
											<p className="text-xs font-medium">暂无自定义规则</p>
											<p className="text-[10px] mt-1 text-gray-400 dark:text-gray-600">添加关键词以过滤动态内容</p>
										</div>
									)}
								</div>
							) : (
								<div className="relative py-2 h-full flex flex-col flex-1">
									<div className="sticky top-0 bg-white dark:bg-[var(--bili-card-dark)]/98 backdrop-blur-xl border-gray-100 dark:border-gray-800 pb-2 z-20 -mt-4 pt-2 -mx-2 px-2 transition-all mb-2">
										<div className="h-[34px] flex items-center justify-between px-1">
											<span className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors">
												v{remoteVersion}
											</span>
											{/* 云端规则开关 */}
											<button
												onClick={toggleRemoteEnabled}
												className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
													remoteEnabled ? 'bg-bili-pink' : 'bg-gray-300 dark:bg-gray-600'
												}`}
												title={remoteEnabled ? '点击禁用云端规则' : '点击启用云端规则'}
											>
												<span
													className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
														remoteEnabled ? 'translate-x-[19px]' : 'translate-x-1'
													}`}
												/>
											</button>
										</div>
									</div>

									<div className="flex-1 flex flex-col">
										{remoteKeywords.length > 0 ? (
											<>
												<KeywordList keywords={remoteKeywords} readonly />
												<div className="mt-auto text-center text-[10px] text-gray-400 dark:text-gray-500 transition-colors">
													上次同步: {formatSyncTime(remoteSyncedAt)}
												</div>
											</>
										) : (
											<div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 transition-colors pb-8">
												<Shield size={44} strokeWidth={1.5} className="mb-2.5 opacity-30" />
												<p className="text-xs font-medium">暂无远程规则</p>
												<p className="text-[10px] mt-1 text-gray-400 dark:text-gray-600">自动同步云端屏蔽列表</p>
												<p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3.5">
													上次同步: {formatSyncTime(remoteSyncedAt)}
												</p>
											</div>
										)}
									</div>
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
