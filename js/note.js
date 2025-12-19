document.addEventListener('DOMContentLoaded', () => {
    // 1. 加载动画控制
    const loader = document.getElementById('loader');

    // 模拟加载完成（2秒后隐藏加载动画）
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
        });
    }, 800);
}, 1500);

class NotePage {
    constructor(config) {
        // 默认配置 + 页面自定义配置
        this.config = Object.assign({
            textContent: {},       // 页面文本内容 {p1: 'xxx', p2: 'xxx'...}
            hasImage: false,       // 是否包含图片
            imageSelector: '#mainImage', // 图片选择器
            modalSelector: '#imageModal', // 弹窗选择器
            modalImageSelector: '#modalImage', // 弹窗图片选择器
            closeModalSelector: '#closeModal', // 关闭按钮选择器
            hasEndEntry: false, // 新增：是否显示“由此进入结局”，默认不显示
            endEntrySelector: '#endEntry', // 新增：“由此进入结局”元素的选择器
            noteContainerSelector: '#noteContainer', // 笔记容器选择器
            audioSelector: '#typeAudio', // 音频选择器
            typingSpeed: {         // 打字速度配置
                firstPara: 40,     // 第一段速度
                otherPara: 30      // 其他段落速度
            }
        }, config);

        // 初始化音频
        this.audio = document.querySelector(this.config.audioSelector);
        this.hasClicked = false; // 标记是否已点击过页面
    }

    // 1. 创建动态背景（云朵粒子+数据流）
    createDynamicBackground() {
        const bgContainer = document.getElementById('dynamic-bg');
        if (!bgContainer) return;

        const particleCount = 15;
        const streamCount = 8;

        // 创建云状粒子
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('cloud-particle');
            particle.style.width = `${Math.random() * 200 + 100}px`;
            particle.style.height = `${Math.random() * 150 + 80}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 30 + 30}s`;
            bgContainer.appendChild(particle);
        }

        // 创建数据流效果
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.classList.add('data-stream');
            stream.style.left = `${Math.random() * 100}vw`;
            stream.style.height = `${Math.random() * 50 + 30}vh`;
            stream.style.animationDelay = `${Math.random() * 5}s`;
            bgContainer.appendChild(stream);
        }
    }

    // 2. 逐字打印效果（通用适配任意段落）
    typeWriter(elementId, text, delay = 0, speed = 50) {
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve();
                return;
            }

            // 第一步：解析占位符 {字符} → 替换为带样式的span
            const processedText = text.replace(/\{([^}]+)\}/g, (match, char) => {
                return `<span class="highlight-char">${char}</span>`;
            });

            let i = 0;
            let currentHtml = '';
            const totalLength = processedText.length;

            // 显示段落
            element.style.display = 'block';

            // 延迟开始逐字打印
            setTimeout(() => {
                const type = () => {
                    if (i < totalLength) {
                        // 逐字符拼接（保留HTML标签完整性）
                        currentHtml += processedText.charAt(i);
                        element.innerHTML = currentHtml; // 用innerHTML渲染标签

                        // 播放打字音效
                        if (this.audio && this.audio.paused) {
                            this.audio.play().catch(e => console.log('播放音效需要用户交互:', e));
                        }

                        i++;
                        setTimeout(type, speed);
                    } else {
                        // 打印完成，移除多余光标（如有）
                        element.innerHTML = currentHtml.replace('<span class="typing-text"></span>', '');
                        resolve();
                    }
                };

                // 初始化
                element.innerHTML = '';
                type();
            }, delay);
        });
    }

    // 3. 初始化图片弹窗（适配有无图片的情况）
    setupImageModal() {
        if (!this.config.hasImage) return;

        const image = document.querySelector(this.config.imageSelector);
        const modal = document.querySelector(this.config.modalSelector);
        const modalImage = document.querySelector(this.config.modalImageSelector);
        const closeBtn = document.querySelector(this.config.closeModalSelector);
        const noteContainer = document.querySelector(this.config.noteContainerSelector);

        if (!image || !modal) return;

        // 打开弹窗
        image.addEventListener('click', () => {
            modalImage.src = image.src;
            modal.classList.add('active');
            noteContainer.classList.add('blur');
            document.body.style.overflow = 'hidden';

            // 添加科技风打开动画
            const content = modal.querySelector('.modal-content');
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            content.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 50);
        });

        // 关闭弹窗
        const closeModal = () => {
            const content = modal.querySelector('.modal-content');
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';

            setTimeout(() => {
                modal.classList.remove('active');
                noteContainer.classList.remove('blur');
                document.body.style.overflow = 'auto';
            }, 300);
        };

        // 关闭按钮事件
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // 点击弹窗背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 按ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 4. 按顺序打印所有段落
    async startTextDisplay() {
        if (this.hasClicked) return;
        this.hasClicked = true;

        // 调整音频音量
        if (this.audio) {
            this.audio.volume = 0.1;
        }

        // 获取文本键名并排序（p1, p2, p3...）
        const paraKeys = Object.keys(this.config.textContent).sort((a, b) => {
            const numA = parseInt(a.replace('p', ''));
            const numB = parseInt(b.replace('p', ''));
            return numA - numB;
        });

        // 逐段打印
        let delay = 500; // 初始延迟
        for (let i = 0; i < paraKeys.length; i++) {
            const key = paraKeys[i];
            const speed = i === 0 ? this.config.typingSpeed.firstPara : this.config.typingSpeed.otherPara;
            await this.typeWriter(key, this.config.textContent[key], delay, speed);
            delay = 300; // 后续段落延迟
        }

        // 如果有图片，打印完成后显示图片
        if (this.config.hasImage) {
            const image = document.querySelector(this.config.imageSelector);
            if (image) {
                image.style.display = 'block';
                image.style.animation = `fadeInImg 1.2s forwards 0.5s`;
            }
        }

        // 新增：按需显示“由此进入结局”（仅配置了hasEndEntry的页面）
        if (this.config.hasEndEntry) {
            const endEntry = document.querySelector(this.config.endEntrySelector);
            if (endEntry) {
                // 显示并添加淡入动画（需配合CSS）
                endEntry.style.display = 'block';
                endEntry.style.animation = 'fadeIn 0.8s forwards';
            }
        }

        // 打字完成后降低音效
        setTimeout(() => {
            if (this.audio) {
                this.audio.volume = 0;
            }
        }, 1000);
    }

    // 5. 页面初始化入口（核心方法）
    init() {
        // 创建动态背景
        this.createDynamicBackground();

        // 初始化图片弹窗（如有）
        this.setupImageModal();

        // 点击页面开始显示文本（仅触发一次）
        document.addEventListener('click', () => {
            this.startTextDisplay();
        }, { once: true });
    }
}

// 暴露给全局使用
window.NotePage = NotePage;