document.addEventListener('DOMContentLoaded', () => {
    // 元素获取
    const loader = document.getElementById('loader');
    const evidenceContainer = document.getElementById('evidenceContainer');
    const mainTitle = document.getElementById('mainTitle');
    const subTitle = document.getElementById('subTitle');
    const clueList = document.getElementById('clueList');
    const clueItems = document.querySelectorAll('.clue-item');
    const pageFooter = document.getElementById('pageFooter');
    const backgroundAudio = document.getElementById('backgroundAudio');
    const annotationModal = document.getElementById('annotationModal');
    const annotationBody = document.getElementById('annotationBody');

    // 状态标记
    let isTitleShown = false;
    let isCluesShown = false;
    let isAllContentShown = false;

    // 1. 加载动画控制
    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            evidenceContainer.classList.add('visible');
            showTitle();
        }, 800);
    }, 1500);

    // 2. 显示标题
    function showTitle() {
        setTimeout(() => {
            typeWrite(mainTitle, '线索整理', 80, () => {
                setTimeout(() => {
                    typeWrite(subTitle, '已收集的关键信息汇总', 60, () => {
                        isTitleShown = true;
                    });
                }, 800);
            });
        }, 500);
    }

    // 3. 点击页面后显示线索列表
    document.body.addEventListener('click', () => {
        if (isTitleShown && !isCluesShown) {
            isCluesShown = true;
            clueList.classList.add('visible');
            showClues();

            // 播放背景音
            backgroundAudio.volume = 0.05;
            backgroundAudio.play().catch(e => {
                console.log('背景音播放失败，点击页面后重试：', e);
                document.body.addEventListener('click', () => {
                    backgroundAudio.volume = 0.2;
                    backgroundAudio.play();
                }, { once: true });
            });
        }
    });

    // 4. 逐字显示文本函数
    const typeWrite = (element, text, speed = 50, callback) => {
        let index = 0;
        element.textContent = '';
        element.style.opacity = 1;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, speed);
    };

    // 5. 显示线索列表 - 优化为随线索展开的动画
    const showClues = () => {
        clueItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');

                // 触发容器高度重绘，产生自然展开效果
                setTimeout(() => {
                    evidenceContainer.style.height = 'auto';
                }, 10);

                // 最后一个线索显示后，显示页脚并停止背景音乐
                if (index === clueItems.length - 1) {
                    setTimeout(() => {
                        pageFooter.classList.add('visible');
                        isAllContentShown = true;
                        backgroundAudio.pause();
                    }, 800);
                }
            }, 500 + (index * 800));
        });
    };

    // 6. 线索点击事件 - 弹窗完全随机位置 + 滑入动画
    clueItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.classList.contains('visible')) return;

            // 获取批注内容
            const annotationContent = item.querySelector('.annotation-content').textContent;
            annotationBody.textContent = annotationContent;

            // 1. 完全随机位置计算
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // 随机水平方向（左/右）
            const isLeft = Math.random() > 0.5;

            // 随机垂直位置（20% ~ 80% 区间，避免弹窗超出可视区）
            const randomTop = 20 + Math.random() * 60; // 20% ~ 80% 高度
            const topPx = (windowHeight * randomTop) / 100; // 转为像素值

            // 2. 重置弹窗状态
            annotationModal.classList.remove('left', 'right', 'active');

            // 3. 设置随机垂直位置 + 初始水平位置（屏幕外）
            annotationModal.style.top = `${topPx}px`;
            if (isLeft) {
                annotationModal.classList.add('left');
                annotationModal.style.left = '-100%';
                annotationModal.style.right = 'auto';
            } else {
                annotationModal.classList.add('right');
                annotationModal.style.right = '-100%';
                annotationModal.style.left = 'auto';
            }

            // 4. 触发重绘后添加激活状态（滑入动画）
            setTimeout(() => {
                annotationModal.classList.add('active');
            }, 50);
        });
    });

    // 7. 关闭对话框
    function closeModal() {
        // 关闭时滑出动画
        annotationModal.classList.remove('active');
        // 延迟重置位置，保证滑出动画完成
        setTimeout(() => {
            annotationModal.classList.remove('left', 'right');
            annotationModal.style.left = '';
            annotationModal.style.right = '';
            annotationModal.style.top = '';
        }, 600);
    }

    // 点击对话框外部关闭
    document.addEventListener('click', (e) => {
        if (annotationModal.classList.contains('active') &&
            !annotationModal.contains(e.target)) {
            closeModal();
        }
    });

    // 按ESC键关闭对话框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && annotationModal.classList.contains('active')) {
            closeModal();
        }
    });
});