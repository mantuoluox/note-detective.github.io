document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    // 模拟加载
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
        });
    }, 800);
}, 1500);

class AudioTextPlayer {
  constructor(textSegments) {
    this._handlePlayClick = this._handlePlayClick.bind(this);
    this._updateTotalPlayTime = this._updateTotalPlayTime.bind(this);
    this.resetState = this.resetState.bind(this);

    this.config = {
      playButtonId: 'playButton',
      audioVisualizerId: 'audioVisualizer',
      recordingTextId: 'recordingText',
      dynamicBgId: 'dynamic-bg',
      startAudioSrc: '../audio/bi.mp3',      
      recordingAudioSrc: '../audio/fire.mp3', 
      startAudioVolume: 0.1,
      recordingAudioVolume: 0.1,
      playButtonKeepHidden: true,
      textSegments: textSegments || [] 
    };

    this.isPlaying = false;
    this.visualizerInterval = null;
    this.textUpdateInterval = null;
    this.currentSegmentIndex = 0;
    this.textComplete = false;
    this.totalPlayTime = 0;
    this.lastCurrentTime = 0;

    this.playButton = null;
    this.startAudio = null;
    this.recordingAudio = null;
    this.textElement = null;
    this.visualizer = null;
    this.bars = [];

    setTimeout(() => this.init(), 100);
  }

  init() {
    try {
      this._checkDOMElements();
      this._createDynamicBg();
      this._createVisualizer();
      this._initAudio();
      this._bindEvents();
    } catch (e) {
      console.error('播放器初始化失败：', e);
      alert('播放器加载失败，请检查音频文件是否存在');
    }
  }

  _checkDOMElements() {
    this.playButton = document.getElementById(this.config.playButtonId);
    this.textElement = document.getElementById(this.config.recordingTextId);
    this.visualizer = document.getElementById(this.config.audioVisualizerId);

    const missing = [];
    if (!this.playButton) missing.push('playButton');
    if (!this.textElement) missing.push('recordingText');
    if (!this.visualizer) missing.push('audioVisualizer');
    if (missing.length > 0) throw new Error(`缺失DOM元素：${missing.join(', ')}`);

    if (!document.getElementById('startAudio')) {
      const el = document.createElement('audio');
      el.id = 'startAudio';
      el.preload = 'auto';
      document.body.appendChild(el);
    }
    if (!document.getElementById('recordingAudio')) {
      const el = document.createElement('audio');
      el.id = 'recordingAudio';
      el.preload = 'auto';
      document.body.appendChild(el);
    }
    this.startAudio = document.getElementById('startAudio');
    this.recordingAudio = document.getElementById('recordingAudio');
  }

  // 动态背景
  _createDynamicBg() {
    const bg = document.getElementById(this.config.dynamicBgId);
    if (!bg) return;
    const animId = `float_${Date.now()}`;
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position:absolute; width:2px; height:2px; background:#0ff8; 
        border-radius:50%; left:${Math.random() * 100}%; top:${Math.random() * 100}%;
        animation:${animId} ${Math.random() * 10 + 10}s linear infinite;
      `;
      bg.appendChild(dot);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animId} {
        0% { transform:translate(0,0); opacity:0.3; }
        50% { opacity:0.8; }
        100% { transform:translate(${Math.random() * 40 - 20}px,${Math.random() * 40 - 20}px); opacity:0.3; }
      }
      #dynamic-bg,.grid-bg {
        position:fixed; top:0; left:0; width:100%; height:100%; 
        pointer-events:none; z-index:-1; opacity:0.7;
      }
      .grid-bg {
        background-image: 
          linear-gradient(rgba(0,255,255,0.03) 1px,transparent 1px),
          linear-gradient(90deg,rgba(0,255,255,0.03) 1px,transparent 1px);
        background-size:40px 40px;
      }
    `;
    document.head.appendChild(style);
  }

