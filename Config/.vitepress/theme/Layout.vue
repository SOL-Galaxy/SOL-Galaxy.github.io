<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, inBrowser, useRouter } from 'vitepress'
import { onMounted, onUnmounted, watch, nextTick, watchEffect } from 'vue'
import { useRoute } from 'vitepress'
import { initMarkdownWorldview } from 'markdown-worldview/client'
import { useReadingProgress } from './useReadingProgress'
import NotFound from './NotFound.vue'
import Settings from './Settings.vue'
import MusicPlayer from './MusicPlayer.vue'
import { 
  NolebaseEnhancedReadabilitiesMenu, 
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

const { lang } = useData()
watchEffect(() => {
  if (inBrowser) {
    document.cookie = `nf_lang=${lang.value}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/`
  }
})

const { Layout } = DefaultTheme
const route = useRoute()
const router = useRouter()


// 初始化阅读进度跟踪
const readingProgress = useReadingProgress()

let cleanup: (() => void) | null = null

// 组件挂载时初始化图表和导航
onMounted(async () => {
  // 初始化阅读进度跟踪
  readingProgress.initReadingProgress()
  
  // 等待 DOM 和 CSS 都完全渲染
  await nextTick()
  // 再等待一个短暂的延迟确保样式已应用
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        // 客户端处理导航跳转
        console.log('Navigating to:', event.path)
        router.go(event.path)
      }
    })
  }, 100)
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
  readingProgress.cleanup()
})

// 监听路由变化，重新初始化图表和导航
watch(() => route.path, async (newPath) => {
  // 通知阅读进度系统页面已切换
  readingProgress.onPageChange(newPath)
  
  // 路由变化时，先清理旧资源
  if (cleanup) {
    cleanup()
  }
  // 等待新页面渲染完成
  await nextTick()
  setTimeout(async () => {
    cleanup = await initMarkdownWorldview({ 
      debug: true,
      onNavigate: (event) => {
        console.log('Navigating to:', event.path)
        // 客户端处理导航跳转
        router.go(event.path)
      }
    })
  }, 100)
})
</script>

<template>
  <DefaultTheme.Layout>
    <!-- 自定义 404 页面 -->
    <template #not-found>
      <NotFound />
    </template>
    
    <!-- 导航栏右侧：阅读增强菜单 + 设置按钮 -->
    <template #nav-bar-content-after>
      <NolebaseEnhancedReadabilitiesMenu />
      <Settings />
    </template>
    
    <!-- 移动端菜单：阅读增强选项 -->
    <template #nav-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
  </DefaultTheme.Layout>
  
  <!-- 音乐播放器（全局固定在右下角） -->
  <MusicPlayer />
</template>