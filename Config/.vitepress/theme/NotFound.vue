<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { site, lang } = useData()

// 判断是否为英文环境
const isEnglish = computed(() => lang.value.includes('en'))

// 多语言文案
const i18n = computed(() => {
  if (isEnglish.value) {
    return {
      errorCode: '404',
      title: 'Sorry, Page Not Found',
      description: 'The link may have expired or the page may have been removed.',
      homeButton: 'Back to Home',
      issuesButton: 'Report Issue',
      footer: 'SOL Galaxy Creative Center'
    }
  } else {
    return {
      errorCode: '404',
      title: '抱歉，您访问的页面不存在',
      description: '可能是链接已失效，或页面已被移除。',
      homeButton: '返回首页',
      issuesButton: '报告问题',
      footer: 'SOL Galaxy 创意中心'
    }
  }
})

const homeLink = computed(() => {
  return site.value.themeConfig?.nav?.[0]?.link || '/'
})

const issuesLink = 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io/issues'
</script>

<template>
  <div class="not-found-wrapper">
    <div class="not-found-card">
      <!-- 404错误码 -->
      <div class="error-code">{{ i18n.errorCode }}</div>
      
      <!-- 标题 -->
      <h1 class="title">{{ i18n.title }}</h1>
      
      <!-- 描述 -->
      <p class="description">{{ i18n.description }}</p>
      
      <!-- 操作按钮 -->
      <div class="actions">
        <a :href="homeLink" class="action-button primary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {{ i18n.homeButton }}
        </a>
        
        <a :href="issuesLink" target="_blank" class="action-button secondary">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ i18n.issuesButton }}
        </a>
      </div>
      
      <!-- 页脚 -->
      <div class="footer">
        <p>{{ i18n.footer }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-card {
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 96px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
  font-family: monospace;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.description {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
  cursor: pointer;
  border: 1px solid transparent;
}

.action-button .icon {
  width: 20px;
  height: 20px;
}

.action-button.primary {
  color: #fff;
  background-color: var(--vp-c-brand-1);
}

.action-button.primary:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-button.secondary {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-divider);
}

.action-button.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.footer {
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.footer p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .not-found-card {
    padding: 2rem 1.5rem;
  }

  .error-code {
    font-size: 72px;
  }

  .title {
    font-size: 1.25rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}

/* 暗色模式优化 */
.dark .not-found-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}
</style>
