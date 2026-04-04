# Markdown-WorldView 组件使用指南

> **致 AI 助手**：本文档说明了在此项目中可用的 Markdown-WorldView 组件及其使用方法。在编写世界观文档时，请充分利用这些组件来增强内容展示效果。

---

## 📋 目录

- [组件概览](#组件概览)
- [组件详细说明](#组件详细说明)
  - [Card - 介绍卡片](#card---介绍卡片)
  - [Numerical - 数值面板](#numerical---数值面板)
  - [Inventory - 物品网格](#inventory---物品网格)
- [主题定制说明](#主题定制说明)
- [使用建议](#使用建议)

---

## 🎯 组件概览

本项目已集成 **Markdown-WorldView** 插件，提供了以下交互式组件用于世界观展示：

| 组件名称 | 用途 | 适用场景 |
|---------|------|---------|
| **Card** | 介绍卡片 | 角色介绍、势力介绍、物品介绍、地点介绍 |
| **Numerical** | 数值面板 | 角色属性、资源状态、统计数据、进度展示 |
| **Inventory** | 物品网格 | 物品清单、装备列表、收藏展示 |

> 💡 **更多组件开发中**：Radar（雷达图）、Faction（势力图）、Network（关系网络）、Hierarchy（层级架构）、Timeline（时间线）

---

## 📖 组件详细说明

### Card - 介绍卡片

用于展示角色、势力、物品等的基本信息，适合作为百科条目的头部展示。

#### 基本语法

````markdown
```card
name: 角色名称
avatar: /path/to/avatar.png
description: 角色描述文本
dictum: "座右铭或名言"
tags: [标签1, 标签2, 标签3]
link: /wiki/character-name
```
````

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `name` | string | ✅ | 名称（唯一必填字段） |
| `avatar` | string | ❌ | 头像图片 URL |
| `description` | string | ❌ | 描述文本 |
| `dictum` | string | ❌ | 座右铭/名言 |
| `tags` | array | ❌ | 标签列表 |
| `link` | string | ❌ | 点击后跳转的链接 |

#### 使用示例

**角色介绍：**
````markdown
```card
name: 艾蕾娜·星语
avatar: /images/characters/elena.png
description: 银月森林的精灵守护者，世代守护着古老的魔法结界
dictum: "森林记得每一个名字"
tags: [精灵, 传奇射手, 守序中立]
link: /characters/elena
```
````

**势力介绍：**
````markdown
```card
name: 影刃公会
avatar: /images/factions/shadowblade.png
description: 主大陆最神秘的刺客组织，只为信仰而非金钱服务
dictum: "黑暗是我们的家，沉默是我们的誓言"
tags: [刺客组织, 中立邪恶, 隐秘结社]
```
````

**最小化卡片：**
````markdown
```card
name: 神秘旅者
```
````

---

### Numerical - 数值面板

用于展示角色属性、资源状态、势力数据等数值信息，支持进度条可视化。

#### 基本语法

````markdown
```numerical
title: 面板标题
items:
  - label: 属性名称
    value: 当前值
    max: 最大值
    icon: 💰
```
````

#### 字段说明

**顶层字段：**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `title` | string | ❌ | 面板标题 |
| `items` | array | ✅ | 数值项列表 |

**items 数组元素：**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `label` | string | ✅ | 标签名称 |
| `value` | number | ✅ | 当前值 |
| `max` | number | ❌ | 最大值（如果设置，将显示进度条） |
| `icon` | string | ❌ | 图标（Emoji 或图片） |

#### 进度条颜色规则

- **0-30%**：红色（危险状态）
- **30-60%**：黄色（警告状态）
- **60-100%**：绿色（正常状态）

#### 使用示例

**带进度条的数值：**
````markdown
```numerical
title: 角色状态
items:
  - label: 生命值
    value: 85
    max: 100
    icon: ❤️
  - label: 魔力值
    value: 42
    max: 80
    icon: 💧
  - label: 体力
    value: 60
    max: 100
```
````

**纯数值展示（无进度条）：**
````markdown
```numerical
title: 基础属性
items:
  - label: 力量
    value: 18
    icon: 💪
  - label: 敏捷
    value: 14
    icon: 🏃
  - label: 智力
    value: 16
    icon: 🧠
  - label: 魅力
    value: 12
    icon: ✨
```
````

**资源统计：**
````markdown
```numerical
title: 帝国月度报告
items:
  - label: 国库储备
    value: 287500
    max: 500000
    icon: 👑
  - label: 军队规模
    value: 125000
    max: 200000
    icon: ⚔️
  - label: 人口总数
    value: 4500000
    icon: 👥
  - label: 领土面积（平方公里）
    value: 285000
    icon: 🗺️
```
````

---

### Inventory - 物品网格

用于展示物品清单、装备列表等，支持物品稀有度展示。

#### 基本语法

````markdown
```inventory
title: 物品栏标题
items:
  - name: 物品名称
    icon: /path/to/icon.png
    rarity: legendary
    quantity: 1
```
````

#### 字段说明

**顶层字段：**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `title` | string | ❌ | 物品栏标题 |
| `items` | array | ✅ | 物品列表 |

**items 数组元素：**

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `name` | string | ✅ | 物品名称 |
| `icon` | string | ❌ | 图标 URL 或 Emoji |
| `rarity` | string | ❌ | 稀有度：`common`、`rare`、`epic`、`legendary` |
| `quantity` | number | ❌ | 数量 |

#### 稀有度颜色

- **common**（普通）：灰色边框
- **rare**（稀有）：蓝色边框
- **epic**（史诗）：紫色边框
- **legendary**（传说）：金色边框（带发光动画）

#### 使用示例

````markdown
```inventory
title: 背包
items:
  - name: 誓约之剑
    icon: ⚔️
    rarity: legendary
    quantity: 1
  - name: 生命药水
    icon: 🧪
    rarity: common
    quantity: 5
  - name: 以太水晶
    icon: 💎
    rarity: epic
    quantity: 3
```
````

---

## 🎨 主题定制说明

本项目已在 `Config/.vitepress/theme/style.css` 中配置了 Markdown-WorldView 的自定义主题，主题会自动：

- ✅ **适配 VitePress 品牌色**：组件主色调与网站整体风格一致
- ✅ **支持深色模式**：自动切换亮/暗主题
- ✅ **响应式布局**：
  - 手机：2列物品网格，80px 头像
  - 平板/桌面：6列物品网格，140px 头像

### 可用的 CSS 变量

如需进一步定制，可在 CSS 中覆盖以下变量：

```css
:root {
  /* 基础颜色 */
  --mw-primary-color: #2563eb;
  --mw-bg-color: #ffffff;
  --mw-text-color: #1f2937;
  --mw-border-color: #e5e7eb;
  
  /* 状态颜色 */
  --mw-pos-color: #16a34a;  /* 正面（绿） */
  --mw-neg-color: #dc2626;  /* 负面（红） */
  --mw-neu-color: #6b7280;  /* 中性（灰） */
  
  /* 稀有度 */
  --mw-rarity-common: #9ca3af;
  --mw-rarity-rare: #3b82f6;
  --mw-rarity-epic: #a855f7;
  --mw-rarity-legendary: #f59e0b;
  
  /* 组件尺寸 */
  --mw-card-avatar-size: 120px;
  --mw-inventory-columns: 4;
  --mw-inventory-icon-size: 48px;
}
```

---

## 💡 使用建议

### AI 助手使用指南

当你在编写世界观文档时：

1. **角色/NPC 介绍**
   - 使用 `Card` 组件展示基本信息
   - 使用 `Numerical` 组件展示属性和状态

2. **势力/组织介绍**
   - 使用 `Card` 组件展示势力概况
   - 使用 `Numerical` 组件展示势力数据（人口、资源等）

3. **物品/装备条目**
   - 使用 `Card` 组件展示单个物品详情
   - 使用 `Inventory` 组件展示物品列表

4. **地点/场景描述**
   - 使用 `Card` 组件展示地点信息
   - 使用 `Numerical` 组件展示统计数据

### 最佳实践

✅ **推荐做法：**
- 合理使用组件，不要过度堆砌
- 为图片提供清晰的路径（建议使用 `/images/` 目录）
- 标签数量控制在 3-5 个
- 使用 Emoji 作为简单图标
- 数值面板的项目数控制在 3-8 个

❌ **避免：**
- 在一个页面中使用过多相同类型的组件
- 过长的描述文本（description 建议 1-2 句话）
- 过多的标签（影响美观）
- 缺少必填字段（如 Card 的 `name`）

### 示例页面结构

```markdown
# 角色名称

<!-- 使用 Card 组件展示基本信息 -->
```card
name: ...
avatar: ...
description: ...
```

## 角色背景

（正文描述...）

## 能力与属性

<!-- 使用 Numerical 组件展示数值 -->
```numerical
title: 基础属性
items: ...
```

## 装备

<!-- 使用 Inventory 组件展示装备 -->
```inventory
title: 当前装备
items: ...
```
```

---

## 🔗 参考资源

- **官方文档**：http://localhost:5173
- **快速开始**：http://localhost:5173/guide/quickstart.html
- **主题定制**：http://localhost:5173/guide/theming.html
- **组件文档**：http://localhost:5173/components/card.html

---

## 📝 更新记录

- **2026-04-04**：创建本指南文档，配置主题
- 未来将添加更多组件: Radar, Faction, Network, Hierarchy, Timeline

---

> 💡 **提示**：如有任何问题或建议，请查阅在线文档或在项目中提出 issue。
