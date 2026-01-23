/**
 * @description 关键词列表组件
 * @author 14K
 */

import { X } from 'lucide-react'

interface KeywordListProps {
    keywords: string[]
    onRemove?: (keyword: string) => void
    readonly?: boolean
}

export function KeywordList({ keywords, onRemove, readonly = false }: KeywordListProps) {


    return (
        <div className="flex flex-wrap gap-2 px-1 pb-4 pt-3 content-start">
            {keywords.map((keyword, index) => (
                <div
                    key={keyword}
                    className={`group relative flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-normal transition-all duration-200 select-none border ${readonly
                        ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/20'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/30 dark:hover:bg-red-900/10'
                        }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                >
                    <span>{keyword}</span>

                    {!readonly && onRemove && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(keyword)
                            }}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-400/80 hover:bg-bili-pink text-white rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 shadow-sm z-10 cursor-pointer backdrop-blur-[2px] hover:rotate-90"
                            title="删除"
                        >
                            <X size={10} strokeWidth={3} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
