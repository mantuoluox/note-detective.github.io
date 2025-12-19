// 人物页面路径映射
const characterPages = [
    'characters/yao.html',
    'characters/hayase.html',
    'characters/sakurai.html',
    'characters/toudou.html',
    'characters/yamamoto.html',
    'characters/atagi.html'
];

// 初始化电子粒子
function createParticles() {
    const container = document.getElementById('particle-container');
    const count = 30;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');

        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;

        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size * 3}px`;

        container.appendChild(particle);
    }
}

// 清除访问记录函数 - 新增
// function clearVisitedData() {
//     // 清除localStorage中的访问记录
//     localStorage.removeItem('visitedCharacters');
//     // 隐藏制作名单文件夹
//     document.getElementById('credits-folder').style.display = 'none';
//     // 移除所有文件夹的visited类
//     document.querySelectorAll('.folder').forEach(folder => {
//         folder.classList.remove('visited');
//     });
//     // 可选：刷新页面（也可以不刷新，上面的操作已生效）
//     // window.location.reload();
// }

// 初始化页面
window.onload = function () {
    createParticles();

    const visitedPages = JSON.parse(localStorage.getItem('visitedCharacters') || '[]');

    visitedPages.forEach(page => {
        const folderId = `folder-${getFolderIdByPage(page)}`;
        const folder = document.getElementById(folderId);
        if (folder) folder.classList.add('visited');
    });

    checkAllVisited();
};

// 辅助函数：根据页面路径获取文件夹ID
function getFolderIdByPage(page) {
    switch (page) {
        case 'characters/yao.html': return 'yaomeko';
        case 'characters/hayase.html': return 'hayase';
        case 'characters/sakurai.html': return 'sakurai';
        case 'characters/toudou.html': return 'toudou';
        case 'characters/yamamoto.html': return 'yamamoto';
        case 'characters/atagi.html': return 'atagi';
        default: return '';
    }
}

// 打开文件夹并记录访问
function openFolder(pageUrl) {
    const visitedPages = JSON.parse(localStorage.getItem('visitedCharacters') || '[]');
    if (!visitedPages.includes(pageUrl)) {
        visitedPages.push(pageUrl);
        localStorage.setItem('visitedCharacters', JSON.stringify(visitedPages));
    }
    window.location.href = pageUrl;
}

// 检查是否所有人物都已访问
function checkAllVisited() {
    const visitedPages = JSON.parse(localStorage.getItem('visitedCharacters') || '[]');
    const allVisited = characterPages.every(page => visitedPages.includes(page));

    if (allVisited) {
        document.getElementById('credits-folder').style.display = 'flex';
    }
}