// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginPage = document.getElementById('loginPage');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('boukilibre_admin_token');

    if (isLoggedIn) {
        showDashboard();
    }

    // Login Form Handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Demo login (replace with actual API call)
        if (email === 'admin@boukilibre.com' && password === 'admin123') {
            localStorage.setItem('boukilibre_admin_token', 'demo_token');
            showDashboard();
        } else {
            // Try API login
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('boukilibre_admin_token', data.token);
                    showDashboard();
                } else {
                    showLoginError(data.message || 'Identifiants incorrects');
                }
            } catch (error) {
                // If API fails, show demo mode
                showLoginError('Email ou mot de passe incorrect. (Demo: admin@boukilibre.com / admin123)');
            }
        }
    });

    // Logout Handler
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('boukilibre_admin_token');
        hideDashboard();
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            navigateTo(pageName);

            // Close mobile menu
            sidebar.classList.remove('open');
        });
    });

    // View All Links
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            navigateTo(pageName);
        });
    });

    // Functions
    function showDashboard() {
        loginPage.style.display = 'none';
        dashboard.style.display = 'flex';
        loadDashboardData();
    }

    function hideDashboard() {
        loginPage.style.display = 'flex';
        dashboard.style.display = 'none';
    }

    function showLoginError(message) {
        loginMessage.textContent = message;
        loginMessage.className = 'login-message error';
    }

    function navigateTo(pageName) {
        // Update nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // Show page
        pages.forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update title
        const titles = {
            'overview': 'Vue d\'ensemble',
            'ebooks': 'Gestion des Ebooks',
            'orders': 'Commandes',
            'newsletter': 'Newsletter',
            'messages': 'Messages',
            'settings': 'Parametres'
        };
        pageTitle.textContent = titles[pageName] || 'Dashboard';
    }

    async function loadDashboardData() {
        try {
            // Load stats
            const [ordersRes, subscribersRes, ebooksRes] = await Promise.all([
                fetch('/api/orders'),
                fetch('/api/newsletter/subscribers'),
                fetch('/api/ebooks')
            ]);

            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                updateOrdersStats(orders);
                renderRecentOrders(orders);
            }

            if (subscribersRes.ok) {
                const subscribers = await subscribersRes.json();
                document.getElementById('totalSubscribers').textContent = subscribers.length || 0;
                renderNewsletterTable(subscribers);
            }

            if (ebooksRes.ok) {
                const ebooks = await ebooksRes.json();
                document.getElementById('totalEbooks').textContent = ebooks.length || 2;
            }

        } catch (error) {
            console.log('Running in demo mode - API not available');
            // Set demo data
            document.getElementById('monthlySales').textContent = '0 FCFA';
            document.getElementById('totalOrders').textContent = '0';
            document.getElementById('totalSubscribers').textContent = '0';
            document.getElementById('totalEbooks').textContent = '2';
        }
    }

    function updateOrdersStats(orders) {
        const now = new Date();
        const thisMonth = orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate.getMonth() === now.getMonth() &&
                   orderDate.getFullYear() === now.getFullYear();
        });

        const monthlyTotal = thisMonth.reduce((sum, o) => sum + (o.total || 0), 0);

        document.getElementById('monthlySales').textContent = monthlyTotal.toLocaleString() + ' FCFA';
        document.getElementById('totalOrders').textContent = orders.length || 0;
    }

    function renderRecentOrders(orders) {
        const tbody = document.getElementById('recentOrdersTable');

        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Aucune commande pour le moment</td></tr>';
            return;
        }

        const recentOrders = orders.slice(0, 5);

        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.orderNumber || 'N/A'}</td>
                <td>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</td>
                <td>${order.items?.map(i => i.title).join(', ') || 'N/A'}</td>
                <td>${(order.total || 0).toLocaleString()} FCFA</td>
                <td><span class="badge badge-${order.paymentStatus === 'completed' ? 'success' : 'warning'}">${order.paymentStatus === 'completed' ? 'Payee' : 'En attente'}</span></td>
                <td>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
        `).join('');
    }

    function renderNewsletterTable(subscribers) {
        const tbody = document.getElementById('newsletterTable');

        if (!subscribers || subscribers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Aucun abonne pour le moment</td></tr>';
            return;
        }

        tbody.innerHTML = subscribers.map(sub => `
            <tr>
                <td>${sub.email}</td>
                <td>${new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}</td>
                <td><span class="badge badge-${sub.isActive ? 'success' : 'error'}">${sub.isActive ? 'Actif' : 'Desabonne'}</span></td>
                <td>
                    <button class="action-btn delete" onclick="unsubscribe('${sub._id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Export functions
    document.getElementById('exportOrdersBtn')?.addEventListener('click', function() {
        alert('Fonctionnalite d\'export en cours de developpement');
    });

    document.getElementById('exportNewsletterBtn')?.addEventListener('click', function() {
        alert('Fonctionnalite d\'export en cours de developpement');
    });

    document.getElementById('addEbookBtn')?.addEventListener('click', function() {
        alert('Fonctionnalite d\'ajout en cours de developpement. Ajoutez les ebooks directement dans le code pour le moment.');
    });

    // Change password
    document.getElementById('changePasswordBtn')?.addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caracteres');
            return;
        }

        alert('Mot de passe modifie avec succes (demo). En production, cette modification sera enregistree dans la base de donnees.');
    });
});
