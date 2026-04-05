/**
 * 阅读进度跟踪 Composable
 * 
 * 功能1（主）：记录最后访问的页面，下次打开网站时自动跳转
 * 功能2（次）：记录每个页面的滚动位置，返回页面时自动恢复
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vitepress'
import { inBrowser } from 'vitepress'

// localStorage 键名
const LAST_PAGE_KEY = 'vitepress-last-visited-page'
const SCROLL_PROGRESS_KEY = 'vitepress-scroll-progress'
const SETTINGS_KEY = 'vitepress-settings'

// 滚动位置记录
interface ScrollProgress {
  [path: string]: number
}

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
 * 检查功能1是否启用（自动跳转到上次页面）
 */
function isRedirectEnabled(): boolean {
  if (!inBrowser) return false
  
  try {
    const settings = localStorage.getItem(SETTINGS_KEY)
    if (settings) {
      const parsed = JSON.parse(settings)
      return parsed.autoRedirectToLastPage !== false
    }
  } catch (error) {
    console.error('[阅读进度] 读取跳转设置失败:', error)
  }
  return true
}

/**
 * 检查功能2是否启用（自动恢复滚动位置）
 */
function isScrollRestoreEnabled(): boolean {
  if (!inBrowser) return false
  
  try {
    const settings = localStorage.getItem(SETTINGS_KEY)
    if (settings) {
      const parsed = JSON.parse(settings)
      return parsed.autoRestoreScrollPosition !== false
    }
  } catch (error) {
    console.error('[阅读进度] 读取滚动恢复设置失败:', error)
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
   * 功能1: 保存最后访问的页面
   */
  function saveLastPage(path: string) {
    if (!inBrowser || !isRedirectEnabled()) return
    
    try {
      localStorage.setItem(LAST_PAGE_KEY, path)
      console.log('[阅读进度] 已保存最后访问页面:', path)
    } catch (error) {
      console.error('[阅读进度] 保存页面失败:', error)
    }
  }

  /**
   * 功能1: 获取最后访问的页面
   */
  function getLastPage(): string | null {
    if (!inBrowser || !isRedirectEnabled()) return null
    
    try {
      return localStorage.getItem(LAST_PAGE_KEY)
    } catch (error) {
      console.error('[阅读进度] 读取页面失败:', error)
      return null
    }
  }

  /**
   * 功能1: 跳转到最后访问的页面
   * 仅当打开首页时执行
   */
  function redirectToLastPage(): boolean {
    if (!inBrowser || !isRedirectEnabled() || hasRedirected.value) return false
    
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
   * 功能2: 保存滚动位置
   */
  function saveScrollPosition(path: string, scrollY: number) {
    if (!inBrowser || !isScrollRestoreEnabled()) return
    
    try {
      const stored = localStorage.getItem(SCROLL_PROGRESS_KEY)
      const progress: ScrollProgress = stored ? JSON.parse(stored) : {}
      progress[path] = scrollY
      localStorage.setItem(SCROLL_PROGRESS_KEY, JSON.stringify(progress))
    } catch (error) {
      console.error('[阅读进度] 保存滚动位置失败:', error)
    }
  }

  /**
   * 功能2: 获取滚动位置
   */
  function getScrollPosition(path: string): number | null {
    if (!inBrowser || !isScrollRestoreEnabled()) return null
    
    try {
      const stored = localStorage.getItem(SCROLL_PROGRESS_KEY)
      if (!stored) return null
      const progress: ScrollProgress = JSON.parse(stored)
      return progress[path] ?? null
    } catch (error) {
      console.error('[阅读进度] 读取滚动位置失败:', error)
      return null
    }
  }

  /**
   * 功能2: 恢复滚动位置
   */
  function restoreScrollPosition(path: string) {
    if (!inBrowser || !isScrollRestoreEnabled() || hasRestored.value) return
    
    const scrollY = getScrollPosition(path)
    
    if (scrollY && scrollY > 0) {
      console.log('[阅读进度] 📜 恢复滚动位置:', scrollY, 'px for', path)
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
      console.log('[阅读进度] 无保存的滚动位置:', path)
    }
  }

  /**
   * 设置滚动监听
   */
  function setupScrollListener() {
    if (!inBrowser || !isScrollRestoreEnabled()) return
    
    // 移除旧监听器
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    
    // 使用节流，每 500ms 最多保存一次
    scrollHandler = throttle(() => {
      const scrollY = window.scrollY
      saveScrollPosition(route.path, scrollY)
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
    
    // 功能1: 保存为最后访问的页面（如果启用）
    if (isRedirectEnabled()) {
      saveLastPage(path)
    }
    
    // 功能2: 恢复滚动位置（如果启用）
    if (isScrollRestoreEnabled()) {
      restoreScrollPosition(path)
    }
  }

  /**
   * 初始化阅读进度跟踪
   */
  function initReadingProgress() {
    if (!inBrowser) return
    
    console.log('[阅读进度] 🎯 初始化，当前页面:', route.path)
    
    let didRedirect = false
    
    // 功能1: 尝试跳转到上次访问的页面（如果启用）
    if (isRedirectEnabled()) {
      didRedirect = redirectToLastPage()
    }
    
    if (!didRedirect) {
      // 没有跳转，记录当前页面（如果功能1启用）
      if (isRedirectEnabled()) {
        saveLastPage(route.path)
      }
      
      // 恢复滚动位置（如果功能2启用）
      if (isScrollRestoreEnabled()) {
        restoreScrollPosition(route.path)
      }
    }
    
    // 功能2: 设置滚动监听（如果启用）
    if (isScrollRestoreEnabled()) {
      setupScrollListener()
    }
  }

  /**
   * 清除所有阅读进度
   */
  function clearAllProgress() {
    if (!inBrowser) return
    
    try {
      localStorage.removeItem(LAST_PAGE_KEY)
      localStorage.removeItem(SCROLL_PROGRESS_KEY)
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
