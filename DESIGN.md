---
colors:
  brand:
    primary: '#fb7299'
    primary-hover: '#e35d7f'
    secondary: '#00a1d6'
  
  light:
    background: '#f5f5f5'
    card: '#ffffff'
    border: 'rgba(209, 213, 219, 0.6)'
    text-primary: '#1f2937'
    text-secondary: '#6b7280'
    text-tertiary: '#9ca3af'
    tab-bg: 'rgba(229, 231, 235, 0.6)'
    tab-active: '#ffffff'
  
  dark:
    background: '#0f0f12'
    card: '#2a2b2e'
    border: 'rgba(31, 41, 55, 0.6)'
    text-primary: '#e5e9ef'
    text-secondary: '#9ca3af'
    text-tertiary: '#6b7280'
    tab-bg: 'rgba(31, 41, 55, 0.8)'
    tab-active: '#374151'

typography:
  font-family: 'GoogleSans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  
  sizes:
    xs: '10px'
    sm: '11px'
    badge: '9px'
    base: '13px'
    icon: '14px'
  
  weights:
    normal: 400
    medium: 500

spacing:
  unit: '0.25rem'
  scale:
    0.5: '2px'
    1: '4px'
    1.5: '6px'
    2: '8px'
    2.5: '10px'
    3: '12px'
    4: '16px'
  
  component:
    header-px: '16px'
    header-pt: '12px'
    header-pb: '10px'
    content-p: '6px'
    item-gap: '6px'

border-radius:
  sm: '4px'
  md: '6px'
  lg: '8px'
  full: '9999px'

borders:
  width: '1px'
  style: 'solid'
  opacity: 0.6

shadows:
  none: 'none'

animations:
  duration:
    fast: '200ms'
    normal: '300ms'
  
  easing:
    default: 'ease-out'
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  
  transitions:
    colors: 'colors 300ms'
    slide-tab: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
    hover: 'all 200ms ease-out'
  
  keyframes:
    slideInLeft:
      from: 'translateX(-100%) opacity-0'
      to: 'translateX(0) opacity-1'
      duration: '250ms'
    slideInRight:
      from: 'translateX(100%) opacity-0'
      to: 'translateX(0) opacity-1'
      duration: '250ms'
    fadeIn:
      from: 'opacity-0'
      to: 'opacity-1'
      duration: '300ms'

layout:
  popup:
    width: '286px'
    height: '460px'
  
  header:
    height: 'auto'
  
  icon:
    size: '28px'
    display-size: '20px'
  
  tab:
    height: '28px'
    padding: '2px'
  
  switch:
    width: '36px'
    height: '20px'
    thumb: '14px'

scrollbar:
  width: '6px'
  track: 'transparent'
  thumb:
    light: '#e5e9ef'
    light-hover: '#ccd0d7'
    dark: '#444444'
    dark-hover: '#555555'
  radius: '3px'

---

# 设计系统规范

本文档定义了应用的完整视觉设计系统，为 AI 开发工具提供结构化的设计指导。

## 设计理念

### 核心原则

**小巧精致**  
简洁紧凑的视觉元素，在有限空间内实现最佳信息密度。

**色彩克制**  
主品牌色作为唯一的强调色，浅色/深色模式保持统一的色彩逻辑。

**扁平化设计**  
使用色块和边框区分层级。圆角范围 4-8px。

**流畅交互**  
Tab 切换采用轮播式滑动动画，整体内容作为一个单元移动。所有交互均有平滑的过渡效果。

## 配色系统

### 品牌色

主品牌色用于所有强调场景：
- Tab 激活状态
- 按钮悬停
- 开关激活
- 徽章背景
- 链接悬停

品牌色的悬停变体提供二次反馈，增强交互感知。

### 浅色模式

背景采用三层结构，从页面背景到卡片背景形成层次感。文本使用三级灰度系统，确保信息层级清晰。Tab 系统通过背景透明度区分激活和未激活状态。

### 深色模式

低对比度配色方案，背景使用深灰色系（#0f0f12, #2a2b2e）。

## 字体系统

### 字体族

GoogleSans 作为主字体，回退到系统默认 Sans-serif 字体栈。

### 字号梯度

- **9px**: 徽章数字
- **10px**: 辅助信息（时间戳、版本号）
- **11px**: 标签文字、按钮文字
- **13px**: 正文内容
- **14px**: 图标尺寸

## 间距系统

### 基础单位

4px 基础单位系统（0.25rem），所有间距为 4px 的倍数。

### 组件级间距

- 头部区域: 左右 16px，上 12px，下 10px
- 内容区: 6px 内边距
- 列表项间距: 6px

## 圆角系统

### 圆角梯度

