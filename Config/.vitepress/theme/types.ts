/**
 * 设置项配置类型定义
 */

/**
 * 单个设置项的配置
 */
export interface SettingItem {
  /** 设置项的唯一键名 */
  key: string
  /** 设置项的显示标题 */
  label: string
  /** 设置项的描述信息 */
  description?: string
  /** 设置项的类型 */
  type: 'boolean' | 'string' | 'number' | 'select'
  /** 默认值 */
  defaultValue: any
  /** 如果类型是 select，提供选项列表 */
  options?: Array<{ label: string; value: any }>
}

/**
 * 设置项分组
 */
export interface SettingGroup {
  /** 分组的唯一 ID */
  id: string
  /** 分组的显示标题 */
  title: string
  /** 分组的描述 */
  description?: string
  /** 该分组下的设置项 */
  items: SettingItem[]
}

/**
 * 完整的设置配置
 */
export interface SettingsConfig {
  /** 所有设置分组 */
  groups: SettingGroup[]
}

/**
 * 对外暴露的 API 接口
 */
export interface SettingsAPI {
  /** 获取指定键的设置值 */
  getSetting: <T = any>(key: string) => T | undefined
  /** 设置指定键的值 */
  setSetting: <T = any>(key: string, value: T) => void
  /** 重置所有设置为默认值 */
  resetSettings: () => void
  /** 导出所有设置为 JSON 对象 */
  exportSettings: () => Record<string, any>
  /** 从 JSON 对象导入设置 */
  importSettings: (data: Record<string, any>) => void
}
