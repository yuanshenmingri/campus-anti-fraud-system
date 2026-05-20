/**
 * 🛡️ 校园反诈智能预警系统 v2.0 PRO - 高级交互引擎
 * 
 * 功能特性：
 * - 3D粒子背景系统
 * - 高级自定义鼠标光标（三层：圆环+点+拖尾）
 * - 全息投影登录界面
 * - 实时数据流可视化
 * - 3D模块卡片矩阵
 * - ECharts高级图表
 * - 数据导入/导出系统
 * - 霓虹光效动画
 */

// ============================================
// 🌟 全局配置与状态管理
// ============================================
const CONFIG = {
    particleCount: 80,
    particleSpeed: 0.3,
    mouseSmoothing: 0.12,
    dataUpdateInterval: 3000,
    animationDuration: 800
};

const STATE = {
    isLoggedIn: false,
    currentUser: null,
    currentRole: 'admin',
    importedData: null,
    updateInterval: null,
    notifications: [],
    isFabMenuOpen: false
};

// ============================================
// 🎨 高级粒子背景系统
// ============================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getParticleColor()
            });
        }
    }

    getParticleColor() {
        const colors = [
            'rgba(0, 240, 255, ',   // 青色
            'rgba(184, 41, 255, ',  // 紫色
            'rgba(0, 255, 157, ',   // 绿色
            'rgba(255, 107, 53, '   // 橙色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制粒子
        this.particles.forEach((particle, index) => {
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // 鼠标交互
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= dx * force * 0.02;
                particle.y -= dy * force * 0.02;
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.fill();

            // 绘制发光效果
            if (particle.radius > 1.5) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color + (particle.opacity * 0.15) + ')';
                this.ctx.fill();
            }

            // 绘制连线
            this.particles.slice(index + 1).forEach(other => {
                const dx2 = other.x - particle.x;
                const dy2 = other.y - particle.y;
                const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 🖱️ 三层自定义鼠标光标系统
// ============================================
class AdvancedCursor {
    constructor() {
        this.ring = document.getElementById('cursorRing');
        this.dot = document.getElementById('cursorDot');
        this.trail = document.getElementById('cursorTrail');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.trailX = 0;
        this.trailY = 0;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onClick());
        document.addEventListener('mouseup', () => this.onRelease());
        document.addEventListener('mouseenter', () => this.show());
        document.addEventListener('mouseleave', () => this.hide());

        // 添加悬停效果监听
        this.addHoverListeners();

        this.animate();
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    onClick() {
        this.ring.classList.add('clicking');
        this.dot.classList.add('clicking');
        setTimeout(() => {
            this.ring.classList.remove('clicking');
            this.dot.classList.remove('clicking');
        }, 150);
    }

    onRelease() {
        // 可选的释放效果
    }

    show() {
        this.ring.style.opacity = '1';
        this.dot.style.opacity = '1';
    }

    hide() {
        this.ring.style.opacity = '0';
        this.dot.style.opacity = '0';
    }

    addHoverListeners() {
        const hoverElements = document.querySelectorAll(
            '.btn-pro, .nav-tab, .module-card-3d, .widget, .stat-card-3d, .control-btn, ' +
            '.fab-main, .fab-item, .filter-btn, .chart-control-btn, .menu-item, ' +
            '.option-toggle, input, select, button, a'
        );

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.ring.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                this.ring.classList.remove('hovering');
            });
        });
    }

    animate() {
        // 平滑插值算法
        const ease = CONFIG.mouseSmoothing;

        // Ring跟随（最慢，最平滑）
        this.ringX += (this.mouseX - this.ringX) * ease;
        this.ringY += (this.mouseY - this.ringY) * ease;
        this.ring.style.left = `${this.ringX - 20}px`;
        this.ring.style.top = `${this.ringY - 20}px`;

        // Dot跟随（中等速度）
        this.dotX += (this.mouseX - this.dotX) * (ease * 1.5);
        this.dotY += (this.mouseY - this.dotY) * (ease * 1.5);
        this.dot.style.left = `${this.dotX - 4}px`;
        this.dot.style.top = `${this.dotY - 4}px`;

        // Trail跟随（最慢，产生拖尾效果）
        this.trailX += (this.mouseX - this.trailX) * (ease * 0.7);
        this.trailY += (this.mouseY - this.trailY) * (ease * 0.7);
        this.trail.style.left = `${this.trailX - 30}px`;
        this.trail.style.top = `${this.trailY - 30}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// 🔐 登录表单验证与处理
// ============================================
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginFormPro');
        this.usernameInput = document.getElementById('usernamePro');
        this.passwordInput = document.getElementById('passwordPro');
        this.roleSelect = document.getElementById('roleSelectPro');

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // 实时验证
        this.usernameInput.addEventListener('blur', () => this.validateUsername());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.roleSelect.addEventListener('change', () => this.validateRole());

        // 输入框聚焦特效
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const isUsernameValid = this.validateUsername();
        const isPasswordValid = this.validatePassword();
        const isRoleValid = this.validateRole();

        if (isUsernameValid && isPasswordValid && isRoleValid) {
            this.performLogin();
        }
    }

    validateUsername() {
        const value = this.usernameInput.value.trim();
        const errorEl = document.getElementById('usernameErrorPro');

        if (!value) {
            return this.showError(this.usernameInput, errorEl, 'Username required');
        } else if (value.length < 3) {
            return this.showError(this.usernameInput, errorEl, 'Minimum 3 characters');
        }

        return this.clearError(this.usernameInput, errorEl);
    }

    validatePassword() {
        const value = this.passwordInput.value;
        const errorEl = document.getElementById('passwordErrorPro');

        if (!value) {
            return this.showError(this.passwordInput, errorEl, 'Password required');
        } else if (value.length < 6) {
            return this.showError(this.passwordInput, errorEl, 'Minimum 6 characters');
        }

        return this.clearError(this.passwordInput, errorEl);
    }

    validateRole() {
        const value = this.roleSelect.value;
        const errorEl = document.getElementById('roleErrorPro');

        if (!value) {
            return this.showError(this.roleSelect.parentElement, errorEl, 'Please select role');
        }

        return this.clearError(this.roleSelect.parentElement, errorEl);
    }

    showError(input, errorEl, message) {
        input.classList.add('error-shake');
        errorEl.textContent = message;
        errorEl.classList.add('show');

        setTimeout(() => input.classList.remove('error-shake'), 500);
        return false;
    }

    clearError(input, errorEl) {
        input.classList.remove('error-shake');
        errorEl.textContent = '';
        errorEl.classList.remove('show');
        return true;
    }

    performLogin() {
        const btn = this.form.querySelector('.login-btn-pro');
        const btnText = btn.querySelector('.btn-text');
        
        // 加载状态
        btnText.textContent = '正在验证身份...';
        btn.disabled = true;
        btn.style.pointerEvents = 'none';

        // 模拟认证过程
        setTimeout(() => {
            btnText.textContent = '验证成功 ✓';
            
            setTimeout(() => {
                STATE.isLoggedIn = true;
                STATE.currentUser = this.usernameInput.value.trim();
                STATE.currentRole = this.roleSelect.value;

                showMainPage(STATE.currentUser, STATE.currentRole);
                
                // 重置按钮
                btnText.textContent = 'INITIALIZE SYSTEM ACCESS';
                btn.disabled = false;
                btn.style.pointerEvents = 'auto';
            }, 1000);
        }, 2000);
    }
}

// 密码可见性切换
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordPro');
    const toggleBtn = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// ============================================
// 📊 主页面显示与初始化
// ============================================
function showMainPage(username, role) {
    const loginPage = document.getElementById('loginPage');
    const mainPage = document.getElementById('mainPagePro');

    // 登录页面淡出
    loginPage.style.animation = 'fadeOut 0.8s ease forwards';

    setTimeout(() => {
        loginPage.classList.add('hidden');
        mainPage.classList.remove('hidden');

        // 设置用户信息
    const roleNames = { admin: '管理员', teacher: '教师', student: '学生' };
    document.getElementById('currentUserPro').textContent = roleNames[role];

        // 初始化主页面组件
        initializeMainComponents();

        // 启动实时数据更新
        startRealtimeUpdates();
    }, 800);
}

function initializeMainComponents() {
    // 初始化图表
    initializeCharts();
    
    // 初始化数据流
    initializeDataStream();
    
    // 初始化预警列表
    initializeAlertsFeed();
    
    // 初始化雷达图
    initializeThreatRadar();
    
    // 初始化时间显示
    startDateTimeUpdate();
    
    // 显示欢迎通知
    showNotificationPro(`欢迎回来，${STATE.currentUser}！系统已准备就绪。`, 'success');
}

// ============================================
// 📈 ECharts图表初始化（高级版）
// ============================================
let mainChart3D, threatRadarChart;

function initializeCharts() {
    mainChart3D = echarts.init(document.getElementById('main-chart'));
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(10, 10, 20, 0.95)',
            borderColor: 'rgba(0, 240, 255, 0.3)',
            borderWidth: 1,
            textStyle: { color: '#fff', fontSize: 12 },
            axisPointer: {
                type: 'cross',
                crossStyle: { color: 'rgba(0, 240, 255, 0.3)' },
                lineStyle: { color: 'rgba(0, 240, 255, 0.5)' }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: { 
                lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } 
            },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 11,
                fontFamily: 'Courier New'
            },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 11,
                fontFamily: 'Courier New'
            },
            splitLine: { 
                lineStyle: { 
                    color: 'rgba(255, 255, 255, 0.04)',
                    type: 'dashed'
                } 
            }
        },
        series: [{
            name: 'Warnings',
            type: 'bar',
            barWidth: '45%',
            data: [
                {
                    value: 85,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f0ff' },
                            { offset: 1, color: '#0080ff' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(0, 240, 255, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 120,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f0ff' },
                            { offset: 1, color: '#0080ff' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(0, 240, 255, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 105,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f0ff' },
                            { offset: 1, color: '#0080ff' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(0, 240, 255, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 155,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#b829ff' },
                            { offset: 1, color: '#9922dd' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(184, 41, 255, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 180,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#b829ff' },
                            { offset: 1, color: '#9922dd' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(184, 41, 255, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 65,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ff6b35' },
                            { offset: 1, color: '#ff4500' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(255, 107, 53, 0.5)',
                        shadowBlur: 15
                    }
                },
                {
                    value: 48,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f0ff' },
                            { offset: 1, color: '#0080ff' }
                        ]),
                        borderRadius: [8, 8, 0, 0],
                        shadowColor: 'rgba(0, 240, 255, 0.5)',
                        shadowBlur: 15
                    }
                }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 25,
                    shadowColor: 'rgba(0, 240, 255, 0.8)'
                }
            },
            animationDelay: (idx) => idx * 120
        }]
    };

    mainChart3D.setOption(option);

    // 图表交互事件
    mainChart3D.on('click', (params) => {
        showNotificationPro(`${params.name}: 检测到 ${params.value} 次预警`, 'info');
    });

    // 响应式
    window.addEventListener('resize', () => {
        mainChart3D && mainChart3D.resize();
    });

    // 图表控制按钮
    document.querySelectorAll('.chart-control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const range = this.dataset.range;
            updateChartDataByRange(range);
        });
    });
}

function updateChartDataByRange(range) {
    let data, categories;
    
    switch(range) {
        case 'week':
            categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            data = [85, 120, 105, 155, 180, 65, 48];
            break;
        case 'month':
            categories = ['第1周', '第2周', '第3周', '第4周'];
            data = [520, 680, 750, 630];
            break;
        case 'year':
            categories = ['第一季度', '第二季度', '第三季度', '第四季度'];
            data = [2450, 2890, 3200, 2780];
            break;
    }

    mainChart3D.setOption({
        xAxis: { data: categories },
        series: [{ data: data.map((val, idx) => ({
            value: val,
            itemStyle: mainChart3D.getOption().series[0].data[0]?.itemStyle
        })) }]
    });

    showNotificationPro(`数据已更新为${range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}视图`, 'info');
}

// ============================================
// 🎯 预警雷达图
// ============================================
function initializeThreatRadar() {
    threatRadarChart = echarts.init(document.getElementById('threatRadar'));

    const option = {
        backgroundColor: 'transparent',
        radar: {
            indicator: [
                { name: 'Critical', max: 100 },
                { name: 'High', max: 200 },
                { name: 'Medium', max: 300 },
                { name: 'Low', max: 500 },
                { name: 'Info', max: 400 },
                { name: 'Resolved', max: 350 }
            ],
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 11,
                fontFamily: 'Segoe UI'
            },
            splitLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.06)' }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(0, 240, 255, 0.02)', 'rgba(0, 240, 255, 0.04)', 
                           'rgba(0, 240, 255, 0.06)', 'rgba(0, 240, 255, 0.08)']
                }
            },
            axisLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: [65, 89, 156, 428, 320, 298],
                name: 'Current Threats',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#00f0ff' },
                        { offset: 1, color: '#b829ff' }
                    ])
                },
                areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                        { offset: 0, color: 'rgba(0, 240, 255, 0.3)' },
                        { offset: 1, color: 'rgba(184, 41, 255, 0.1)' }
                    ])
                },
                itemStyle: {
                    color: '#00f0ff',
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowColor: 'rgba(0, 240, 255, 0.8)',
                    shadowBlur: 10
                }
            }],
            animationDuration: 2000,
            animationEasing: 'elasticOut'
        }]
    };

    threatRadarChart.setOption(option);

    window.addEventListener('resize', () => {
        threatRadarChart && threatRadarChart.resize();
    });
}

// ============================================
// 📊 实时数据流
// ============================================
function initializeDataStream() {
    const container = document.getElementById('dataStreamContainer');
    const streamTypes = [
        { type: 'AI_DETECTION', icon: '🧠' },
        { type: 'NETWORK_SCAN', icon: '📡' },
        { type: 'DATA_SYNC', icon: '🔄' },
        { type: 'ALERT_TRIGGERED', icon: '⚡' },
        { type: 'USER_ACTION', icon: '👤' },
        { type: 'SYSTEM_CHECK', icon: '✅' }
    ];

    setInterval(() => {
        const randomType = streamTypes[Math.floor(Math.random() * streamTypes.length)];
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        
        const streamItem = document.createElement('div');
        streamItem.className = 'stream-item';
        streamItem.innerHTML = `
            <span class="stream-time">${timeStr}</span>
            <span class="stream-icon">${randomType.icon}</span>
            <span class="stream-type">${randomType.type}</span>
            <span style="color: rgba(0, 255, 157, 0.8); margin-left: auto;">✓</span>
        `;

        container.insertBefore(streamItem, container.firstChild);

        // 保持最多显示15条
        while (container.children.length > 15) {
            container.removeChild(container.lastChild);
        }
    }, 2000);
}

// ============================================
// 🚨 实时预警列表
// ============================================
function initializeAlertsFeed() {
    generateAlerts();

    // 每5秒刷新一次
    setInterval(generateAlerts, 5000);
}

function generateAlerts() {
    const feed = document.getElementById('alertsFeedPro');
    const alertTypes = [
        { type: 'Phishing Attempt Detected', level: 'critical', location: 'Campus Network Hub' },
        { type: 'Suspicious Login Activity', level: 'high', location: 'Library Terminal #14' },
        { type: 'Malware Signature Found', level: 'high', location: 'Computer Lab B' },
        { type: 'Unusual Data Transfer', level: 'medium', location: 'Admin Building' },
        { type: 'Brute Force Attack Blocked', level: 'critical', location: 'Server Room Gateway' },
        { type: 'Unauthorized Access Attempt', level: 'high', location: 'Student Portal' },
        { type: 'DNS Spoofing Detected', level: 'medium', location: 'Network Core' },
        { type: 'SQL Injection Prevented', level: 'critical', location: 'Database Server' }
    ];

    const alerts = Array.from({ length: 6 }, (_, i) => {
        const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const time = new Date(Date.now() - Math.random() * 3600000);
        return {
            ...alert,
            time: time.toLocaleTimeString('en-US', { hour12: false }),
            id: Date.now() + i
        };
    });

    feed.innerHTML = alerts.map(alert => `
        <div class="alert-item-pro ${alert.level}" onclick="viewAlertDetail('${alert.type}')">
            <div class="alert-time-pro">${alert.time}</div>
            <div class="alert-type-pro">
                ${alert.type}
                <span class="alert-badge-pro badge-${alert.level}">${alert.level.toUpperCase()}</span>
            </div>
            <div class="alert-location-pro">📍 ${alert.location}</div>
        </div>
    `).join('');

    // 更新统计数字
    updateThreatCounts(alerts);
}

function updateThreatCounts(alerts) {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    alerts.forEach(a => counts[a.level]++);

    animateValue('criticalCount', counts.critical + Math.floor(Math.random() * 10));
    animateValue('highCount', counts.high + 85);
    animateValue('mediumCount', counts.medium + 150);
    animateValue('lowCount', counts.low + 420);
}

function viewAlertDetail(type) {
    showNotificationPro(`正在查看详情: ${type}`, 'info');
}

// ============================================
// ⏰ 时间日期显示
// ============================================
function startDateTimeUpdate() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('datePart').textContent = now.toLocaleDateString('en-US', dateOptions);
    
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('timePart').textContent = timeStr;
}

// ============================================
// 🔔 通知系统（高级版）
// ============================================
function showNotificationPro(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-item ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const colors = {
        success: 'var(--accent-green)',
        error: 'var(--accent-red)',
        warning: 'var(--accent-orange)',
        info: 'var(--primary-neon)'
    };

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">${icons[type]}</span>
            <div>
                <div style="font-weight: 600; font-size: 13px; color: ${colors[type]};">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                    ${message}
                </div>
            </div>
        </div>
        <div style="width: 4px; height: 100%; background: ${colors[type]}; position: absolute; left: 0; top: 0;"></div>
    `;

    notification.style.cssText += `
        position: fixed;
        top: 90px;
        right: 32px;
        min-width: 380px;
        z-index: 10002;
        animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(20px);
        border-left: none;
    `;

    document.body.appendChild(notification);

    // 自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => notification.remove(), 500);
    }, 5000);

    // 添加到通知列表
    STATE.notifications.unshift({
        message,
        type,
        timestamp: new Date()
    });
}

