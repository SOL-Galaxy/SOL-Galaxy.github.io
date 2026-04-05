# VitePress 设置组件使用指南

## 概述

设置组件是一个可扩展的配置管理系统，集成在 VitePress 导航栏的右上角，提供完整的 localStorage 持久化和对外 API。

## 功能特性

✅ **导航栏集成** - 齿轮图标位于导航栏右上角，点击打开设置面板  
✅ **弹窗交互** - 优雅的遮罩层 + 弹窗，支持点击外部关闭  
✅ **数据持久化** - 自动保存到 localStorage (`vitepress-settings`)  
✅ **全局 API** - 通过 `window.__VITEPRESS_SETTINGS__` 访问  
✅ **导入/导出** - 支持配置的备份和恢复  
✅ **主题自适应** - 完美适配 VitePress 深色/浅色模式  
✅ **响应式设计** - 手机/平板/桌面全适配  

## 文件结构

```
Config/.vitepress/theme/
├── types.ts          # TypeScript 类型定义
├── useSettings.ts    # 设置管理 Composable
├── Settings.vue      # 设置面板组件
└── index.ts          # 主题入口（已集成）
```

## 使用方式

### 1. 在浏览器控制台使用全局 API

```javascript
// 读取设置值
window.__VITEPRESS_SETTINGS__.getSetting('theme')

// 设置值
window.__VITEPRESS_SETTINGS__.setSetting('theme', 'dark')

// 导出所有设置
const backup = window.__VITEPRESS_SETTINGS__.exportSettings()
console.log(backup)

// 导入设置
window.__VITEPRESS_SETTINGS__.importSettings({ theme: 'dark', fontSize: 16 })

// 重置所有设置
window.__VITEPRESS_SETTINGS__.resetSettings()
```

### 2. 在 Vue 组件中使用

```vue
<script setup>
import { useSettings } from './.vitepress/theme/useSettings'

const { getSetting, setSetting } = useSettings()

// 读取设置
const currentTheme = getSetting('theme')

// 更新设置
function changeTheme(newTheme) {
  setSetting('theme', newTheme)
}
</script>
```

### 3. 在 Markdown 文件中使用（通过脚本）

可以在 Markdown 的脚本块中访问全局 API：

```markdown
<script setup>
const settings = window.__VITEPRESS_SETTINGS__

// 使用设置...
</script>
```

## 添加新的设置项

### 步骤 1: 更新类型定义

编辑 `useSettings.ts`，在 `defaultConfig` 中添加设置分组：

```typescript
const defaultConfig: SettingsConfig = {
  groups: [
    {
      id: 'appearance',
      title: '外观',
      description: '自定义网站的外观',
      items: [
        {
          key: 'theme',
          label: '主题模式',
          description: '选择网站的显示主题',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: '跟随系统', value: 'auto' },
            { label: '亮色模式', value: 'light' },
            { label: '暗色模式', value: 'dark' }
          ]
        },
        {
          key: 'fontSize',
          label: '字体大小',
          type: 'number',
          defaultValue: 16
        }
      ]
    }
  ]
}
```

### 步骤 2: 更新组件 UI

编辑 `Settings.vue` 的 `<template>` 部分，取消注释并实现设置项渲染：

```vue
<div class="vp-settings-content">
  <!-- 设置分组 -->
  <div v-for="group in config.groups" :key="group.id" class="vp-settings-group">
    <h3 class="vp-settings-group-title">{{ group.title }}</h3>
    <p v-if="group.description" class="vp-settings-group-desc">
      {{ group.description }}
    </p>
    
    <!-- 设置项 -->
    <div v-for="item in group.items" :key="item.key" class="vp-settings-item">
      <label class="vp-settings-label">{{ item.label }}</label>
      
      <!-- 布尔类型 -->
      <input 
        v-if="item.type === 'boolean'"
        type="checkbox"
        :checked="getSetting(item.key) ?? item.defaultValue"
        @change="e => setSetting(item.key, e.target.checked)"
      />
      
      <!-- 选择器类型 -->
      <select
        v-else-if="item.type === 'select'"
        :value="getSetting(item.key) ?? item.defaultValue"
        @change="e => setSetting(item.key, e.target.value)"
      >
        <option v-for="opt in item.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      
      <!-- 数字类型 -->
      <input
        v-else-if="item.type === 'number'"
        type="number"
        :value="getSetting(item.key) ?? item.defaultValue"
        @input="e => setSetting(item.key, Number(e.target.value))"
      />
      
      <!-- 文本类型 -->
      <input
        v-else
        type="text"
        :value="getSetting(item.key) ?? item.defaultValue"
        @input="e => setSetting(item.key, e.target.value)"
      />
      
      <p v-if="item.description" class="vp-settings-item-desc">
        {{ item.description }}
      </p>
    </div>
  </div>
</div>
```

