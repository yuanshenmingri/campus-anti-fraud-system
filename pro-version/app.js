// 全局变量
let pieChart, barChart;
let dataFlowAnimation;
let importedData = null;
let updateInterval = null;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initLoginForm();
    initRoleTabs();
    initCharts();
    initWarningList();
    initDataFlow();
    initTimeUpdate();
    initHoverEffects();
    initDataImport();
    startRealtimeUpdate();
});

// 自定义鼠标光标 - 流畅跟随
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    
    // 使用requestAnimationFrame实现流畅的鼠标跟随
    function animate() {
        // 平滑插值，让鼠标移动更自然
        const ease = 0.15;
        mouseX += (targetX - mouseX) * ease;
        mouseY += (targetY - mouseY) * ease;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    // 监听鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX - 10; // 减去光标宽度的一半
        targetY = e.clientY - 10;
    });
    
    // 鼠标点击效果
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        setTimeout(() => cursor.classList.remove('clicking'), 150);
    });
    
    // 悬停效果
    document.querySelectorAll('.hover-effect, .hover-lift, .hover-glow, .btn, .role-tab, .module-icon, .metric-card, .stat-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
    
    animate();
}

// 登录表单验证
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('roleSelect');

    // 实时验证
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);
    roleSelect.addEventListener('change', validateRole);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isRoleValid = validateRole();

        if (isUsernameValid && isPasswordValid && isRoleValid) {
            // 模拟登录成功动画
            const btn = form.querySelector('.login-btn');
            btn.innerHTML = '<span class="loading-spinner"></span> 登录中...';
            btn.disabled = true;

            setTimeout(() => {
                showMainPage(usernameInput.value, roleSelect.value);
            }, 1500);
        }
    });

    function validateUsername() {
        const value = usernameInput.value.trim();
        const errorEl = document.getElementById('usernameError');
        
        if (!value) {
            showError(usernameInput, errorEl, '请输入用户名');
            return false;
        } else if (value.length < 3) {
            showError(usernameInput, errorEl, '用户名至少3个字符');
            return false;
        }
        
        clearError(usernameInput, errorEl);
        return true;
    }

    function validatePassword() {
        const value = passwordInput.value;
        const errorEl = document.getElementById('passwordError');
        
        if (!value) {
            showError(passwordInput, errorEl, '请输入密码');
            return false;
        } else if (value.length < 6) {
            showError(passwordInput, errorEl, '密码至少6位');
            return false;
        }
        
        clearError(passwordInput, errorEl);
        return true;
    }

    function validateRole() {
        const value = roleSelect.value;
        const errorEl = document.getElementById('roleError');
        
        if (!value) {
            showError(roleSelect, errorEl, '请选择角色');
            return false;
        }
        
        clearError(roleSelect, errorEl);
        return true;
    }

    function showError(input, errorEl, message) {
        input.classList.add('error');
        errorEl.textContent = message;
        setTimeout(() => input.classList.remove('error'), 500);
    }

    function clearError(input, errorEl) {
        input.classList.remove('error');
        errorEl.textContent = '';
    }
}

// 显示主页面
function showMainPage(username, role) {
    const loginPage = document.getElementById('loginPage');
    const mainPage = document.getElementById('mainPage');
    
    // 添加过渡动画
    loginPage.style.animation = 'fadeOut 0.5s ease forwards';
    
    setTimeout(() => {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        mainPage.style.animation = 'fadeIn 0.8s ease forwards';
        
        // 设置用户信息
        const roleNames = {
            admin: '管理员',
            teacher: '教师',
            student: '学生'
        };
        document.getElementById('currentUser').textContent = `${roleNames[role]} - ${username}`;
        
        // 更新角色标签状态
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.role === role) {
                tab.classList.add('active');
            }
        });
        
        // 初始化图表（确保容器可见后渲染）
        setTimeout(() => {
            renderPieChart();
            renderBarChart();
        }, 100);
    }, 500);
}

// 角色切换功能
function initRoleTabs() {
    const tabs = document.querySelectorAll('.role-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            // 添加当前active类
            tab.classList.add('active');
            
            // 角色切换动画效果
            const role = tab.dataset.role;
            switchRole(role);
            
            // 显示角色信息提示
            showNotification(`已切换到${tab.textContent}角色`, 'info');
        });
    });
}

