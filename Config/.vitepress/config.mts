import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "../Markdown",
  
  title: "SOL Galaxy",
  description: "A Webpage to storage Ideas of the Galaxy of SOL",
  
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh_cn/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh_cn/' },
          { text: '快速开始', link: '/zh_cn/what_is_our_novel' }
        ],
        sidebar: [
          {
            text: '快速开始',
            items: [
              { text: '《双星旅记》是什么', link: '/zh_cn/what_is_our_novel' },
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io' }
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Quick Start', link: '/en/what_is_our_novel' }
        ],
        sidebar: [
          {
            text: 'Quick Start',
            items: [
              { text: 'What is Our Novel', link: '/en/what_is_our_novel' },
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io' }
        ]
      }
    }
  }
})