### 步骤 3: 添加相应的 CSS 样式

在 `Settings.vue` 的 `<style scoped>` 中添加：

```css
.vp-settings-group {
  margin-bottom: 24px;
}

.vp-settings-group-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vp-settings-group-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.vp-settings-item {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
}

.vp-settings-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.vp-settings-item input,
.vp-settings-item select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.vp-settings-item-desc {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
```

## API 参考

### SettingsAPI

#### `getSetting<T>(key: string): T | undefined`

获取指定键的设置值。

**参数:**
- `key` - 设置项的键名

**返回:** 设置值，如果不存在返回 `undefined`

**示例:**
```javascript
const theme = window.__VITEPRESS_SETTINGS__.getSetting('theme')
```

#### `setSetting<T>(key: string, value: T): void`

设置指定键的值，并自动保存到 localStorage。

**参数:**
- `key` - 设置项的键名
- `value` - 要设置的值

**示例:**
```javascript
window.__VITEPRESS_SETTINGS__.setSetting('fontSize', 18)
```

#### `resetSettings(): void`

重置所有设置为默认值（清空 localStorage）。

**示例:**
```javascript
window.__VITEPRESS_SETTINGS__.resetSettings()
```

#### `exportSettings(): Record<string, any>`

导出所有设置为 JSON 对象。

**返回:** 包含所有设置的对象

**示例:**
```javascript
const backup = window.__VITEPRESS_SETTINGS__.exportSettings()
console.log(JSON.stringify(backup, null, 2))
```

#### `importSettings(data: Record<string, any>): void`

从 JSON 对象导入设置。

**参数:**
- `data` - 要导入的设置对象

**示例:**
```javascript
window.__VITEPRESS_SETTINGS__.importSettings({
  theme: 'dark',
  fontSize: 16,
  language: 'zh-CN'
})
```

## 高级用法

### 监听设置变化

可以通过 Vue 的 `watch` API 监听设置的变化：

```vue
<script setup>
import { watch } from 'vue'
import { useSettings } from './.vitepress/theme/useSettings'

const { settings } = useSettings()

watch(
  () => settings.value,
  (newSettings) => {
    console.log('设置已更新:', newSettings)
    // 执行相应的操作...
  },
  { deep: true }
)
</script>
```

### 与路由集成

可以在路由守卫中使用设置：

```typescript
import { useRouter } from 'vitepress'

const router = useRouter()

router.onBeforeRouteChange = (to) => {
  const settings = window.__VITEPRESS_SETTINGS__
  const lastVisited = settings.getSetting('lastVisited')
  
  // 记录访问历史
  settings.setSetting('lastVisited', {
    path: to,
    timestamp: Date.now()
  })
}
```

## 注意事项

1. **localStorage 容量限制** - 大多数浏览器的 localStorage 限制为 5-10MB，请勿存储大量数据
2. **数据验证** - 导入设置时会进行基础验证，但不会深度验证数据结构
3. **隐私模式** - 在浏览器隐私模式下，localStorage 可能不可用或在关闭后清空
4. **跨域限制** - localStorage 数据仅在同一域名下共享

## 故障排除

### 设置未保存

检查浏览器控制台是否有 localStorage 相关错误，可能原因：
- 浏览器隐私设置阻止了 localStorage
- localStorage 容量已满
- 浏览器处于隐私模式

### 导入失败

确保导入的数据是有效的 JSON 对象：
```javascript
// ✅ 正确
window.__VITEPRESS_SETTINGS__.importSettings({ key: 'value' })

// ❌ 错误
window.__VITEPRESS_SETTINGS__.importSettings('invalid')
window.__VITEPRESS_SETTINGS__.importSettings([1, 2, 3])
```

### 设置按钮不显示

检查：
1. 是否正确导入了 Settings 组件到 `index.ts`
2. 浏览器控制台是否有 Vue 相关错误
3. VitePress 开发服务器是否正常运行

## 未来扩展计划

- [ ] 添加设置项的条件显示/隐藏
- [ ] 支持设置项的分类标签
- [ ] 提供设置搜索功能
- [ ] 添加设置项的重置单个功能
- [ ] 支持设置的版本迁移
- [ ] 提供设置的云同步能力（需要后端支持）

## 贡献

欢迎贡献新的设置项或改进组件！请遵循现有的代码风格和 TypeScript 类型定义。
