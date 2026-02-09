document.addEventListener('DOMContentLoaded', () => {
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

    let isTitleShown = false;
    let isCluesShown = false;
    let isAllContentShown = false;

    setTimeout(() => {
        loader.style.opacity = 0;
        setTimeout(() => {
            loader.style.display = 'none';
            evidenceContainer.classList.add('visible');
            showTitle();
        }, 800);
    }, 1500);

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

    document.body.addEventListener('click', () => {
        if (isTitleShown && !isCluesShown) {
            isCluesShown = true;
            clueList.classList.add('visible');
            showClues();

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

    const showClues = () => {
        clueItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');

                setTimeout(() => {
                    evidenceContainer.style.height = 'auto';
                }, 10);

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

    clueItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!item.classList.contains('visible')) return;

            const annotationContent = item.querySelector('.annotation-content').textContent;
            annotationBody.textContent = annotationContent;

            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            const isLeft = Math.random() > 0.5;

            const randomTop = 20 + Math.random() * 60; 
            const topPx = (windowHeight * randomTop) / 100; 

            annotationModal.classList.remove('left', 'right', 'active');

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

            setTimeout(() => {
                annotationModal.classList.add('active');
            }, 50);
        });
    });

    function closeModal() {
        annotationModal.classList.remove('active');
        setTimeout(() => {
            annotationModal.classList.remove('left', 'right');
            annotationModal.style.left = '';
            annotationModal.style.right = '';
            annotationModal.style.top = '';
        }, 600);
    }

    document.addEventListener('click', (e) => {
        if (annotationModal.classList.contains('active') &&
            !annotationModal.contains(e.target)) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && annotationModal.classList.contains('active')) {
            closeModal();
        }
    });

});
