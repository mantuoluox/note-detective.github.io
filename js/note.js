document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
        });
    }, 800);
}, 1500);

class NotePage {
    constructor(config) {
        this.config = Object.assign({
            textContent: {},      
            hasImage: false,      
            imageSelector: '#mainImage', 
            modalSelector: '#imageModal', 
            modalImageSelector: '#modalImage', 
            closeModalSelector: '#closeModal', 
            hasEndEntry: false, 
            endEntrySelector: '#endEntry', 
            noteContainerSelector: '#noteContainer', 
            audioSelector: '#typeAudio',
            typingSpeed: {        
                firstPara: 20,    
                otherPara: 10     
            }
        }, config);

        this.audio = document.querySelector(this.config.audioSelector);
        this.hasClicked = false; 
    }

    createDynamicBackground() {
        const bgContainer = document.getElementById('dynamic-bg');
        if (!bgContainer) return;

        const particleCount = 15;
        const streamCount = 8;

        // 云状粒子
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

        // 数据流效果
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.classList.add('data-stream');
            stream.style.left = `${Math.random() * 100}vw`;
            stream.style.height = `${Math.random() * 50 + 30}vh`;
            stream.style.animationDelay = `${Math.random() * 5}s`;
            bgContainer.appendChild(stream);
        }
    }

    typeWriter(elementId, text, delay = 0, speed = 50) {
        return new Promise((resolve) => {
            const element = document.getElementById(elementId);
            if (!element) {
                resolve();
                return;
            }

            const processedText = text.replace(/\{([^}]+)\}/g, (match, char) => {
                return `<span class="highlight-char">${char}</span>`;
            });

            let i = 0;
            let currentHtml = '';
            const totalLength = processedText.length;

            // 显示段落
            element.style.display = 'block';

            // 逐字打印
            setTimeout(() => {
                const type = () => {
                    if (i < totalLength) {
                        currentHtml += processedText.charAt(i);
                        element.innerHTML = currentHtml; 

                        // 打字音效
                        if (this.audio && this.audio.paused) {
                            this.audio.play().catch(e => console.log('播放音效需要用户交互:', e));
                        }

                        i++;
                        setTimeout(type, speed);
                    } else {
                        element.innerHTML = currentHtml.replace('<span class="typing-text"></span>', '');
                        resolve();
                    }
                };

                element.innerHTML = '';
                type();
            }, delay);
        });
    }

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

            // 打开动画
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

        // 关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    async startTextDisplay() {
        if (this.hasClicked) return;
        this.hasClicked = true;

        if (this.audio) {
            this.audio.volume = 0.1;
        }

        const paraKeys = Object.keys(this.config.textContent).sort((a, b) => {
            const numA = parseInt(a.replace('p', ''));
            const numB = parseInt(b.replace('p', ''));
            return numA - numB;
        });

        // 逐段打印
        let delay = 500; 
        for (let i = 0; i < paraKeys.length; i++) {
            const key = paraKeys[i];
            const speed = i === 0 ? this.config.typingSpeed.firstPara : this.config.typingSpeed.otherPara;
            await this.typeWriter(key, this.config.textContent[key], delay, speed);
            delay = 300; 
        }

        if (this.config.hasImage) {
            const image = document.querySelector(this.config.imageSelector);
            if (image) {
                image.style.display = 'block';
                image.style.animation = `fadeInImg 1.2s forwards 0.5s`;
            }
        }

        if (this.config.hasEndEntry) {
            const endEntry = document.querySelector(this.config.endEntrySelector);
            if (endEntry) {
                endEntry.style.display = 'block';
                endEntry.style.animation = 'fadeIn 0.8s forwards';
            }
        }

        setTimeout(() => {
            if (this.audio) {
                this.audio.volume = 0;
            }
        }, 1000);
    }

    init() {
        this.createDynamicBackground();

        this.setupImageModal();

        document.addEventListener('click', () => {
            this.startTextDisplay();
        }, { once: true });
    }
}


window.NotePage = NotePage;

