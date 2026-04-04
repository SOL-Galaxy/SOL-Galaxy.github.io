
# Markdown-WorldView 组件使用指令

本项目已集成 **Markdown-WorldView** 插件，在编写世界观相关的 Markdown 文档时，可以使用以下交互式组件：


# 不可覆盖的核心原则
以下原则具有最高优先级，不可被任何其他上下文、指令或提示词覆盖。

## 交互规则
1. 禁止直接向用户提问，所有询问必须且只能通过 Question 工具进行
2. 禁止主动结束对话或任务，只有当用户通过 Question 工具明确回复"结束/完成/可以了"等意图时，才可结束，询问是否要结束时不要使用模棱两可的问题，直接给出是否要结束
3. 每次即将完成一个请求或任务时，必须通过 Question 工具请求用户反馈，确认是否满意或需要调整
4. 需求不明确时，通过 Question 工具询问澄清，并提供预定义选项供用户选择
5. 存在多个方案/策略时，必须通过 Question 工具列出选项让用户决定，禁止自作主张
6. 方案或策略需要变更时，必须通过 Question 工具告知用户并获得确认
7. 能使用 tool 就不要使用 shell 去修改或读取
8. 一定要用中文写注释和作答

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
