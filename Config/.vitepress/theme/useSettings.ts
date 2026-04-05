/**
 * 设置管理 Composable
 * 提供 localStorage 持久化、响应式状态管理和对外 API
 */

import { ref, computed, watch, onMounted } from 'vue'
import type { SettingsConfig, SettingsAPI } from './types'

// localStorage 的键名
const STORAGE_KEY = 'vitepress-settings'

// 当前的设置配置（可扩展）
const defaultConfig: SettingsConfig = {
  groups: [
    {
      id: 'reading',
      title: '阅读体验',
      description: '自定义你的阅读体验',
      items: [
        {
          key: 'autoRedirectToLastPage',
          label: '自动跳转到上次页面',
          description: '打开网站时自动跳转到上次访问的页面',
          type: 'boolean',
          defaultValue: true
        },
        {
          key: 'autoRestoreScrollPosition',
          label: '自动恢复滚动位置',
          description: '进入文章时自动滚动到上次阅读的位置',
          type: 'boolean',
          defaultValue: true
        }
      ]
    }
  ]
}

/**
 * 从 localStorage 读取设置
 */
function loadSettings(): Record<string, any> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('[Settings] Failed to load settings from localStorage:', error)
  }
  return {}
}

/**
 * 保存设置到 localStorage
 */
function saveSettings(settings: Record<string, any>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('[Settings] Failed to save settings to localStorage:', error)
  }
}

/**
 * 导出设置管理 composable
 */
export function useSettings() {
  // 响应式的设置数据
  const settings = ref<Record<string, any>>({})
  
  // 配置信息
  const config = ref<SettingsConfig>(defaultConfig)

  // 是否已初始化
  const initialized = ref(false)

  /**
   * 初始化设置
   */
  function init() {
    if (initialized.value) return
    
    // 从 localStorage 加载
    settings.value = loadSettings()
    
    initialized.value = true
  }

  /**
   * 获取设置值
   */
  function getSetting<T = any>(key: string): T | undefined {
    return settings.value[key] as T | undefined
  }

  /**
   * 设置值
   */
  function setSetting<T = any>(key: string, value: T): void {
    settings.value[key] = value
    saveSettings(settings.value)
  }

  /**
   * 重置所有设置
   */
  function resetSettings(): void {
    settings.value = {}
    localStorage.removeItem(STORAGE_KEY)
    console.log('[Settings] All settings have been reset')
  }

  /**
   * 导出设置
   */
  function exportSettings(): Record<string, any> {
    return { ...settings.value }
  }

  /**
   * 导入设置
   */
  function importSettings(data: Record<string, any>): void {
    // 基础验证：必须是对象
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      console.error('[Settings] Invalid import data: must be an object')
      return
    }

    // 合并设置
    settings.value = { ...settings.value, ...data }
    saveSettings(settings.value)
    console.log('[Settings] Settings imported successfully')
  }

  // 在组件挂载时自动初始化
  onMounted(() => {
    init()
  })

  // 返回响应式数据和方法
  return {
    settings,
    config,
    initialized,
    getSetting,
    setSetting,
    resetSettings,
    exportSettings,
    importSettings,
  }
}

/**
 * 创建全局 API 对象
 */
export function createSettingsAPI(): SettingsAPI {
  const settingsData = ref<Record<string, any>>(loadSettings())

  // 监听变化并自动保存
  watch(settingsData, (newValue) => {
    saveSettings(newValue)
  }, { deep: true })

  return {
    getSetting: <T = any>(key: string): T | undefined => {
      return settingsData.value[key] as T | undefined
    },

    setSetting: <T = any>(key: string, value: T): void => {
      settingsData.value[key] = value
      saveSettings(settingsData.value)
    },

    resetSettings: (): void => {
      settingsData.value = {}
      localStorage.removeItem(STORAGE_KEY)
      console.log('[Settings] All settings have been reset')
    },

    exportSettings: (): Record<string, any> => {
      return { ...settingsData.value }
    },

    importSettings: (data: Record<string, any>): void => {
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        console.error('[Settings] Invalid import data: must be an object')
        return
      }
      settingsData.value = { ...settingsData.value, ...data }
      saveSettings(settingsData.value)
      console.log('[Settings] Settings imported successfully')
    },
  }
}