function switchRole(role) {
    // 根据角色调整界面显示
    const mainContent = document.querySelector('.main-content');
    mainContent.style.transition = 'opacity 0.3s ease';
    mainContent.style.opacity = '0.7';
    
    setTimeout(() => {
        // 可以在这里根据角色加载不同的数据或视图
        refreshData();
        mainContent.style.opacity = '1';
    }, 300);
}

// 初始化图表
function initCharts() {
    // 延迟初始化，等待DOM完全渲染
}

function renderPieChart() {
    const chartDom = document.getElementById('pieChart');
    if (!chartDom || echarts.getInstanceByDom(chartDom)) return;
    
    pieChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(10, 22, 40, 0.9)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            textStyle: { color: '#f8fafc' },
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            bottom: '0',
            textStyle: { color: '#94a3b8', fontSize: 11 },
            itemWidth: 12,
            itemHeight: 12
        },
        series: [{
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#030712',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}\n{d}%',
                color: '#94a3b8',
                fontSize: 11
            },
            emphasis: {
                label: { show: true, fontSize: 14, fontWeight: 'bold' },
                itemStyle: {
                    shadowBlur: 20,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(99, 102, 241, 0.5)'
                }
            },
            data: [
                { 
                    value: 35, 
                    name: '电信诈骗', 
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#ef4444' },
                        { offset: 1, color: '#dc2626' }
                    ])}
                },
                { 
                    value: 25, 
                    name: '网络钓鱼', 
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#f59e0b' },
                        { offset: 1, color: '#d97706' }
                    ])}
                },
                { 
                    value: 20, 
                    name: '虚假兼职', 
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#06b6d4' },
                        { offset: 1, color: '#0891b2' }
                    ])}
                },
                { 
                    value: 12, 
                    name: '冒充客服', 
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#8b5cf6' },
                        { offset: 1, color: '#7c3aed' }
                    ])}
                },
                { 
                    value: 8, 
                    name: '其他类型', 
                    itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#10b981' },
                        { offset: 1, color: '#059669' }
                    ])}
                }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut'
        }]
    };

    pieChart.setOption(option);

    // 图表交互：点击事件
    pieChart.on('click', (params) => {
        showNotification(`查看${params.name}详细信息`, 'info');
    });

    // 窗口大小改变时重新渲染
    window.addEventListener('resize', () => {
        pieChart && pieChart.resize();
    });
}

function renderBarChart() {
    const chartDom = document.getElementById('barChart');
    if (!chartDom || echarts.getInstanceByDom(chartDom)) return;
    
    barChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(10, 22, 40, 0.9)',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            textStyle: { color: '#f8fafc' },
            axisPointer: {
                type: 'shadow',
                shadowStyle: { color: 'rgba(99, 102, 241, 0.1)' }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
            axisLabel: { color: '#94a3b8', fontSize: 11 }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.08)' } }
        },
        series: [{
            type: 'bar',
            barWidth: '50%',
            data: [
                { 
                    value: 85, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 120, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 105, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 155, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 180, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 65, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ef4444' },
                            { offset: 1, color: '#dc2626' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                },
                { 
                    value: 48, 
                    itemStyle: { 
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6366f1' },
                            { offset: 1, color: '#4f46e5' }
                        ]),
                        borderRadius: [6, 6, 0, 0]
                    }
                }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(99, 102, 241, 0.5)'
                }
            },
            animationDelay: (idx) => idx * 100
        }]
    };

    barChart.setOption(option);

    // 图表交互
    barChart.on('click', (params) => {
        showNotification(`${params.name}: ${params.value}次预警`, 'info');
    });

    window.addEventListener('resize', () => {
        barChart && barChart.resize();
    });
}

// 预警列表
function initWarningList() {
    const warnings = generateWarnings();
    renderWarningList(warnings);
    
    // 定时更新预警列表
    setInterval(() => {
        const newWarnings = generateWarnings();
        renderWarningList(newWarnings);
    }, 5000);
}

