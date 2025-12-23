// 攻略数据：核心保留 unlockKey（对应cloud存储的URL）
const guideData = [
    { file: "委托开始", unlockKey: "notes/start.html", content: "查看图片得知案件编号，在搜索框中输入：<br><span>lake250228</span>-解锁笔记“案件资料”" },
    { file: "案件资料", unlockKey: "notes/material.html", content: "根据笔记中提到的录音笔相关信息，在搜索框中输入：<br><span>px470</span>-解锁笔记“录音笔”<br><span>tape01</span>-解锁证物“录音文件”" },
    { file: "录音笔", unlockKey: "notes/recorder.html", content: "得知死亡时间，在搜索框中输入：<br><span>2308</span>-解锁笔记“案发现场”" },
    { file: "案发现场", unlockKey: "notes/scene.html", content: "通过笔记中的暗示，查看页面源代码，在搜索框中输入：<br><span>annotation</span>-解锁证物“中场休息”、笔记“线索？”" },
    { file: "线索？", unlockKey: "notes/clue.html", content: "连接邮件开头字母，在搜索框中输入：<br><span>sakura</span>-解锁笔记“樱井”、笔记“桜屋偶遇”" },
    { file: "桜屋偶遇", unlockKey: "notes/meet.html", content: "查看证物“录音文件”得知创建者，根据二进制暗示，在搜索框中输入：<br><span>yao</span>-解锁笔记“挑战书”<br><span>tape02</span>-解锁彩蛋“录音文件2”<br><span>tape10</span>-解锁证物“录音文件·新”" },
    { file: "挑战书", unlockKey: "notes/challenge.html", content: "选中页面空白段落查看隐藏文字，在搜索框中输入：<br><span>0228</span>-解锁笔记“胜利”<br><span>0229</span>-解锁笔记“AES”" },
    { file: "AES", unlockKey: "notes/keyword-is-real.html", content: "页面乱码可以用AES解码，结合特殊提示查看页面链接文件名，在搜索框中输入：<br><span>real</span>-解锁笔记“最后的谜题”" },
    { file: "最后的谜题", unlockKey: "notes/last.html", content: "查看图片名称及物品上的字符，重新排序后在搜索框中输入：<br><span>ao</span>-解锁笔记“自杀”<br><span>hayaseyao0229</span>-解锁笔记“真相……”" }
];

// 更新解锁进度条
function updateProgress() {
    const totalItems = guideData.length;
    const unlockedUrls = getUnlockedUrls();
    const unlockedCount = unlockedUrls.filter(url =>
        guideData.some(item => item.unlockKey === url)
    ).length;

    const progressPercent = (unlockedCount / totalItems) * 100;

    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressText').textContent = `已解锁: ${unlockedCount + 1}/${totalItems + 1}`;
}

// 核心修改：直接读取cloud存储的URL列表（无需转换）
function getUnlockedUrls() {
    let unlocked = localStorage.getItem('unlockedPages');
    if (!unlocked) return [];

    let unlockedUrls = [];
    try {
        unlockedUrls = JSON.parse(unlocked);
        // 过滤非URL数据（兜底）
        unlockedUrls = unlockedUrls.filter(url => url.includes('.html'));
    } catch (e) {
        console.error('解析URL列表失败：', e);
        unlockedUrls = [];
    }
    return unlockedUrls;
}

// 核心修改：根据URL匹配攻略项
function renderDynamicGuideItems() {
    const unlockedUrls = getUnlockedUrls(); // 读取URL列表
    const dynamicGuideItems = document.getElementById('dynamicGuideItems');
    dynamicGuideItems.innerHTML = '';

    // 遍历攻略数据，匹配URL
    guideData.forEach(guide => {
        if (unlockedUrls.includes(guide.unlockKey)) { // 关键：匹配unlockKey（URL）
            const guideItem = document.createElement('div');
            guideItem.className = 'guide-item dynamic-item';
            guideItem.innerHTML = `
                        <div class="guide-item-header" data-file="${guide.file}">
                            ${guide.file}
                        </div>
                        <div class="guide-item-content">
                            <div class="guide-content-text">${guide.content}</div>
                        </div>
                    `;
            dynamicGuideItems.appendChild(guideItem);
        }
    });
    bindAllGuideToggle(); // 重新绑定点击事件
    updateProgress(); // 更新进度条
}

// 绑定展开/收起事件
function bindAllGuideToggle() {
    document.querySelectorAll('.guide-item-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            document.querySelectorAll('.guide-item-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                    activeHeader.nextElementSibling.classList.remove('visible');
                }
            });
            header.classList.toggle('active');
            content.classList.toggle('visible');
        });
    });
}

// 手动刷新按钮
// document.getElementById('syncRefreshBtn').addEventListener('click', () => {
//     renderDynamicGuideItems();
//     alert('解锁进度已同步！');
// });

// 页面加载逻辑
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const guideContainer = document.getElementById('guideContainer');

    // 加载动画
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            guideContainer.classList.add('visible');
            renderDynamicGuideItems(); // 初始渲染
        }, 800);
    }, 1600);

    // 监听storage变化（URL更新时同步）
    window.addEventListener('storage', (e) => {
        if (e.key === 'unlockedPages') {
            setTimeout(() => renderDynamicGuideItems(), 100);
        }
    });

});
