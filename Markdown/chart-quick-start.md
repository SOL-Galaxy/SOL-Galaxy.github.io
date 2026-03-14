# 图表快速入门

## 🚀 3 分钟上手

<script setup>
// 在 Markdown 顶部定义你的图表配置
const sales = {
  xAxis: { data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [50, 65, 80, 70, 90, 100] }]
}

const temperature = {
  xAxis: { data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: {},
  series: [
    { name: '最高温', type: 'line', data: [20, 22, 25, 23, 21], smooth: true },
    { name: '最低温', type: 'line', data: [10, 12, 15, 13, 11], smooth: true }
  ]
}

const market = {
  series: [{
    type: 'pie',
    data: [
      { value: 40, name: 'iOS' },
      { value: 35, name: 'Android' },
      { value: 15, name: 'Web' },
      { value: 10, name: '其他' }
    ]
  }]
}
</script>

### 示例 1：柱状图

<Chart :config="sales" height="280px" />

```md
<script setup>
const sales = {
  xAxis: { data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: {},
  series: [{ type: 'bar', data: [50, 65, 80, 70, 90, 100] }]
}
</script>

<Chart :config="sales" height="280px" />
```

---

### 示例 2：折线图

<Chart :config="temperature" height="280px" />

```md
<script setup>
const temperature = {
  xAxis: { data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: {},
  series: [
    { name: '最高温', type: 'line', data: [20, 22, 25, 23, 21], smooth: true },
    { name: '最低温', type: 'line', data: [10, 12, 15, 13, 11], smooth: true }
  ]
}
</script>

<Chart :config="temperature" height="280px" />
```

---

### 示例 3：饼图

<Chart :config="market" height="300px" />

```md
<script setup>
const market = {
  series: [{
    type: 'pie',
    data: [
      { value: 40, name: 'iOS' },
      { value: 35, name: 'Android' },
      { value: 15, name: 'Web' },
      { value: 10, name: '其他' }
    ]
  }]
}
</script>

<Chart :config="market" height="300px" />
```

---

## 📚 更多示例

查看 [完整示例集合](./chart-examples.md) 了解更多图表类型。

## 📖 配置参考

所有配置项请参考 [ECharts 官方文档](https://echarts.apache.org/zh/option.html)。
