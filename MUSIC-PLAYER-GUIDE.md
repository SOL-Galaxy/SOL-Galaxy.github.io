# 音乐播放器使用指南

## 1. 添加音乐文件

1. 在项目的 `public` 目录下创建 `music` 文件夹（如果不存在）
2. 将你的音乐文件（支持 mp3、wav、ogg 等格式）放入该文件夹
3. 可选：在 `public/images` 目录下添加封面图片

文件结构示例：
```
public/
├── music/
│   ├── song1.mp3
│   ├── song2.mp3
│   └── song3.mp3
└── images/
    ├── cover1.jpg
    └── cover2.jpg
```

## 2. 配置播放列表

打开浏览器控制台（F12），执行以下代码来配置播放列表：

```javascript
// 配置播放列表
const playlist = [
  {
    title: '歌曲名称1',
    artist: '歌手名称1',  // 可选
    src: '/music/song1.mp3',
    cover: '/images/cover1.jpg'  // 可选
  },
  {
    title: '歌曲名称2',
    artist: '歌手名称2',
    src: '/music/song2.mp3',
    cover: '/images/cover2.jpg'
  },
  {
    title: '歌曲名称3',
    artist: '歌手名称3',
    src: '/music/song3.mp3'
  }
]

// 保存到 localStorage
localStorage.setItem('music-playlist', JSON.stringify(playlist))

// 刷新页面
location.reload()
```

## 3. 播放器功能

- **播放/暂停**：点击中间的大按钮
- **上一首**：点击左侧按钮
- **下一首**：点击右侧按钮
- **进度控制**：点击进度条跳转到指定位置
- **收起/展开**：点击右下角按钮（未来功能）

## 4. 设置选项

在页面右上角点击「设置」按钮，可以：
- 启用/禁用音乐播放器
- 其他相关设置

## 5. 导出/导入配置

### 导出播放列表

```javascript
const playlist = JSON.parse(localStorage.getItem('music-playlist') || '[]')
console.log(JSON.stringify(playlist, null, 2))
// 复制控制台输出的内容保存为 playlist.json
```

### 导入播放列表

```javascript
// 从 playlist.json 复制内容
const playlist = [
  // 粘贴你的播放列表配置
]
localStorage.setItem('music-playlist', JSON.stringify(playlist))
location.reload()
```

## 6. 高级配置

### 方式一：直接修改源码（推荐）

编辑 `Config/.vitepress/theme/useMusicPlayer.ts` 文件，在 `playlist` 的初始化部分：

```typescript
const playlist = ref<MusicTrack[]>([
  { 
    title: '歌曲1', 
    artist: '歌手1', 
    src: '/music/song1.mp3',
    cover: '/images/cover1.jpg'
  },
  { 
    title: '歌曲2', 
    artist: '歌手2', 
    src: '/music/song2.mp3' 
  },
  // ... 添加更多歌曲
])
```

### 方式二：使用配置文件

创建 `public/music/playlist.json`：

```json
[
  {
    "title": "歌曲1",
    "artist": "歌手1",
    "src": "/music/song1.mp3",
    "cover": "/images/cover1.jpg"
  },
  {
    "title": "歌曲2",
    "artist": "歌手2",
    "src": "/music/song2.mp3"
  }
]
```

然后修改 `useMusicPlayer.ts` 中的 `loadPlaylist` 函数来加载这个文件。

## 7. 常见问题

**Q: 音乐播放器不显示？**
- 检查设置中是否启用了音乐播放器
- 确保播放列表不为空
- 查看浏览器控制台是否有错误

**Q: 音乐无法播放？**
- 检查音乐文件路径是否正确
- 确保音频格式浏览器支持（推荐 mp3）
- 检查浏览器控制台错误信息

**Q: 如何自动播放？**
- 由于浏览器限制，大多数情况下需要用户交互后才能自动播放
- 首次访问时需要手动点击播放按钮

## 8. 示例配置

```javascript
// 示例：配置三首来自 /music 文件夹的歌曲
const playlist = [
  {
    title: '过往与现在',
    artist: '未知艺术家',
    src: '/music/past-and-present.mp3'
  },
  {
    title: 'From Hopeless to Hopeful',
    artist: 'Unknown Artist',
    src: '/music/from-hopeless-to-hopeful.mp3'
  },
  {
    title: '星辰大海',
    artist: '探索者',
    src: '/music/stars-and-sea.mp3',
    cover: '/images/music-cover.jpg'
  }
]

localStorage.setItem('music-playlist', JSON.stringify(playlist))
