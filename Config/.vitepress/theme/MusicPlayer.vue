<template>
  <!-- 只有在启用且有播放列表时才显示 -->
  <Transition name="music-player-fade">
    <div v-if="enabled && currentTrack" class="music-player" :class="{ minimized: isMinimized }">
      <div class="music-player-content">
        <!-- 歌曲信息 - 最小化时隐藏 -->
        <div v-show="!isMinimized" class="music-info">
          <div class="music-title">{{ currentTrack.title }}</div>
          <div class="music-artist" v-if="currentTrack.artist">
            {{ currentTrack.artist }}
          </div>
        </div>

        <!-- 进度条 - 最小化时隐藏 -->
        <div v-show="!isMinimized" class="music-progress-wrapper">
          <span class="music-time">{{ formatTime(currentTime) }}</span>
          <div 
            class="music-progress-bar"
            @click="handleProgressClick"
            ref="progressBar"
          >
            <div 
              class="music-progress-fill"
              :style="{ width: `${progress}%` }"
            ></div>
            <div 
              class="music-progress-thumb"
              :style="{ left: `${progress}%` }"
            ></div>
          </div>
          <span class="music-time">{{ formatTime(duration) }}</span>
        </div>

        <!-- 控制按钮 -->
        <div class="music-controls">
          <!-- 循环模式 - 最小化时隐藏 -->
          <button 
            v-show="!isMinimized"
            class="music-btn music-btn-loop" 
            @click.stop="toggleLoopMode"
            :title="loopModeText"
            :class="{ active: loopMode !== 'off' }"
          >
            <!-- 不循环 -->
            <svg v-if="loopModeIcon === 'loop-off'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            <!-- 列表循环 -->
            <svg v-else-if="loopModeIcon === 'loop-all'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            <!-- 单曲循环 -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">1</text>
            </svg>
          </button>

          <button 
            v-show="!isMinimized"
            class="music-btn" 
            @click.stop="prev"
            title="上一首"
            :disabled="playlist.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5"/>
            </svg>
          </button>

          <button 
            class="music-btn music-btn-play" 
            @click.stop="togglePlay"
            :title="isPlaying ? '暂停' : '播放'"
          >
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>

          <button 
            v-show="!isMinimized"
            class="music-btn" 
            @click.stop="next"
            title="下一首"
            :disabled="playlist.length <= 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 4 15 12 5 20 5 4"/>
              <line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
          </button>

          <!-- 音量控制 - 最小化时隐藏 -->
          <div v-show="!isMinimized" class="music-volume-container">
            <button 
              class="music-btn music-btn-volume" 
              @click.stop="toggleVolumeControl"
              title="音量"
            >
              <svg v-if="volume > 0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg v-else-if="volume > 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>
            
            <!-- 音量滑块 -->
            <Transition name="volume-fade">
              <div v-if="showVolumeControl" class="music-volume-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  :value="volume"
                  @input="handleVolumeChange"
                  class="volume-input"
                />
                <span class="volume-value">{{ Math.round(volume * 100) }}%</span>
              </div>
            </Transition>
          </div>

          <!-- 播放列表按钮 - 最小化时隐藏 -->
          <button 
            v-show="!isMinimized"
            class="music-btn music-btn-playlist" 
            @click.stop="togglePlaylist"
            :title="showPlaylist ? '关闭列表' : '播放列表'"
            :class="{ active: showPlaylist }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>

          <!-- 收起/展开按钮 -->
          <button 
            class="music-btn music-btn-minimize" 
            @click.stop="toggleMinimize"
            :title="isMinimized ? '展开' : '收起'"
          >
            <svg v-if="!isMinimized" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="19 12 12 19 5 12"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>

        <!-- 播放列表面板 -->
        <Transition name="playlist-fade">
          <div v-if="showPlaylist && !isMinimized" class="music-playlist">
            <div class="music-playlist-header">
              <span class="music-playlist-title">播放列表 ({{ playlist.length }})</span>
            </div>
            <div class="music-playlist-items">
              <div 
                v-for="(track, index) in playlist" 
                :key="index"
                class="music-playlist-item"
                :class="{ active: index === currentIndex }"
                @click="playTrack(index)"
              >
                <div class="music-playlist-item-index">{{ index + 1 }}</div>
                <div class="music-playlist-item-info">
                  <div class="music-playlist-item-title">{{ track.title }}</div>
                  <div v-if="track.artist" class="music-playlist-item-artist">{{ track.artist }}</div>
                </div>
                <div v-if="index === currentIndex && isPlaying" class="music-playlist-item-playing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                </div>
                <div v-else-if="index === currentIndex" class="music-playlist-item-playing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMusicPlayer } from './useMusicPlayer'
