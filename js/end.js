const fileInput = document.getElementById('fileInput');
const submitBtn = document.getElementById('submitBtn');
const warningPart1 = document.getElementById('warningPart1');
const warningPart2 = document.getElementById('warningPart2');
const bgParticles = document.getElementById('bgParticles');
const cornerTexts = document.querySelectorAll('.corner-text');

// 背景粒子
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

// 显示角落文字
let isTriggered = false;
function showCornerTexts() {
    if (isTriggered) return; 
    isTriggered = true;

    const clickSound = new Audio();
    clickSound.src = '../audio/error.mp3';
    clickSound.volume = 0.5;
    clickSound.play().catch(() => { });

    cornerTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('active');
        }, index * 150); 
    });

    fileInput.style.animation = 'inputShake 0.5s ease-in-out';
    setTimeout(() => {
        fileInput.style.animation = '';
    }, 500);
}

// 页面加载
window.addEventListener('DOMContentLoaded', () => {
    createRedParticles();

    const initialInput = localStorage.getItem('initialInput');
    fileInput.value = initialInput || 'Your_name';

    setTimeout(() => {
        warningPart1.style.animation = 'fadeIn 1.5s ease-out forwards, redFloat 5s ease-in-out infinite 0.5s';
    }, 1000);

    setTimeout(() => {
        warningPart2.style.animation = 'fadeIn 1.5s ease-out forwards, redFloat 6s ease-in-out infinite 0.8s';
    }, 2500);

    setInterval(() => {
        fileInput.style.caretColor = fileInput.style.caretColor === 'transparent' ? '#ff6b6b' : 'transparent';
    }, 500);

    fileInput.addEventListener('click', showCornerTexts);
    fileInput.addEventListener('touchstart', showCornerTexts); 
    fileInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') showCornerTexts(); 
    });
});

submitBtn.addEventListener('click', () => {
    window.location.href = 'final.html';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        window.location.href = 'final.html';
    }

});
