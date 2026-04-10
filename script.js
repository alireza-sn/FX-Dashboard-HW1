document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logout-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const contentArea = document.getElementById('dynamic-content');
    const sidebarLinks = document.querySelectorAll('#sidebar-nav a');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    // Sidebar Collapse Logic
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    sidebarToggle.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed);
    });

    // Apple 2026 Color Palette
    const palette = {
        blue: '#0071E3',
        teal: '#5AC8FA',
        green: '#34C759',
        red: '#FF3B30',
        muted: '#86868B',
        grid: 'rgba(0,0,0,0.05)'
    };

    const mockDB = {
        overview: {
            leads: 2482,
            conversion: '18.5%',
            payouts: '$128,450',
            trends: [
                { pair: 'EUR/USD', price: '1.0942', change: '+0.04%', up: true },
                { pair: 'GBP/USD', price: '1.2681', change: '-0.12%', up: false },
                { pair: 'BTC/USD', price: '64,210', change: '+2.41%', up: true }
            ],
            systemHealth: [98, 99, 97, 98, 99, 100, 99, 98, 97, 99, 100, 98],
            marketSignals: [45, 52, 48, 61, 55, 67, 72, 65, 58, 63, 70, 75]
        },
        clients: {
            directory: [
                { id: 'C001', name: 'James Wilson', status: 'Active', balance: '$12,400' },
                { id: 'C002', name: 'Sarah Chen', status: 'Pending', balance: '$0' },
                { id: 'C003', name: 'Michael Ross', status: 'Active', balance: '$45,200' },
                { id: 'C004', name: 'Elena Rodriguez', status: 'Inactive', balance: '$1,200' }
            ],
            stats: { total: 1284, active: 856, leads: 42 }
        },
        finances: {
            revenue: [45000, 52000, 48000, 61000, 55000, 67000],
            payouts: [12000, 15000, 11000, 18000, 14000, 21000],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },
        alerts: {
            recent: [
                { time: '10:24 AM', type: 'Critical', message: 'High Volatility Detected: BTC/USD' },
                { time: '09:15 AM', type: 'Info', message: 'Pending Withdrawal Request: #8821' },
                { time: '08:42 AM', type: 'Warning', message: 'API Latency Above Threshold' }
            ],
            frequency: [5, 8, 3, 12, 7, 15, 10, 4, 6, 9, 11, 5, 8, 14, 12, 6, 4, 3, 7, 10, 15, 12, 8, 5]
        }
    };

    // Theme Logic
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderTab(tab);
        });
    });

    // Auth Simulation
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginOverlay.style.opacity = '0';
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            dashboard.style.display = 'flex';
            renderTab('overview');
        }, 500);
    });

    logoutBtn.addEventListener('click', () => {
        dashboard.style.display = 'none';
        loginOverlay.style.display = 'flex';
        loginOverlay.style.opacity = '1';
    });

    function renderTab(tab) {
        contentArea.innerHTML = '';
        switch(tab) {
            case 'overview': renderOverview(); break;
            case 'clients': renderClients(); break;
            case 'finances': renderFinances(); break;
            case 'alerts': renderAlerts(); break;
        }
    }

    function countUp(el, target) {
        let current = 0;
        const inc = target / 40;
        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                el.innerText = Math.floor(target).toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current).toLocaleString();
            }
        }, 25);
    }

    function renderOverview() {
        const data = mockDB.overview;
        contentArea.innerHTML = `
            <div class="card"><h3>Active Leads</h3><div class="value">${data.leads}</div><div class="status positive">↑ 14.2%</div></div>
            <div class="card"><h3>Conversion</h3><div class="value">${data.conversion}</div><div class="status">Target: 20%</div></div>
            <div class="card"><h3>Pending Payouts</h3><div class="value" style="color:var(--accent-blue)">${data.payouts}</div><div class="status">12 Requests</div></div>
            <div class="card">
                <h3>Market Trends</h3>
                ${data.trends.map(t => `<div class="trend-row"><span>${t.pair}</span><span style="font-weight:500">${t.price}</span><span style="color:${t.up ? palette.green : palette.red}">${t.change}</span></div>`).join('')}
            </div>
            <div class="card card-half"><h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> System Health</h3><div class="chart-container"><canvas id="hChart"></canvas></div></div>
            <div class="card card-half"><h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Market Signals</h3><div class="chart-container"><canvas id="sChart"></canvas></div></div>
        `;
        const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } };
        
        new Chart(document.getElementById('hChart'), {
            type: 'line',
            data: { labels: Array(12).fill(''), datasets: [{ data: data.systemHealth, borderColor: palette.green, fill: true, backgroundColor: 'rgba(52,199,89,0.1)', tension: 0.4, pointRadius: 0 }] },
            options: commonOptions
        });
        new Chart(document.getElementById('sChart'), {
            type: 'line',
            data: { labels: Array(12).fill(''), datasets: [{ data: data.marketSignals, borderColor: palette.blue, tension: 0.4, pointRadius: 0 }] },
            options: commonOptions
        });
    }

    function renderClients() {
        const { directory, stats } = mockDB.clients;
        contentArea.innerHTML = `
            <div class="stat-group">
                <div class="card stat-card"><div class="stat-label">Total Clients</div><div class="stat-value" id="c1">0</div></div>
                <div class="card stat-card"><div class="stat-label">Active Today</div><div class="stat-value" id="c2">0</div></div>
                <div class="card stat-card"><div class="stat-label">New Leads</div><div class="stat-value" id="c3">0</div></div>
            </div>
            <div class="card card-wide">
                <h3>Client Directory</h3>
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Balance</th></tr></thead>
                    <tbody>${directory.map(c => `<tr><td style="color:var(--text-secondary)">${c.id}</td><td style="font-weight:500">${c.name}</td><td><span class="status ${c.status === 'Active' ? 'positive' : ''}">${c.status}</span></td><td>${c.balance}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        countUp(document.getElementById('c1'), stats.total);
        countUp(document.getElementById('c2'), stats.active);
        countUp(document.getElementById('c3'), stats.leads);
    }

    function renderFinances() {
        contentArea.innerHTML = `
            <div class="card card-half"><h3>Monthly Revenue</h3><div class="chart-container"><canvas id="rfChart"></canvas></div></div>
            <div class="card card-half"><h3>Payout History</h3><div class="chart-container"><canvas id="pfChart"></canvas></div></div>
        `;
        new Chart(document.getElementById('rfChart'), {
            type: 'bar', data: { labels: mockDB.finances.months, datasets: [{ data: mockDB.finances.revenue, backgroundColor: palette.blue, borderRadius: 8 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
        new Chart(document.getElementById('pfChart'), {
            type: 'line', data: { labels: mockDB.finances.months, datasets: [{ data: mockDB.finances.payouts, borderColor: palette.teal, tension: 0.4, pointRadius: 4, pointBackgroundColor: palette.teal }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
    }

    function renderAlerts() {
        contentArea.innerHTML = `
            <div class="card card-wide"><h3>Alert Frequency (24h)</h3><div class="chart-container" style="height:200px"><canvas id="afChart"></canvas></div></div>
            <div class="card card-wide">
                <h3>System Logs</h3>
                <table class="data-table">
                    <thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead>
                    <tbody>${mockDB.alerts.recent.map(a => `<tr><td style="color:var(--text-secondary)">${a.time}</td><td><span class="status ${a.type === 'Critical' ? 'negative' : ''}">${a.type}</span></td><td style="font-weight:400">${a.message}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        new Chart(document.getElementById('afChart'), {
            type: 'line', data: { labels: Array(24).fill(''), datasets: [{ data: mockDB.alerts.frequency, borderColor: palette.red, backgroundColor: 'rgba(255,59,48,0.05)', fill: true, tension: 0.4, pointRadius: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
    }
});
