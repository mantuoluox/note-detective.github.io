// 冷笑话库
const jokes = [
    "为什么撒谎的人写出来的字都没墨水？<br><br>因为心虚到墨（没）底气啦！",
    "我家的盆栽为什么都软趴趴的？<br><br>它们都没我有梗啊！",
    "为什么字母Z最适合当主角？<br><br>因为它总是最后出现呀！",
    "两个i人谈恋爱为什么会有一个e人暴富？<br><br>当然是因为i2=-1哦！"
];

// DOM元素
const loader = document.getElementById('loader');
const writeText = document.getElementById('writeText');
const content = document.getElementById('content');
const jokePen = document.getElementById('jokePen');
const jokeModal = document.getElementById('jokeModal');
const jokeContent = document.getElementById('jokeContent');
const jokeClose = document.getElementById('jokeClose');
const petalContainer = document.getElementById('petalContainer');
const fireworkContainer = document.getElementById('fireworkContainer');
const magnifier = document.getElementById('magnifier');
const detectiveBadge = document.getElementById('detectiveBadge');
const mottoText = document.getElementById('mottoText');
const secretContent = document.getElementById('secretContent');
const highlightTexts = document.querySelectorAll('.highlight-text');

// 仅保留烟花音效元素
const fireworkSound = document.getElementById('fireworkSound');

// 生成樱花花瓣
function createPetals() {
    setInterval(() => {
        if (Math.random() > 0.3) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDuration = `${5 + Math.random() * 10}s`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            petalContainer.appendChild(petal);

            // 随机移除花瓣
            setTimeout(() => {
                petal.remove();
            }, 15000);
        }
    }, 300);
}

// 生成烟花
function createFirework(x, y) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    fireworkContainer.appendChild(firework);

    // 播放烟花音效（仅保留这处音效）
    fireworkSound.currentTime = 0;
    fireworkSound.play();

    // 移除烟花元素
    setTimeout(() => {
        firework.remove();
    }, 3000);
}

// 生成钢笔轨迹
function createPenTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'pen-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);

    // 移除轨迹
    setTimeout(() => {
        trail.remove();
    }, 1000);
}

// 生成随机墨水点
function createInkSpot() {
    const inkSpot = document.createElement('div');
    inkSpot.className = 'ink-spot';
    inkSpot.style.left = `${Math.random() * 100}%`;
    inkSpot.style.top = `${Math.random() * 100}%`;
    secretContent.appendChild(inkSpot);

    // 移除墨水点
    setTimeout(() => {
        inkSpot.remove();
    }, 4000);
}

// 加载动画：钢笔写字效果（移除写字音效）
function typeWrite(text, element, speed = 150) {
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            // 加载完成，显示内容
            setTimeout(() => {
                loader.style.opacity = 0;
                setTimeout(() => {
                    loader.style.display = 'none';
                    content.style.opacity = 1;
                    content.style.transform = 'translateY(0)';
                    // 启动花瓣生成（移除花瓣音效）
                    createPetals();
                    // 随机生成墨水点
                    setInterval(createInkSpot, 8000);
                }, 1000);
            }, 800);
        }
    }, speed);
}

// 随机选择冷笑话
function getRandomJoke() {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    jokeContent.innerHTML = jokes[randomIndex];
}

// 事件绑定
// 鼠标移动生成钢笔轨迹
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.7) {
        createPenTrail(e.clientX, e.clientY);
    }
});

// 点击任意位置触发烟花
document.addEventListener('click', (e) => {
    // 排除弹窗区域
    if (!jokeModal.classList.contains('active')) {
        createFirework(e.clientX, e.clientY);
    }
});

// 钢笔点击触发冷笑话（移除笑话音效）
jokePen.addEventListener('click', () => {
    getRandomJoke();
    jokeModal.classList.add('active');
    // 同时触发烟花
    createFirework(jokePen.getBoundingClientRect().left, jokePen.getBoundingClientRect().top);
});

// 关闭冷笑话弹窗
jokeClose.addEventListener('click', () => {
    jokeModal.classList.remove('active');
});

// 放大镜点击效果
magnifier.addEventListener('click', () => {
    createFirework(magnifier.getBoundingClientRect().left + 40, magnifier.getBoundingClientRect().top + 40);
    mottoText.style.color = '#ff69b4';
    mottoText.style.fontSize = '1.2rem';
    setTimeout(() => {
        mottoText.style.color = '#6d4c41';
        mottoText.style.fontSize = '1.05rem';
    }, 2000);
});

// 侦探徽章点击效果
detectiveBadge.addEventListener('click', () => {
    createFirework(detectiveBadge.getBoundingClientRect().left + 35, detectiveBadge.getBoundingClientRect().top + 35);
    // 随机改变页面主题色
    const colors = ['#ffc1e9', '#87ceeb', '#ffd700', '#ff69b4', '#8b5a2b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = `rgba(${hexToRgb(randomColor).r}, ${hexToRgb(randomColor).g}, ${hexToRgb(randomColor).b}, 0.05)`;
    setTimeout(() => {
        document.body.style.backgroundColor = '#f8f5f2';
    }, 3000);
});

// 高亮文字点击效果
highlightTexts.forEach(text => {
    text.addEventListener('click', () => {
        createFirework(text.getBoundingClientRect().left + text.offsetWidth / 2, text.getBoundingClientRect().top);
        text.style.transform = 'scale(1.1)';
        setTimeout(() => {
            text.style.transform = 'scale(1)';
        }, 500);
    });
});

// 十六进制转RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    typeWrite('Yao Meko', writeText, 200);
});