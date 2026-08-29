// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const TYPE_LABELS = { ebook: 'Ebook', application: 'Application', outil: 'Outil' };

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

    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const productModalTitle = document.getElementById('productModalTitle');
    const productFormMessage = document.getElementById('productFormMessage');
    const ebooksTable = document.getElementById('ebooksTable');

    let allProducts = [];

    function getToken() {
        return localStorage.getItem('boukilibre_admin_token');
    }

    function authHeaders() {
        return { Authorization: `Bearer ${getToken()}` };
    }

    // Check if user is logged in
    if (getToken()) {
        showDashboard();
    }

    // Login Form Handler
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            showLoginError('Impossible de contacter le serveur. Reessayez plus tard.');
        }
    });

    // Logout Handler
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('boukilibre_admin_token');
        hideDashboard();
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });

    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            navigateTo(pageName);
            sidebar.classList.remove('open');
        });
    });

    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.dataset.page;
            navigateTo(pageName);
        });
    });

    function showDashboard() {
        loginPage.style.display = 'none';
        dashboard.style.display = 'flex';
        loadDashboardData();
        loadProducts();
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
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        pages.forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const titles = {
            'overview': 'Vue d\'ensemble',
            'ebooks': 'Gestion des Produits',
            'orders': 'Commandes',
            'newsletter': 'Newsletter',
            'messages': 'Messages',
            'settings': 'Parametres'
        };
        pageTitle.textContent = titles[pageName] || 'Dashboard';
    }

    async function loadDashboardData() {
        try {
            const [ordersRes, subscribersRes] = await Promise.all([
                fetch('/api/orders', { headers: authHeaders() }),
                fetch('/api/newsletter')
            ]);

            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                updateOrdersStats(orders);
                renderRecentOrders(orders);
                renderOrdersTable(orders);
            }

            if (subscribersRes.ok) {
                const data = await subscribersRes.json();
                const subscribers = data.subscribers || data;
                document.getElementById('totalSubscribers').textContent = subscribers.length || 0;
                renderNewsletterTable(subscribers);
            }
        } catch (error) {
            console.log('Impossible de charger les statistiques', error);
        }
    }

    function updateOrdersStats(orders) {
        const now = new Date();
        const thisMonth = orders.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear();
        });

        const monthlyTotal = thisMonth.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);

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
                <td>${order.customer?.firstName || order.customerName || ''} ${order.customer?.lastName || ''}</td>
                <td>${order.items?.map(i => i.title).join(', ') || 'N/A'}</td>
                <td>${(order.total || order.totalAmount || 0).toLocaleString()} FCFA</td>
                <td><span class="badge badge-${order.paymentStatus === 'completed' ? 'success' : 'warning'}">${order.paymentStatus === 'completed' ? 'Payee' : 'En attente'}</span></td>
                <td>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
            </tr>
        `).join('');
    }

    function renderOrdersTable(orders) {
        const tbody = document.getElementById('ordersTable');
        if (!tbody) return;

        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucune commande pour le moment</td></tr>';
            return;
        }

        const statusLabels = { completed: 'Payee', pending: 'En attente', failed: 'Echouee', refunded: 'Remboursee' };

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.orderNumber}</td>
                <td>${order.customerName || ''}</td>
                <td>${order.customerEmail}</td>
                <td>${order.items.map(i => i.title).join(', ')}</td>
                <td>${order.totalAmount.toLocaleString()} FCFA</td>
                <td>${order.paymentMethod}</td>
                <td><span class="badge badge-${order.paymentStatus === 'completed' ? 'success' : 'warning'}">${statusLabels[order.paymentStatus] || order.paymentStatus}</span></td>
                <td>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>-</td>
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

    // ===== Product management =====

    async function loadProducts() {
        try {
            const response = await fetch('/api/ebooks/admin/all', { headers: authHeaders() });

            if (response.status === 401 || response.status === 403) {
                hideDashboard();
                return;
            }

            allProducts = response.ok ? await response.json() : [];
            renderProductsTable();
            document.getElementById('totalEbooks').textContent = allProducts.filter(p => p.isActive).length;
        } catch (error) {
            ebooksTable.innerHTML = '<tr><td colspan="7" class="empty-state">Erreur de chargement</td></tr>';
        }
    }

    function renderProductsTable() {
        if (allProducts.length === 0) {
            ebooksTable.innerHTML = '<tr><td colspan="7" class="empty-state">Aucun produit pour le moment</td></tr>';
            return;
        }

        ebooksTable.innerHTML = allProducts.map(p => `
            <tr>
                <td><img src="${p.coverImage}" alt="" class="table-img"></td>
                <td>${p.title}</td>
                <td><span class="badge badge-primary">${TYPE_LABELS[p.type] || p.type}</span></td>
                <td>${p.category}</td>
                <td>${p.price.toLocaleString()} FCFA</td>
                <td><span class="badge badge-${p.isActive ? 'success' : 'error'}">${p.isActive ? 'Actif' : 'Inactif'}</span></td>
                <td>
                    <button class="action-btn edit" data-edit-id="${p._id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button class="action-btn delete" data-delete-id="${p._id}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                </td>
            </tr>
        `).join('');

        ebooksTable.querySelectorAll('[data-edit-id]').forEach(btn => {
            btn.addEventListener('click', () => openProductModal(btn.dataset.editId));
        });
        ebooksTable.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', () => deleteProduct(btn.dataset.deleteId));
        });
    }

    function linesToArray(value) {
        return value.split('\n').map(l => l.trim()).filter(Boolean);
    }

    function tocLinesToArray(value) {
        return linesToArray(value).map(line => {
            const [chapter, ...rest] = line.split(' - ');
            return { chapter: chapter.trim(), description: rest.join(' - ').trim() };
        });
    }

    function openProductModal(id) {
        productForm.reset();
        productFormMessage.textContent = '';
        document.getElementById('currentCoverHint').textContent = '';
        document.getElementById('currentFileHint').textContent = '';

        if (id) {
            const product = allProducts.find(p => p._id === id);
            if (!product) return;

            productModalTitle.textContent = 'Modifier le produit';
            document.getElementById('productId').value = product._id;
            document.getElementById('productType').value = product.type;
            document.getElementById('productBadgeSelect').value = product.badge || '';
            document.getElementById('productTitle').value = product.title;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productBenefits').value = (product.benefits || []).join('\n');
            document.getElementById('productFeatures').value = (product.features || []).join('\n');
            document.getElementById('productAudience').value = (product.targetAudience || []).join('\n');
            document.getElementById('productToc').value = (product.tableOfContents || [])
                .map(t => `${t.chapter} - ${t.description || ''}`).join('\n');
            document.getElementById('productIsActive').checked = product.isActive;
            document.getElementById('currentCoverHint').textContent = 'Image actuelle conservee si aucun nouveau fichier n\'est choisi.';
            document.getElementById('currentFileHint').textContent = product.fileName
                ? `Fichier actuel : ${product.fileName}`
                : 'Fichier actuel conserve si vous ne changez rien.';
        } else {
            productModalTitle.textContent = 'Ajouter un produit';
            document.getElementById('productId').value = '';
        }

        productModal.style.display = 'flex';
    }

    function closeProductModal() {
        productModal.style.display = 'none';
    }

    document.getElementById('addEbookBtn').addEventListener('click', () => openProductModal(null));
    document.getElementById('productModalClose').addEventListener('click', closeProductModal);
    document.getElementById('productCancelBtn').addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });

    productForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('productId').value;
        const submitBtn = document.getElementById('productSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enregistrement...';
        productFormMessage.textContent = '';
        productFormMessage.className = 'modal-message';

        const formData = new FormData();
        formData.append('type', document.getElementById('productType').value);
        formData.append('badge', document.getElementById('productBadgeSelect').value);
        formData.append('title', document.getElementById('productTitle').value);
        formData.append('category', document.getElementById('productCategory').value);
        formData.append('price', document.getElementById('productPrice').value);
        formData.append('description', document.getElementById('productDescription').value);
        formData.append('benefits', JSON.stringify(linesToArray(document.getElementById('productBenefits').value)));
        formData.append('features', JSON.stringify(linesToArray(document.getElementById('productFeatures').value)));
        formData.append('targetAudience', JSON.stringify(linesToArray(document.getElementById('productAudience').value)));
        formData.append('tableOfContents', JSON.stringify(tocLinesToArray(document.getElementById('productToc').value)));
        formData.append('isActive', document.getElementById('productIsActive').checked);

        const coverFile = document.getElementById('productCoverImage').files[0];
        if (coverFile) formData.append('coverImage', coverFile);

        const productFile = document.getElementById('productFile').files[0];
        if (productFile) formData.append('productFile', productFile);

        const externalUrl = document.getElementById('productFileUrlExternal').value.trim();
        if (externalUrl) formData.append('fileUrlExternal', externalUrl);

        try {
            const response = await fetch(id ? `/api/ebooks/${id}` : '/api/ebooks', {
                method: id ? 'PUT' : 'POST',
                headers: authHeaders(),
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'enregistrement');
            }

            await loadProducts();
            closeProductModal();
        } catch (error) {
            productFormMessage.textContent = error.message;
            productFormMessage.className = 'modal-message error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function deleteProduct(id) {
        if (!confirm('Supprimer ce produit ? Il ne sera plus visible dans le catalogue.')) return;

        try {
            const response = await fetch(`/api/ebooks/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');
            await loadProducts();
        } catch (error) {
            alert(error.message);
        }
    }

    // Export functions
    document.getElementById('exportOrdersBtn')?.addEventListener('click', function () {
        alert('Fonctionnalite d\'export en cours de developpement');
    });

    document.getElementById('exportNewsletterBtn')?.addEventListener('click', function () {
        alert('Fonctionnalite d\'export en cours de developpement');
    });

    // Change password (not yet wired to a backend endpoint)
    document.getElementById('changePasswordBtn')?.addEventListener('click', function () {
        alert('Pour changer le mot de passe admin, modifiez ADMIN_PASSWORD dans les variables d\'environnement.');
    });

    window.unsubscribe = async function (id) {
        if (!confirm('Desinscrire cet abonne ?')) return;
        try {
            const response = await fetch('/api/newsletter/unsubscribe-id/' + id, { method: 'POST' });
            if (response.ok) loadDashboardData();
        } catch (error) {
            alert('Erreur lors de la desinscription');
        }
    };
});