- **4px (sm)**: 小型元素（滑块、开关圆点）
- **6px (md)**: 中型容器（Tab 容器）
- **8px (lg)**: 大型容器（主卡片）
- **9999px (full)**: 完全圆形（徽章、标签）

## 布局规范

### 弹窗尺寸

固定尺寸 286×460px。

### 头部布局

```
┌─────────────────────────────────┐
│ [图标+文字]         [操作按钮]    │
│ [━━━━ Tab 切换 ━━━━]            │
└─────────────────────────────────┘
```

左侧区域包含图标和辅助文字，右侧放置主要操作按钮，底部是 Tab 切换器。图标容器 28×28px，内部显示 20×20px。

### 内容区布局

```
┌─────────────────────────────────┐
│ [固定控制栏]                     │
├─────────────────────────────────┤
│                                 │
│   可滚动内容区域                 │
│                                 │
├─────────────────────────────────┤
│ [底部信息（可选）]               │
└─────────────────────────────────┘
```

顶部控制栏粘性定位，始终可见。主内容区域可滚动。底部信息栏（可选）显示状态或时间戳。

## 交互动画

### Tab 切换动画

整个内容容器通过强制重新渲染实现轮播式水平滑动。缓动函数 `ease-out`，时长 250ms。

### Tab 滑块动画

弹性动画，缓动函数 `cubic-bezier(0.34, 1.56, 0.64, 1)`，时长 300ms。

### 主题切换

颜色属性过渡时长 300ms，包括 `background-color`、`color`、`border-color`。

## 组件规范

### 图标容器

双层结构：外层容器 28×28px，内层图标 20×20px 居中显示。背景使用低透明度渐变（10% → 5%）。

```tsx
<div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
	<img src="/icons/32.png" className="w-5 h-5" />
</div>
```

### Tab 切换器

滑动背景设计。滑块宽度 `calc(50% - 2px)`。

```tsx
<div className="flex bg-gray-200/60 dark:bg-gray-800/80 p-0.5 rounded-md relative h-7">
	<div className="absolute w-[calc(50%-2px)] transition-all duration-300" />
	<button className="flex-1 text-[11px]">标签一</button>
	<button className="flex-1 text-[11px]">标签二</button>
</div>
```

### 开关组件

滑动圆点设计，激活时圆点平移并改变背景色。尺寸 36×20px。

```tsx
<button className={`relative inline-flex items-center h-5 w-9 rounded-full ${
	enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
}`}>
	<span className={`inline-block h-3.5 w-3.5 rounded-full bg-white ${
		enabled ? 'translate-x-[19px]' : 'translate-x-1'
	}`} />
</button>
```

### 标签组件

完全圆角（`rounded-full`），内边距左右 8px、上下 4px。删除按钮悬停时变为品牌色。

```tsx
<div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-[13px] transition-colors">
	<span>{text}</span>
	<button className="text-gray-400 hover:text-primary">×</button>
</div>
```

## 滚动条样式

宽度 6px，圆角 3px，轨道透明。浅色模式使用浅灰色，深色模式使用深灰色。悬停时颜色加深。

## 响应式与适配

### 主题切换

根元素的 `.dark` 类名切换主题。颜色通过 `dark:` 前缀定义深色模式变体。

```tsx
const { theme, toggleTheme } = useTheme()

useEffect(() => {
	document.documentElement.classList.toggle('dark', theme === 'dark')
}, [theme])
```

### 滚动优化

- `overflow-y-auto`: 按需显示垂直滚动条
- `overflow-x-hidden`: 禁止横向滚动
- 控制栏粘性定位（`sticky top-0`）

## 性能优化

### 动画性能

动画使用 `transform` 和 `opacity` 属性。

```css
/* 高性能动画 */
.animate-slide {
	transform: translateX(-100%);
	opacity: 0;
}
```

### 过渡属性

精确指定过渡属性，而非使用 `transition: all`。

```css
/* 精确控制 */
transition: background-color 300ms, color 300ms, border-color 300ms;
```

## 可访问性

### 语义化 HTML

使用语义化标签（`<header>`, `<main>` 等）和正确的元素类型（按钮使用 `<button>`）。交互元素添加 `title` 属性。

### 对比度

文本与背景对比度符合 WCAG AA 标准（≥4.5:1）。

- 浅色模式主要文本: 11.9:1
- 深色模式主要文本: 12.6:1

### 交互反馈

可交互元素的悬停状态：
- 按钮: `cursor-pointer` + 颜色变化
- 链接: 颜色变为品牌色
- 输入框: 边框颜色变化

## 技术栈

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS 4.0
- **构建工具**: WXT (Browser Extension Framework)
- **字体**: GoogleSans (自托管)

## 参考资源

- [DESIGN.md 规范](https://github.com/google-labs-code/design.md)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [WCAG 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

**最后更新**: 2026/06/17  
**版本**: v3.0
