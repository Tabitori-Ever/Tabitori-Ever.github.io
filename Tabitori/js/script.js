// 加载页逻辑
window.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    
    // 设置加载文本
    if (loadingText) {
        loadingText.textContent = '欢迎你的旅程';
    }
    
    // 检查所有资源是否加载完成
    function checkAllResourcesLoaded() {
        // 检查图片加载
        const images = document.querySelectorAll('img');
        let allImagesLoaded = true;
        
        images.forEach(img => {
            if (!img.complete) {
                allImagesLoaded = false;
            }
        });
        
        return allImagesLoaded && document.readyState === 'complete';
    }
    
    // 监听window.load事件，确保所有资源都加载完成
    window.addEventListener('load', function() {
        // 给一个小延迟让用户看到加载效果
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 800);
            }
        }, 1000);
    });
    
    // 导航栏滚动效果
    const header = document.querySelector('.site-header');
    
    // 确保每次进入首页都保持在最初简介区域
    window.addEventListener('load', function() {
        // 滚动到页面顶部，确保显示简介区域
        window.scrollTo({ top: 0, behavior: 'auto' });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
// 只有在首页才执行滚动切换功能
    if (document.body.classList.contains('index-page')) {
        // 保留滚动动画，但禁用滚动惯性
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        // 下滑指引点击事件
        const scrollIndicators = document.querySelectorAll('.scroll-indicator');
        scrollIndicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // 检测滚动事件，实现滚动切换
        let currentSectionIndex = 0;
        const sections = document.querySelectorAll('section');
        const footer = document.querySelector('footer');
        const totalSections = sections.length;
        let isScrolling = false;
        const SCROLL_DELAY = 800; // 设置为0.8秒只响应一次滚动
        
        // 核心防抖函数
        function setIsScrollingTrue() {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, SCROLL_DELAY);
        }
        
        // 鼠标滚轮事件 - 重写为更简单可靠的版本
        window.addEventListener('wheel', function(e) {
            // 如果正在滚动中，直接返回
            if (isScrolling) {
                e.preventDefault();
                return;
            }
            
            e.preventDefault(); // 阻止默认滚动行为
            
            // 设置防抖标志
            setIsScrollingTrue();
            
            // 确定滚动方向并移动到对应section
            if (e.deltaY > 0) {
                // 向下滚动
                if (currentSectionIndex < totalSections - 1) {
                    currentSectionIndex++;
                } else if (currentSectionIndex === totalSections - 1 && footer) {
                    // 如果在最后一个section(联系section)，则滚动到footer
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    return;
                } else {
                    return;
                }
            } else if (e.deltaY < 0) {
                // 向上滚动
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                } else {
                    return;
                }
            } else {
                // 没有滚动，不做任何事情
                return;
            }
            
            // 滚动到目标位置
            window.scrollTo({
                top: sections[currentSectionIndex].offsetTop,
                behavior: 'smooth'
            });
        }, { passive: false });
        
        // 键盘箭头键事件
        window.addEventListener('keydown', function(e) {
            if (isScrolling) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                if (currentSectionIndex < totalSections - 1) {
                    currentSectionIndex++;
                    window.scrollTo({
                        top: sections[currentSectionIndex].offsetTop,
                        behavior: 'smooth'
                    });
                    setIsScrollingTrue();
                } else if (currentSectionIndex === totalSections - 1 && footer) {
                    // 如果在最后一个section(联系section)，则滚动到footer
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    setIsScrollingTrue();
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                    window.scrollTo({
                        top: sections[currentSectionIndex].offsetTop,
                        behavior: 'smooth'
                    });
                    setIsScrollingTrue();
                }
            }
        });
        
        // 滚动位置监听 - 只用于更新currentSectionIndex，不触发滚动
        window.addEventListener('scroll', function() {
            // 只有当不在滚动状态时才更新索引
            if (isScrolling) return;
            
            const scrollPosition = window.pageYOffset + window.innerHeight / 2;
            const bodyHeight = document.body.scrollHeight;
            
            // 检查是否滚动到底部附近
            if (window.innerHeight + window.pageYOffset >= bodyHeight - 100) {
                // 保持在最后一个section的索引
                currentSectionIndex = totalSections - 1;
                return;
            }
            
            // 检查当前在哪个section
            for (let i = 0; i < totalSections; i++) {
                const section = sections[i];
                if (scrollPosition >= section.offsetTop && 
                    scrollPosition < section.offsetTop + section.offsetHeight) {
                    currentSectionIndex = i;
                    break;
                }
            }
        });
    } else {
        // 在子页面中，应用平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // 减去导航栏高度
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 为作品区域图片添加背景图
    const workImages = document.querySelectorAll('.work-img');
    const imageUrls = [
        'https://picsum.photos/id/26/800/1000',
        'https://picsum.photos/id/96/800/1000',
        'https://picsum.photos/id/106/800/1000',
        'https://picsum.photos/id/136/800/1000',
        'https://picsum.photos/id/237/800/1000',
        'https://picsum.photos/id/239/800/1000'
    ];
    
    if (workImages.length > 0) {
        workImages.forEach((img, index) => {
            img.style.backgroundImage = `url(${imageUrls[index % imageUrls.length]})`;
            img.style.backgroundSize = 'cover';
            img.style.backgroundPosition = 'center';
        });
        
        // 窗口调整大小时重新调整图片
        window.addEventListener('resize', function() {
            workImages.forEach((img) => {
                img.style.backgroundSize = 'cover';
                img.style.backgroundPosition = 'center';
            });
        });
    }
    
    // 动画触发函数
    function triggerIntroAnimation() {
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            // 添加背景动画
            introSection.style.animation = 'backgroundReveal 1.2s ease forwards';
            
            // 延迟添加组件动画类，确保背景动画先执行
            setTimeout(() => {
                introSection.classList.add('animate');
            }, 300);
        }
    }
    
    // 页面加载完成后初始化
    function init() {
        // 触发一次滚动事件以确保导航栏状态正确
        window.dispatchEvent(new Event('scroll'));
        
        // 触发简介区域动画
        setTimeout(triggerIntroAnimation, 500);
    }
    
    // 初始化页面
    init();
    
    // 结局分支选择器交互逻辑
    const branchToggle = document.querySelector('.branch-toggle');
    if (branchToggle) {
        const branchOptions = document.querySelector('.branch-options');
        
        branchToggle.addEventListener('click', function() {
            branchOptions.classList.toggle('show');
            // 切换箭头方向
            const text = branchToggle.textContent;
            if (text.includes('▼')) {
                branchToggle.textContent = text.replace('▼', '▲');
            } else {
                branchToggle.textContent = text.replace('▲', '▼');
            }
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function(event) {
            if (!branchToggle.contains(event.target) && !branchOptions.contains(event.target)) {
                branchOptions.classList.remove('show');
                branchToggle.textContent = branchToggle.textContent.replace('▲', '▼');
            }
        });
    }
});