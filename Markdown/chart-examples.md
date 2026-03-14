# 图表示例

<script setup>
const barConfig = {
  title: { text: '月度销量' },
  tooltip: {},
  xAxis: { data: ['一月', '二月', '三月', '四月', '五月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [10, 20, 30, 25, 15] }]
}

const lineConfig = {
  title: { text: '温度变化' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: { type: 'value' },
  series: [
    { name: '最高温', type: 'line', data: [15, 18, 22, 20, 19] },
    { name: '最低温', type: 'line', data: [8, 10, 13, 11, 10] }
  ]
}

const pieConfig = {
  title: { text: '访问来源', left: 'center' },
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: '50%',
    data: [
      { value: 335, name: '直接访问' },
      { value: 234, name: '搜索引擎' },
      { value: 154, name: '社交媒体' },
      { value: 135, name: '广告推广' }
    ]
  }]
}

const stackConfig = {
  title: { text: '产品销售' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['产品A', '产品B', '产品C'] },
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
  yAxis: { type: 'value' },
  series: [
    { name: '产品A', type: 'bar', stack: 'total', data: [120, 132, 101, 134] },
    { name: '产品B', type: 'bar', stack: 'total', data: [220, 182, 191, 234] },
    { name: '产品C', type: 'bar', stack: 'total', data: [150, 232, 201, 154] }
  ]
}

const gaugeConfig = {
  series: [{
    type: 'gauge',
    detail: { formatter: '{value}%' },
    data: [{ value: 75, name: '完成度' }]
  }]
}
</script>

## 📊 柱状图

<Chart :config="barConfig" height="300px" />

---

## 📈 折线图

<Chart :config="lineConfig" height="320px" />

---

## 🥧 饼图

<Chart :config="pieConfig" height="360px" />

---

## 📊 堆叠柱状图

<Chart :config="stackConfig" height="340px" />

---

## 🎯 仪表盘

<Chart :config="gaugeConfig" height="300px" />

---

## 💡 使用技巧

### 方式 1：使用 `<script setup>` 定义（推荐）
```md
<script setup>
const myChart = {
  xAxis: { data: ['一月', '二月', '三月'] },
  series: [{ type: 'bar', data: [10, 20, 15] }]
}
</script>

<Chart :config="myChart" />
```

### 方式 2：单行对象（简单图表）
```md
<Chart :config="{ series: [{ type: 'pie', data: [{ value: 100, name: '完成' }] }] }" />
```

### 方式 3：JSON 字符串（从外部数据源）
```md
<Chart config='{"xAxis":{"data":["A","B"]},"series":[{"type":"bar","data":[1,2]}]}' />
```

### 自定义高度和主题
```md
<Chart :config="myChart" height="500px" theme="dark" />
```

---

## 🔗 参考资料

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)
- [ECharts 示例库](https://echarts.apache.org/examples/zh/index.html)