function generateWarnings() {
    const types = ['电信诈骗预警', '网络钓鱼检测', '异常转账提醒', '可疑链接拦截', '冒充身份警告'];
    const locations = ['教学楼A栋', '图书馆', '学生宿舍', '食堂', '实验楼', '行政楼'];
    const levels = ['high', 'medium', 'low'];
    
    return Array.from({ length: 6 }, (_, i) => ({
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        type: types[Math.floor(Math.random() * types.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        level: levels[Math.floor(Math.random() * levels.length)]
    }));
}

function renderWarningList(warnings) {
    const container = document.getElementById('warningList');
    container.innerHTML = warnings.map((warning, index) => `
        <div class="warning-item ${warning.level}" style="animation-delay: ${index * 0.1}s" onclick="showWarningDetail('${warning.type}')">
            <div class="warning-time">${warning.time}</div>
            <div class="warning-type">
                ${warning.type}
                <span class="warning-badge badge-${warning.level}">${warning.level === 'high' ? '高危' : warning.level === 'medium' ? '中危' : '低危'}</span>
            </div>
            <div class="warning-location">📍 ${warning.location}</div>
        </div>
    `).join('');
}

function showWarningDetail(type) {
    showNotification(`正在查看"${type}"详情...`, 'info');
}

// 数据传输路径动画
function initDataFlow() {
    const canvas = document.getElementById('dataFlowCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const connections = [];

    // 创建连接点（模拟数据节点）
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = `hsla(${220 + Math.random() * 40}, 80%, 60%, ${Math.random() * 0.5 + 0.3})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // 边界反弹
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // 回归原位的力
            this.x += (this.baseX - this.x) * 0.01;
            this.y += (this.baseY - this.y) * 0.01;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // 数据流动画点
    class DataPoint {
        constructor(startParticle, endParticle) {
            this.start = startParticle;
            this.end = endParticle;
            this.progress = Math.random();
            this.speed = 0.005 + Math.random() * 0.005;
            this.trail = [];
        }

        update() {
            this.progress += this.speed;
            if (this.progress > 1) {
                this.progress = 0;
                this.trail = [];
            }

            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;

            this.trail.push({ x, y, alpha: 1 });
            if (this.trail.length > 15) this.trail.shift();

            this.trail.forEach(point => point.alpha *= 0.92);
        }

        draw() {
            // 绘制轨迹
            this.trail.forEach((point, index) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${point.alpha})`;
                ctx.fill();
            });

            // 绘制当前点
            const currentX = this.start.x + (this.end.x - this.start.x) * this.progress;
            const currentY = this.start.y + (this.end.y - this.start.y) * this.progress;

            ctx.beginPath();
            ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
            gradient.addColorStop(0, 'rgba(129, 140, 248, 1)');
            gradient.addColorStop(1, 'rgba(129, 140, 248, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // 初始化粒子
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    // 创建数据流连接
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            if (Math.random() > 0.85) {
                connections.push(new DataPoint(particles[i], particles[j]));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制连接线
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.lineWidth = 1;
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 更新和绘制数据流
        connections.forEach(conn => {
            conn.update();
            conn.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// 时间更新
function initTimeUpdate() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    const dateStr = now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        weekday: 'long'
    });
    document.getElementById('currentTime').innerHTML = `
        <div>${dateStr}</div>
        <div style="font-size: 1.3em;">${timeStr}</div>
    `;
}

// 悬停交互效果
function initHoverEffects() {
    // 卡片悬停效果
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 进度条悬停动画
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.parentElement.addEventListener('mouseenter', function() {
            const fill = this.querySelector('.progress-fill');
            fill.style.filter = 'brightness(1.3)';
        });
        
        bar.parentElement.addEventListener('mouseleave', function() {
            const fill = this.querySelector('.progress-fill');
            fill.style.filter = 'brightness(1)';
        });
    });

    // 模块图标点击交互
    document.querySelectorAll('.module-icon').forEach(module => {
        module.addEventListener('click', function() {
            const moduleName = this.dataset.module;
            showModuleInteraction(moduleName);
        });
    });
}

function showModuleInteraction(moduleName) {
    const modules = {
        ai: 'AI智能识别模块',
        warning: '实时预警系统',
        education: '宣传教育中心',
        analysis: '数据分析平台'
    };
    
    showNotification(`正在启动${modules[moduleName]}...`, 'success');
    
    // 模块激活动画
    const icon = document.querySelector(`[data-module="${moduleName}"]`);
    icon.style.transform = 'scale(1.1)';
    icon.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.6)';
    
    setTimeout(() => {
        icon.style.transform = '';
        icon.style.boxShadow = '';
    }, 600);
}

// 数据导入功能
function initDataImport() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

