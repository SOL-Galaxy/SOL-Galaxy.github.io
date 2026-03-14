import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "../Markdown",
  
  title: "SOL Galaxy",
  description: "A Webpage to storage Ideas of the Galaxy of SOL",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速开始/Quick Start', link: '/what_is_our_novel' }
    ],

    sidebar: [
      {
        text: '快速开始/Quick Start',
        items: [
          { text: '《双星旅记》是什么', link: '/what_is_our_novel' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io' }
    ]
  }
})
