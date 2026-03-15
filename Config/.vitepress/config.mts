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
          { text: '世界观', link: '/zh_cn/what_is_our_novel' }
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
              { text: '人物角色', 
                link: '/zh_cn/characters/',
                items: [
                  { text: '星溯', link: '/zh_cn/characters/xingsu' },
                ] 
              },
              { text: '势力组织', 
                link: '/zh_cn/organizations/', 
                items: [
                  { text: '财团', link: '/zh_cn/organizations/the-ogas-consortium' },
                  { text: '黎明之剑', link: '/zh_cn/organizations/dawn-blade' },
                ] 
              },
              { text: '种族与生物', link: '/zh_cn/creatures/' },
            ]
          },
          {
            text: '小说章节',
            items: [
              { 
                text: '双星旅记', 
                link: '/zh_cn/novels/shuangxingluji/',
                collapsed: true,
                items: [
                  { text: '简介', link: '/zh_cn/novels/shuangxingluji/chapter-01' },
                  { text: '序幕:起始点', link: '/zh_cn/novels/shuangxingluji/chapter-02' },
                  { text: 'α星篇·其一：燃烧的访客', link: '/zh_cn/novels/shuangxingluji/chapter-03' },
                  { text: 'α星篇·其二：灵裔临境', link: '/zh_cn/novels/shuangxingluji/chapter-04' },
                  { text: 'α星篇·其三：血染长歌', link: '/zh_cn/novels/shuangxingluji/chapter-05' },
                  { text: 'α星篇·其四：在血与火中', link: '/zh_cn/novels/shuangxingluji/chapter-06' },
                  { text: 'α星篇·其五：暗潮涌动', link: '/zh_cn/novels/shuangxingluji/chapter-07' },
                  { text: 'α星篇·其六：迈向黑暗', link: '/zh_cn/novels/shuangxingluji/chapter-08' },
                  { text: 'α星篇·其七：在黑暗中', link: '/zh_cn/novels/shuangxingluji/chapter-09' },
                  { text: 'α星篇·其八：『再燃烧吧』', link: '/zh_cn/novels/shuangxingluji/chapter-10' },
                  { text: 'α星篇·其九：黎明前夜', link: '/zh_cn/novels/shuangxingluji/chapter-11' },
                  { text: 'α星篇·完结篇1：『来找我们，聆听我们。』', link: '/zh_cn/novels/shuangxingluji/chapter-12' },
                  { text: 'α星篇·完结篇2：往日种种...', link: '/zh_cn/novels/shuangxingluji/chapter-13' },
                ]
              },
              { 
                text: '裂痕之火', 
                link: '/zh_cn/novels/liehenzhihuo/',
                collapsed: true,
                items: [
                  { text: '序章：不存在的人', link: '/zh_cn/novels/liehenzhihuo/chapter-01' },
                  { text: '第一章：净化之火', link: '/zh_cn/novels/liehenzhihuo/chapter-02' },
                  { text: '第二章：阴影中的回响', link: '/zh_cn/novels/liehenzhihuo/chapter-03' },
                  { text: '第三章：血债与筹码', link: '/zh_cn/novels/liehenzhihuo/chapter-04' },
                  { text: '第四章：第一次回响', link: '/zh_cn/novels/liehenzhihuo/chapter-05' },
                ]
              }
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
          },
          {
            text: 'Novels',
            items: [
              { 
                text: 'Twin Star Journey', 
                link: '/novels/shuangxingluji/',
                collapsed: true,
                items: [
                  { text: 'Introduction', link: '/novels/shuangxingluji/chapter-01' },
                  { text: 'Prologue: Starting Point', link: '/novels/shuangxingluji/chapter-02' },
                  { text: 'α Star Chapter 1: Burning Visitor', link: '/novels/shuangxingluji/chapter-03' },
                  { text: 'α Star Chapter 2: Spirit Descendants Arrival', link: '/novels/shuangxingluji/chapter-04' },
                  { text: 'α Star Chapter 3: Blood-Stained Elegy', link: '/novels/shuangxingluji/chapter-05' },
                  { text: 'α Star Chapter 4: In Blood and Fire', link: '/novels/shuangxingluji/chapter-06' },
                  { text: 'α Star Chapter 5: Undercurrents Surging', link: '/novels/shuangxingluji/chapter-07' },
                  { text: 'α Star Chapter 6: Towards Darkness', link: '/novels/shuangxingluji/chapter-08' },
                  { text: 'α Star Chapter 7: In the Darkness', link: '/novels/shuangxingluji/chapter-09' },
                  { text: 'α Star Chapter 8: "Burn Again"', link: '/novels/shuangxingluji/chapter-10' },
                  { text: 'α Star Chapter 9: Before Dawn', link: '/novels/shuangxingluji/chapter-11' },
                  { text: 'α Star Finale 1: "Come Find Us, Listen to Us."', link: '/novels/shuangxingluji/chapter-12' },
                  { text: 'α Star Finale 2: The Past...', link: '/novels/shuangxingluji/chapter-13' },
                ]
              },
              { 
                text: 'Fire of Rift', 
                link: '/novels/liehenzhihuo/',
                collapsed: true,
                items: [
                  { text: 'Prologue: The Non-Existent', link: '/novels/liehenzhihuo/chapter-01' },
                  { text: 'Chapter 1: Purifying Fire', link: '/novels/liehenzhihuo/chapter-02' },
                  { text: 'Chapter 2: Echoes in Shadow', link: '/novels/liehenzhihuo/chapter-03' },
                  { text: 'Chapter 3: Blood Debt and Bargaining Chips', link: '/novels/liehenzhihuo/chapter-04' },
                  { text: 'Chapter 4: First Echo', link: '/novels/liehenzhihuo/chapter-05' },
                ]
              }
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
