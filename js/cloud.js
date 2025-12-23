// ========== 全局粒子生成（与首页一致） ==========
function createGlobalDots() {
    const container = document.getElementById('globalDotsContainer');
    const dotCount = 80;
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'bg-dot';
        dot.style.left = `${Math.random() * 100}vw`;
        dot.style.top = `${Math.random() * 100}vh`;
        dot.style.animationDelay = `${Math.random() * 10}s`;
        dot.style.animationDuration = `${10 + Math.random() * 15}s`;
        dot.style.width = `${2 + Math.random() * 3}px`;
        dot.style.height = `${2 + Math.random() * 3}px`;
        const opacity = 0.2 + Math.random() * 0.4;
        dot.style.background = `rgba(0, 255, 255, ${opacity})`;
        container.appendChild(dot);
    }
}

// ========== 笔记数据（与文档解锁规则对应） ==========
const noteData = [
    {
        key: '0303',
        url: 'notes/start.html',
        title: '委托开始',
        desc: '0303',
        tag: '记录笔记'
    },
    {
        key: 'lake250228',
        url: 'notes/material.html',
        title: '案件资料',
        desc: 'lake250228',
        tag: '记录笔记'
    },
    {
        key: 'tape01',
        url: 'notes/file.html',
        title: '录音文件',
        desc: 'tape01',
        tag: '相关证据'
    },
    {
        key: 'px470',
        url: 'notes/recorder.html',
        title: '录音笔',
        desc: 'px470',
        tag: '记录笔记'
    },
    {
        key: '2308',
        url: 'notes/scene.html',
        title: '案发现场',
        desc: '2308',
        tag: '记录笔记'
    },
    {
        key: 'annotation',
        url: ['notes/midfield.html', 'notes/clue.html'],
        title: ['中场休息', '线索？'],
        desc: ['annotation', 'annotation'],
        tag: ['相关证据', '记录笔记']
    },
    {
        key: 'sakura',
        url: ['notes/sakurai.html', 'notes/meet.html'],
        title: ['樱井', '桜屋偶遇'],
        desc: ['sakura', 'sakura'],
        tag: ['记录笔记', '记录笔记']
    },
    {
        key: 'tape10',
        url: 'notes/newfile.html',
        title: '录音文件·新',
        desc: 'tape10',
        tag: '相关证据'
    },
    {
        key: 'yao',
        url: 'notes/challenge.html',
        title: '挑战书',
        desc: 'yao',
        tag: '记录笔记'
    },
    {
        key: '0228',
        url: 'notes/win.html',
        title: '胜利',
        desc: '0228',
        tag: '结局'
    },
    {
        key: '0229',
        url: 'notes/keyword-is-real.html',
        title: 'AES',
        desc: '0229',
        tag: '记录笔记'
    },
    {
        key: 'real',
        url: 'notes/last.html',
        title: '最后的谜题',
        desc: 'real',
        tag: '记录笔记'
    },
    {
        key: 'ao',
        url: 'notes/suicide.html',
        title: '自杀',
        desc: 'ao',
        tag: '结局'
    },
    {
        key: 'hayaseyao0229',
        url: 'notes/truth.html',
        title: '真相……',
        desc: 'hayaseyao0229',
        tag: '结局'
    },
    // 彩蛋笔记
    {
        key: 'help',
        url: 'notes/help.html',
        title: '攻略',
        desc: 'help',
        tag: '惊喜彩蛋'
    },
    {
        key: 'yaomeko',
        url: 'notes/yaomeko.html',
        title: '八尾美子',
        desc: 'yaomeko',
        tag: '惊喜彩蛋'
    },
    {
        key: 'tape02',
        url: 'notes/file2.html',
        title: '录音文件2',
        desc: 'tape02',
        tag: '惊喜彩蛋'
    }
];

// 获取所有解锁关键词
const allKeys = noteData.map(note => note.key.toLowerCase());

