import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
	srcDir: 'src',
	manifest: {
		name: 'bilibili Ads Remover',
		description: 'bilibili插件，屏蔽首页换一换广告、动态广告(关键词匹配)',
		permissions: ['storage', 'alarms'],
		host_permissions: ['*://api.bilibili.com/*'],
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
})