function handleFile(file) {
    const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
        showNotification('请上传CSV或Excel文件', 'error');
        return;
    }

    showNotification('正在解析文件...', 'info');

    const reader = new FileReader();
    
    if (file.name.match(/\.csv$/i)) {
        reader.onload = (e) => parseCSV(e.target.result);
        reader.readAsText(file);
    } else {
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target.result, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(firstSheet);
            displayPreview(data);
        };
        reader.readAsArrayBuffer(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || '';
        });
        return obj;
    });
    
    displayPreview(data);
}

function displayPreview(data) {
    importedData = data;
    const previewTable = document.getElementById('previewTable');
    
    if (data.length === 0) {
        previewTable.innerHTML = '<p style="padding: 20px; color: #94a3b8;">文件中没有数据</p>';
        return;
    }

    const headers = Object.keys(data[0]);
    let tableHTML = `<table><thead><tr>`;
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += `</tr></thead><tbody>`;

    data.slice(0, 10).forEach(row => {
        tableHTML += `<tr>`;
        headers.forEach(header => {
            tableHTML += `<td>${row[header] || '-'}</td>`;
        });
        tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table>`;
    if (data.length > 10) {
        tableHTML += `<p style="padding: 12px; color: #94a3b8; text-align: center;">
            显示前10条记录，共${data.length}条数据
        </p>`;
    }
    
    previewTable.innerHTML = tableHTML;
    showNotification(`成功解析${data.length}条数据`, 'success');
}

function openImportModal() {
    document.getElementById('importModal').classList.remove('hidden');
}

function closeImportModal() {
    document.getElementById('importModal').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    document.getElementById('previewTable').innerHTML = '';
}

function importData() {
    if (!importedData || importedData.length === 0) {
        showNotification('请先选择要导入的数据文件', 'error');
        return;
    }

    const autoUpdate = document.getElementById('autoUpdate').checked;
    const clearExisting = document.getElementById('clearExisting').checked;

    showNotification(`正在导入${importedData.length}条数据...`, 'info');

    // 模拟导入过程
    setTimeout(() => {
        applyImportedData(importedData);
        
        if (autoUpdate) {
            enableRealtimeUpdate();
            showNotification('数据导入成功，实时更新已启用', 'success');
        } else {
            showNotification('数据导入成功', 'success');
        }
        
        closeImportModal();
    }, 1500);
}

function applyImportedData(data) {
    // 根据导入的数据更新图表和显示
    if (pieChart && data.some(d => d.hasOwnProperty('type') || d.hasOwnProperty('案件类型'))) {
        updatePieChartData(data);
    }
    
    if (barChart && data.some(d => d.hasOwnProperty('count') || d.hasOwnProperty('数量'))) {
        updateBarChartData(data);
    }

    // 更新统计数据
    updateMetricsFromData(data);
}

function updatePieChartData(data) {
    // 统计各类型数量
    const typeCounts = {};
    data.forEach(item => {
        const type = item['type'] || item['案件类型'] || item['类型'] || '其他';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const pieData = Object.entries(typeCounts).map(([name, value]) => ({
        value,
        name,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: getRandomColor() },
                { offset: 1, color: getRandomColor() }
            ])
        }
    }));

    pieChart.setOption({
        series: [{ data: pieData }]
    });
}

function updateBarChartData(data) {
    // 更新柱状图数据
    const values = data.map(d => parseFloat(d['count'] || d['数量'] || d['value'] || 0));
    const option = barChart.getOption();
    
    option.series[0].data = values.map(v => ({
        value: v,
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6366f1' },
                { offset: 1, color: '#4f46e5' }
            ]),
            borderRadius: [6, 6, 0, 0]
        }
    }));
    
    barChart.setOption(option);
}

function updateMetricsFromData(data) {
    // 根据数据更新指标卡片
    if (data.length > 0) {
        const sample = data[0];
        
        if (sample.hasOwnProperty('accuracy') || sample.hasOwnProperty('准确率')) {
            const accuracy = sample['accuracy'] || sample['准确率'];
            animateValue('metricAccuracy', accuracy);
        }
        
        if (sample.hasOwnProperty('total') || sample.hasOwnProperty('总数')) {
            const total = sample['total'] || sample['总数'];
            animateValue('statTotal', total.toLocaleString());
        }
    }
}

function animateValue(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const currentValue = startValue + (parseFloat(finalValue) - startValue) * easeProgress;
        
        element.textContent = typeof finalValue === 'string' && finalValue.includes('%') 
            ? currentValue.toFixed(1) + '%'
            : Math.round(currentValue).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function getRandomColor() {
    const colors = ['#ef4444', '#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#6366f1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 实时数据更新
function startRealtimeUpdate() {
    // 每3秒更新一次数据
    updateInterval = setInterval(() => {
        updateRandomData();
    }, 3000);
}

function enableRealtimeUpdate() {
    if (!updateInterval) {
        startRealtimeUpdate();
        showNotification('实时数据更新已启用', 'success');
    }
}

function disableRealtimeUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        showNotification('实时数据更新已停止', 'info');
    }
}

function updateRandomData() {
    // 更新核心指标
    const metrics = {
        metricAccuracy: (93 + Math.random() * 4).toFixed(1),
        metricCoverage: (96 + Math.random() * 4).toFixed(1),
        metricResponse: (0.5 + Math.random() * 0.8).toFixed(1),
        metricProcessing: Math.floor(60 + Math.random() * 30)
    };

    Object.entries(metrics).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            const suffix = id === 'metricResponse' ? 's' : '%';
            element.textContent = value + suffix;
            
            // 更新进度条
            const progressBar = element.closest('.metric-card')?.querySelector('.progress-fill');
            if (progressBar) {
                const width = id === 'metricResponse' ? (value / 1.5 * 100) : parseFloat(value);
                progressBar.style.width = width + '%';
            }
        }
    });

    // 更新统计数字
    const stats = {
        statTotal: Math.floor(85000 + Math.random() * 3000),
        statToday: Math.floor(23000 + Math.random() * 2000),
        statRate: (95 + Math.random() * 3).toFixed(1)
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = id === 'statRate' ? value + '%' : value.toLocaleString();
        }
    });

    // 更新预警数量
    document.getElementById('warningHigh').textContent = Math.floor(80 + Math.random() * 20);
    document.getElementById('warningMedium').textContent = Math.floor(140 + Math.random() * 30);
    document.getElementById('warningLow').textContent = Math.floor(400 + Math.random() * 60);
    document.getElementById('totalWarnings').textContent = Math.floor(620 + Math.random() * 100);
}

function refreshData() {
    showNotification('正在刷新数据...', 'info');
    
    // 刷新动画
    const btn = document.getElementById('refreshBtn');
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 0.6s ease';
    
    setTimeout(() => {
        updateRandomData();
        if (barChart) barChart.setOption(barChart.getOption());
        if (pieChart) pieChart.setOption(pieChart.getOption());
        
        btn.style.transform = '';
        showNotification('数据刷新完成', 'success');
    }, 800);
}

// 全屏功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showNotification('已进入全屏模式', 'info');
    } else {
        document.exitFullscreen();
        showNotification('已退出全屏模式', 'info');
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${
            type === 'success' ? '✅' : 
            type === 'error' ? '❌' : 
            type === 'warning' ? '⚠️' : 'ℹ️'
        }</span>
        <span class="notification-message">${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 24px;
        padding: 16px 24px;
        background: rgba(10, 22, 40, 0.95);
        backdrop-filter: blur(16px);
        border-radius: 12px;
        border-left: 4px solid ${
            type === 'success' ? '#10b981' : 
            type === 'error' ? '#ef4444' : 
            type === 'warning' ? '#f59e0b' : '#6366f1'
        };
        color: #f8fafc;
        font-size: 0.95em;
        font-weight: 500;
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        animation: slideInRight 0.4s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // 自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .loading-spinner {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 登出功能
function logout() {
    if (confirm('确定要退出系统吗？')) {
        const mainPage = document.getElementById('mainPage');
        const loginPage = document.getElementById('loginPage');
        
        mainPage.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
            mainPage.classList.add('hidden');
            loginPage.classList.remove('hidden');
            loginPage.style.animation = 'fadeIn 0.5s ease forwards';
            
            // 重置表单
            document.getElementById('loginForm').reset();
            document.querySelector('.login-btn').innerHTML = '登录系统';
            document.querySelector('.login-btn').disabled = false;
            
            // 停止实时更新
            if (updateInterval) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
        }, 500);
    }
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // F11 全屏
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // ESC 关闭弹窗
    if (e.key === 'Escape') {
        closeImportModal();
    }
    
    // Ctrl+R 刷新数据（阻止默认刷新）
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }
});

console.log('🛡️ 校园反诈智能预警系统 - 交互演示平台已加载完成');
console.log('💡 提示：使用 Ctrl+R 快速刷新数据 | F11 进入全屏');
