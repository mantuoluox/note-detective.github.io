// DOM元素
const syncLoader = document.getElementById('syncLoader');
const dataStream = document.getElementById('dataStream');
const contentContainer = document.getElementById('contentContainer');
const logContent = document.getElementById('logContent');
const recordingContent = document.getElementById('recordingContent');
const recordingContainer = document.getElementById('recordingContainer');
const leaveBtn = document.getElementById('leaveBtn');
const particles = document.getElementById('particles');

// 音效元素
const loadingSound = document.getElementById('loadingSound');
const footstepSound = document.getElementById('footstepSound');
const knockSound = document.getElementById('knockSound');

// 设置脚步声音量（0-1之间，0.3为30%音量）
footstepSound.volume = 0.3;

// 生成背景粒子
function createParticles() {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // 随机位置和动画时长
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particles.appendChild(particle);
    }
}

// 点击波纹效果
function createRipple(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    // 移除波纹元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 获取当前日期时间并格式化
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 生成模拟数据流
function generateDataStream() {
    const dataTemplates = [
        "Syncing file: truth.html | Progress: 25%",
        "Encrypting data | Status: Success",
        "Verifying uploader identity: Yao | Confirmed",
        "Checking target connection | Online",
        "Transmitting log data | Packet: 1/5",
        "Transmitting log data | Packet: 2/5",
        "Transmitting log data | Packet: 3/5",
        "Transmitting log data | Packet: 4/5",
        "Transmitting log data | Packet: 5/5",
        "Upload complete. Target confirmed."
    ];

    dataTemplates.forEach((data, index) => {
        setTimeout(() => {
            const dataLine = document.createElement('div');
            dataLine.className = 'data-line';
            dataLine.textContent = data;
            dataStream.appendChild(dataLine);

            // 滚动到底部
            dataStream.scrollTop = dataStream.scrollHeight;
        }, index * 300);
    });
}

// 逐字显示函数（放慢速度，默认150ms/字）
function typeWriter(text, element, speed = 150, callback) {
    let i = 0;
    element.textContent = '';
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            if (callback) callback();
        }
    }, speed);
}

// 页面点击处理函数
function handlePageClick(e) {
    // 创建点击波纹
    createRipple(e);

    // 显示录音容器
    recordingContainer.classList.add('visible');

    // 先播放bi音效
    loadingSound.play();

    // bi音效播放完后播放脚步声
    loadingSound.onended = function () {
        footstepSound.play();
    };

    // 录音文本分为两部分：敲门声之前和之后
    const part1 = `“恭喜你成功解锁了她的所有笔记。

很好。

但可惜的是，她没能再写下后面的篇章。

因为我主动去见了她。

就像我现在来见你一样。”

`;
    const part2 = `"嗨，又见面了————"`;

    // 先显示第一部分文本（放慢速度，200ms/字）
    let i = 0;
    recordingContent.textContent = '';
    const typingInterval = setInterval(() => {
        if (i < part1.length) {
            recordingContent.textContent += part1.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            // 第一部分显示完后，停止脚步声，播放敲门声
            footstepSound.pause();
            knockSound.play();

            // 敲门声播放完后显示第二部分（放慢速度，200ms/字）
            knockSound.onended = function () {
                let j = 0;
                const part2Interval = setInterval(() => {
                    if (j < part2.length) {
                        recordingContent.textContent += part2.charAt(j);
                        j++;
                    } else {
                        clearInterval(part2Interval);
                        // 全部显示完后，等待3秒显示离开按钮
                        setTimeout(() => {
                            leaveBtn.classList.add('visible');
                        }, 1000);
                    }
                }, 200);
            };
        }
    }, 200);

    // 移除点击事件监听，防止重复点击
    document.body.removeEventListener('click', handlePageClick);
}

// 页面流程控制
function startGameFlow() {
    // 创建背景粒子
    createParticles();

    // 播放加载音效
    loadingSound.play();

    // 生成数据流
    generateDataStream();

    // 3秒后隐藏加载动画，显示内容容器
    setTimeout(() => {
        syncLoader.style.opacity = 0;
        setTimeout(() => {
            syncLoader.style.display = 'none';
            contentContainer.style.opacity = 1;
            contentContainer.style.transform = 'translateY(0)';

            // 准备系统日志文本，包含当前日期时间
            const currentDateTime = getCurrentDateTime();
            const logText = `同步状态：ON 上传者：Yao 最后同步：${currentDateTime}`;

            // 逐字显示系统日志（放慢速度）
            logContent.textContent = '';
            typeWriter(logText, logContent, 150, () => {
                // 日志显示完后，等待1秒准备好点击事件
                setTimeout(() => {
                    document.body.addEventListener('click', handlePageClick);
                }, 1000);
            });
        }, 1000);
    }, 3500);
}

// 离开按钮跳转至结尾页面
leaveBtn.addEventListener('click', () => {
    window.location.href = 'ending.html';
});

// 页面加载后启动流程
window.addEventListener('DOMContentLoaded', startGameFlow);