import { defineConfig } from 'vitepress'
import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import { withMermaid } from "vitepress-plugin-mermaid";


// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  srcDir: "../Markdown",
  base: '/', // GitHub Pages base路径
  cleanUrls: true, // 启用简洁URL
  
  title: "SOL Galaxy",
  description: "A Webpage to storage Ideas of the Galaxy of SOL",
  
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-inline-link-preview/client',
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-git-changelog/client',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-inline-link-preview',
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-git-changelog',
      ],
    },
    plugins: [
      GitChangelog({
        repoURL: () => 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io',
      }),
      GitChangelogMarkdownSection(),
    ],
  },
  
  markdown: {
    config: (md) => {
      md.use(InlineLinkPreviewElementTransform)
    }
  },
  
  themeConfig: {
    lastUpdated: true,
    editLink: {
      pattern: 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io/edit/main/Markdown/:path'
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },
  
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
          },
          {
            text: '世界设定',
            items: [
              { text: '世界概览', link: '/zh_cn/world/' },
              { text: '概念与术语', link: '/zh_cn/concepts/' },
              { text: '地点与星球', link: '/zh_cn/locations/' },
              { text: '历史年表', link: '/zh_cn/history/'},
              { 
                text: '重大事件', 
                link: '/zh_cn/events/',
                items: [
                  { text: 'α星大屠杀', link: '/zh_cn/events/alpha-star-massacre' },
                ]
               },
            ]
          },
          {
            text: '角色与势力',
            items: [
              { text: '人物角色', link: '/zh_cn/characters/' },
              { text: '势力组织', link: '/zh_cn/organizations/' },
              { text: '种族与生物', link: '/zh_cn/creatures/' },
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
        search: {
          provider: 'local'
        },
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
          },
          {
            text: 'World Building',
            items: [
              { text: 'World Overview', link: '/en/world/' },
              { text: 'Locations & Planets', link: '/en/locations/' },
              { text: 'Historical Timeline', link: '/en/history/' },
              { text: 'Major Events', link: '/en/events/' },
            ]
          },
          {
            text: 'Characters & Factions',
            items: [
              { text: 'Characters', link: '/en/characters/' },
              { text: 'Organizations', link: '/en/organizations/' },
              { text: 'Creatures & Races', link: '/en/creatures/' },
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/SOL-Galaxy/SOL-Galaxy.github.io' }
        ]
      }
    }
  }
}))
