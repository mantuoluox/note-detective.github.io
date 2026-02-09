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
        tag: '记录笔记'
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

const allKeys = noteData.map(note => note.key.toLowerCase());

// 判断
function isEasterEgg(note) {
    if (Array.isArray(note.tag)) {
        return note.tag.includes('惊喜彩蛋');
    }
    return note.tag === '惊喜彩蛋';
}

function isRecordNote(note) {
    if (Array.isArray(note.tag)) {
        return note.tag.includes('记录笔记');
    }
    return note.tag === '记录笔记';
}

function findPrevRecordNote(currentIndex) {
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (isRecordNote(sequentialNotes[i])) {
            return sequentialNotes[i];
        }
    }
    return null;
}

const sequentialNotes = noteData.filter(note => !isEasterEgg(note));

// 检查
function isNoteUnlocked(note) {
    if (Array.isArray(note.url)) {
        return note.url.every(url => unlockedPages.includes(url));
    }
    return unlockedPages.includes(note.url);
}

document.addEventListener('DOMContentLoaded', function () {
    createGlobalDots();

    const cloudSearch = document.getElementById('cloudSearch');
    const notesList = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyState');
    const unlockAudio = document.getElementById('unlockAudio');
    const errorToast = document.getElementById('errorToast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const toastBtn = document.querySelector('.toast-btn');
    unlockAudio.volume = 0.8;

    function closeToast() {
        errorToast.classList.remove('show');
    }

    toastClose.addEventListener('click', closeToast);
    toastBtn.addEventListener('click', closeToast);

    const unlockedPages = JSON.parse(localStorage.getItem('unlockedPages')) || [];
    const clickedPages = JSON.parse(localStorage.getItem('clickedPages')) || [];
    const usedKeys = JSON.parse(localStorage.getItem('usedKeys')) || [];

    renderUnlockedNotes();

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
                let allUnlocked = false;
                if (Array.isArray(matchedNote.url)) {
                    allUnlocked = matchedNote.url.every(url => unlockedPages.includes(url));
                } else {
                    allUnlocked = unlockedPages.includes(matchedNote.url);
                }

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

                if (!isEasterEgg(matchedNote)) {
                    const currentIndex = sequentialNotes.findIndex(note => note.key === matchedNote.key);
                    if (currentIndex > 0) {
                        let needCheckNote = null;

                        if (isRecordNote(matchedNote)) {
                            needCheckNote = findPrevRecordNote(currentIndex);
                        } else {
                            needCheckNote = sequentialNotes[currentIndex - 1];
                        }

                        if (needCheckNote) {
                            let isPrevUnlocked = false;
                            if (Array.isArray(needCheckNote.url)) {
                                isPrevUnlocked = needCheckNote.url.some(url => unlockedPages.includes(url));
                            } else {
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
                    }
                }
                // 解锁逻辑
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

    // 显示提示框
    function showToast(message) {
        toastMessage.innerHTML = `<span class="toast-icon">⚠️</span>${message}`;
        errorToast.classList.add('show');

        setTimeout(() => {
            errorToast.classList.remove('show');
        }, 5000);
    }

    function renderUnlockedNotes() {
        if (unlockedPages.length > 0) {
            emptyState.style.display = 'none';
        } else {
            emptyState.style.display = 'flex';
            return;
        }

        notesList.innerHTML = '';

        const allUnlockedUrls = new Set(unlockedPages);
        const renderedUrls = new Set();

        noteData.forEach(note => {
            if (Array.isArray(note.url)) {
                note.url.forEach((url, index) => {
                    if (allUnlockedUrls.has(url) && !renderedUrls.has(url)) {
                        createNoteItem(url, {
                            title: note.title[index],
                            desc: note.desc[index],
                            tag: note.tag[index]
                        });
                        renderedUrls.add(url); 
                    }
                });
            } else {
                const url = note.url;
                if (allUnlockedUrls.has(url) && !renderedUrls.has(url)) {
                    createNoteItem(url, {
                        title: note.title,
                        desc: note.desc,
                        tag: note.tag
                    });
                    renderedUrls.add(url); 
                }
            }
        });
    }

    // 创建笔记项
    function createNoteItem(pageUrl, noteInfo) {
        const li = document.createElement('li');
        li.className = `note-item ${clickedPages.includes(pageUrl) ? 'viewed' : ''}`;
        li.setAttribute('data-url', pageUrl);

        li.innerHTML = `
        <h3 class="note-title">${noteInfo.title}</h3>
        <p class="note-desc">${noteInfo.desc}</p>
        <span class="unlock-tag">${noteInfo.tag}</span>
    `;

        // 点击事件
        li.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (!clickedPages.includes(url)) {
                    clickedPages.push(url);
                    localStorage.setItem('clickedPages', JSON.stringify(clickedPages));
                }
                window.open(url, '_blank');
            }, 200);
        });

        notesList.appendChild(li);
    }

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
// 调试按钮
document.getElementById('clearSyncBtn').addEventListener('click', function () {
    if (confirm('确定清除所有同步记录？清除后进度将重置！')) {
        localStorage.removeItem('unlockedPages');
        localStorage.removeItem('clickedPages');
        localStorage.removeItem('initialInput');
        localStorage.removeItem('viewedCharacters');
        localStorage.removeItem('usedKeys'); 
        location.reload(); 
    }

});