import { useSettings } from './useSettings'

const { getSetting } = useSettings()

// 使用音乐播放器
const {
  playlist,
  currentTrack,
  currentIndex,
  isPlaying,
  currentTime,
  duration,
  progress,
  volume,
  loopMode,
  loopModeIcon,
  loopModeText,
  togglePlay,
  pause,
  next,
  prev,
  seek,
  playTrackByIndex,
  setVolume,
  toggleLoopMode,
  formatTime,
  loadPlaylist,
} = useMusicPlayer()

// 是否启用音乐播放器
const enabled = ref(true)

// 是否最小化
const isMinimized = ref(false)

// 是否显示音量控制
const showVolumeControl = ref(false)

// 是否显示播放列表
const showPlaylist = ref(false)

// 进度条元素
const progressBar = ref<HTMLElement | null>(null)

/**
 * 处理进度条点击
 */
function handleProgressClick(e: MouseEvent) {
  if (!progressBar.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  seek(percent)
}

/**
 * 切换最小化状态
 */
function toggleMinimize() {
  isMinimized.value = !isMinimized.value
}

/**
 * 处理音量变化
 */
function handleVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement
  setVolume(parseFloat(target.value))
}

/**
 * 切换音量控制显示
 */
function toggleVolumeControl() {
  showVolumeControl.value = !showVolumeControl.value
}

/**
 * 切换播放列表显示
 */
function togglePlaylist() {
  showPlaylist.value = !showPlaylist.value
}

/**
 * 播放指定歌曲
 */
function playTrack(index: number) {
  if (index === currentIndex.value) {
    // 如果点击的是当前歌曲，切换播放/暂停
    togglePlay()
  } else {
    // 切换到指定歌曲并播放
    playTrackByIndex(index)
  }
}

/**
 * 监听设置变化
 */
watch(() => getSetting('enableMusicPlayer'), (value) => {
  const newEnabled = value !== false // 默认为 true
  
  // 如果从启用变为禁用，暂停播放
  if (enabled.value && !newEnabled && isPlaying.value) {
    pause()
  }
  
  enabled.value = newEnabled
}, { immediate: true })

// 组件挂载时，只有在启用的情况下才加载播放列表
onMounted(() => {
  // 等待 enabled 状态初始化完成
  const checkEnabled = () => {
    const isEnabled = getSetting('enableMusicPlayer') !== false
    console.log('Music Player Enabled:', isEnabled)
    if (isEnabled) {
      loadPlaylist()
    }
  }
  
  // 延迟一下确保设置已加载
  setTimeout(checkEnabled, 100)
})
</script>

<style scoped>
/* 音乐播放器容器 */
.music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 320px;
  max-width: 400px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* 歌曲信息 */
.music-info {
  margin-bottom: 12px;
  text-align: center;
}

.music-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-artist {
  font-size: 13px;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 进度条区域 */
.music-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.music-time {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: monospace;
  min-width: 40px;
}

.music-progress-bar {
  flex: 1;
  height: 6px;
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.music-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 3px;
  transition: width 0.1s linear;
}

.music-progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s;
}

/* 控制按钮 */
.music-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.music-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s;
}

.music-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.music-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.music-btn-play {
  width: 44px;
  height: 44px;
  background: var(--vp-c-brand-1);
  color: white;
}

/* 循环模式按钮 */
.music-btn-loop {
  width: 32px;
  height: 32px;
}

