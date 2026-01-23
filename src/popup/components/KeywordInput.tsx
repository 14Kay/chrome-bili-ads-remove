/**
 * @description 关键词输入组件
 * @author 14K
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface KeywordInputProps {
    onAdd: (keyword: string) => Promise<{ success: boolean; message: string }>
}

export function KeywordInput({ onAdd }: KeywordInputProps) {
    const [value, setValue] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!value.trim() || isSubmitting) return

        setIsSubmitting(true)
        // 模拟微小延迟以显示交互状态
        await new Promise(r => setTimeout(r, 300))

        const result = await onAdd(value)

        setIsSubmitting(false)
        setFeedback({
            type: result.success ? 'success' : 'error',
            message: result.message,
        })

        if (result.success) {
            setValue('')
        }

        // 2.5秒后清除反馈
        setTimeout(() => setFeedback(null), 2500)
    }

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-stretch gap-2 transition-all">
                <div className="relative flex-1 group">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="输入关键词..."
                        disabled={isSubmitting}
                        className="w-full pl-3 pr-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500
               focus:border-bili-pink focus:ring-1 focus:ring-bili-pink dark:focus:border-bili-pink
               hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-60 disabled:cursor-not-allowed
               text-gray-800 dark:text-gray-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!value.trim() || isSubmitting}
                    title="添加关键词"
                    className={`group flex items-center justify-center w-[30px] h-[30px] rounded-md transition-all duration-200 border
            ${!value.trim() || isSubmitting
                            ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-transparent cursor-not-allowed'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-bili-pink hover:text-bili-pink dark:hover:text-bili-pink hover:bg-bili-pink/5 active:scale-95 cursor-pointer'
                        }`}
                >
                    {isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Plus size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-90" />
                    )}
                </button>
            </form>

            {/* 全局反馈 Toast (Portal) */}
            {feedback && createPortal(
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] animate-slide-up pointer-events-none w-max max-w-[90%]">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-xl backdrop-blur-md border transition-all ${feedback.type === 'success'
                        ? 'bg-white/90 dark:bg-gray-800/90 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                        : 'bg-white/90 dark:bg-gray-800/90 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                        }`}>
                        {feedback.type === 'success' ? (
                            <CheckCircle2 size={14} className="shrink-0" />
                        ) : (
                            <AlertCircle size={14} className="shrink-0" />
                        )}
                        <span className="text-xs font-medium shadow-none">{feedback.message}</span>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