// ============================================
// 🔄 实时数据更新系统
// ============================================
function startRealtimeUpdates() {
    // 核心指标更新
    setInterval(updateCoreMetrics, CONFIG.dataUpdateInterval);
    
    // 统计数字更新
    setInterval(updateStatistics, CONFIG.dataUpdateInterval);
    
    // 系统资源监控
    setInterval(updateSystemResources, 2000);

    console.log('🔄 Real-time updates started');
}

function updateCoreMetrics() {
    // AI准确率
    const accuracy = (93 + Math.random() * 4).toFixed(1);
    document.querySelector('.ai-percentage').textContent = accuracy + '%';

    // 其他指标
    const metrics = [
        { el: document.querySelector('.neon-blue'), value: (96 + Math.random() * 3).toFixed(1), suffix: '%' },
        { el: document.querySelector('.neon-green'), value: (0.5 + Math.random() * 0.8).toFixed(1), suffix: 's' },
        { el: document.querySelector('.neon-purple'), value: Math.floor(60 + Math.random() * 30), suffix: '%' }
    ];

    metrics.forEach(m => {
        if (m.el) m.el.textContent = m.value + m.suffix;
    });
}

function updateStatistics() {
    // 总案件数
    const total = Math.floor(85000 + Math.random() * 3000);
    animateValue('statTotalPro', total.toLocaleString());

    // 今日预警
    const today = Math.floor(23000 + Math.random() * 2000);
    animateValue('statTodayPro', today.toLocaleString());

    // 准确率
    const rate = (95 + Math.random() * 3).toFixed(1);
    animateValue('statRatePro', rate + '%');
}

