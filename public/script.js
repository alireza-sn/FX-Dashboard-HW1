document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginOverlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('dashboard');
    const logoutBtn = document.getElementById('logout-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const contentArea = document.getElementById('dynamic-content');
    const sidebarLinks = document.querySelectorAll('#sidebar-nav a');
    const sidebarNav = document.getElementById('sidebar-nav');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    const BASE_URL = 'http://localhost:3000/api';

    // Check for existing session
    const savedToken = localStorage.getItem('fx_token');
    if (savedToken) {
        showDashboard();
    }

    // Sidebar Collapse Logic
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }

    sidebarToggle.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebar-collapsed', collapsed);
    });

    const palette = {
        blue: '#0071E3', teal: '#5AC8FA', green: '#34C759', red: '#FF3B30', muted: '#86868B', grid: 'rgba(0,0,0,0.05)'
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Navigation Handling
    function setupNav() {
        const links = document.querySelectorAll('#sidebar-nav a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                renderTab(tab);
            });
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const submitBtn = e.target.querySelector('button');

        submitBtn.innerText = 'Verifying...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('fx_token', data.token);
                localStorage.setItem('fx_user', JSON.stringify(data.user));
                showDashboard();
            } else {
                alert(data.error || 'Login failed');
                submitBtn.innerText = 'Sign In';
                submitBtn.disabled = false;
            }
        } catch (error) {
            alert('Server connection error');
            submitBtn.innerText = 'Sign In';
            submitBtn.disabled = false;
        }
    });

    function showDashboard() {
        const user = JSON.parse(localStorage.getItem('fx_user') || '{}');
        
        // Set role attributes for CSS scoping
        document.body.setAttribute('data-user-role', user.role || 'Guest');

        // Add Admin Tab if user is Admin
        if (user.role === 'Admin' && !document.querySelector('[data-tab="users"]')) {
            const adminLink = document.createElement('a');
            adminLink.href = '#';
            adminLink.setAttribute('data-tab', 'users');
            adminLink.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg><span>Admin</span>`;
            sidebarNav.appendChild(adminLink);
        }

        loginOverlay.style.opacity = '0';
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            dashboard.style.display = 'flex';
            if (user.name) document.querySelector('.user-name').innerText = user.name;
            if (user.role) {
                const roleDisplay = document.getElementById('display-role');
                roleDisplay.innerText = `FX ${user.role}`;
                roleDisplay.className = 'user-role'; // Reset
                if (user.role === 'Admin') roleDisplay.style.color = 'var(--accent-blue)';
                if (user.role === 'Guest') roleDisplay.style.color = 'var(--text-secondary)';
            }
            setupNav();
            renderTab('overview');
        }, 500);
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('fx_token');
        localStorage.removeItem('fx_user');
        window.location.reload(); // Hard refresh to reset UI
    });

    function renderTab(tab) {
        contentArea.innerHTML = '<div class="loading">Loading...</div>';
        switch(tab) {
            case 'overview': renderOverview(); break;
            case 'clients': renderClients(); break;
            case 'finances': renderFinances(); break;
            case 'alerts': renderAlerts(); break;
            case 'users': renderUsers(); break;
        }
    }

    async function fetchData(endpoint) {
        const token = localStorage.getItem('fx_token');
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401 || response.status === 403) {
                if (response.status === 403 && endpoint !== '/users') {
                     alert("Permission denied");
                } else if (response.status === 401) {
                    logoutBtn.click();
                }
                return null;
            }
            return await response.json();
        } catch (error) { return null; }
    }

    async function renderOverview() {
        const data = await fetchData('/overview');
        if (!data) return;
        contentArea.innerHTML = `
            <div class="card"><h3>Active Leads</h3><div class="value">${data.leads}</div><div class="status positive">↑ 14.2%</div></div>
            <div class="card"><h3>Conversion</h3><div class="value">${data.conversion}</div><div class="status">Target: 20%</div></div>
            <div class="card"><h3>Pending Payouts</h3><div class="value" style="color:var(--accent-blue)">${data.payouts}</div><div class="status">12 Requests</div></div>
            <div class="card"><h3>Market Trends</h3>${data.trends.map(t => `<div class="trend-row"><span>${t.pair}</span><span>${t.price}</span><span style="color:${t.up ? palette.green : palette.red}">${t.change}</span></div>`).join('')}</div>
            <div class="card card-half"><h3>System Health</h3><div class="chart-container"><canvas id="hChart"></canvas></div></div>
            <div class="card card-half"><h3>Market Signals</h3><div class="chart-container"><canvas id="sChart"></canvas></div></div>
        `;
        const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: 'rgba(0,0,0,0.03)' } } } };
        new Chart(document.getElementById('hChart'), { type: 'line', data: { labels: Array(12).fill(''), datasets: [{ data: data.systemHealth, borderColor: palette.green, fill: true, backgroundColor: 'rgba(52,199,89,0.1)', tension: 0.4, pointRadius: 0 }] }, options: commonOptions });
        new Chart(document.getElementById('sChart'), { type: 'line', data: { labels: Array(12).fill(''), datasets: [{ data: data.marketSignals, borderColor: palette.blue, tension: 0.4, pointRadius: 0 }] }, options: commonOptions });
    }

    async function renderClients() {
        const leads = await fetchData('/leads');
        if (!leads) return;
        const user = JSON.parse(localStorage.getItem('fx_user') || '{}');
        const canWrite = user.role === 'Admin' || user.role === 'Agent';

        contentArea.innerHTML = `
            <div class="card card-wide">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3>Client Directory</h3>
                    ${canWrite ? `<button id="show-lead-form" class="pill-button">+ Add New Lead</button>` : ''}
                </div>
                <div id="lead-form-container" class="glass" style="display:none; padding:20px; border-radius:12px; margin-bottom:20px;">
                    <form id="new-lead-form" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                        <input type="text" id="lead-name" placeholder="Full Name" required>
                        <select id="lead-status"><option value="Active">Active</option><option value="Pending">Pending</option></select>
                        <input type="text" id="lead-balance" placeholder="Balance (e.g. $1,000)" required>
                        <button type="submit" class="pill-button">Save</button>
                    </form>
                </div>
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Balance</th></tr></thead>
                    <tbody>${leads.map(c => `<tr><td>#${c.id}</td><td>${c.name}</td><td><span class="status ${c.status === 'Active' ? 'positive' : ''}">${c.status}</span></td><td>${c.balance}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;

        if (canWrite) {
            document.getElementById('show-lead-form').addEventListener('click', () => document.getElementById('lead-form-container').style.display = 'block');
            document.getElementById('new-lead-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const leadData = { name: document.getElementById('lead-name').value, status: document.getElementById('lead-status').value, balance: document.getElementById('lead-balance').value };
                const res = await fetch(`${BASE_URL}/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('fx_token')}` },
                    body: JSON.stringify(leadData)
                });
                if (res.ok) renderClients();
            });
        }
    }

    async function renderFinances() {
        const data = await fetchData('/finances');
        if (!data) return;
        contentArea.innerHTML = `<div class="card card-half"><h3>Revenue</h3><div class="chart-container"><canvas id="rfChart"></canvas></div></div>`;
        new Chart(document.getElementById('rfChart'), { type: 'bar', data: { labels: data.map(d => d.month), datasets: [{ data: data.map(d => d.revenue), backgroundColor: palette.blue }] }, options: { responsive: true, maintainAspectRatio: false } });
    }

    async function renderAlerts() {
        const alerts = await fetchData('/alerts');
        if (!alerts) return;
        contentArea.innerHTML = `<div class="card card-wide"><h3>Logs</h3><table class="data-table"><tbody>${alerts.map(a => `<tr><td>${a.time}</td><td>${a.type}</td><td>${a.message}</td></tr>`).join('')}</tbody></table></div>`;
    }

    async function renderUsers() {
        const users = await fetchData('/users');
        if (!users) return;
        contentArea.innerHTML = `
            <div class="card card-wide">
                <h3>User Management (Admin Only)</h3>
                <table class="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                    <tbody>${users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td><strong>${u.role}</strong></td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
    }
});
