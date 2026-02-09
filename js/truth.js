const syncLoader = document.getElementById('syncLoader');
const dataStream = document.getElementById('dataStream');
const contentContainer = document.getElementById('contentContainer');
const logContent = document.getElementById('logContent');
const recordingContent = document.getElementById('recordingContent');
const recordingContainer = document.getElementById('recordingContainer');
const leaveBtn = document.getElementById('leaveBtn');
const particles = document.getElementById('particles');

const loadingSound = document.getElementById('loadingSound');
const footstepSound = document.getElementById('footstepSound');
const knockSound = document.getElementById('knockSound');

footstepSound.volume = 0.3;

// 背景粒子
function createParticles() {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

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

// 波纹效果
function createRipple(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 当前日期时间
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 模拟数据流
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

            dataStream.scrollTop = dataStream.scrollHeight;
        }, index * 300);
    });
}

// 逐字显示
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

// 页面点击
function handlePageClick(e) {
    createRipple(e);

    recordingContainer.classList.add('visible');

    loadingSound.play();

    loadingSound.onended = function () {
        footstepSound.play();
    };

    const part1 = `“恭喜你成功解锁了她的所有笔记。

很好。

但可惜的是，她没能再写下后面的篇章。

因为我主动去见了她。

就像我现在来见你一样。”

`;
    const part2 = `"嗨，又见面了————"`;

    let i = 0;
    recordingContent.textContent = '';
    const typingInterval = setInterval(() => {
        if (i < part1.length) {
            recordingContent.textContent += part1.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            footstepSound.pause();
            knockSound.play();

            knockSound.onended = function () {
                let j = 0;
                const part2Interval = setInterval(() => {
                    if (j < part2.length) {
                        recordingContent.textContent += part2.charAt(j);
                        j++;
                    } else {
                        clearInterval(part2Interval);
                        setTimeout(() => {
                            leaveBtn.classList.add('visible');
                        }, 1000);
                    }
                }, 200);
            };
        }
    }, 200);

    document.body.removeEventListener('click', handlePageClick);
}

// 页面流程
function startGameFlow() {
    createParticles();

    loadingSound.play();

    generateDataStream();

    setTimeout(() => {
        syncLoader.style.opacity = 0;
        setTimeout(() => {
            syncLoader.style.display = 'none';
            contentContainer.style.opacity = 1;
            contentContainer.style.transform = 'translateY(0)';

            const currentDateTime = getCurrentDateTime();
            const logText = `同步状态：ON 上传者：Yao 最后同步：${currentDateTime}`;

            // 逐字显示系统日志
            logContent.textContent = '';
            typeWriter(logText, logContent, 150, () => {
                setTimeout(() => {
                    document.body.addEventListener('click', handlePageClick);
                }, 1000);
            });
        }, 1000);
    }, 3500);
}

leaveBtn.addEventListener('click', () => {
    window.location.href = 'ending.html';
});


window.addEventListener('DOMContentLoaded', startGameFlow);