function updateSystemResources() {
    // CPU使用率
    const cpu = Math.floor(35 + Math.random() * 25);
    document.getElementById('cpuUsage').textContent = cpu + '%';
    document.querySelector('.health-bar .cpu').style.width = cpu + '%';

    // 内存使用率
    const mem = Math.floor(55 + Math.random() * 20);
    document.getElementById('memUsage').textContent = mem + '%';
    document.querySelector('.health-bar .memory').style.width = mem + '%';

    // 网络速度
    const net = (0.8 + Math.random() * 1).toFixed(1);
    document.getElementById('netSpeed').textContent = net + ' Gbps';
    document.querySelector('.health-bar .network').style.width = (70 + Math.random() * 20) + '%';
}

function animateValue(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1000;
    const startTime = performance.now();
    const startValue = element.textContent.replace(/,/g, '');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        if (finalValue.includes('%')) {
            const numVal = parseFloat(finalValue);
            const currentVal = parseFloat(startValue) + (numVal - parseFloat(startValue)) * easeProgress;
            element.textContent = currentVal.toFixed(1) + '%';
        } else {
            const numVal = parseInt(finalValue.replace(/,/g, ''));
            const currentVal = parseInt(startValue.replace(/,/g, '')) + (numVal - parseInt(startValue.replace(/,/g, ''))) * easeProgress;
            element.textContent = Math.round(currentVal).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// 🎯 3D模块卡片交互
// ============================================
function activateModule(card) {
    // 移除其他卡片的active状态
    document.querySelectorAll('.module-card-3d').forEach(c => c.classList.remove('active'));
    
    // 激活当前卡片
    card.classList.add('active');
    card.classList.toggle('flipped');

    const moduleName = card.dataset.module;
    
    // 显示详情通知
    const moduleNames = {
        'ai-recognition': '🧠 AI智能识别引擎',
        'realtime-warning': '⚡ 实时预警系统',
        'education': '📚 宣传教育中心',
        'data-analysis': '🔬 数据分析平台'
    };

    showNotificationPro(`模块已激活: ${moduleNames[moduleName]}`, 'success');

    // 模块激活动画效果
    const glowEffect = card.querySelector('.module-glow-effect');
    glowEffect.style.animation = 'none';
    glowEffect.offsetHeight; // 触发重绘
    glowEffect.style.animation = 'moduleGlowPulse 0.6s ease-out';
}

// ============================================
// 👤 用户资料菜单
// ============================================
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('hidden');
}

function switchRole(role) {
    STATE.currentRole = role;
    const roleNames = { admin: '管理员', teacher: '教师', student: '学生' };
    document.getElementById('currentUserPro').textContent = roleNames[role];

    toggleProfileMenu();
    showNotificationPro(`已切换到${roleNames[role]}模式`, 'info');

    // 刷新数据显示
    refreshAllData();
}

// ============================================
// 📁 高级数据导入系统
// ============================================
function openImportModalPro() {
    document.getElementById('importModalPro').classList.remove('hidden');
    setupImportZone();
}

function closeImportModalPro() {
    document.getElementById('importModalPro').classList.add('hidden');
}

function setupImportZone() {
    const uploadZone = document.getElementById('uploadZonePro');
    const fileInput = document.getElementById('fileInputPro');

    uploadZone.onclick = () => fileInput.click();

    uploadZone.ondragover = (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    };

    uploadZone.ondragleave = () => {
        uploadZone.classList.remove('dragover');
    };

    uploadZone.ondrop = (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    };

    fileInput.onchange = (e) => handleFiles(e.target.files);
}

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/json'
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls|json)$/i)) {
        showNotificationPro('不支持的文件格式，请使用CSV、Excel或JSON格式文件。', 'error');
        return;
    }

    showNotificationPro(`正在处理文件: ${file.name} (${formatFileSize(file.size)})`, 'info');

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            if (file.name.match(/\.csv$/i)) {
                parseCSVData(e.target.result);
            } else if (file.name.match(/\.json$/i)) {
                parseJSONData(JSON.parse(e.target.result));
            } else {
                parseExcelData(e.target.result);
            }
        } catch (err) {
            showNotificationPro('文件解析出错: ' + err.message, 'error');
        }
    };

    if (file.name.match(/\.csv$/i)) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        showNotificationPro('CSV file appears to be empty or invalid.', 'warning');
        return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index]?.trim().replace(/"/g, '') || '';
            });
            return obj;
        });

    displayImportPreview(data);
}

