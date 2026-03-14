// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import Chart from './Chart.vue'

// Nolebase Plugins
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import { 
  NolebaseEnhancedReadabilitiesMenu, 
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'
import { InjectionKey as NolebaseGitChangelogInjectionKey } from '@nolebase/vitepress-plugin-git-changelog/client'
import { InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'not-found': () => h(NotFound),
      // Git Changelog 组件
      'doc-before': () => h(NolebaseGitChangelogPlugin),
      // 阅读增强菜单
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册 Inline Link Preview 插件
    app.use(NolebaseInlineLinkPreviewPlugin)

    // 注册图表组件（可在 Markdown 中直接使用 <Chart />）
    app.component('Chart', Chart)
    
    // Git Changelog 配置
    app.provide(NolebaseGitChangelogInjectionKey, {
      locales: {
        'zh-CN': {
          changelog: {
            title: '页面历史',
            noData: '暂无数据',
            lastEdited: '最后编辑于',
            lastEditedDateFnsLocaleName: 'zhCN',
            viewFullHistory: '查看完整历史',
            committedOn: '提交于',
          },
          contributors: {
            title: '贡献者',
            noData: '暂无贡献者',
          },
        },
        'en-US': {
          changelog: {
            title: 'Page History',
            noData: 'No data',
            lastEdited: 'Last edited on',
            lastEditedDateFnsLocaleName: 'enUS',
            viewFullHistory: 'View full history',
            committedOn: 'Committed on',
          },
          contributors: {
            title: 'Contributors',
            noData: 'No contributors',
          },
        },
      },
      mapAuthors: [
        {
          name: 'SOL-Galaxy',
          username: 'SOL-Galaxy',
        },
      ],
    })

    // 增强可读性配置
    app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
      locales: {
        'zh-CN': {
          title: {
            title: '阅读增强',
            titleAriaLabel: '阅读增强',
          },
          toggleSpotlight: {
            title: '聚光灯',
            titleAriaLabel: '聚光灯',
          },
          toggleLayoutSwitch: {
            title: '布局切换',
            titleAriaLabel: '布局切换',
            pageLayoutFullWidth: '全宽',
            pageLayoutFullWidthAriaLabel: '全宽',
            pageLayoutSidebarWidthAdjustableOnlyContentWidth: '仅调整内容宽度',
            pageLayoutSidebarWidthAdjustableOnlyContentWidthAriaLabel: '仅调整内容宽度',
            pageLayoutBothWidthAdjustable: '同时调整',
            pageLayoutBothWidthAdjustableAriaLabel: '同时调整',
          },
        },
        'en-US': {
          title: {
            title: 'Reading Enhancements',
          },
        },
      },
    })
  }
} satisfies Theme