.music-btn-loop.active {
  color: var(--vp-c-brand-1);
}

/* 音量控制容器 */
.music-volume-container {
  position: relative;
  display: flex;
  align-items: center;
}

.music-btn-volume {
  width: 32px;
  height: 32px;
}

.music-volume-slider {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.volume-input {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.volume-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.volume-value {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: monospace;
}

.music-btn-minimize {
  margin-left: 8px;
  width: 32px;
  height: 32px;
}

/* 播放列表按钮 */
.music-btn-playlist {
  width: 32px;
  height: 32px;
}

.music-btn-playlist.active {
  color: var(--vp-c-brand-1);
}

/* 播放列表面板 */
.music-playlist {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider-light);
  padding-top: 12px;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.music-playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 8px;
}

.music-playlist-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.music-playlist-items {
  overflow-y: auto;
  max-height: 240px;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft);
}

.music-playlist-items::-webkit-scrollbar {
  width: 6px;
}

.music-playlist-items::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
}

.music-playlist-items::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand-1);
  border-radius: 3px;
}

.music-playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.music-playlist-item.active {
  background: var(--vp-c-brand-soft);
}

.music-playlist-item-index {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: monospace;
  min-width: 24px;
  text-align: center;
}

.music-playlist-item.active .music-playlist-item-index {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.music-playlist-item-info {
  flex: 1;
  overflow: hidden;
}

.music-playlist-item-title {
  font-size: 13px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-playlist-item.active .music-playlist-item-title {
  color: var(--vp-c-brand-1);
}

.music-playlist-item-artist {
  font-size: 11px;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.music-playlist-item-playing {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--vp-c-brand-1);
}

/* 播放列表淡入淡出 */
.playlist-fade-enter-active,
.playlist-fade-leave-active {
  transition: all 0.3s ease;
}

.playlist-fade-enter-from {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

.playlist-fade-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

/* 最小化状态 */
.music-player.minimized {
  min-width: auto;
  width: auto;
  padding: 8px;
}

.music-player.minimized .music-controls {
  gap: 4px;
}

.music-player.minimized .music-btn-play {
  width: 40px;
  height: 40px;
}

.music-player.minimized .music-btn-minimize {
  margin-left: 4px;
}

/* 淡入淡出动画 */
.music-player-fade-enter-active,
.music-player-fade-leave-active {
  transition: all 0.3s ease;
}

.music-player-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.music-player-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* 音量控制淡入淡出 */  
.volume-fade-enter-active,
.volume-fade-leave-active {
  transition: all 0.2s ease;
}

.volume-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

.volume-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(5px);
}

/* 只在支持 hover 的设备上应用悬停效果 */
@media (hover: hover) {
  .music-player:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .music-progress-bar:hover {
    height: 8px;
  }

  .music-progress-bar:hover .music-progress-thumb {
    opacity: 1;
  }

  .music-btn:hover:not(:disabled) {
    background: var(--vp-c-brand-1);
    color: white;
    transform: scale(1.1);
  }

  .music-btn-play:hover {
    background: var(--vp-c-brand-2);
    transform: scale(1.15);
  }

  .volume-input::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  .volume-input::-moz-range-thumb:hover {
    transform: scale(1.2);
  }

  .music-playlist-items::-webkit-scrollbar-thumb:hover {
    background: var(--vp-c-brand-2);
  }

  .music-playlist-item:hover {
    background: var(--vp-c-bg-soft);
  }
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .music-player {
    bottom: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
    padding: 12px;
  }

  .music-title {
    font-size: 14px;
  }

  .music-artist {
    font-size: 12px;
  }

  .music-btn {
    width: 32px;
    height: 32px;
  }

  .music-btn-play {
    width: 40px;
    height: 40px;
  }

  .music-playlist {
    max-height: 200px;
  }

  .music-playlist-items {
    max-height: 160px;
  }

  .music-playlist-item {
    padding: 8px 4px;
  }

  .music-playlist-item-title {
    font-size: 12px;
  }
}
</style>
