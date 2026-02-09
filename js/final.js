const bgParticles = document.getElementById('bgParticles');
const buttonsContainer = document.getElementById('buttonsContainer');
const easterEggModal = document.getElementById('easterEggModal');
const creditsContainer = document.querySelector('.credits-container');
const finalText = document.getElementById('finalText');

// 背景粒子
function createParticles() {
    const count = 150;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 8 + 1;
        const isCircle = Math.random() > 0.3; 
        particle.style.width = `${size}px`;
        particle.style.height = isCircle ? `${size}px` : `${size * 0.6}px`;
        particle.style.borderRadius = isCircle ? '50%' : '3px';

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 40 + 30;
        const delay = Math.random() * 20;

        const directionX = Math.random() > 0.5 ? 1 : -1;
        const directionY = Math.random() > 0.5 ? 1 : -1;

        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particle.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';

        const hue = 230 + Math.random() * 20;
        const lightness = 70 + Math.random() * 10;
        particle.style.background = `linear-gradient(135deg, hsla(${hue}, 80%, ${lightness}%, 0.5), hsla(${hue + 10}, 80%, ${lightness - 5}%, 0.5))`;

        bgParticles.appendChild(particle);
    }
}

function showAllFinalElements() {
    setTimeout(() => {
        finalText.classList.add('show');
    }, 300);

    setTimeout(() => {
        buttonsContainer.classList.add('show');
    }, 800);

    setTimeout(() => {
        easterEggModal.classList.add('show');
    }, 1300);
}

function setupPrecisionDetection() {
    function checkScrollState() {
        const creditsRect = creditsContainer.getBoundingClientRect();
        const isPrevTextFullyOut = creditsRect.bottom < 0;

        if (isPrevTextFullyOut) {
            creditsContainer.style.animation = 'none';
            showAllFinalElements();
        } else {
            requestAnimationFrame(checkScrollState);
        }
    }

    requestAnimationFrame(checkScrollState);

    creditsContainer.addEventListener('animationend', (e) => {
        if (e.animationName === 'scrollPrevText') {
            showAllFinalElements();
        }
    });

    setTimeout(() => {
        showAllFinalElements();
    }, 82000);
}

// 鼠标互动效果
function addMouseInteraction() {
    const body = document.body;
    body.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        particles.forEach(particle => {
            const left = parseFloat(particle.style.left);
            const top = parseFloat(particle.style.top);

            const distance = Math.sqrt(Math.pow(left - mouseX * 100, 2) + Math.pow(top - mouseY * 100, 2));
            if (distance < 20) {
                const attraction = 20 - distance;
                const dirX = (mouseX * 100 - left) / distance;
                const dirY = (mouseY * 100 - top) / distance;

                particle.style.transform = `translate(${dirX * attraction * 0.3}px, ${dirY * attraction * 0.3}px)`;
                setTimeout(() => {
                    particle.style.transform = '';
                }, 300);
            }
        });
    });
}

// 按钮点击
document.getElementById('backToStart').addEventListener('click', () => {
    const btn = document.getElementById('backToStart');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
        window.open('../cloud.html', '_blank');
    }, 200);
});

document.getElementById('characterBtn').addEventListener('click', () => {
    const btn = document.getElementById('characterBtn');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
        window.open('../character.html', '_blank');
    }, 200);
});

window.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupPrecisionDetection();
    addMouseInteraction(); 

    const 彩蛋Items = document.querySelectorAll('.modal-content li');
    彩蛋Items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });

});
