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

    const BASE_URL = 'http://localhost:3000/api';

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
        contentArea.innerHTML = '<div class="loading">Loading...</div>';
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

    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    }

    async function renderOverview() {
        const data = await fetchData('/overview');
        if (!data) {
            contentArea.innerHTML = '<div class="error">Failed to load overview data.</div>';
            return;
        }

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

    async function renderClients() {
        // We fetch 'leads' from the API for the clients tab
        const leads = await fetchData('/leads');
        if (!leads) {
            contentArea.innerHTML = '<div class="error">Failed to load clients data.</div>';
            return;
        }

        const stats = {
            total: leads.length,
            active: leads.filter(l => l.status === 'Active').length,
            new: leads.filter(l => l.status === 'Pending').length
        };

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
                    <tbody>${leads.map(c => `<tr><td style="color:var(--text-secondary)">${c.id}</td><td style="font-weight:500">${c.name}</td><td><span class="status ${c.status === 'Active' ? 'positive' : ''}">${c.status}</span></td><td>${c.balance}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        countUp(document.getElementById('c1'), stats.total);
        countUp(document.getElementById('c2'), stats.active);
        countUp(document.getElementById('c3'), stats.new);
    }

    async function renderFinances() {
        const data = await fetchData('/finances');
        if (!data || data.length === 0) {
            contentArea.innerHTML = '<div class="error">No finance data available.</div>';
            return;
        }

        const months = data.map(d => d.month);
        const revenues = data.map(d => d.revenue);
        const payouts = data.map(d => d.payout);

        contentArea.innerHTML = `
            <div class="card card-half"><h3>Monthly Revenue</h3><div class="chart-container"><canvas id="rfChart"></canvas></div></div>
            <div class="card card-half"><h3>Payout History</h3><div class="chart-container"><canvas id="pfChart"></canvas></div></div>
        `;
        new Chart(document.getElementById('rfChart'), {
            type: 'bar', data: { labels: months, datasets: [{ data: revenues, backgroundColor: palette.blue, borderRadius: 8 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
        new Chart(document.getElementById('pfChart'), {
            type: 'line', data: { labels: months, datasets: [{ data: payouts, borderColor: palette.teal, tension: 0.4, pointRadius: 4, pointBackgroundColor: palette.teal }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
    }

    async function renderAlerts() {
        const alerts = await fetchData('/alerts');
        if (!alerts) {
            contentArea.innerHTML = '<div class="error">Failed to load alerts data.</div>';
            return;
        }

        contentArea.innerHTML = `
            <div class="card card-wide"><h3>Alert Frequency (24h)</h3><div class="chart-container" style="height:200px"><canvas id="afChart"></canvas></div></div>
            <div class="card card-wide">
                <h3>System Logs</h3>
                <table class="data-table">
                    <thead><tr><th>Time</th><th>Type</th><th>Message</th></tr></thead>
                    <tbody>${alerts.map(a => `<tr><td style="color:var(--text-secondary)">${a.time}</td><td><span class="status ${a.type === 'Critical' ? 'negative' : ''}">${a.type}</span></td><td style="font-weight:400">${a.message}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
        
        // frequency data might need to be extracted or calculated from alerts if not provided separately
        // For now, using a placeholder if 'frequency' is not in alert object
        const freqData = Array(24).fill(0).map(() => Math.floor(Math.random() * 15)); 

        new Chart(document.getElementById('afChart'), {
            type: 'line', data: { labels: Array(24).fill(''), datasets: [{ data: freqData, borderColor: palette.red, backgroundColor: 'rgba(255,59,48,0.05)', fill: true, tension: 0.4, pointRadius: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } }
        });
    }
});
