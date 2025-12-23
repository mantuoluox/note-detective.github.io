// DOM元素
const body = document.getElementById('body');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const digitalLoader = document.querySelector('.digital-loader');
const penLoader = document.querySelector('.pen-loader');
const paperContainer = document.getElementById('paperContainer');
const cloudBtn = document.getElementById('cloudBtn');

// 所有段落
const paragraphs = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3'),
    document.getElementById('p4')
];

// 逐字显示函数 - 加快速度到120ms/字
function typeWriter(text, element, speed = 30, callback) {
    let i = 0;
    element.textContent = '';
    element.classList.add('visible'); // 显示段落
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

// 按顺序逐段逐字显示
function startTyping() {
    let currentParaIndex = 0;
    const originalTexts = paragraphs.map(p => p.textContent);

    // 先清空所有段落内容
    paragraphs.forEach(p => {
        p.textContent = '';
    });

    function typeNextPara() {
        if (currentParaIndex < paragraphs.length) {
            const para = paragraphs[currentParaIndex];
            const text = originalTexts[currentParaIndex];

            typeWriter(text, para, 80, () => {
                currentParaIndex++;
                typeNextPara(); // 继续下一段
            });
        }
    }

    typeNextPara();
}

// 整体风格过渡逻辑
function transitionToHandwrittenStyle() {
    // 第一步：切换加载文字内容和样式
    setTimeout(() => {
        loaderText.textContent = '正在整理报告...';
        loaderText.classList.remove('digital');
        loaderText.classList.add('handwritten');
    }, 800);

    // 第二步：隐藏电子加载动画，显示手写加载动画
    setTimeout(() => {
        digitalLoader.style.opacity = 0;
        setTimeout(() => {
            penLoader.style.opacity = 1;
        }, 500);
    }, 1200);

    // 第三步：切换整个页面的风格（背景、颜色等）
    setTimeout(() => {
        body.classList.add('handwritten-style');
        loader.classList.add('handwritten-style');
    }, 1500);

    // 第四步：隐藏加载容器，显示内容
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            // 显示纸张容器
            paperContainer.classList.add('show');
            // 开始逐字显示
            startTyping();
        }, 1000);
    }, 3000);
}

// 页面加载后启动风格过渡
window.addEventListener('DOMContentLoaded', () => {
    transitionToHandwrittenStyle();
});

// 按钮跳转至真结局页面
cloudBtn.addEventListener('click', () => {
    window.location.href = 'truth-end.html';

});