function parseJSONData(jsonData) {
    if (Array.isArray(jsonData)) {
        displayImportPreview(jsonData);
    } else {
        showNotificationPro('JSON must contain an array of objects.', 'warning');
    }
}

function parseExcelData(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    displayImportPreview(data);
}

function displayImportPreview(data) {
    STATE.importedData = data;
    const previewTable = document.getElementById('previewTablePro');
    const recordCount = document.getElementById('recordCountPro');

    recordCount.textContent = `${data.length} 条记录`;

    if (data.length === 0) {
        previewTable.innerHTML = '<p style="padding: 40px; text-align: center; color: var(--text-muted);">文件中没有找到数据。</p>';
        return;
    }

    const headers = Object.keys(data[0]);
    let html = '<table><thead><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.slice(0, 15).forEach(row => {
        html += '<tr>';
        headers.forEach(header => {
            html += `<td>${row[header] !== undefined ? row[header] : '-'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';

    if (data.length > 15) {
        html += `<p style="padding: 16px; text-align: center; color: var(--primary-neon); font-size: 12px;">
            显示前15条记录，共${data.length}条总记录
        </p>`;
    }

    previewTable.innerHTML = html;
    showNotificationPro(`成功解析 ${data.length} 条记录`, 'success');
}

function executeImport() {
    if (!STATE.importedData || STATE.importedData.length === 0) {
        showNotificationPro('没有可导入的数据，请先选择文件。', 'warning');
        return;
    }

    const btn = document.querySelector('.btn-primary-pro');
    btn.classList.add('loading');
    btn.disabled = true;

    // 模拟导入过程
    setTimeout(() => {
        applyImportedDataToSystem(STATE.importedData);

        btn.classList.remove('loading');
        btn.disabled = false;

        closeImportModalPro();
        showNotificationPro(`成功导入 ${STATE.importedData.length} 条记录！`, 'success');

        if (document.getElementById('autoSyncPro').checked) {
            showNotificationPro('已启用实时数据同步，数据将自动更新。', 'info');
        }
    }, 2500);
}

function applyImportedDataToSystem(data) {
    // 更新图表数据
    if (mainChart3D && data.length > 0) {
        const sample = data[0];
        const numericKeys = Object.keys(sample).filter(key => 
            typeof sample[key] === 'number' || !isNaN(parseFloat(sample[key]))
        );

        if (numericKeys.length >= 7) {
            const values = numericKeys.slice(0, 7).map(key => ({
                value: parseFloat(sample[key]) || Math.floor(Math.random() * 200),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00f0ff' },
                        { offset: 1, color: '#0080ff' }
                    ]),
                    borderRadius: [8, 8, 0, 0]
                }
            }));

            mainChart3D.setOption({ series: [{ data: values }] });
        }
    }

    // 更新统计数据
    updateStatisticsFromImport(data);
}

function updateStatisticsFromImport(data) {
    if (data.length > 0) {
        // 尝试从数据中提取统计值
        const sample = data[0];
        const keys = Object.keys(sample);

        // 查找可能的统计字段
        const totalKey = keys.find(k => /total|count|sum|cases/i.test(k));
        const todayKey = keys.find(k => /today|daily|current/i.test(k));
        const rateKey = keys.find(k => /rate|accuracy|percent/i.test(k));

        if (totalKey) animateValue('statTotalPro', formatNumber(sample[totalKey]));
        if (todayKey) animateValue('statTodayPro', formatNumber(sample[todayKey]));
        if (rateKey) animateValue('statRatePro', sample[rateKey]);
    }
}

function formatNumber(num) {
    return parseFloat(num).toLocaleString();
}

// ============================================
// 🔄 刷新功能
// ============================================
function refreshAllData() {
    showNotificationPro('正在刷新所有系统数据...', 'info');

    const btn = event.currentTarget;
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    setTimeout(() => {
        updateCoreMetrics();
        updateStatistics();
        updateSystemResources();
        generateAlerts();

        if (mainChart3D) mainChart3D.setOption(mainChart3D.getOption());
        if (threatRadarChart) threatRadarChart.setOption(threatRadarChart.getOption());

        btn.style.transform = '';
        showNotificationPro('所有数据刷新完成！', 'success');
    }, 1000);
}

// ============================================
// ⛶ 全屏切换
// ============================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showNotificationPro('已进入全屏模式', 'info');
    } else {
        document.exitFullscreen();
        showNotificationPro('已退出全屏模式', 'info');
    }
}

// ============================================
// 🔔 通知中心
// ============================================
function toggleAlerts() {
    const panel = document.getElementById('notificationCenter');
    panel.classList.toggle('hidden');
    
    if (!panel.classList.contains('hidden')) {
        renderNotificationsList();
    }
}

function renderNotificationsList() {
    const list = document.getElementById('notificationList');
    
    if (STATE.notifications.length === 0) {
        list.innerHTML = '<p style="padding: 40px; text-align: center; color: var(--text-muted);">No notifications yet.</p>';
        return;
    }

    list.innerHTML = STATE.notifications.slice(0, 20).map(notif => `
        <div class="notification-item" style="margin-bottom: 10px;">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 18px;">${notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}</span>
                <div style="flex: 1;">
                    <div style="font-size: 12px; color: var(--text-primary); margin-bottom: 4px;">${notif.message}</div>
                    <div style="font-size: 10px; color: var(--text-muted);">${new Date(notif.timestamp).toLocaleString()}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function clearAllNotifications() {
    STATE.notifications = [];
    renderNotificationsList();
    showNotificationPro('All notifications cleared', 'info');
}

// ============================================
// ⚡ FAB浮动按钮组
// ============================================
function toggleFabMenu() {
    const menu = document.getElementById('fabMenu');
    menu.classList.toggle('hidden');
    STATE.isFabMenuOpen = !STATE.isFabMenuOpen;
}

function exportReport() {
    showNotificationPro('正在生成综合报表...', 'info');
    setTimeout(() => {
        showNotificationPro('报表已成功导出！', 'success');
        toggleFabMenu();
    }, 2000);
}

function generatePDF() {
    showNotificationPro('正在创建PDF文档...', 'info');
    setTimeout(() => {
        showNotificationPro('PDF文档已生成并下载！', 'success');
        toggleFabMenu();
    }, 2000);
}

function showHelp() {
    showNotificationPro('正在打开帮助文档...', 'info');
    setTimeout(() => {
        showNotificationPro('帮助中心已加载，请查看侧边栏指南。', 'success');
        toggleFabMenu();
    }, 1500);
}

// ============================================
// 🚪 登出系统
// ============================================
function logoutPro() {
    if (confirm('确定要退出系统吗？')) {
        toggleProfileMenu();
        
        const mainPage = document.getElementById('mainPagePro');
        const loginPage = document.getElementById('loginPage');

        mainPage.style.animation = 'fadeOut 0.8s ease forwards';

        setTimeout(() => {
            mainPage.classList.add('hidden');
            loginPage.classList.remove('hidden');
            loginPage.style.animation = 'fadeIn 0.8s ease forwards';

            // 重置状态
            STATE.isLoggedIn = false;
            STATE.currentUser = null;

            // 清除定时器
            if (STATE.updateInterval) {
                clearInterval(STATE.updateInterval);
                STATE.updateInterval = null;
            }

            // 重置表单
            document.getElementById('loginFormPro').reset();
            document.querySelector('.login-btn-pro .btn-text').textContent = 'INITIALIZE SYSTEM ACCESS';
        }, 800);
    }
}

// ============================================
// ⌨️ 键盘快捷键
// ============================================
document.addEventListener('keydown', (e) => {
    // F11 全屏
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // ESC 关闭弹窗
    if (e.key === 'Escape') {
        closeImportModalPro();
        document.getElementById('notificationCenter').classList.add('hidden');
        if (STATE.isFabMenuOpen) toggleFabMenu();
    }
    
    // Ctrl+Shift+R 强制刷新
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        refreshAllData();
    }

    // Ctrl+I 打开导入
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        openImportModalPro();
    }
});

// ============================================
// 🎨 导航标签页交互
// ============================================
// ============================================
// 🔗 函数别名（兼容HTML中的调用）
// ============================================
function initDataStream() {
    initializeDataStream();
}

function initAlertList() {
    initializeAlertsFeed();
}

// ============================================
// 🎨 导航标签页交互
// ============================================
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const view = this.dataset.view;
        showNotificationPro(`已切换到${view === 'dashboard' ? '数据总览' : view === 'monitoring' ? '实时监控' : view === 'analytics' ? '数据分析' : '系统设置'}视图`, 'info');
    });
});

