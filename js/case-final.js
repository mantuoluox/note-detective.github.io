const body = document.getElementById('body');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const digitalLoader = document.querySelector('.digital-loader');
const penLoader = document.querySelector('.pen-loader');
const paperContainer = document.getElementById('paperContainer');
const cloudBtn = document.getElementById('cloudBtn');

const paragraphs = [
    document.getElementById('p1'),
    document.getElementById('p2'),
    document.getElementById('p3'),
    document.getElementById('p4')
];

// 逐字显示函数
function typeWriter(text, element, speed = 30, callback) {
    let i = 0;
    element.textContent = '';
    element.classList.add('visible');
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

    paragraphs.forEach(p => {
        p.textContent = '';
    });

    function typeNextPara() {
        if (currentParaIndex < paragraphs.length) {
            const para = paragraphs[currentParaIndex];
            const text = originalTexts[currentParaIndex];

            typeWriter(text, para, 80, () => {
                currentParaIndex++;
                typeNextPara(); 
            });
        }
    }

    typeNextPara();
}

// 整体风格过渡
function transitionToHandwrittenStyle() {
    setTimeout(() => {
        loaderText.textContent = '正在整理报告...';
        loaderText.classList.remove('digital');
        loaderText.classList.add('handwritten');
    }, 800);

    setTimeout(() => {
        digitalLoader.style.opacity = 0;
        setTimeout(() => {
            penLoader.style.opacity = 1;
        }, 500);
    }, 1200);

    setTimeout(() => {
        body.classList.add('handwritten-style');
        loader.classList.add('handwritten-style');
    }, 1500);

    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            paperContainer.classList.add('show');
            startTyping();
        }, 1000);
    }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    transitionToHandwrittenStyle();
});

cloudBtn.addEventListener('click', () => {
    window.location.href = 'truth-end.html';

});


