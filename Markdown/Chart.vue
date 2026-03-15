<template>
  <div ref="container" :style="{ width: '100%', height: height || '400px' }" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: { type: String, default: 'line' },
  config: { type: [Object, String], default: null },
  height: { type: String, default: '400px' },
  theme: { type: String, default: '' }
})

const container = ref(null)
let chart = null

async function initChart() {
  if (!container.value) return

  const echarts = await import('echarts')
  chart = echarts.init(container.value, props.theme || undefined)

  const options = typeof props.config === 'string' 
    ? JSON.parse(props.config) 
    : props.config

  if (options) {
    chart.setOption(options)
  }
}

function resizeChart() {
  chart?.resize?.()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose?.()
  chart = null
})

watch(() => [props.config, props.theme, props.height], () => {
  if (!chart) return
  const options = typeof props.config === 'string' 
    ? JSON.parse(props.config) 
    : props.config
  if (options) {
    chart.setOption(options, true)
    resizeChart()
  }
}, { deep: true })
</script>