// ============================================
// 🎭 CSS动画定义（动态添加）
// ============================================
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.98); }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }

    @keyframes moduleGlowPulse {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }

    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }

    .error-shake {
        animation: errorShake 0.4s ease-in-out;
        border-color: var(--accent-red) !important;
    }
`;
document.head.appendChild(dynamicStyles);

// ============================================
// 🚀 系统初始化入口
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🛡️ 校园反诈系统 v2.0 PRO', 'color: #00f0ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 20px #00f0ff;');
    console.log('%c高级反诈智能预警系统已初始化', 'color: #b829ff; font-size: 12px;');
    console.log('%c⌨️ 快捷键: F11=全屏 | ESC=关闭 | Ctrl+I=导入 | Ctrl+Shift+R=刷新', 'color: #666; font-size: 11px;');

    // 初始化核心系统
    new ParticleSystem('particleCanvas');
    new AdvancedCursor();
    new LoginManager();

    // 初始化数据流动画
    initDataFlowCanvas();

    console.log('✅ 所有系统已上线，准备就绪。');
});

// ============================================
// 🌊 高级数据流动画Canvas
// ============================================
function initDataFlowCanvas() {
    const canvas = document.getElementById('dataFlowCanvasPro');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowLines = [];
    const nodePositions = [];

    // 创建节点位置（基于实际元素位置）
    function updateNodePositions() {
        nodePositions.length = 0;
        document.querySelectorAll('.widget').forEach(widget => {
            const rect = widget.getBoundingClientRect();
            nodePositions.push({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                radius: Math.max(rect.width, rect.height) / 4
            });
        });
    }

    // 创建数据流线
    class FlowLine {
        constructor() {
            this.reset();
        }

        reset() {
            if (nodePositions.length < 2) return;

            const startIdx = Math.floor(Math.random() * nodePositions.length);
            let endIdx;
            do {
                endIdx = Math.floor(Math.random() * nodePositions.length);
            } while (endIdx === startIdx);

            this.start = nodePositions[startIdx];
            this.end = nodePositions[endIdx];
            this.progress = 0;
            this.speed = 0.005 + Math.random() * 0.01;
            this.trail = [];
            this.maxTrailLength = 20;
            this.alpha = 0.6 + Math.random() * 0.4;
        }

        update() {
            this.progress += this.speed;

            if (this.progress >= 1) {
                this.reset();
                return;
            }

            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;

            this.trail.unshift({ x, y, alpha: 1 });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }

            this.trail.forEach(point => point.alpha *= 0.92);
        }

        draw(ctx) {
            // 绘制轨迹
            this.trail.forEach((point, index) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3 * point.alpha, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${point.alpha * this.alpha * 0.5})`;
                ctx.fill();
            });

            // 绘制当前点
            if (this.trail.length > 0) {
                const current = this.trail[0];
                ctx.beginPath();
                ctx.arc(current.x, current.y, 6, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(current.x, current.y, 0, current.x, current.y, 12);
                gradient.addColorStop(0, `rgba(0, 240, 255, ${this.alpha})`);
                gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    // 创建多条流线
    for (let i = 0; i < 15; i++) {
        flowLines.push(new FlowLine());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateNodePositions();

        flowLines.forEach(line => {
            line.update();
            line.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // 延迟启动以确保DOM已渲染
    setTimeout(animate, 1000);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// ✨ 最终完成标志
// ============================================
console.log('🎉 校园反诈系统 v2.0 PRO - 完全加载并运行正常！');
