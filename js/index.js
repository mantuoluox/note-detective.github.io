// ========== 全局粒子生成（覆盖整个页面） ==========
function createGlobalDots() {
    const container = document.getElementById('globalDotsContainer');
    // 清空容器，确保不会重复生成
    container.innerHTML = '';

    const dotCount = 100; // 增加粒子数量，确保覆盖全面
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'bg-dot';
        dot.style.left = `${Math.random() * 100}vw`;
        dot.style.top = `${Math.random() * 100}vh`;
        dot.style.animationDelay = `${Math.random() * 10}s`;
        dot.style.animationDuration = `${10 + Math.random() * 15}s`;
        dot.style.width = `${2 + Math.random() * 4}px`;
        dot.style.height = `${2 + Math.random() * 4}px`;
        const opacity = 0.3 + Math.random() * 0.5;
        dot.style.background = `rgba(0, 255, 255, ${opacity})`;
        container.appendChild(dot);
    }

    // 定期更新粒子位置，增强动态效果
    setInterval(() => {
        const dots = document.querySelectorAll('.bg-dot');
        dots.forEach(dot => {
            // 随机微调位置，增强动态感
            const currentLeft = parseFloat(dot.style.left);
            const currentTop = parseFloat(dot.style.top);
            dot.style.left = `${(currentLeft + (Math.random() - 0.5) * 2) % 100}vw`;
            dot.style.top = `${(currentTop + (Math.random() - 0.5) * 2) % 100}vh`;
        });
    }, 1000);
}

// ========== 加载文字逐字显示效果 ==========
function animateLoadingText() {
    const loadingTexts = [
        "正在同步云端文件...",
        "正在同步云端文件...",
        "正在同步云端文件...",
        "正在同步云端文件...",
    ];
    const textElement = document.getElementById('loadingText');
    let textIndex = 0;
    let charIndex = 0;

    function typeText() {
        if (charIndex < loadingTexts[textIndex].length) {
            textElement.textContent += loadingTexts[textIndex][charIndex];
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            // 文字显示完成后，等待一段时间再切换
            setTimeout(() => {
                textElement.textContent = '';
                charIndex = 0;
                textIndex = (textIndex + 1) % loadingTexts.length;
                typeText();
            }, 1000);
        }
    }

    typeText();
}

