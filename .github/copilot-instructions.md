---
description: 在编写世界观 Markdown 文档时使用 Markdown-WorldView 组件的指导
applyTo:  "**/*.md"
---

# Markdown-WorldView 组件使用指令

本项目已集成 **Markdown-WorldView** 插件，在编写世界观相关的 Markdown 文档时，可以使用以下交互式组件：

## 可用组件

1. **Card（卡片）** - 用于角色、势力、物品、地点介绍
   ```markdown
   ```card
   name: 名称
   avatar: /path/to/image.png
   description: 描述文本
   dictum: "座右铭"
   tags: [标签1, 标签2]
   link: /path/to/page
   ```
   ```

2. **Numerical（数值面板）** - 用于展示属性、资源、统计数据
   ```markdown
   ```numerical
   title: 标题
   items:
     - label: 属性名
       value: 当前值
       max: 最大值
       icon: 💰
   ```
   ```

3. **Inventory（物品网格）** - 用于展示物品清单
   ```markdown
   ```inventory
   title: 标题
   items:
     - name: 物品名
       icon: ⚔️
       rarity: legendary
       quantity: 1
   ```
   ```

## 使用建议

- 在介绍角色/NPC 时，优先使用 `Card` 组件展示基本信息
- 在展示属性数据时，使用 `Numerical` 组件（带进度条效果）
- 在列举物品时，使用 `Inventory` 组件（支持稀有度：common/rare/epic/legendary）
- 详细文档参见：`。/WORLDVIEW-COMPONENTS-GUIDE.md`

## 主题配置

主题已在 `Config/.vitepress/theme/style.css` 中配置，支持：
- ✅ 自动适配 VitePress 品牌色
- ✅ 深色模式
- ✅ 响应式布局（手机/平板/桌面）

## 注意事项

- 所有组件使用 YAML 语法
- 图片路径建议使用 `/images/` 目录
- 传说级物品（legendary）会有金色发光动画
- 进度条颜色自动根据百分比变化（红/黄/绿）