  // 可视化柱形
  _createVisualizer() {
    if (this.bars.length > 0) return;
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.className = 'audio-bar';
      this.visualizer.appendChild(bar);
      this.bars.push(bar);
    }
  }

  _initAudio() {
    this.startAudio.src = this.config.startAudioSrc;
    this.recordingAudio.src = this.config.recordingAudioSrc;
    this.startAudio.volume = this.config.startAudioVolume;
    this.recordingAudio.volume = this.config.recordingAudioVolume;

    this.startAudio.addEventListener('error', () => alert('提示音文件缺失：bi.mp3'));
    this.recordingAudio.addEventListener('error', () => alert('主音频文件缺失：fire.mp3'));

  }

  _bindEvents() {
    this.playButton.removeEventListener('click', this._handlePlayClick);
    this.playButton.addEventListener('click', this._handlePlayClick);
    window.removeEventListener('beforeunload', this.resetState);
    window.addEventListener('beforeunload', this.resetState);
  }

  // 按钮点击
  _handlePlayClick() {
    if (this.playButton.classList.contains('loading')) return;

    if (this.isPlaying) {
      this.resetState();
    } else {
      if (this.textComplete) this.resetState();
      this.isPlaying = true;
      this.playButton.classList.add('loading');

      this.startAudio.currentTime = 0;
      this.startAudio.play()
        .then(() => {
          this.playButton.style.display = 'none';
          this.startAudio.onended = () => {
            this.visualizer.classList.add('active');
            this._animateVisualizer();
            this.textElement.classList.add('active');

            this.totalPlayTime = 0;
            this.lastCurrentTime = 0;
            this.recordingAudio.removeEventListener('timeupdate', this._updateTotalPlayTime);
            this.recordingAudio.addEventListener('timeupdate', this._updateTotalPlayTime);

            this.recordingAudio.currentTime = 0;
            this.recordingAudio.play()
              .then(() => {
                this._startTextSync();
                const handleEnd = () => {
                  this.recordingAudio.removeEventListener('ended', handleEnd);
                  if (this.textComplete) {
                    this.recordingAudio.pause();
                    this._stopVisualizer();
                    this.isPlaying = false;
                    this.playButton.style.display = 'none';
                    this.playButton.classList.remove('loading');
                  } else {
                    this.totalPlayTime += (this.recordingAudio.duration - this.lastCurrentTime);
                    this.lastCurrentTime = 0;
                    this.recordingAudio.currentTime = 0;
                    this.recordingAudio.play().then(() => this.recordingAudio.addEventListener('ended', handleEnd));
                  }
                };
                this.recordingAudio.addEventListener('ended', handleEnd);
              })
              .catch(e => {
                alert('主音频播放失败：' + e.message);
                this.resetState();
              });
          };
        })
        .catch(e => {
          this.playButton.classList.remove('loading');
          this.isPlaying = false;
          if (e.name === 'NotAllowedError') alert('请点击页面任意位置后重试播放');
          else alert('提示音播放失败：' + e.message);
        });
    }
  }

  _animateVisualizer() {
    if (this.visualizerInterval) clearInterval(this.visualizerInterval);
    this.visualizerInterval = setInterval(() => {
      this.bars.forEach(bar => {
        bar.style.height = this.isPlaying ? `${Math.floor(Math.random() * 90) + 10}%` : '10%';
      });
    }, 80);
  }

  _stopVisualizer() {
    clearInterval(this.visualizerInterval);
    this.visualizerInterval = null;
    this.bars.forEach(bar => bar.style.height = '10%');
    this.visualizer.classList.remove('active');
  }

  // 文本同步
  _startTextSync() {
    if (this.textUpdateInterval) clearInterval(this.textUpdateInterval);
    if (this.currentSegmentIndex === 0) this.textElement.innerHTML = '';

    this.textUpdateInterval = setInterval(() => {
      if (!this.isPlaying) return;
      while (this.currentSegmentIndex < this.config.textSegments.length &&
        this.totalPlayTime >= this.config.textSegments[this.currentSegmentIndex].time) {
        this.textElement.innerHTML += this.config.textSegments[this.currentSegmentIndex].text;
        this.currentSegmentIndex++;
        this.textElement.scrollTop = this.textElement.scrollHeight;

        if (this.currentSegmentIndex >= this.config.textSegments.length) {
          this.textComplete = true;
          this.recordingAudio.pause();
          this._stopVisualizer();
          this.isPlaying = false;
          this.playButton.style.display = 'none';
          this.playButton.classList.remove('loading');
        }
      }
    }, 100);
  }

  // 播放时间
  _updateTotalPlayTime() {
    if (!this.isPlaying) return;
    const curr = this.recordingAudio.currentTime;
    this.totalPlayTime += curr - this.lastCurrentTime;
    this.lastCurrentTime = curr;
  }

  resetState() {
    this.isPlaying = false;
    this.textComplete = false;
    this.currentSegmentIndex = 0;
    this.totalPlayTime = 0;
    this.lastCurrentTime = 0;

    this.playButton.style.display = 'none';
    this.playButton.classList.remove('loading', 'playing');

    this.startAudio.pause();
    this.recordingAudio.pause();
    this.startAudio.currentTime = 0;
    this.recordingAudio.currentTime = 0;

    this.recordingAudio.removeEventListener('timeupdate', this._updateTotalPlayTime);
    this._stopVisualizer();

    clearInterval(this.textUpdateInterval);
    this.textUpdateInterval = null;
    this.textElement.innerHTML = '';
    this.textElement.classList.remove('active');
  }
}

// 暴露到全局

window.AudioTextPlayer = AudioTextPlayer;