// ========== 核心逻辑 ==========
document.addEventListener('DOMContentLoaded', function () {
    // 1. 生成全局粒子（页面加载即显示）
    createGlobalDots();

    // 元素获取
    const initStartContainer = document.getElementById('initStartContainer');
    const initStartBtn = document.getElementById('initStartBtn');
    const loadingContainer = document.getElementById('loading');
    const loadingAudio = document.getElementById('loadingAudio');
    const popup = document.getElementById('popup');
    const startBtn = document.getElementById('startBtn');
    const popupInput = document.getElementById('popupInput');
    const mainContent = document.getElementById('mainContent');
    const loginBtn = document.getElementById('loginBtn');
    const typingAudio = document.getElementById('typingAudio');
    typingAudio.volume = 0.1; // 提高打字音效音量，确保能听到

    // 2. 初始开始按钮点击事件
    initStartBtn.addEventListener('click', function () {
        // 隐藏初始页面
        initStartContainer.style.display = 'none';
        // 显示加载动画
        loadingContainer.style.display = 'flex';
        // 开始加载文字动画
        animateLoadingText();
        // 播放加载音频（用户交互后100%生效）
        loadingAudio.volume = 0.2;
        loadingAudio.play().catch(err => {
            console.error('加载音频播放失败：', err);
            alert('音频播放失败，请检查浏览器音频设置！');
        });

        // 加载进度条动画
        setTimeout(() => {
            document.querySelector('.loading-progress').style.width = '100%';

            // 加载结束前1秒，loading音效渐弱
            setTimeout(() => {
                const fadeInterval = setInterval(() => {
                    if (loadingAudio.volume > 0.1) {
                        loadingAudio.volume -= 0.1; // 逐步降低音量
                    } else {
                        clearInterval(fadeInterval);
                        loadingAudio.pause(); // 最终暂停
                    }
                }, 100);
            }, 2000);

            // 3秒后隐藏加载动画，显示弹窗
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                popup.style.display = 'flex';
            }, 3000);
        }, 500);
    });

    // 3. 弹窗开始按钮点击事件（修复黑屏+确保打字音效权限）
    startBtn.addEventListener('click', function () {
        const inputVal = popupInput.value.trim();
        if (!inputVal) {
            alert('请输入姓名');
            return;
        }

        // 验证通过，存储并显示主体内容
        localStorage.setItem('initialInput', inputVal);
        popup.style.display = 'none';
        mainContent.style.display = 'block';

        // 预触发打字音效（确保权限）
        typingAudio.currentTime = 0;
        typingAudio.play().then(() => {
            // 播放一小段以获取权限
            setTimeout(() => {
                typingAudio.pause();
                typingAudio.currentTime = 0;
                // 开始显示正文
                typeText();
            }, 100);
        }).catch(err => {
            console.error('预触发打字音效失败：', err);
            // 即使失败也继续显示文本，只是没有音效
            typeText();
        });
    });

    // 4. 登录按钮点击事件
    loginBtn.addEventListener('click', function () {
        const unlockAudio = document.getElementById('unlockAudio');
        unlockAudio.volume = 0.1;
        unlockAudio.play().catch(err => console.log('跳转音效播放失败：', err));
        setTimeout(() => {
            window.open('cloud.html', '_blank');
        }, 300);
    });
});

// ========== 逐字显示正文（修复打字音效+关键词倾斜） ==========
function typeText() {
    // 标记关键词：八尾美子（italic）、help（italic）、0303（特殊高亮）
    const text = `我在一次事务所清理时意外发现了这些隐藏在云端的文件，它们看起来像是名侦探八尾美子（Yao Meko）在3月3日接到调查委托后的案件记录。不幸的是，每个文件都被加密了，但以名侦探的性格，它们似乎可以通过特定的“字母或数字密码”来解锁。

那么我就先用0303尝试一下吧。

对了，记得之前计算机专业的朋友说过：不知道该干什么的时候就试试“help”吧。`;

    const container = document.getElementById('contentContainer');
    let index = 0;
    const typeSpeed = 50;
    const typingAudio = document.getElementById('typingAudio');

    // 逐字解析+渲染
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            // 播放打字音效（提高触发成功率）
            if (typingAudio.paused) {
                typingAudio.currentTime = 0;
                typingAudio.play().catch(err => {
                    console.error('打字音效播放失败：', err);
                });
            }

            let char = text[index];
            const span = document.createElement('span');
            span.className = 'char-span';

            // 识别特殊关键词
            // 1. 八尾美子
            if (text.substr(index, 14) === '八尾美子（Yao Meko）') {
                span.textContent = '八尾美子（Yao Meko）';
                span.className = 'char-span italic-text';
                index += 14;
            }
            // 2. help
            else if (text.substr(index, 4) === 'help') {
                span.textContent = 'help';
                span.className = 'char-span italic-text';
                index += 4;
            }
            // 3. 0303（去掉unlock音效）
            else if (text.substr(index, 4) === '0303') {
                span.textContent = '0303';
                span.className = 'char-span special-code';
                index += 4;
                // 已移除unlock音效播放代码
            }
            // 普通字符
            else {
                span.textContent = char;
                index++;
            }

            // 换行处理
            if (char === '\n') {
                span.innerHTML = '<br>';
            }

            container.appendChild(span);
        } else {
            clearInterval(typeInterval);
            typingAudio.pause();
            // 显示登录按钮
            setTimeout(() => {
                document.getElementById('loginBtn').classList.add('btn-visible');
            }, 800);
        }
    }, typeSpeed);

}
