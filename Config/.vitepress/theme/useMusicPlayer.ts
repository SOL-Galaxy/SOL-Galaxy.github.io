/**
 * 音乐播放器 Composable
 * 管理音乐播放、播放列表和播放状态
 */

import { ref, computed, watch, onUnmounted } from 'vue'

// 音乐信息接口
export interface MusicTrack {
  title: string
  artist?: string
  src: string
  cover?: string
}

// 循环模式类型
export type LoopMode = 'off' | 'all' | 'one'

// 播放器状态
export function useMusicPlayer() {
  // 播放列表 - 从 /music 目录加载
  const playlist = ref<MusicTrack[]>([
    { 
      title: '危机前夕', 
      src: '/music/危机前夕.mp3'
    },
    { 
      title: '向明天', 
      src: '/music/向明天.mp3'
    },
    { 
      title: '大混乱年代', 
      src: '/music/大混乱年代.mp3'
    },
    { 
      title: '致这不完美的世界', 
      src: '/music/致这不完美的世界.mp3'
    },
    { 
      title: '褪色的心跳', 
      src: '/music/褪色的心跳.mp3'
    }
  ])

  // 当前播放索引
  const currentIndex = ref(0)
  
  // 是否正在播放
  const isPlaying = ref(false)
  
  // 当前时间(秒)
  const currentTime = ref(0)
  
  // 总时长(秒)
  const duration = ref(0)
  
  // 是否已恢复播放状态
  let hasRestored = false
  
  // 音量 (0-1)
  const volume = ref(0.7)
  
  // 循环模式: off(不循环) | all(列表循环) | one(单曲循环)
  const loopMode = ref<LoopMode>('all')
  
  // 音频对象
  let audio: HTMLAudioElement | null = null
  
  // 当前歌曲信息
  const currentTrack = computed(() => {
    if (playlist.value.length === 0) return null
    return playlist.value[currentIndex.value] || null
  })
  
  // 进度百分比
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })
  
  // 获取循环模式图标
  const loopModeIcon = computed(() => {
    switch (loopMode.value) {
      case 'off':
        return 'loop-off'
      case 'all':
        return 'loop-all'
      case 'one':
        return 'loop-one'
      default:
        return 'loop-off'
    }
  })

  // 获取循环模式提示文本
  const loopModeText = computed(() => {
    switch (loopMode.value) {
      case 'off':
        return '不循环'
      case 'all':
        return '列表循环'
      case 'one':
        return '单曲循环'
      default:
        return '不循环'
    }
  })
  
  // 格式化时间 (秒 -> mm:ss)
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 保存播放状态
  function savePlaybackState() {
    try {
      const state = {
        index: currentIndex.value,
        time: currentTime.value,
        isPlaying: isPlaying.value,
        timestamp: Date.now()
      }
      localStorage.setItem('music-playback-state', JSON.stringify(state))
    } catch (error) {
      console.error('[MusicPlayer] Failed to save playback state:', error)
    }
  }

  // 事件处理函数（保持引用以便移除）
  const handleTimeUpdate = () => {
    currentTime.value = audio?.currentTime || 0
    // 每5秒保存一次播放状态
    if (Math.floor(currentTime.value) % 5 === 0) {
      savePlaybackState()
    }
  }

  const handleLoadedMetadata = () => {
    duration.value = audio?.duration || 0
  }

  const handleEnded = () => {
    if (loopMode.value === 'one') {
      // 单曲循环：重新播放当前歌曲
      if (audio) {
        audio.currentTime = 0
        play()
      }
    } else if (loopMode.value === 'all') {
      // 列表循环：播放下一首
      next()
    } else {
      // 不循环：停止播放，如果是最后一首则回到开头
      if (currentIndex.value >= playlist.value.length - 1) {
        currentIndex.value = 0
        currentTime.value = 0
        duration.value = 0
        initAudio()
        isPlaying.value = false
      } else {
        next()
      }
    }
  }

  const handleError = (e: Event) => {
    console.error('[MusicPlayer] Audio error:', e)
    next() // 跳到下一首
  }

  // 清理音频资源
  function cleanupAudio() {
    if (audio) {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.src = ''
      audio = null
    }
  }

  // 初始化音频
  function initAudio() {
    if (!currentTrack.value) return
    
    // 先清理旧的音频对象和事件监听器
    cleanupAudio()
    
    // 创建新的音频对象
    audio = new Audio(currentTrack.value.src)
    audio.volume = volume.value
    
    // 添加事件监听器
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
  }

  // 播放
  function play() {
    if (!audio && currentTrack.value) {
      initAudio()
    }
    
    audio?.play().then(() => {
      isPlaying.value = true
      savePlaybackState()
    }).catch((error) => {
      console.error('[MusicPlayer] Play failed:', error)
    })
  }

  // 暂停
  function pause() {
    audio?.pause()
    isPlaying.value = false
    savePlaybackState()
  }

  // 切换播放/暂停
  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  // 切换中标志，防止快速连续点击
  let isSwitching = false

  // 下一首
  function next() {
    if (playlist.value.length === 0 || isSwitching) return
    
    isSwitching = true
    const wasPlaying = isPlaying.value
    
    // 先暂停当前播放
    if (audio) {
      audio.pause()
      isPlaying.value = false
    }
    
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    currentTime.value = 0
    duration.value = 0
    
    initAudio()
    
    // 如果之前在播放，继续播放新歌曲
    if (wasPlaying) {
      setTimeout(() => {
        play()
        isSwitching = false
      }, 100)
    } else {
      setTimeout(() => {
        isSwitching = false
      }, 100)
    }
  }

  // 上一首
  function prev() {
    if (playlist.value.length === 0 || isSwitching) return
    
    isSwitching = true
    const wasPlaying = isPlaying.value
    
    // 先暂停当前播放
    if (audio) {
      audio.pause()
      isPlaying.value = false
    }
    
    currentIndex.value = currentIndex.value === 0 
      ? playlist.value.length - 1 
      : currentIndex.value - 1
    
    currentTime.value = 0
    duration.value = 0
    
    initAudio()
    
    // 如果之前在播放，继续播放新歌曲
    if (wasPlaying) {
      setTimeout(() => {
        play()
        isSwitching = false
      }, 100)
    } else {
      setTimeout(() => {
        isSwitching = false
      }, 100)
    }
  }

  // 跳转到指定位置 (百分比 0-100)
  function seek(percent: number) {
    if (!audio || !duration.value) return
    
    const newTime = (percent / 100) * duration.value
    audio.currentTime = newTime
    currentTime.value = newTime
  }

  // 切换到指定歌曲并播放
  function playTrackByIndex(index: number) {
    if (index < 0 || index >= playlist.value.length || isSwitching) return
    
    isSwitching = true
    
    // 暂停当前播放
    if (audio) {
      audio.pause()
      isPlaying.value = false
    }
    
    currentIndex.value = index
    currentTime.value = 0
    duration.value = 0
    
    initAudio()
    
    // 自动播放新歌曲
    setTimeout(() => {
      play()
      isSwitching = false
    }, 100)
  }

  // 设置音量 (0-1)
  function setVolume(val: number) {
    volume.value = Math.max(0, Math.min(1, val))
    if (audio) {
      audio.volume = volume.value
    }
    // 保存音量设置
    try {
      localStorage.setItem('music-volume', volume.value.toString())
    } catch (error) {
      console.error('[MusicPlayer] Failed to save volume:', error)
    }
  }

  // 切换循环模式
  function toggleLoopMode() {
    const modes: LoopMode[] = ['off', 'all', 'one']
    const currentModeIndex = modes.indexOf(loopMode.value)
    loopMode.value = modes[(currentModeIndex + 1) % modes.length]
    
    // 保存循环模式
    try {
      localStorage.setItem('music-loop-mode', loopMode.value)
    } catch (error) {
      console.error('[MusicPlayer] Failed to save loop mode:', error)
    }
  }

  // 恢复播放状态
  async function restorePlaybackState() {
    if (hasRestored) return
    
    try {
      const stored = localStorage.getItem('music-playback-state')
      if (!stored) return
      
      const state = JSON.parse(stored)
      
      // 检查状态是否过期（超过24小时不恢复）
      const now = Date.now()
      const elapsed = now - (state.timestamp || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24小时
      
      if (elapsed > maxAge) {
        console.log('[MusicPlayer] Playback state expired, not restoring')
        return
      }
      
      // 恢复播放索引
      if (typeof state.index === 'number' && state.index >= 0 && state.index < playlist.value.length) {
        currentIndex.value = state.index
      }
      
      // 初始化音频
      await new Promise(resolve => setTimeout(resolve, 100))
      initAudio()
      
      // 等待音频加载完成
      await new Promise(resolve => {
        if (!audio) {
          resolve(null)
          return
        }
        
        const onCanPlay = () => {
          audio?.removeEventListener('canplay', onCanPlay)
          resolve(null)
        }
        
        audio.addEventListener('canplay', onCanPlay)
        
        // 超时保护
        setTimeout(() => {
          audio?.removeEventListener('canplay', onCanPlay)
          resolve(null)
        }, 3000)
      })
      
      // 恢复播放进度
      if (audio && typeof state.time === 'number' && state.time > 0) {
        audio.currentTime = state.time
        currentTime.value = state.time
      }
      
      // 如果之前在播放，自动恢复播放
      if (state.isPlaying) {
        await new Promise(resolve => setTimeout(resolve, 200))
        play()
        console.log('[MusicPlayer] Restored playback state:', state)
      }
      
      hasRestored = true
    } catch (error) {
      console.error('[MusicPlayer] Failed to restore playback state:', error)
    }
  }

  // 加载播放列表配置
  async function loadPlaylist() {
    try {
      // 从配置文件或 localStorage 加载播放列表
      const stored = localStorage.getItem('music-playlist')
      if (stored) {
        const data = JSON.parse(stored)
        if (Array.isArray(data) && data.length > 0) {
          playlist.value = data
        }
      }
      
      // 加载音量设置
      const storedVolume = localStorage.getItem('music-volume')
      if (storedVolume) {
        const vol = parseFloat(storedVolume)
        if (!isNaN(vol)) {
          volume.value = Math.max(0, Math.min(1, vol))
        }
      }
      
      // 加载循环模式
      const storedLoopMode = localStorage.getItem('music-loop-mode')
      if (storedLoopMode && ['off', 'all', 'one'].includes(storedLoopMode)) {
        loopMode.value = storedLoopMode as LoopMode
      }
      
      // 恢复播放状态
      await restorePlaybackState()
    } catch (error) {
      console.error('[MusicPlayer] Failed to load playlist:', error)
    }
  }

  // 保存播放列表配置
  function savePlaylist() {
    try {
      localStorage.setItem('music-playlist', JSON.stringify(playlist.value))
    } catch (error) {
      console.error('[MusicPlayer] Failed to save playlist:', error)
    }
  }

  // 监听播放列表变化并保存
  watch(playlist, () => {
    savePlaylist()
  }, { deep: true })

  // 组件卸载时清理
  onUnmounted(() => {
    // 保存最终状态
    savePlaybackState()
    cleanupAudio()
  })
  
  // 页面卸载前保存状态
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', savePlaybackState)
  }

  return {
    // 状态
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    loopMode,
    loopModeIcon,
    loopModeText,
    
    // 方法
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    playTrackByIndex,
    setVolume,
    toggleLoopMode,
    formatTime,
    loadPlaylist,
    savePlaylist,
  }
}
