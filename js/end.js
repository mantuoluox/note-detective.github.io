// DOM元素
const fileInput = document.getElementById('fileInput');
const submitBtn = document.getElementById('submitBtn');
const warningPart1 = document.getElementById('warningPart1');
const warningPart2 = document.getElementById('warningPart2');
const bgParticles = document.getElementById('bgParticles');
const cornerTexts = document.querySelectorAll('.corner-text');

// 生成红色背景粒子
function createRedParticles() {
    const count = 60;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const length = Math.random() * 15 + 5;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 20;

        particle.style.height = `${length}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        bgParticles.appendChild(particle);
    }
}

// 显示角落文字 - 确保只触发一次，增强突兀感
let isTriggered = false;
function showCornerTexts() {
    if (isTriggered) return; // 防止重复点击重复触发
    isTriggered = true;

    // 播放点击音效（可选，增强反馈）
    const clickSound = new Audio();
    clickSound.src = '../audio/error.mp3'; // 可替换为恐怖音效路径
    clickSound.volume = 0.5;
    clickSound.play().catch(() => { }); // 捕获静音/未用户交互的错误

    // 错开动画时间，逐个显现更诡异
    cornerTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('active');
        }, index * 150); // 150ms间隔
    });

    // 输入框额外反馈：短暂抖动（调用CSS中定义的inputShake动画）
    fileInput.style.animation = 'inputShake 0.5s ease-in-out';
    setTimeout(() => {
        fileInput.style.animation = '';
    }, 500);
}

// 页面加载逻辑
window.addEventListener('DOMContentLoaded', () => {
    createRedParticles();

    // 从localStorage获取初始输入内容
    const initialInput = localStorage.getItem('initialInput');
    fileInput.value = initialInput || 'Your_name';

    // 显示警告文字
    setTimeout(() => {
        warningPart1.style.animation = 'fadeIn 1.5s ease-out forwards, redFloat 5s ease-in-out infinite 0.5s';
    }, 1000);

    setTimeout(() => {
        warningPart2.style.animation = 'fadeIn 1.5s ease-out forwards, redFloat 6s ease-in-out infinite 0.8s';
    }, 2500);

    // 输入框光标闪烁
    setInterval(() => {
        fileInput.style.caretColor = fileInput.style.caretColor === 'transparent' ? '#ff6b6b' : 'transparent';
    }, 500);

    // 绑定点击事件（兼容多种触发方式）
    fileInput.addEventListener('click', showCornerTexts);
    fileInput.addEventListener('touchstart', showCornerTexts); // 移动端
    fileInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') showCornerTexts(); // 按任意键也触发
    });
});

// 按钮/回车跳转逻辑
submitBtn.addEventListener('click', () => {
    window.location.href = 'final.html';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        window.location.href = 'final.html';
    }
});