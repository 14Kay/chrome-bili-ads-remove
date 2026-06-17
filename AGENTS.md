# bilibili Ads Remover - 项目文档

Chrome 扩展，屏蔽 B 站动态页广告和推广内容。采用 Manifest V3 + Main World Script 注入技术。

## 项目概览

**技术栈**
- **框架**: WXT (Browser Extension Framework)
- **UI**: React 18 + TypeScript
- **样式**: Tailwind CSS 4.0
- **构建**: Vite 6.0

**核心特性**
- API 级别拦截：在数据渲染前过滤广告内容
- 双重过滤机制：云端规则 + 用户自定义规则
- Main World Script 注入：早期介入，拦截成功率 100%
- 跨设备同步：用户规则通过 Chrome Sync 同步

## 架构设计

### 目录结构

```
src/
├── entrypoints/                 # WXT 入口点
│   ├── background.ts            # Service Worker（规则同步）
│   ├── dynamic-filter.content.ts # 动态页 fetch 拦截器
│   ├── dynamic-sync.content.ts   # 规则数据同步
│   ├── home-feed.content.ts      # 首页推荐 API 拦截
│   ├── home-dom.content.ts       # 首页 DOM 处理
│   ├── video.content.ts          # 视频页处理
│   └── popup/                    # 弹窗 UI
│       ├── App.tsx
│       └── main.tsx
├── components/                  # React 组件
│   ├── KeywordInput.tsx
│   └── KeywordList.tsx
├── composables/                 # 组合式逻辑
│   ├── useKeywords.ts
│   ├── useStorage.ts
│   └── useTheme.ts
├── types/                       # TypeScript 类型定义
│   ├── dynamic.ts
│   ├── major.ts
│   └── additional.ts
├── config/                      # 配置文件
│   └── keywords.json            # 云端规则（通过 GitHub 同步）
└── assets/                      # 静态资源
```

### 核心流程

#### 1. 规则同步（Background）

```
扩展安装 → 立即同步云端规则 → 设置 24 小时定时任务
         ↓
   GitHub Raw URL
         ↓
   存储到 local:remoteKeywords
```

#### 2. 动态页拦截（dynamic-filter.content.ts）

```
页面加载 → Main World Script 注入 → 劫持 window.fetch
         ↓
   监听 getLocalData 事件获取规则
         ↓
   拦截 API 请求（/x/polymer/web-dynamic/v1/feed/all）
         ↓
   过滤包含关键词的动态 → 返回清洗后的数据
```

**关键技术点**
- `world: 'MAIN'` - 在页面主世界执行，可访问页面原生 API
- `runAt: 'document_start'` - 极早期注入，抢在页面脚本前执行
- Promise 锁机制：确保规则加载完成后再处理 API 响应

#### 3. 规则合并逻辑

```typescript
合并后的规则 = 云端规则（remoteEnabled = true）+ 用户规则
```

- 云端规则：`local:remoteKeywords`（本地存储）
- 用户规则：`sync:userKeywords`（同步存储）
- 云端开关：`sync:remoteKeywordsEnabled`（同步存储）

### 数据存储

| 键名 | 存储类型 | 说明 |
|------|---------|------|
| `local:remoteKeywords` | LocalStorage | 云端规则缓存 |
| `sync:userKeywords` | SyncStorage | 用户自定义规则 |
| `sync:remoteKeywordsEnabled` | SyncStorage | 云端规则开关 |
| `sync:theme` | SyncStorage | 主题设置 |

## 开发指南

### 环境准备

```bash
# 安装依赖
pnpm install

# 开发模式（自动重载）
pnpm dev

# 构建生产版本
pnpm build

# 打包扩展（生成 zip）
pnpm zip
```

### 调试技巧

**Background Service Worker**
```
chrome://extensions/ → 扩展详情 → Service Worker → 检查视图
```

**Content Script (Main World)**
```
F12 → Console → 筛选 [bilibili-ads-remover]
```

**Storage 查看**
```
F12 → Application → Storage → Local Storage / Sync Storage
```

### 添加新的过滤规则

#### 修改云端规则

编辑 `src/config/keywords.json`：

```json
{
	"version": "1.0.0",
	"keywords": ["关键词1", "关键词2"]
}
```

推送到 GitHub 后，扩展会在 24 小时内自动同步。

#### 添加用户规则

通过 Popup UI 添加，立即生效并跨设备同步。

### 扩展到其他页面

参考 `dynamic-filter.content.ts` 的模式：

```typescript
export default defineContentScript({
	matches: ['*://new-page.bilibili.com/*'],
	world: 'MAIN',
	runAt: 'document_start',
	main() {
		// 1. 监听规则数据
		// 2. 劫持目标 API
		// 3. 过滤响应数据
	},
})
```

## 代码规范

### 格式

- 缩进：Tab
- 引号：单引号
- 分号：不使用
- 末尾逗号：必须添加

### 命名约定

- 组件：PascalCase（`KeywordInput.tsx`）
- 文件：kebab-case（`dynamic-filter.content.ts`）
- 函数：camelCase（`syncRemoteKeywords`）
- 常量：UPPER_SNAKE_CASE（`SYNC_INTERVAL_MINUTES`）

### TypeScript

所有动态数据结构必须定义类型：

```typescript
interface DynamicItem {
	type: string
	modules?: {
		module_dynamic?: {
			desc?: { text: string }
		}
	}
}
```

## 设计系统

参考 `DESIGN.md` 文档，包含：
- 配色方案（浅色/深色模式）
- 字体系统（GoogleSans）
- 间距系统（4px 基础单位）
- 组件规范（Tab、开关、标签等）

**核心设计原则**
- 小巧精致（286×460px 弹窗）
- 色彩克制（主品牌色 #fb7299）
- 扁平化设计（无阴影，色块分层）
- 流畅交互（轮播式 Tab 切换）

## 性能优化

### 1. 拦截层面

- 仅拦截目标 API，不污染全局 fetch
- 使用 Promise 锁避免竞态条件
- 数据过滤在内存中完成，不触发 DOM 重排

### 2. 存储优化

- 云端规则使用 LocalStorage（无同步开销）
- 用户规则使用 SyncStorage（跨设备同步）
- 定时任务使用 chrome.alarms（低功耗）

### 3. UI 性能

- 动画仅使用 `transform` 和 `opacity`
- 精确指定过渡属性，避免 `transition: all`
- 虚拟滚动（如需处理大量关键词）

## 常见问题

### 拦截失效

**原因**: Content Script 注入时机晚于页面请求
**解决**: 确保 `runAt: 'document_start'` + `world: 'MAIN'`

### 规则不生效

**原因**: 规则加载未完成就处理了 API 响应
**解决**: Promise 锁机制已处理，检查控制台日志

### 跨设备同步失败

**原因**: Chrome 未登录或同步已关闭
**解决**: 检查 `chrome://settings/syncSetup`

## 权限说明

```json
{
	"permissions": [
		"storage",     // 本地和同步存储
		"alarms"       // 定时任务
	],
	"host_permissions": [
		"*://api.bilibili.com/*"  // B 站 API 访问
	]
}
```

## 浏览器兼容性

- Chrome/Edge: 完全支持
- Firefox: 需调整 WXT 配置（`pnpm build:firefox`）
- Safari: 不支持 Manifest V3 的部分特性
