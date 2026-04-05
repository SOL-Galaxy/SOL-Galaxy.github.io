<template>
  <div class="vp-settings">
    <!-- 设置按钮 -->
    <button 
      class="vp-settings-button" 
      @click="togglePanel"
      :aria-label="isOpen ? '关闭设置' : '打开设置'"
      :title="isOpen ? '关闭设置' : '打开设置'"
    >
      <svg class="vp-settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m5.196-15.804L13.463 6.93M10.537 13.07l-3.732 3.732m0-9.804L10.537 10.93m2.926 2.14l3.733 3.733M1 12h6m6 0h6"/>
      </svg>
    </button>

    <!-- 设置面板 -->
    <Transition name="vp-settings-fade">
      <div v-if="isOpen" class="vp-settings-overlay" @click="closePanel">
        <div class="vp-settings-panel" @click.stop>
          <!-- 标题栏 -->
          <div class="vp-settings-header">
            <h2 class="vp-settings-title">设置</h2>
            <button class="vp-settings-close" @click="closePanel" aria-label="关闭">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="vp-settings-content">
            <!-- 空状态提示 -->
            <div v-if="config.groups.length === 0" class="vp-settings-empty">
              <svg class="vp-settings-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p class="vp-settings-empty-text">暂无配置项</p>
              <p class="vp-settings-empty-hint">设置项将在未来版本中添加</p>
            </div>

            <!-- 未来可以在这里添加设置项 -->
            <!-- <div v-for="group in config.groups" :key="group.id" class="vp-settings-group">
              <h3>{{ group.title }}</h3>
              <div v-for="item in group.items" :key="item.key">
                {{ item.label }}
              </div>
            </div> -->
          </div>

          <!-- 底部操作栏 -->
          <div class="vp-settings-footer">
            <button class="vp-settings-action" @click="handleExport">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              导出配置
            </button>
            <button class="vp-settings-action" @click="handleImport">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              导入配置
            </button>
            <button class="vp-settings-action vp-settings-danger" @click="handleReset">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              重置设置
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettings } from './useSettings'

// 使用设置 composable
const { config, exportSettings, importSettings, resetSettings } = useSettings()

// 面板状态
const isOpen = ref(false)

function togglePanel() {
  isOpen.value = !isOpen.value
}

function closePanel() {
  isOpen.value = false
}

/**
 * 导出配置
 */
function handleExport() {
  try {
    const data = exportSettings()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vitepress-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    console.log('[Settings] Configuration exported successfully')
  } catch (error) {
    console.error('[Settings] Failed to export configuration:', error)
  }
}

/**
 * 导入配置
 */
function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      importSettings(data)
      alert('配置导入成功！')
    } catch (error) {
      console.error('[Settings] Failed to import configuration:', error)
      alert('配置导入失败，请检查文件格式')
    }
  }
  input.click()
}

/**
 * 重置设置
 */
function handleReset() {
  if (confirm('确定要重置所有设置吗？此操作无法撤销。')) {
    resetSettings()
    alert('设置已重置')
  }
}
</script>

<style scoped>
/* 设置按钮 */
.vp-settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.25s;
}

.vp-settings-button:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

.vp-settings-icon {
  width: 20px;
  height: 20px;
}

/* 遮罩层 */
.vp-settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* 设置面板 */
.vp-settings-panel {
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 标题栏 */
.vp-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vp-settings-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-settings-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.25s;
}

.vp-settings-close:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-default-soft);
}

/* 内容区域 */
.vp-settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 空状态 */
.vp-settings-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.vp-settings-empty-icon {
  width: 64px;
  height: 64px;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

.vp-settings-empty-text {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vp-settings-empty-hint {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-3);
}

/* 底部操作栏 */
.vp-settings-footer {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.vp-settings-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s;
}

.vp-settings-action:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

.vp-settings-action.vp-settings-danger:hover {
  color: var(--vp-c-danger-1);
  border-color: var(--vp-c-danger-1);
}

/* 过渡动画 */
.vp-settings-fade-enter-active,
.vp-settings-fade-leave-active {
  transition: opacity 0.25s ease;
}

.vp-settings-fade-enter-from,
.vp-settings-fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vp-settings-overlay {
    padding: 0;
  }

  .vp-settings-panel {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .vp-settings-footer {
    flex-direction: column;
  }

  .vp-settings-action {
    width: 100%;
  }
}
</style>
