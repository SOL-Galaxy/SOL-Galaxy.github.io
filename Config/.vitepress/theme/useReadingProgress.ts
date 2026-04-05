/**
 * 阅读进度跟踪 Composable
 * 
 * 功能：记录最后访问的页面及其滚动位置，下次打开网站时自动跳转并恢复滚动位置
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { inBrowser } from 'vitepress'

// localStorage 键名
const LAST_PAGE_KEY = 'vitepress-last-visited-page'
const LAST_SCROLL_KEY = 'vitepress-last-scroll-position'
const SETTINGS_KEY = 'vitepress-settings'

/**
 * 节流函数
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastRan = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    
    if (!lastRan) {
      func.apply(this, args)
      lastRan = now
    } else {
      if (timeout) clearTimeout(timeout)
      
      timeout = setTimeout(() => {
        if (now - lastRan >= delay) {
          func.apply(this, args)
          lastRan = now
        }
      }, delay - (now - lastRan))
    }
  }
}

/**
 * 检查阅读进度功能是否启用（包括自动跳转和滚动恢复）
 */
function isReadingProgressEnabled(): boolean {
  if (!inBrowser) return false
  
  try {
    const settings = localStorage.getItem(SETTINGS_KEY)
    if (settings) {
      const parsed = JSON.parse(settings)
      return parsed.enableReadingProgress !== false
    }
  } catch (error) {
    console.error('[阅读进度] 读取设置失败:', error)
  }
  return true
}

/**
 * 阅读进度跟踪 Composable
 */
export function useReadingProgress() {
  const route = useRoute()
  const router = useRouter()
  
  const hasRedirected = ref(false)
  const hasRestored = ref(false)
  let scrollHandler: (() => void) | null = null

  /**
   * 保存最后访问的页面
   */
  function saveLastPage(path: string) {
    if (!inBrowser || !isReadingProgressEnabled()) return
    
    try {
      localStorage.setItem(LAST_PAGE_KEY, path)
      console.log('[阅读进度] 已保存最后访问页面:', path)
    } catch (error) {
      console.error('[阅读进度] 保存页面失败:', error)
    }
  }

  /**
   * 获取最后访问的页面
   */
  function getLastPage(): string | null {
    if (!inBrowser || !isReadingProgressEnabled()) return null
    
    try {
      return localStorage.getItem(LAST_PAGE_KEY)
    } catch (error) {
      console.error('[阅读进度] 读取页面失败:', error)
      return null
    }
  }

  /**
   * 跳转到最后访问的页面
   * 仅当打开首页时执行
   */
  function redirectToLastPage(): boolean {
    if (!inBrowser || !isReadingProgressEnabled() || hasRedirected.value) return false
    
    const currentPath = route.path
    const lastPage = getLastPage()
    
    // 检查是否是首页
    const isHomePage = 
      currentPath === '/' || 
      currentPath === '/index' || 
      currentPath === '/index.html' ||
      currentPath === '/zh_cn/' ||
      currentPath === '/zh_cn/index' ||
      currentPath === '/en/' ||
      currentPath === '/en/index'
    
    console.log('[阅读进度] 当前页:', currentPath, '是否首页:', isHomePage, '上次访问:', lastPage)
    
    if (isHomePage && lastPage && lastPage !== currentPath) {
      hasRedirected.value = true
      console.log('[阅读进度] 🚀 跳转到上次访问的页面:', lastPage)
      router.go(lastPage)
      return true
    }
    
    return false
  }

  /**
   * 保存滚动位置（仅保存最后访问页面的位置）
   */
  function saveScrollPosition(scrollY: number) {
    if (!inBrowser || !isReadingProgressEnabled()) return
    
    try {
      localStorage.setItem(LAST_SCROLL_KEY, scrollY.toString())
    } catch (error) {
      console.error('[阅读进度] 保存滚动位置失败:', error)
    }
  }

  /**
   * 获取滚动位置
   */
  function getScrollPosition(): number | null {
    if (!inBrowser || !isReadingProgressEnabled()) return null
    
    try {
      const stored = localStorage.getItem(LAST_SCROLL_KEY)
      return stored ? parseInt(stored, 10) : null
    } catch (error) {
      console.error('[阅读进度] 读取滚动位置失败:', error)
      return null
    }
  }

  /**
   * 恢复滚动位置（仅恢复最后访问页面的位置）
   */
  function restoreScrollPosition() {
    if (!inBrowser || !isReadingProgressEnabled() || hasRestored.value) return
    
    const scrollY = getScrollPosition()
    
    if (scrollY && scrollY > 0) {
      console.log('[阅读进度] 📜 恢复滚动位置:', scrollY, 'px')
      hasRestored.value = true
      
      // 多次尝试确保内容已加载
      let attempts = 0
      const maxAttempts = 10
      
      const tryRestore = () => {
        attempts++
        const docHeight = document.documentElement.scrollHeight
        
        if (docHeight > scrollY || attempts >= maxAttempts) {
          window.scrollTo({
            top: scrollY,
            behavior: attempts === 1 ? 'auto' : 'smooth'
          })
          console.log(`[阅读进度] ✅ 已恢复到 ${scrollY}px (尝试 ${attempts}/${maxAttempts})`)
        } else {
          setTimeout(tryRestore, 100)
        }
      }
      
      setTimeout(tryRestore, 300)
    } else {
      console.log('[阅读进度] 无保存的滚动位置')
    }
  }

  /**
   * 设置滚动监听
   */
  function setupScrollListener() {
    if (!inBrowser || !isReadingProgressEnabled()) return
    
    // 移除旧监听器
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    
    // 使用节流，每 500ms 最多保存一次
    scrollHandler = throttle(() => {
      const scrollY = window.scrollY
      saveScrollPosition(scrollY)
    }, 500)
    
    window.addEventListener('scroll', scrollHandler, { passive: true })
  }

  /**
   * 页面切换处理
   */
  function onPageChange(path: string) {
    if (!inBrowser) return
    
    console.log('[阅读进度] 页面切换:', path)
    
    // 重置状态
    hasRestored.value = false
    
    // 保存为最后访问的页面
    saveLastPage(path)
    
    // 恢复滚动位置（仅当返回到最后访问的页面时）
    const lastPage = getLastPage()
    if (lastPage === path) {
      restoreScrollPosition()
    }
  }

  /**
   * 初始化阅读进度跟踪
   */
  function initReadingProgress() {
    if (!inBrowser) return
    
    console.log('[阅读进度] 🎯 初始化，当前页面:', route.path)
    
    // 尝试跳转到上次访问的页面
    const didRedirect = redirectToLastPage()
    
    if (!didRedirect) {
      // 没有跳转，记录当前页面
      saveLastPage(route.path)
      
      // 恢复滚动位置
      restoreScrollPosition()
    }
    
    // 设置滚动监听
    setupScrollListener()
  }

  /**
   * 清除所有阅读进度
   */
  function clearAllProgress() {
    if (!inBrowser) return
    
    try {
      localStorage.removeItem(LAST_PAGE_KEY)
      localStorage.removeItem(LAST_SCROLL_KEY)
      console.log('[阅读进度] 已清除所有记录')
    } catch (error) {
      console.error('[阅读进度] 清除失败:', error)
    }
  }

  /**
   * 清理监听器
   */
  function cleanup() {
    if (scrollHandler && inBrowser) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }

  return {
    initReadingProgress,
    onPageChange,
    clearAllProgress,
    cleanup,
  }
}