// 辅助函数：判断是否为惊喜彩蛋笔记
function isEasterEgg(note) {
    if (Array.isArray(note.tag)) {
        return note.tag.includes('惊喜彩蛋');
    }
    return note.tag === '惊喜彩蛋';
}

// ========== 新增辅助函数：判断是否为记录笔记 ==========
function isRecordNote(note) {
    if (Array.isArray(note.tag)) {
        return note.tag.includes('记录笔记');
    }
    return note.tag === '记录笔记';
}

// ========== 新增辅助函数：查找上一个记录笔记 ==========
function findPrevRecordNote(currentIndex) {
    // 从当前索引往前查找最近的记录笔记
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (isRecordNote(sequentialNotes[i])) {
            return sequentialNotes[i];
        }
    }
    return null; // 没有找到前序记录笔记
}

// 筛选出需要按顺序解锁的非彩蛋笔记（保持原始顺序）
const sequentialNotes = noteData.filter(note => !isEasterEgg(note));

// 辅助函数：检查笔记是否已完全解锁
function isNoteUnlocked(note) {
    if (Array.isArray(note.url)) {
        return note.url.every(url => unlockedPages.includes(url));
    }
    return unlockedPages.includes(note.url);
}

// ========== 核心逻辑 ==========
document.addEventListener('DOMContentLoaded', function () {
    // 1. 生成全局粒子
    createGlobalDots();

    // 元素获取
    const cloudSearch = document.getElementById('cloudSearch');
    const notesList = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyState');
    const unlockAudio = document.getElementById('unlockAudio');
    const errorToast = document.getElementById('errorToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const toastBtn = document.querySelector('.toast-btn');
    unlockAudio.volume = 0.8;

    // 关闭弹窗事件
    function closeToast() {
        errorToast.classList.remove('show');
    }

    toastClose.addEventListener('click', closeToast);
    toastBtn.addEventListener('click', closeToast);

    // 2. 从本地存储获取已解锁笔记和已点击笔记
    const unlockedPages = JSON.parse(localStorage.getItem('unlockedPages')) || [];
    const clickedPages = JSON.parse(localStorage.getItem('clickedPages')) || [];
    // 记录已使用的解锁词
    const usedKeys = JSON.parse(localStorage.getItem('usedKeys')) || [];

    // 3. 渲染已解锁笔记
    renderUnlockedNotes();

    // 4. 搜索解锁逻辑（修改部分）
    cloudSearch.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            const input = this.value.trim();

            // 未输入内容
            if (!input) {
                showToast('请输入内容');
                this.style.borderColor = '#ff3333';
                return;
            }

            // 验证是否为字母数字
            const alphanumeric = /^[a-zA-Z0-9]+$/.test(input);
            if (!alphanumeric) {
                showToast('仅支持字母和数字');
                this.style.borderColor = '#ff3333';
                return;
            }

            const inputLower = input.toLowerCase();
            const tempClosedKeys = ['hayaseyao', 'yamamotoharuka', 'sakuraireiji', 'atagiao', 'toudounanami', 'hayase'];
            const incompleteKeys = ['yh229', 'y0a2', 'sea'];
            const formatErrorKeys = ['10', 'tape0010', '0010', '0229hayaseyao','010','tape010'];


            if (tempClosedKeys.includes(inputLower)) {
                showToast('该文件暂不开放');
                this.style.borderColor = '#ff3333';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 800);
                return;
            }

            if (incompleteKeys.includes(inputLower)) {
                showToast('密码不完整');
                this.style.borderColor = '#ffcc00';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 800);
                return;
            }

            if (formatErrorKeys.includes(inputLower)) {
                showToast('格式错误');
                this.style.borderColor = '#ffcc00';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 800);
                return;
            }

            const matchedNote = noteData.find(item =>
                item.key.toLowerCase() === inputLower
            );
            if (matchedNote) {
                // 新增：检查该笔记对应的URL是否已全部解锁
                let allUnlocked = false;
                if (Array.isArray(matchedNote.url)) {
                    // 多URL情况：判断所有URL是否都已解锁
                    allUnlocked = matchedNote.url.every(url => unlockedPages.includes(url));
                } else {
                    // 单URL情况：判断该URL是否已解锁
                    allUnlocked = unlockedPages.includes(matchedNote.url);
                }

                // 若文件已解锁，直接提示
                if (allUnlocked) {
                    showToast('该文件已存在');
                    this.style.borderColor = '#ff3333';
                    setTimeout(() => {
                        this.style.borderColor = '';
                    }, 800);
                    return;
                }

                // 检查解锁词是否已使用
                if (usedKeys.includes(inputLower)) {
                    showToast('该解锁词已使用');
                    this.style.borderColor = '#ff3333';
                    setTimeout(() => {
                        this.style.borderColor = '';
                    }, 800);
                    return;
                }

                // 修改核心解锁逻辑中的前序笔记检查部分
                if (!isEasterEgg(matchedNote)) {
                    const currentIndex = sequentialNotes.findIndex(note => note.key === matchedNote.key);
                    // 不是第一个非彩蛋笔记时，检查前序内容
                    if (currentIndex > 0) {
                        let needCheckNote = null;

                        // 如果当前是记录笔记，查找上一个记录笔记作为检查对象
                        if (isRecordNote(matchedNote)) {
                            needCheckNote = findPrevRecordNote(currentIndex);
                        } else {
                            // 非记录笔记，仍检查前一项
                            needCheckNote = sequentialNotes[currentIndex - 1];
                        }

                        // 如果找到需要检查的笔记
                        if (needCheckNote) {
                            let isPrevUnlocked = false;
                            if (Array.isArray(needCheckNote.url)) {
                                // 多URL前序笔记：至少有一个URL解锁即可
                                isPrevUnlocked = needCheckNote.url.some(url => unlockedPages.includes(url));
                            } else {
                                // 单URL前序笔记：直接判断是否解锁
                                isPrevUnlocked = unlockedPages.includes(needCheckNote.url);
                            }

                            if (!isPrevUnlocked) {
                                showToast('请先解锁前序内容');
                                this.style.borderColor = '#ffcc00';
                                setTimeout(() => {
                                    this.style.borderColor = '';
                                }, 800);
                                return;
                            }
                        }
                        // 没有找到需要检查的笔记（如第一个记录笔记），直接通过检查
                    }
                }
                // 解锁逻辑（文件未解锁且验证通过时执行）
                unlockAudio.play().catch(err => console.error('解锁音效播放失败：', err));

                if (Array.isArray(matchedNote.url)) {
                    matchedNote.url.forEach((url, index) => {
                        if (!unlockedPages.includes(url)) {
                            unlockedPages.push(url);
                        }
                    });
                } else {
                    if (!unlockedPages.includes(matchedNote.url)) {
                        unlockedPages.push(matchedNote.url);
                    }
                }

                usedKeys.push(inputLower);
                localStorage.setItem('unlockedPages', JSON.stringify(unlockedPages));
                localStorage.setItem('usedKeys', JSON.stringify(usedKeys));
                renderUnlockedNotes();

                this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.8)';
                setTimeout(() => {
                    this.style.boxShadow = '';
                    this.style.borderColor = '';
                }, 800);
                this.value = '';
            } else {
                showToast('该文件不存在');
                this.style.borderColor = '#ff3333';
                setTimeout(() => {
                    this.style.borderColor = '';
                }, 800);
            }
        }
    });

    // 显示提示框函数
    function showToast(message) {
        toastMessage.innerHTML = `<span class="toast-icon">⚠️</span>${message}`;
        errorToast.classList.add('show');

        // 5秒后自动关闭
        setTimeout(() => {
            errorToast.classList.remove('show');
        }, 5000);
    }

    // 5. 渲染已解锁笔记函数 - 按原始顺序排列，且每个URL只渲染一次
    function renderUnlockedNotes() {
        // 隐藏空状态
        if (unlockedPages.length > 0) {
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'flex';
            return;
        }

        // 清空列表
        notesList.innerHTML = '';

        // 收集所有已解锁的笔记URL
        const allUnlockedUrls = new Set(unlockedPages);
        // 新增：记录已渲染的URL，避免重复
        const renderedUrls = new Set();

        // 按noteData原始顺序遍历并渲染已解锁的笔记（去重）
        noteData.forEach(note => {
            if (Array.isArray(note.url)) {
                note.url.forEach((url, index) => {
                    // 仅当URL已解锁且未渲染过时，才创建笔记项
                    if (allUnlockedUrls.has(url) && !renderedUrls.has(url)) {
                        createNoteItem(url, {
                            title: note.title[index],
                            desc: note.desc[index],
                            tag: note.tag[index]
                        });
                        renderedUrls.add(url); // 标记为已渲染
                    }
                });
            } else {
                const url = note.url;
                // 仅当URL已解锁且未渲染过时，才创建笔记项
                if (allUnlockedUrls.has(url) && !renderedUrls.has(url)) {
                    createNoteItem(url, {
                        title: note.title,
                        desc: note.desc,
                        tag: note.tag
                    });
                    renderedUrls.add(url); // 标记为已渲染
                }
            }
        });
    }

    // 创建笔记项的辅助函数
    function createNoteItem(pageUrl, noteInfo) {
        // 创建笔记项
        const li = document.createElement('li');
        // 使用viewed类替代unlocked类，不使用删除线
        li.className = `note-item ${clickedPages.includes(pageUrl) ? 'viewed' : ''}`;
        li.setAttribute('data-url', pageUrl);

        // 笔记项内容
        li.innerHTML = `
        <h3 class="note-title">${noteInfo.title}</h3>
        <p class="note-desc">${noteInfo.desc}</p>
        <span class="unlock-tag">${noteInfo.tag}</span>
    `;

        // 点击事件：新标签页打开页面并标记为已点击
        li.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                // 标记为已点击
                if (!clickedPages.includes(url)) {
                    clickedPages.push(url);
                    localStorage.setItem('clickedPages', JSON.stringify(clickedPages));
                }
                // 关键修改：新标签页打开页面
                window.open(url, '_blank');
                // 移除原有的 window.location.href = url;
            }, 200);
        });

        notesList.appendChild(li);
    }

    // 6. 根据URL查找笔记数据
    function findNoteByUrl(url) {
        for (const note of noteData) {
            if (note.url === url) {
                return {
                    title: note.title,
                    desc: note.desc,
                    tag: note.tag
                };
            } else if (Array.isArray(note.url)) {
                const index = note.url.findIndex(item => item === url);
                if (index !== -1) {
                    return {
                        title: note.title[index],
                        desc: note.desc[index],
                        tag: note.tag[index]
                    };
                }
            }
        }
        return null;
    }

    // 调试按钮动画效果
    const clearBtn = document.getElementById('clearSyncBtn');
    clearBtn.addEventListener('mouseenter', function () {
        this.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.7)';
        this.style.transform = 'scale(1.05)';
    });
    clearBtn.addEventListener('mouseleave', function () {
        this.style.boxShadow = 'none';
        this.style.transform = 'scale(1)';
    });
});
// 调试按钮：清除同步记录
document.getElementById('clearSyncBtn').addEventListener('click', function () {
    if (confirm('确定清除所有同步记录？清除后进度将重置！')) {
        localStorage.removeItem('unlockedPages');
        localStorage.removeItem('clickedPages');
        localStorage.removeItem('initialInput');
        localStorage.removeItem('viewedCharacters');
        localStorage.removeItem('usedKeys'); // 清除已使用的解锁词记录
        location.reload(); // 清除后自动刷新页面
    }

});
